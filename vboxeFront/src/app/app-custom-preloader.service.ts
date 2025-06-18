import { PreloadingStrategy, Route, Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AppCustomPreloaderService implements PreloadingStrategy {
  constructor(private router: Router) {}
  preload(route: Route, load: Function): Observable<any> {
    // Preload module when start URL match with preload data
    return route.data &&
      route.data["preloadAtPath"] &&
      this.router.url.startsWith(route.data["preloadAtPath"])
      ? load()
      : of(null);
  }
}
