import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from 'src/modules/app.module';
import mongoose from 'mongoose';

jest.setTimeout(30000);

describe('Database Connection', () => {
  let app;
  let mongooseInstance: typeof mongoose;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            const uri = configService.get<string>('MONGODB_CONNECT_URL');
            const dbName = configService.get<string>('MONGODB_DATABASE');
            console.log('Connecting to:', `${uri}${dbName}`);
            return {
              uri: `${uri}${dbName}`,
              useUnifiedTopology: true,
            };
          },
          inject: [ConfigService],
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    mongooseInstance = mongoose;
  });

  afterAll(async () => {
    if (mongooseInstance) {
      await mongooseInstance.disconnect();
    }
    if (app) {
      await app.close();
    }
  });

  it('should connect to MongoDB', async () => {
    const dbConnection = mongooseInstance.connection;
    expect(dbConnection.readyState).toBe(1);
  });
});
