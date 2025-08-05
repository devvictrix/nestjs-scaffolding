import { Injectable } from '@nestjs/common';
import { Route } from './shared/route.entity';
import { RouteRepository } from './shared/route.repository';
import { groupRoutesByAccessType } from './shared/route.serialization';

@Injectable()
export class RouteService {
  constructor(private readonly routeRepository: RouteRepository) {}

  async getGroupedRoutes() {
    const routes = await this.routeRepository.findAllActivateRoutes();

    return groupRoutesByAccessType(routes);
  }

  async findOneByRouteAndMethod(path: string, method: string): Promise<Route> {
    const route = await this.routeRepository.findOneByRouteAndMethod(
      path,
      method,
    );

    return route;
  }
}
