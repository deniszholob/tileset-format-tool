import { APP_UPDATE_DATE } from '../app-update.js';
import { SelectOption } from '../classes/SelectOption.model.js';
import { AppSettings } from '../classes/settings.model.js';
import { TileSets } from '../classes/TileSets.model.js';
import { NAV_LINKS } from '../data/links.data.js';
import { AppLocalStorageService } from '../services/app-local-storage.service.js';
import { BitMaskTiles } from '../util/bit-mask-tiles.model.js';
import { GenericPageHtmlElements } from './generic-page.elements.js';
import { Link, NavigationComponent } from './navigation.component.js';

export abstract class GenericPageComponent<T extends GenericPageHtmlElements> {
  protected readonly bitMaskTiles: BitMaskTiles;
  protected readonly appLocalStorageService: AppLocalStorageService =
    new AppLocalStorageService();
  protected tileSets: TileSets = this.appLocalStorageService.loadTileSets();
  protected appSettings: AppSettings =
    this.appLocalStorageService.loadAppSettings();

  constructor(
    protected readonly HTML_ELEMENTS: T,
    activePage: Link,
  ) {
    this.renderUpdateDate();
    this.renderNavigation(activePage);
    this.bitMaskTiles = new BitMaskTiles(
      this.appSettings.bitMaskRenderSettings.hd
        ? this.HTML_ELEMENTS.bitMask64
        : this.HTML_ELEMENTS.bitMask32,
    );
  }

  private renderUpdateDate(): void {
    this.HTML_ELEMENTS.updateDate.innerHTML = APP_UPDATE_DATE;
  }

  private renderNavigation(activePage: Link): void {
    const navigationComponent: NavigationComponent = new NavigationComponent(
      this.HTML_ELEMENTS.templateNavItem,
    );
    navigationComponent.update(
      this.HTML_ELEMENTS.navLinks,
      NAV_LINKS,
      activePage,
    );
  }

  protected createHTMLSelectOptions(
    selectElement: HTMLSelectElement,
    optionsArray: SelectOption[],
  ): void {
    const fragment: DocumentFragment = document.createDocumentFragment();

    optionsArray.forEach((optionData: SelectOption): void => {
      const option: HTMLOptionElement = document.createElement('option');
      option.text = optionData.name;
      option.value = `${optionData.value}`;
      fragment.appendChild(option);
    });

    selectElement.innerHTML = '';
    selectElement.appendChild(fragment);
  }
}
