import { Injectable } from '@angular/core';
import { VboxApiService } from './../services/vbox-api.service';
import { HandleAPIError, HandleError } from './error.state';
import { LoadUser, ResetUser } from './user.state';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { catchError, delay, map } from 'rxjs/operators';
import { take } from 'rxjs/operators';

export interface AppStateModel {
  isUserLoggedIn: boolean;
  accessToken: string;
}

export class LogUser {
  static readonly type = '[App] log user';

  constructor(public token: string) {}
}

export class LogOutUser {
  static readonly type = '[App] logout user';

  constructor(public sessionExpired = false) {}
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    isUserLoggedIn: false,
    accessToken: null
  }
})
@Injectable({
  providedIn: 'root'
})
export class AppState implements NgxsOnInit {
  constructor(
    private vboxApi: VboxApiService
  ) {}

  @Selector()
  static getToken(state: AppStateModel) {
    return state.accessToken;
  }

  ngxsOnInit(ctx?: StateContext<AppStateModel>): void | any {
   /*  if (null !== this.auth.token) {
      return ctx.dispatch(new LogUser(this.auth.token));
    } */
  }

  @Action(LogUser)
  logUser(ctx: StateContext<AppStateModel>, action: LogUser) {
    ctx.patchState({
      isUserLoggedIn: true,
      accessToken: action.token
    });

    return ctx.dispatch(new LoadUser()).pipe(
      catchError(error => {
        return ctx.dispatch([new LogOutUser(), new HandleAPIError(error)]);
      })
    );
  }

  @Action(LogOutUser)
  logoutUser(ctx: StateContext<AppStateModel>, action: LogOutUser) {
    ctx.patchState({
      isUserLoggedIn: false,
      accessToken: null
    });

    this.vboxApi.logout();

    // Purge data
    ctx.dispatch([
      new Navigate(['/']),
      new ResetUser()
    ]);

    const logout$ = this.vboxApi.logout().pipe(
      take(1),
      map(() => {
        return ctx.dispatch(new Navigate(['/login']));
      })
    );

    if (action.sessionExpired) {
      return logout$.pipe(
        delay(2000),
        map(() => {
          return ctx.dispatch(new HandleError(401));
        })
      );
    }

    return logout$;
  }
}
