/** @ref https://learnersbucket.com/examples/interview/convert-hex-color-to-rgb-in-javascript/ */
export class Color {
    /** #000000 */
    hex;
    /** Alpha 0-1 */
    a;
    /** Red 0-255 */
    r;
    /** Green 0-255 */
    g;
    /** Blue 0-255 */
    b;
    /** Alpha 0-100 */
    a100;
    /** Alpha 0-255 */
    a255;
    /**
     * @param hex Hex color value, e.g. #000000
     * @param alpha 0-100
     */
    constructor(hex, alpha = 100) {
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
    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
