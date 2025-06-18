import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AvailableLangs } from "./type";
//import { TranslocoService } from "@jsverse/transloco";

@Component({
  selector: "app-langage",
  templateUrl: "./langage.component.html",
  styleUrls: ["./langage.component.scss"],
})
export class LangageComponent implements OnInit {
  availableLangs: AvailableLangs;
  activeLang: string;
  flagCodes: any;

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    //private _translocoService: TranslocoService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the available languages from transloco
    //this.availableLangs = this._translocoService.getAvailableLangs();

    // Subscribe to language changes
    // this._translocoService.langChanges$.subscribe((activeLang) => {
    //   //Get the active lang
    //   this.activeLang = activeLang;

    //   // Update the navigation
    //   //this._updateNavigation(activeLang);
    // });

    // Set the country iso codes for languages for flags
    this.flagCodes = {
      en: "gb",
      fr: "fr",
      de: "de",
    };
  }

  get formattedLangs() {
    if (
      Array.isArray(this.availableLangs) &&
      typeof this.availableLangs[0] === "string"
    ) {
      return (this.availableLangs as string[]).map((lang) => ({
        id: lang,
        label: lang,
      }));
    }
    return this.availableLangs as { id: string; label: string }[];
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set the active lang
   *
   * @param lang
   */
  setActiveLang(lang: string): void {
    // Set the active lang
    //this._translocoService.setActiveLang(lang);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
}
