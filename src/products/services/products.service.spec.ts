import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModelModule } from '@vendor-app/core/mongooseModels.module';
import {
  closeInMemoryMongodConnection,
  rootMongooseTestModule,
} from '../../../test/database';
import { ProductsService } from './products.service';
import configuration from '@vendor-app/config/index';
import { TestDataSeeder } from '../../../test/testDataSeeder';
import { DepositsService } from '@vendor-app/deposits/services/deposits.service';

describe.only('ProductsService', () => {
  let testDataSeeder: TestDataSeeder;
  let service: ProductsService;
  let depositService: DepositsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModelModule,
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [ProductsService, DepositsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    testDataSeeder = TestDataSeeder.create(module);
    depositService = module.get<DepositsService>(DepositsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create products', async () => {
      const user = await testDataSeeder.seedUserByRole('seller');
      await testDataSeeder.seedProduct(user._id);

      const result = await service.create(user, {
        name: 'Water Mellon',
        amountAvailable: 50,
        cost: 5,
      });

      expect(result).toBeDefined();
      expect(result.amountAvailable).toEqual(50);
    });
  });

  describe('List Product', () => {
    it('should list paginated products', async () => {
      const user = await testDataSeeder.seedUserByRole('seller');
      await testDataSeeder.seedProduct(user._id);

      const result = await service.index(user, {
        page: 1,
        limit: 5,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(result.nodes.length).toEqual(2);
    });
  });

  describe('View Product', () => {
    it('should view single product', async () => {
      const user = await testDataSeeder.seedUserByRole('seller');
      const products = await testDataSeeder.seedProduct(user._id);

      const result = await service.view(products[0]._id);

      expect(result).toBeDefined();
    });
  });

  describe('Update Product', () => {
    it('should update single product', async () => {
      const user = await testDataSeeder.seedUserByRole('seller');
      const products = await testDataSeeder.seedProduct(user._id);

      const result = await service.update(user, products[0]._id, {
        amountAvailable: 60,
        cost: 10,
      });

      expect(result).toBeDefined();
    });
  });

  describe('Delete Product', () => {
    it('should delete single product', async () => {
      const user = await testDataSeeder.seedUserByRole('seller');
      const products = await testDataSeeder.seedProduct(user._id);

      const result = await service.delete(user, products[0]._id);

      expect(result).toBeDefined();
    });
  });

  describe('Buy Product', () => {
    it('should throw error of you dont have any coins deposited to make purchases, deposit coins now', async () => {
      const seller = await testDataSeeder.seedUserByRole('seller');
      const buyer = await testDataSeeder.seedUserByRole('buyer');
      const products = await testDataSeeder.seedProduct(seller.id);
      await expect(
        service.buy(buyer, {
          products: [
            {
              id: products[0]._id,
              quantity: 5,
            },
            {
              id: products[1]._id,
              quantity: 10,
            },
          ],
        }),
      ).rejects.toThrow();
    });
    it('should buy multiple product', async () => {
      const seller = await testDataSeeder.seedUserByRole('seller');
      let buyer = await testDataSeeder.seedUserByRole('buyer');
      buyer = await testDataSeeder.seedUserDeposit(buyer._id, 50);
      const products = await testDataSeeder.seedProduct(seller._id);
      jest.spyOn(depositService, 'reset').mockImplementation();

      const result = await service.buy(buyer, {
        products: [
          {
            id: products[0]._id,
            quantity: 2,
          },
          {
            id: products[1]._id,
            quantity: 1,
          },
        ],
      });

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.change.length).toEqual(3);
    });
  });

  afterEach(async () => {
    await testDataSeeder.removeAllData();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeInMemoryMongodConnection();
    await module.close();
  });
});
