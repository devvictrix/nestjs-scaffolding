import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Example } from './example.entity';

@Injectable()
export class ExampleRepository extends Repository<Example> {
  constructor(
    @InjectRepository(Example)
    repository: Repository<Example>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findOneById(id: number) {
    if (id === null || id === undefined) {
      throw new BadRequestException('Invalid ID');
    }

    return await this.findOne({
      where: { id: id },
    });
  }
}
