export class BaseHtmlElements {
    node;
    constructor(node) {
        this.node = node;
    }
    getElementById(name) {
        const element = this.node.getElementById(name);
        if (this.checkNull(element))
            return element;
        throw new Error(`Element "${name}" does not exist: ${element}`);
    }
    checkNull(v) {
        return v != null;
    }
}
