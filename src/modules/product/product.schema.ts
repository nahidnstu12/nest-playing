import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Status } from '../../@core/enum/common';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  collection: 'products',
})
export class Product {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  body: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: [String], required: false })
  tags: string[];

  @Prop({ type: Number, enum: Status, default: Status.PENDING })
  status: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
