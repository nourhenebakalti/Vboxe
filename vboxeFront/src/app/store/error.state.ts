import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastType } from './../models/error.model';
import { getMessageError } from './../utils/error-handler.utils';
import { Action, State, StateContext } from '@ngxs/store';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStateModel } from './app.state';

export class DisplayToast {
  static readonly type = '[App] display toast message';

  constructor(
    public message: string,
    public type: ToastType = ToastType.Info,
    public duration: number = 5000
  ) {}
}

export class HandleError {
  static readonly type = '[App] handle error';

  constructor(public errorCode: number) {}
}

export class HandleAPIError {
  static readonly type = '[App] handle API error';

  constructor(public error: HttpErrorResponse) {}
}

@State<{}>({
  name: 'error',
  defaults: {}
})
@Injectable({
  providedIn: 'root'
})
export class ErrorState {
  constructor(private translate: TranslateService) {}

  @Action(DisplayToast, { cancelUncompleted: true })
  displayToastMessage(ctx: StateContext<AppStateModel>, toast: DisplayToast) {}

  @Action(HandleError)
  handleError(ctx: StateContext<AppStateModel>, action: HandleError) {
    const messageErrorKey = getMessageError(action.errorCode);
    const messageError = this.translate.instant(messageErrorKey);

    return ctx.dispatch(new DisplayToast(messageError, ToastType.Error, 5000));
  }

  @Action(HandleAPIError)
  handleAPIError(ctx: StateContext<AppStateModel>, action: HandleAPIError) {
    const { ErreurDescription } = action.error.error;

    if (ErreurDescription) {
      return ctx.dispatch(
        new DisplayToast(ErreurDescription, ToastType.Error, 5000)
      );
    }

    return ctx.dispatch(new HandleError(action.error.status));
  }
}
