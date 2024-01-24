export class HtmlElementsBase {
  public updateDate: HTMLSpanElement = this.getElementById('updateDate');

  constructor() {}

  protected getElementById<T extends HTMLElement>(name: string): T {
    const element: HTMLElement | null = document.getElementById(name);
    if (this.checkNull(element)) return element as T;
    throw new Error(`Element "${name}" does not exist: ${element}`);
  }

  private checkNull<T>(v?: T | null): v is T {
    return v != null;
  }
}
