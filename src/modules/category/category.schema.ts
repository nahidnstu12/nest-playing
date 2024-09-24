import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Status } from 'src/@core/enum/common';

@Schema({ collection: 'categories' })
export class Category {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  body: string;

  @Prop({ type: Number, enum: Status, default: Status.ACTIVE })
  status: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
