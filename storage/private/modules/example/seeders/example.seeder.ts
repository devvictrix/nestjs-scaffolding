import { Injectable } from '@nestjs/common';
import { ExampleRepository } from '../entities/example.repository';

@Injectable()
export class ExampleSeeder {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async seed() {
    const newExamples = [];

    const users = this.exampleRepository.create(newExamples);
    await this.exampleRepository.save(users);
  }
}
