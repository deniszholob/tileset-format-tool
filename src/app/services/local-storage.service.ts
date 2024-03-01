/** TODO: Type Safe serialization
 * @ref https://hackernoon.com/mastering-type-safe-json-serialization-in-typescript
 */
export class LocalStorageService {
  constructor(private key: string) {}

  public save(data: string): void {
    localStorage.setItem(this.key, data);
    // console.log(`Saved to local storage: `, data);
  }

  public load(): string {
    const json: string = localStorage.getItem(this.key) ?? '';
    console.log(`Loaded from local storage: `, json);
    return json;
  }

  public clear(): void {
    localStorage.removeItem(this.key);
    // console.log(`Removed from local storage: `, this.key);
  }

  public exists(): boolean {
    return Object.prototype.hasOwnProperty.call(localStorage, this.key);
  }
}
