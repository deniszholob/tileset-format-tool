import { APP_UPDATE_DATE } from './app-update.js';
console.log('// ===================== Main.ts ======================== //');
// ================================================================= //
// Expose global functions
window.onLoad = onLoad;
// ================================================================= //
// Global Functions
function onLoad() {
    console.log('App Loaded');
    console.log(`App Updated last: `, APP_UPDATE_DATE);
}
