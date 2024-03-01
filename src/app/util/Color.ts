/** @ref https://learnersbucket.com/examples/interview/convert-hex-color-to-rgb-in-javascript/ */
export class Color {
  /** #000000 */
  public readonly hex: string;
  /** Alpha 0-1 */
  public readonly a: number;
  /** Red 0-255 */
  public readonly r: number;
  /** Green 0-255 */
  public readonly g: number;
  /** Blue 0-255 */
  public readonly b: number;

  /** Alpha 0-100 */
  public readonly a100: number;
  /** Alpha 0-255 */
  public readonly a255: number;

  /**
   * @param hex Hex color value, e.g. #000000
   * @param alpha 0-100
   */
  constructor(hex: string, alpha: number = 100) {
    if (hex.length !== 7 || hex.charAt(0) !== '#') {
      throw new Error('Invalid hex code: ' + hex);
    }
    this.hex = hex;

    this.a100 = clamp(Math.round(alpha), 0, 100);
    this.a = clamp(alpha / 100, 0, 1);
    this.a255 = clamp(Math.round((alpha / 100) * 255), 0, 255);

    this.r = parseInt(hex.slice(1, 3), 16);
    this.g = parseInt(hex.slice(3, 5), 16);
    this.b = parseInt(hex.slice(5, 7), 16);

    // console.log(`New Color: `, hex, this.toString(), this.a * 255);
  }

  public toString(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
