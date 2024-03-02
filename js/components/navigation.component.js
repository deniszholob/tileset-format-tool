import { HTMLElementsTemplateNavigation } from './navigation.elements.js';
export class NavigationComponent {
    template;
    constructor(template) {
        this.template = template;
    }
    update(parentElement, links, currentLink) {
        parentElement.innerHTML = '';
        links.forEach((link, i) => {
            const item = this.createLinkItem(i, link, currentLink);
            parentElement.appendChild(item);
        });
    }
    createLinkItem(i, link, currentLink) {
        //  Clone template first
        const cloneInstance = this.template.content.cloneNode(true);
        // Create template Element Class
        const cloneInstanceHtmlElements = new HTMLElementsTemplateNavigation(cloneInstance, i);
        // Now populate values
        cloneInstanceHtmlElements.templateNavLink.href = link.url;
        cloneInstanceHtmlElements.templateNavLink.textContent = link.title;
        if (link.title === currentLink.title) {
            cloneInstanceHtmlElements.templateNavLink.classList.add('underline');
            cloneInstanceHtmlElements.templateNavLink.classList.remove('no-underline');
        }
        else {
            cloneInstanceHtmlElements.templateNavLink.classList.remove('underline');
            cloneInstanceHtmlElements.templateNavLink.classList.add('no-underline');
        }
        return cloneInstance;
    }
}
