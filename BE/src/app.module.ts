import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import { ExpensesModule } from './expenses/expenses.module';
import { GroupsModule } from './groups/groups.module';
import { NotificationsModule } from './notifications/notifications.module';
import {
  CalculationCache,
  CalculationCacheSchema,
} from './schemas/calculation-cache.schema';
import {
  PaymentFormula,
  PaymentFormulaSchema,
} from './schemas/payment-formula.schema';
import { SettlementsModule } from './settlements/settlements.module';
import { StatisticsModule } from './statistics/statistics.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig, redisConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: PaymentFormula.name, schema: PaymentFormulaSchema },
      { name: CalculationCache.name, schema: CalculationCacheSchema },
    ]),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('app.throttleTtl') || 60,
            limit: configService.get<number>('app.throttleLimit') || 100,
          },
        ],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    GroupsModule,
    ExpensesModule,
    SettlementsModule,
    NotificationsModule,
    StatisticsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
