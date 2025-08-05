import { InternalServerErrorException, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { Route } from './route.entity';

const getMethodEnum = (method: string): RequestMethod => {
  const methodMap: { [key: string]: RequestMethod } = {
    get: RequestMethod.GET,
    post: RequestMethod.POST,
    put: RequestMethod.PUT,
    delete: RequestMethod.DELETE,
    patch: RequestMethod.PATCH,
    all: RequestMethod.ALL,
    options: RequestMethod.OPTIONS,
    head: RequestMethod.HEAD,
    search: RequestMethod.SEARCH,
  };

  const methodEnum = methodMap[method.toLowerCase()];

  if (methodEnum === undefined) {
    throw new InternalServerErrorException(`Invalid method: ${method}`);
  }

  return methodEnum;
};

export const groupRoutesByAccessType = (
  routes: Route[],
): {
  publicRoutes: RouteInfo[];
  privateNoRoleCheckRoutes: RouteInfo[];
  privateRoutes: RouteInfo[];
  externalServiceRoutes: RouteInfo[];
} => {
  return routes.reduce(
    (acc, route) => {
      try {
        const methodEnum = getMethodEnum(route.method);
        const routeInfo: any = {
          path: route.path,
          method: methodEnum,
        };

        switch (route.accessType) {
          case 'PUBLIC':
            acc.publicRoutes.push(routeInfo);
            break;
          case 'PRIVATE_NO_ROLE_CHECK':
            acc.privateNoRoleCheckRoutes.push(routeInfo);
            break;
          case 'PRIVATE':
            acc.privateRoutes.push(routeInfo);
            break;
          case 'EXTERNAL_SERVICE':
            acc.externalServiceRoutes.push(routeInfo);
            break;
          default:
            throw new InternalServerErrorException(
              'Route access type not exists.',
            );
        }
      } catch (error) {
        throw new InternalServerErrorException(
          `Error processing route: ${route.path} with method: ${route.method}` +
            error,
        );
      }

      return acc;
    },
    {
      publicRoutes: [],
      privateNoRoleCheckRoutes: [],
      privateRoutes: [],
      externalServiceRoutes: [],
    },
  );
};
