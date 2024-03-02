import { APP_UPDATE_DATE } from '../app-update.js';
import { NAV_LINKS } from '../data/links.data.js';
import { AppLocalStorageService } from '../services/app-local-storage.service.js';
import { BitMaskTiles } from '../util/bit-mask-tiles.model.js';
import { NavigationComponent } from './navigation.component.js';
export class GenericPageComponent {
    HTML_ELEMENTS;
    bitMaskTiles;
    appLocalStorageService = new AppLocalStorageService();
    tileSets = this.appLocalStorageService.loadTileSets();
    appSettings = this.appLocalStorageService.loadAppSettings();
    constructor(HTML_ELEMENTS, activePage) {
        this.HTML_ELEMENTS = HTML_ELEMENTS;
        this.renderUpdateDate();
        this.renderNavigation(activePage);
        this.bitMaskTiles = new BitMaskTiles(this.appSettings.bitMaskRenderSettings.hd
            ? this.HTML_ELEMENTS.bitMask64
            : this.HTML_ELEMENTS.bitMask32);
    }
    renderUpdateDate() {
        this.HTML_ELEMENTS.updateDate.innerHTML = APP_UPDATE_DATE;
    }
    renderNavigation(activePage) {
        const navigationComponent = new NavigationComponent(this.HTML_ELEMENTS.templateNavItem);
        navigationComponent.update(this.HTML_ELEMENTS.navLinks, NAV_LINKS, activePage);
    }
    createHTMLSelectOptions(selectElement, optionsArray) {
        const fragment = document.createDocumentFragment();
        optionsArray.forEach((optionData) => {
            const option = document.createElement('option');
            option.text = optionData.name;
            option.value = `${optionData.value}`;
            fragment.appendChild(option);
        });
        selectElement.innerHTML = '';
        selectElement.appendChild(fragment);
    }
}
