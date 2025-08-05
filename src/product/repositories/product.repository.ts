import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findOneById(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid ID');
    }

    return await this.findOne({
      where: { id },
    });
  }
}
