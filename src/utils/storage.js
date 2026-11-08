/**
 * storage.js
 * 
 * Safe wrapper for browser localStorage.
 * 
 * Why this exists:
 * 1. Directly calling `localStorage.getItem` or `localStorage.setItem` throughout 
 *    the app creates tight coupling to the browser's storage API.
 * 2. If JSON.parse fails (e.g., corrupted storage), it can crash the app without a try-catch.
 * 3. In some environments (e.g., Safari private mode, restricted iframes, SSR), 
 *    localStorage may throw a SecurityError.
 * 
 * By wrapping localStorage in safe helper functions, junior developers don't have to
 * remember try/catch blocks every time they save or read data.
 */

const STORAGE_KEYS = {
  USER: "anjaya_user",
  AUTH_TOKEN: "anjaya_token",
  THEME: "anjaya_theme",
};

/**
 * Retrieve and parse JSON data from localStorage safely.
 * @param {string} key - Storage key name.
 * @param {*} defaultValue - Fallback value if key doesn't exist or parsing fails.
 * @returns {*} The parsed data or defaultValue.
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Serialize and save data into localStorage safely.
 * @param {string} key - Storage key name.
 * @param {*} value - Any serializable value (object, array, string, number).
 */
export function setStorageItem(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting key "${key}" in localStorage:`, error);
  }
}

/**
 * Remove an item from localStorage safely.
 * @param {string} key - Storage key name to remove.
 */
export function removeStorageItem(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
  }
}

/**
 * Clear all Anjaya CRM items from storage.
 */
export function clearAuthStorage() {
  removeStorageItem(STORAGE_KEYS.USER);
  removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
}

export { STORAGE_KEYS };

