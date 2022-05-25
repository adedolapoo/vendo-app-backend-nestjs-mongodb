import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Document, Model, PaginateModel, Connection } from 'mongoose';

import { SCHEMAS } from '@vendor-app/core/constants';
import PaginationQuery from '@vendor-app/core/input/pagination-query.input';
import { Product } from '@vendor-app/products/schema/products/product.schema';
import { User } from '@vendor-app/users/schema/users/user.schema';
import BuyProductInput, { CartItem } from '../input/buyProduct.input';
import CreateProductInput from '../input/createProduct.input';
import config from '@vendor-app/config/index';
import { DepositsService } from '@vendor-app/deposits/services/deposits.service';
import UpdateProductInput from '../input/updateProduct.input';

type ProductModel<T extends Document> = PaginateModel<T>;
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(SCHEMAS.PRODUCT) private productModel: Model<Product>,
    @InjectModel(SCHEMAS.USER) private userModel: Model<User>,
    @InjectModel(SCHEMAS.PRODUCT)
    readonly PaginatedProduct: ProductModel<Product>,
    @InjectConnection() private readonly connection: Connection,
    private readonly depositService: DepositsService,
  ) {}

  /**
   * Get all product paginated data
   * @param user
   * @param data
   */
  async index(user: User, data: PaginationQuery): Promise<any> {
    const customLabels = {
      docs: 'nodes',
      page: 'currentPage',
      totalPages: 'pageCount',
      limit: 'perPage',
      totalDocs: 'itemCount',
    };

    let query = {};
    if (user.id) query = { sellerId: user.id };

    return await this.PaginatedProduct.paginate(query, {
      customLabels,
      ...data,
    });
  }

  async create(user: User, input: CreateProductInput): Promise<Product> {
    if (user.role !== 'seller') {
      throw new BadRequestException(
        'Whoops! You dont access to create product.',
      );
    }
    return this.productModel.create({
      ...input,
      sellerId: user.id,
    });
  }

  async view(id: string): Promise<Product> {
    return this.productModel.findById(id);
  }

  async update(
    user: User,
    id: string,
    input: UpdateProductInput,
  ): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (product.sellerId.toString() !== user.id.toString()) {
      throw new BadRequestException(
        'Whoops! You dont access to update this product.',
      );
    }
    return this.productModel.findByIdAndUpdate(id, input, { new: true }).exec();
  }

  async delete(user: User, _id: string): Promise<any> {
    const product = await this.productModel.findById(_id);
    if (product.sellerId.toString() !== user.id.toString()) {
      throw new BadRequestException(
        'Whoops! You dont access to delete this product.',
      );
    }
    return this.productModel.deleteOne({ _id });
  }

  async buy(currentUser: User, input: BuyProductInput): Promise<any> {
    const user = await this.userModel.findById(currentUser.id);
    const items = input.products;
    let totalAmount = 0;
    const productsArray = [];
    if (user.deposit === null) {
      throw new BadRequestException(
        'Whoops! You dont have any coins deposited to make purchases, deposit coins now',
      );
    }

    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      await Promise.all(
        items.map(async (item: CartItem) => {
          const product = await this.productModel.findById(item.id);
          if (product.amountAvailable > item.quantity) {
            const amount = item.quantity * product.cost;
            totalAmount += amount;

            await this.productModel
              .findByIdAndUpdate(item.id, {
                amountAvailable: product.amountAvailable - item.quantity,
              })
              .exec();
            productsArray.push({
              id: product._id,
              name: product.name,
              cost: product.cost,
              quantity: item.quantity,
            });
          }
        }),
      );

      if (totalAmount === null) {
        throw new BadRequestException(
          'Whoops! something went wrong, re-select products and try again',
        );
      }

      //get the change left from the user deposit and the total
      const availableBalance = user.deposit - totalAmount;

      //Check if the total is not more than the user deposit
      if (availableBalance < 0) {
        throw new BadRequestException(
          'The total price of the selected products cannot be more than your deposit',
        );
      }
      // reset user deposit
      this.depositService.reset(user._id);

      await session.commitTransaction();

      //Return products, total and change back to the user
      return {
        success: true,
        data: {
          products: productsArray,
          deposit: user.deposit,
          totalAmount,
          change: this.getCoinsChangeArray(availableBalance),
        },
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  getCoinsChangeArray(amount) {
    //get the available coins
    let coins = config().depositRange;

    //sort the coin by the highest first
    coins = coins.sort((a, b) => b - a);

    const coinsArray = [];

    coins.forEach((coin) => {
      if (amount >= coin) {
        amount -= coin;
        coinsArray.push(coin);
      }
    });

    return coinsArray.reverse();
  }
}
