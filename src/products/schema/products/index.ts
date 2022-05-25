import { ModelDefinition } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';

export const productModels: ModelDefinition[] = [
  { name: Product.name, schema: ProductSchema },
];
