import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true, collection: 'reviews' })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  likedBy: Types.ObjectId[];

  @Prop([{
    user: { type: Types.ObjectId, ref: 'User' },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }])
  replies: {
    user: Types.ObjectId;
    comment: string;
    createdAt: Date;
  }[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
