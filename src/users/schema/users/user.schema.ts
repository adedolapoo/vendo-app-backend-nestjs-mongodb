import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    type: String,
    lowercase: true,
    required: true,
    validate: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
    index: { unique: true },
  })
  email: string;

  @Prop({
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    default: 'user',
  })
  role: string;

  @Prop({
    type: Number,
    default: 0,
  })
  deposit: number;

  @Prop({
    default: false,
  })
  isActive: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate.default);
export { UserSchema };
