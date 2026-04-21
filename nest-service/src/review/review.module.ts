import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review, ReviewSchema } from './schemas/review.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { User, UserSchema } from './schemas/user.schema';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  providers: [ReviewService, NotificationGateway],
  controllers: [ReviewController],
  exports: [ReviewService]
})
export class ReviewModule {}
