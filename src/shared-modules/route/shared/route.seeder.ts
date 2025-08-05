import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RouteRepository } from './route.repository';
import { ROUTE_ACCESS_TYPES, ROUTE_STATUSES } from './route.constant';
import { Route } from './route.entity';

@Injectable()
export class RouteSeeder {
  constructor(private readonly routeRepository: RouteRepository) {}

  async seed(routes: any[]) {
    await this.routeRepository.manager.transaction(
      async (transactionalEntityManager) => {
        try {
          // Fetch all existing routes from the database.
          const existingRoutes = await transactionalEntityManager.find(Route);

          // Deactivate all existing routes in the database.
          await transactionalEntityManager.update(
            Route,
            {},
            { status: ROUTE_STATUSES.DEACTIVATED },
          );

          // Filter out any routes you wish to ignore.
          const ignoreRoutes = [];
          const cleanRoutes = routes.filter(
            (existRoute) => !ignoreRoutes.includes(existRoute.path),
          );

          // Activate or create routes based on the extracted routes.
          const operations = cleanRoutes.map((cleanRoute) => {
            const existingRoute = existingRoutes.find(
              (er) =>
                er.path === cleanRoute.path && er.method === cleanRoute.method,
            );

            if (existingRoute) {
              existingRoute.status = ROUTE_STATUSES.ACTIVATED;
              return existingRoute;
            } else {
              return transactionalEntityManager.create(Route, {
                ...cleanRoute,
                status: ROUTE_STATUSES.ACTIVATED,
              });
            }
          });

          // Check if the lengths are different.
          if (cleanRoutes.length !== operations.length) {
            throw new InternalServerErrorException(
              `Warning: The number of routes from the application (${cleanRoutes.length}) does not match the number of routes in the database (${operations.length}).`,
            );
          }

          // Save the changes to the database.
          await transactionalEntityManager.save(Route, operations);
        } catch (error) {
          throw new InternalServerErrorException(
            'Error occurred during route seeding:  ' + error,
          );
        }
      },
    );
  }

  async updateAllRoutesToExternal() {
    // Define all routes with their respective access types and associated roles
    const allRoutes = [];

    // Fetch all active routes
    const activeRoutes = await this.routeRepository.find({
      where: { status: ROUTE_STATUSES.ACTIVATED },
    });

    // Iterate over all active routes to update their configurations
    const updates = activeRoutes
      .map((activeRoute) => {
        // Attempt to find a specific route configuration that matches both the path and the method
        const specificRouteConfig = allRoutes.find(
          (r) =>
            activeRoute.path === r.path &&
            (r.method ? activeRoute.method === r.method : true),
        );

        // If a specific route config isn't found, attempt to match a wildcard route
        const wildcardRouteConfig =
          !specificRouteConfig &&
          allRoutes.find(
            (r) =>
              r.path.endsWith('*') &&
              activeRoute.path.startsWith(r.path.slice(0, -1)),
          );

        let routeConfig: any = specificRouteConfig || wildcardRouteConfig;

        if (!routeConfig) {
          routeConfig = {
            path: activeRoute.path,
            accessType: ROUTE_ACCESS_TYPES.PRIVATE,
          };

          routeConfig.accessType = ROUTE_ACCESS_TYPES.EXTERNAL_SERVICE;
        }

        // Apply the access type and roles from the configuration to the active route
        activeRoute.accessType = routeConfig.accessType;
        return activeRoute;
      })
      .filter((route) => route !== null); // Filter out any nulls where no config was matched

    // Perform bulk update
    if (updates.length > 0) {
      await this.routeRepository.save(updates);
    }
  }
}
