import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteService } from './route.service';
import { Route } from './shared/route.entity';
import { RouteRepository } from './shared/route.repository';
import { RouteSeeder } from './shared/route.seeder';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Route])],
  controllers: [],
  providers: [RouteRepository, RouteService, RouteSeeder],
  exports: [RouteService, RouteSeeder],
})
export class RouteModule {}
