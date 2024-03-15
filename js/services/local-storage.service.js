/** TODO: Type Safe serialization
 * @ref https://hackernoon.com/mastering-type-safe-json-serialization-in-typescript
 */
export class LocalStorageService {
    key;
    constructor(key) {
        this.key = key;
    }
    save(data) {
        localStorage.setItem(this.key, data);
        // console.log(`Saved to local storage: `, data);
    }
    load() {
        const json = localStorage.getItem(this.key) ?? '';
        // console.log(`Loaded from local storage: `, json);
        return json;
    }
    clear() {
        localStorage.removeItem(this.key);
        // console.log(`Removed from local storage: `, this.key);
    }
    exists() {
        return Object.prototype.hasOwnProperty.call(localStorage, this.key);
    }
}
