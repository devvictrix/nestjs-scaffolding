import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleService } from './services/example.service';
import { ExampleController } from './controllers/example.controller';
import { ExampleRepository } from './entities/example.repository';
import { Example } from './entities/example.entity';
import { ExampleSeeder } from './seeders/example.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Example])],
  controllers: [ExampleController],
  providers: [ExampleRepository, ExampleService, ExampleSeeder],
  exports: [ExampleSeeder],
})
export class ExampleModule {}
