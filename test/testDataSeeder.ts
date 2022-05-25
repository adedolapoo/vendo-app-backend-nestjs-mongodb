import { TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '@vendor-app/users/schema/users/user.schema';
import { Product } from '@vendor-app/products/schema/products/product.schema';
import config from '@config/index';

export class TestDataSeeder {
  private readonly userModel: Model<User>;
  private readonly productModel: Model<Product>;

  private constructor(module: TestingModule) {
    this.userModel = module.get<Model<User>>(getModelToken(User.name));
    this.productModel = module.get<Model<Product>>(getModelToken(Product.name));
  }

  /**
   * create
   */
  public static create(module: TestingModule): TestDataSeeder {
    return new TestDataSeeder(module);
  }

  public async seedUserByRole(role: string): Promise<User> {
    return this.userModel.create({
      firstName: 'test',
      lastName: role,
      role,
      email: `test${role}1@email.com`,
      password: 'password',
    });
  }

  public async seedUserDeposit(id: string, amount: number): Promise<User> {
    if (config().depositRange.includes(amount)) {
      const user = await this.userModel.findById(id);
      user.deposit += amount;
      return user.save();
    }
    throw new Error('coin stated not recongniesd');
  }

  public async seedProduct(sellerId: string): Promise<Product[]> {
    return this.productModel.create([
      {
        name: 'Apple',
        sellerId,
        amountAvailable: 50,
        cost: 5,
      },
      {
        name: 'Mango',
        sellerId,
        amountAvailable: 50,
        cost: 5,
      },
    ]);
  }

  public async removeAllData() {
    await this.productModel.deleteMany();
    await this.userModel.deleteMany();
  }
}
