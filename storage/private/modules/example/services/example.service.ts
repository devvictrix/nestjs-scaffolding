import { Injectable, NotFoundException } from '@nestjs/common';
import { ExampleRepository } from '../entities/example.repository';

@Injectable()
export class ExampleService {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async create(payload: any) {
    return payload;
  }

  async findAll() {
    const exaples = await this.exampleRepository.find();

    return exaples;
  }
  async findOne(id: number) {
    const example = await this.exampleRepository.findOneById(id);

    if (!example) {
      throw new NotFoundException(`User not found`);
    }

    return example;
  }

  async update(id: number, payload: any) {
    return payload;
  }

  async remove(id: number) {
    const example = await this.findOne(id);

    await this.exampleRepository.softRemove(example);
  }
}
