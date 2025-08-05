import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './route.entity';
import { ROUTE_STATUSES } from './route.constant';

@Injectable()
export class RouteRepository extends Repository<Route> {
  constructor(
    @InjectRepository(Route)
    repository: Repository<Route>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllActivateRoutes(): Promise<Route[]> {
    return await this.find({
      where: {
        status: ROUTE_STATUSES.ACTIVATED,
      },
    });
  }

  async findAllActivateRoutesWithRelations(): Promise<Route[]> {
    return await this.find({
      where: {
        status: ROUTE_STATUSES.ACTIVATED,
      },
    });
  }

  async findOneByRouteAndMethod(path: string, method: string): Promise<Route> {
    return await this.findOne({
      where: { path, method },
    });
  }
}
