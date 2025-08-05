import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { join } from 'path';
import { AllExceptionsFilter } from './shared/exceptions/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import { RouteSeeder } from './shared-modules/route/shared/route.seeder';
import { RequestLogService } from './shared-modules/request-log/request-log.service';

async function bootstrap() {
  // Create a new NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Enable Cross-Origin Resource Sharing
  app.enableCors();

  // Configuration service for environment variables
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get('NODE_ENV');
  const port = configService.get('APP_PORT');

  // Middleware for parsing JSON and URL-encoded data
  app.use(express.json({ limit: '250mb' }));
  app.use(express.urlencoded({ limit: '250mb', extended: true }));

  // Middleware for serving static files from the 'public' directory
  app.use(
    '/public',
    express.static(join(__dirname, '..', 'storage', 'public')),
  );

  // Apply global filters for exception handling
  const requestLogService = app.get(RequestLogService);
  app.useGlobalFilters(
    new AllExceptionsFilter(configService, requestLogService),
  );

  // Apply global validation pipes for request data validation and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Logging for non-production environments
  if (nodeEnv !== 'production') {
    const TZ = configService.get('TZ');
    console.log(`NODE_ENV: ${nodeEnv}`);
    console.log(`Timezone: ${TZ}`);
  }

  // Start listening for incoming requests on the configured port
  await app.listen(port);
  console.log(`Application started successfully on port ${port}`);

  // Seeding routes for dynamic route registration
  const server = app.getHttpServer();
  const router = server._events.request._router;
  const existRoutes = router.stack
    .filter(
      (routeObj) => routeObj.route && routeObj.route.stack[0].method !== 'acl',
    )
    .map((routeObj) => ({
      path: routeObj.route?.path,
      method: routeObj.route?.stack[0].method,
    }));

  const routeSeeder = app.get(RouteSeeder);
  await routeSeeder.seed(existRoutes);
  if (nodeEnv !== 'production') {
    await routeSeeder.updateAllRoutesToExternal();
  }
}
bootstrap();
