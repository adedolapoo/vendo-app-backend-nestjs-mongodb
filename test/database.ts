/**
 * mongo test
 */
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

jest.setTimeout(100000);

export const rootMongooseTestModule = (options?: MongooseModuleOptions) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      const defaultOptions: MongooseModuleOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
      mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      return {
        uri: mongoUri,
        ...(options ?? defaultOptions),
      };
    },
  });

export const closeInMemoryMongodConnection = async () => {
  if (mongod) await mongod.stop();
};
