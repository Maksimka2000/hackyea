import { ACCESSIBILITY_STORAGE_KEY } from "./accessibility-settings";

/*
  Runs in <head> before first paint so saved text size and contrast are applied
  without a flash of the default look. Keep it dependency-free and tiny.
*/
export const accessibilityInitScript = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
  ACCESSIBILITY_STORAGE_KEY,
)})||"{}");var d=document.documentElement;if(s.textSize==="lg"||s.textSize==="xl"){d.dataset.textSize=s.textSize;}if(s.contrast==="high"){d.dataset.contrast="high";}}catch(e){}})();`;
