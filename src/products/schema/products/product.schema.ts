import { Document, Schema as MongooseSchema, PopulatedDoc } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { SCHEMAS } from '@vendor-app/core/constants';
import { User } from '@vendor-app/users/schema/users/user.schema';

@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product extends Document {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop({
    type: Number,
    default: 0,
  })
  cost: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: SCHEMAS.USER,
    required: true,
  })
  sellerId: PopulatedDoc<User>;

  @Prop({
    type: Number,
    default: 0,
  })
  amountAvailable: number;
}

const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(mongoosePaginate.default);
export { ProductSchema };
