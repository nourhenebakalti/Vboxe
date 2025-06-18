import { Injectable } from "@angular/core";
import { VboxApiService } from "./../services/vbox-api.service";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { TranslateService } from "@ngx-translate/core";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  fixNumber: string;
  civility: string;
  currency: string;
  adress: string;
  adress2: string;
  city: string;
  zipCode: string;
  logo: string;
  hasPasswordCoffre: boolean;
}

export interface UserStateModel {
  user: User;
  habilitations: Array<string>;
}

/**
 * Load user
 */
export class LoadUser {
  static readonly type = "[User] load user ";

  constructor() {}
}

/**
 * Reset user
 */
export class ResetUser {
  static readonly type = "[User] reset user";

  constructor() {}
}

const stateDefaults: UserStateModel = {
  user: null,
  habilitations: [],
};

@State<UserStateModel>({
  name: "user",
  defaults: stateDefaults,
})
@Injectable({
  providedIn: "root",
})
export class UserState {
  constructor() {}

  @Selector()
  static getUser(state: UserStateModel) {
    return state.user;
  }

  @Action(LoadUser)
  loadUser(ctx: StateContext<UserStateModel>) {}

  @Action(ResetUser)
  resetUser(ctx: StateContext<UserStateModel>) {
    if (ctx.getState().user !== null) {
      ctx.patchState(stateDefaults);
    }
  }
}
