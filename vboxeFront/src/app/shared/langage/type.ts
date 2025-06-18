import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
export interface TranslocoLoader {
    getTranslation(lang: string, data?: TranslocoLoaderData): Observable<Translation> | Promise<Translation>;
}
export declare type TranslocoLoaderData = {
    scope: string;
};
export declare class DefaultLoader implements TranslocoLoader {
    private translations;
    constructor(translations: Map<string, Translation>);
    getTranslation(lang: string): Observable<Translation>;
}
export declare const TRANSLOCO_LOADER: InjectionToken<import("./type").HashMap<any>>;

export declare type AvailableLangs =
  | string[]
  | {
      id: string;
      label: string;
    }[];
export declare type HashMap<T = any> = {
  [key: string]: T;
};
export declare type LoadedEvent = {
  type: "translationLoadSuccess";
  wasFailure: boolean;
  payload: {
    scope: string | null;
    langName: string;
    /** @deprecated */
    lang: string;
  };
};
export declare type FailedEvent = {
  type: "translationLoadFailure";
  payload: LoadedEvent["payload"];
};
export declare type TranslocoEvents = LoadedEvent | FailedEvent;
export declare type Translation = HashMap;
export declare type PersistStorage = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
>;
export declare type TranslateParams = string | string[];
export declare type TranslateObjectParams =
  | TranslateParams
  | HashMap
  | Map<string, HashMap>;
export declare type SetTranslationOptions = {
  merge?: boolean;
  emitChange?: boolean;
};
export declare type ProviderScope = {
  scope: string;
  loader?: InlineLoader;
  alias?: string;
};
export declare type MaybeArray<T> = T | T[];
export declare type TranslocoScope = ProviderScope | string | undefined;
export declare type InlineLoader = HashMap<() => Promise<Translation>>;
export declare type LoadOptions = {
  fallbackLangs?: string[] | null;
  /** @internal */
  failedCounter?: number;
  inlineLoader?: InlineLoader | null;
};
