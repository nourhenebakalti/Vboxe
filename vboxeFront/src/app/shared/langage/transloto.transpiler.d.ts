import { InjectionToken, Injector } from "@angular/core";
import { HashMap, Translation } from "./type";
//import { TranslocoConfig } from "./transloco.config";
import * as ɵngcc0 from "@angular/core";
export declare const TRANSLOCO_TRANSPILER: InjectionToken<{}>;
export interface TranslocoTranspiler {
  transpile(value: any, params: HashMap, translation: HashMap): any;
  onLangChanged?(lang: string): void;
}
export declare class DefaultTranspiler implements TranslocoTranspiler {
  protected interpolationMatcher: RegExp;
  //constructor(userConfig?: TranslocoConfig);
  transpile(value: any, params: HashMap, translation: Translation): any;
  /**
   *
   * @example
   *
   * const en = {
   *  a: {
   *    b: {
   *      c: "Hello {{ value }}"
   *    }
   *  }
   * }
   *
   * const params =  {
   *  "b.c": { value: "Transloco "}
   * }
   *
   * service.selectTranslate('a', params);
   *
   * // the first param will be the result of `en.a`.
   * // the second param will be `params`.
   * parser.transpile(value, params, {});
   *
   *
   */
  protected handleObject(
    value: any,
    params: HashMap,
    translation: Translation
  ): any;
  protected handleArray(
    value: string[],
    params: HashMap,
    translation: Translation
  ): any[];
}
export interface TranslocoTranspilerFunction {
  transpile(...args: string[]): any;
}
export declare function getFunctionArgs(argsString: string): string[];
export declare class FunctionalTranspiler
  extends DefaultTranspiler
  implements TranslocoTranspiler
{
  private injector;
  constructor(injector: Injector);
  transpile(value: any, params: HashMap, translation: Translation): any;
  static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<FunctionalTranspiler, never>;
  static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<FunctionalTranspiler>;
}

//# sourceMappingURL=transloco.transpiler.d.ts.map
