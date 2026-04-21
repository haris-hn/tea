import { Controller, Get, Post, Body, Param, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, CreateReplyDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createReview(@Body() createReviewDto: CreateReviewDto, @Body('userId') userId: string) {
    // In a real app, userId would come from the JWT token
    return this.reviewService.createReview(
      createReviewDto.productId,
      userId,
      createReviewDto.rating,
      createReviewDto.comment,
    );
  }

  @Post(':id/replies')
  async addReply(
    @Param('id') reviewId: string,
    @Body() createReplyDto: CreateReplyDto,
    @Body('userId') userId: string,
  ) {
    return this.reviewService.addReply(reviewId, userId, createReplyDto.comment);
  }

  @Post(':id/like')
  async likeReview(@Param('id') reviewId: string, @Body('userId') userId: string) {
    return this.reviewService.likeReview(reviewId, userId);
  }

  @Get('product/:productId')
  async getReviews(@Param('productId') productId: string) {
    return this.reviewService.getReviewsByProduct(productId);
  }
}
