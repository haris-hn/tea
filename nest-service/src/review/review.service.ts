import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Product, ProductDocument } from './schemas/product.schema';
import { User, UserDocument } from './schemas/user.schema';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly gateway: NotificationGateway,
  ) {}

  async createReview(productId: string, userId: string, rating: number, comment: string): Promise<Review> {
    const review = new this.reviewModel({
      product: new Types.ObjectId(productId),
      user: new Types.ObjectId(userId),
      rating,
      comment,
    });

    const savedReview = await review.save();

    // Update Product rating and numReviews
    const product = await this.productModel.findById(productId);
    if (product) {
      const reviews = await this.reviewModel.find({ product: new Types.ObjectId(productId) });
      product.numReviews = reviews.length;
      product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      await product.save();
      
      // Notify all users about the new review (Broadcast)
      this.gateway.notifyNewReview({
        ...savedReview.toObject(),
        productName: product.name
      });
    }

    return savedReview;
  }

  async addReply(reviewId: string, userId: string, comment: string): Promise<Review> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const reply = {
      user: new Types.ObjectId(userId),
      comment,
      createdAt: new Date(),
    };

    review.replies.push(reply);
    const updatedReview = await review.save();

    // Notify the review owner about the new reply (Direct)
    this.gateway.notifyNewReply(review.user.toString(), reply, reviewId);

    return updatedReview;
  }

  async likeReview(reviewId: string, userId: string): Promise<Review> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const userIdObj = new Types.ObjectId(userId);
    const index = review.likedBy.findIndex(id => id.equals(userIdObj));

    let liked = false;
    if (index === -1) {
      review.likedBy.push(userIdObj);
      review.likes += 1;
      liked = true;
    } else {
      review.likedBy.splice(index, 1);
      review.likes -= 1;
    }

    const savedReview = await review.save();

    if (liked) {
      this.gateway.notifyNewLike(review.user.toString(), 'Someone', reviewId);
    }

    return savedReview;
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    try {
      const id = new Types.ObjectId(productId);
      return this.reviewModel.find({ product: id })
        .populate('user', 'name')
        .populate('replies.user', 'name')
        .sort({ createdAt: -1 })
        .exec();
    } catch (e) {
      // If productId is not a valid ObjectId hex string, try searching as a string
      return this.reviewModel.find({ product: productId as any })
        .populate('user', 'name')
        .populate('replies.user', 'name')
        .sort({ createdAt: -1 })
        .exec();
    }
  }

  async getReviewById(id: string): Promise<ReviewDocument | null> {
    return this.reviewModel.findById(id).exec();
  }
}
