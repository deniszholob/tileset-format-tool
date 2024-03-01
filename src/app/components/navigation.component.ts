import { HTMLElementsTemplateNavigation } from './navigation.elements.js';

export interface Link {
  title: string;
  url: string;
}

export class NavigationComponent {
  constructor(private template: HTMLTemplateElement) {}

  public update(
    parentElement: HTMLElement,
    links: Link[],
    currentLink: Link,
  ): void {
    parentElement.innerHTML = '';
    links.forEach((link: Link, i: number) => {
      const item: DocumentFragment = this.createLinkItem(i, link, currentLink);
      parentElement.appendChild(item);
    });
  }

  private createLinkItem(
    i: number,
    link: Link,
    currentLink: Link,
  ): DocumentFragment {
    //  Clone template first
    const cloneInstance: DocumentFragment = this.template.content.cloneNode(
      true,
    ) as DocumentFragment;

    // Create template Element Class
    const cloneInstanceHtmlElements: HTMLElementsTemplateNavigation =
      new HTMLElementsTemplateNavigation(cloneInstance, i);

    // Now populate values
    cloneInstanceHtmlElements.templateNavLink.href = link.url;
    cloneInstanceHtmlElements.templateNavLink.textContent = link.title;

    if (link.title === currentLink.title) {
      cloneInstanceHtmlElements.templateNavLink.classList.add('underline');
      cloneInstanceHtmlElements.templateNavLink.classList.remove(
        'no-underline',
      );
    } else {
      cloneInstanceHtmlElements.templateNavLink.classList.remove('underline');
      cloneInstanceHtmlElements.templateNavLink.classList.add('no-underline');
    }

    return cloneInstance;
  }
}
