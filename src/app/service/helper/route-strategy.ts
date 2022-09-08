import {
    RouteReuseStrategy,
    ActivatedRouteSnapshot,
    DetachedRouteHandle,
} from '@angular/router';

export class RouteStrategy implements RouteReuseStrategy {

    private handlers: { [key: string]: DetachedRouteHandle } = {};


    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        
        if (!route.routeConfig || route.routeConfig.loadChildren) {
            return false;
        }
        /* Whether this route should be re used or not */
        let shouldReuse = false;
        if (route.routeConfig.data) {
            route.routeConfig.data.reuse ? shouldReuse = true : shouldReuse = false;
        }
        //Check the from route and decide whether to reuse or not
        if(route.routeConfig.path == 'page1') {
            shouldReuse = false;
        } else {
            shouldReuse = true;
        }
        return shouldReuse;
    }



    store(route: ActivatedRouteSnapshot, handler: DetachedRouteHandle): void {
         console.log('[router-reuse] storing handler');
        if (handler) {
            this.handlers[this.getUrl(route)] = handler;
        }
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!this.handlers[this.getUrl(route)];
    }


    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig || route.routeConfig.loadChildren) {
            return null;
        }

        return this.handlers[this.getUrl(route)];
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
         /* We only want to reuse the route if the data of the route config contains a reuse true boolean */
         let reUseUrl = false;

         if (future.routeConfig) {
             if (future.routeConfig.data) {
                 reUseUrl = future.routeConfig.data.reuse;
             }
         }
 
         /**
          * Default reuse strategy by angular assers based on the following condition
          * @see https://github.com/angular/angular/blob/4.4.6/packages/router/src/route_reuse_strategy.ts#L67
          */
         const defaultReuse = (future.routeConfig === current.routeConfig);
 
         // If either of our reuseUrl and default Url are true, we want to reuse the route
         //
         return reUseUrl || defaultReuse;
    }


    /**
     * Returns a url for the current route
     */
     getUrl(route: ActivatedRouteSnapshot): string {
        /* The url we are going to return */
        let next = route;
        // Since navigation is usually relative
        // we go down to find out the child to be shown.
        while (next.firstChild) {
          next = next.firstChild;
        }
        let segments = '';
        // Then build a unique key-path by going to the root.
        while (next) {
          segments += next.url.join('/');
          next = next.parent;
        }
        return segments;
    }


}