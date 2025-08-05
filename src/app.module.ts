import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { RouteModule } from './shared-modules/route/route.module';
import { InMemoryCacheModule } from './shared-modules/in-memory-cache/in-memory-cache.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AllExceptionsFilter } from './shared/exceptions/all-exceptions.filter';
import { RequestLogInterceptor } from './shared/interceptors/request-log.interceptor';
import { CentralSeeder } from './shared/seeders/central.seeder';
import { RouteService } from './shared-modules/route/route.service';
import { RequestLogMiddleware } from './shared/middlewares/request-log.middleware';
import { RequestLogModule } from './shared-modules/request-log/request-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL'),
          limit: configService.get<number>('THROTTLE_LIMIT'),
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('TYPEORM_SYNCHONIZE') === 'TRUE',
        // logging: true,
      }),
      inject: [ConfigService],
    }),
    // Global Modules
    RouteModule,
    InMemoryCacheModule,

    // Shared Modules
    RequestLogModule,

    // Business Modules
    ProductModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLogInterceptor,
    },
    CentralSeeder,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly routeService: RouteService) {}

  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLogMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    // Below is an example of how you might load and apply middleware to routes dynamically based on database entries.
    // This approach is commented out as it's not currently in use and requires further investigation.
    // It's intended to allow for more granular control over which routes require authentication,
    // This feature has been explored in the Development Server environment. There are no current implementations for the Production environment.
    //
    // const { externalServiceRoutes } = await this.routeService.getGroupedRoutes();
    // console.log(externalServiceRoutes);
    // consumer.apply(AuthMiddleware).forRoutes(...externalServiceRoutes);
  }
}
