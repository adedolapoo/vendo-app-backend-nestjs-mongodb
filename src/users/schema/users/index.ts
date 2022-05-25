import { ModelDefinition } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

export const userModels: ModelDefinition[] = [
  { name: User.name, schema: UserSchema },
];
