export class HtmlElementsBase {
    updateDate = this.getElementById('updateDate');
    constructor() { }
    getElementById(name) {
        const element = document.getElementById(name);
        if (this.checkNull(element))
            return element;
        throw new Error(`Element "${name}" does not exist: ${element}`);
    }
    checkNull(v) {
        return v != null;
    }
}
