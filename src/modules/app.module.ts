import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from 'src/controllers/app.controller';
import { AppService } from 'src/services/app.service';
import { PaymentController } from 'src/controllers/payment.controller';
import { PaymentService } from 'src/services/payment.service';
import { PaymentSchema } from 'src/models/payment.model';
import { RefundSchema } from 'src/models/refund.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_CONNECT_URL');
        const dbName = configService.get<string>('MONGODB_DATABASE');
        return {
          uri: `${uri}${dbName}`,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Payment', schema: PaymentSchema },
      { name: 'Refund', schema: RefundSchema },
    ]),
  ],
  controllers: [AppController, PaymentController],
  providers: [AppService, PaymentService],
})
export class AppModule {}
