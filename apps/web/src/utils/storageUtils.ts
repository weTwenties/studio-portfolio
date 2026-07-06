/**
 * Utility functions for handling image paths and logging
 */
const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";

const ensureTrailingSlash = (value: string): string => {
  if (!value) return "";
  return value.endsWith("/") ? value : `${value}/`;
};

/**
 * Gets the base storage URL from environment variables.
 */
export const getBasePath = (): string => {
  return ensureTrailingSlash(STORAGE_URL);
};

/**
 * Resolves an image path using the base path from window.setting
 * @param storagePath - The relative path to the storage (e.g., 'img/logo.png')
 * @returns The full URL to the image
 */
export const getStorageUrl = (storagePath: string): string => {
  const basePath = getBasePath();
  const normalizedPath = storagePath.replace(/^\/+/, "");
  return `${basePath}${normalizedPath}`;
};

/**
 * Resolves a URL for any static json data in storage.
 */
export const getStorageJsonUrl = (relativePath: string): string => {
  return getStorageUrl(relativePath);
};

/**
 * Resolves a URL for language files in storage.
 */
export const getStorageLocaleUrl = (locale: string): string => {
  return getStorageUrl(`messages/${locale}.json`);
};

/**
 * Disables all console logging functions
 * Call this function in production environment to turn off all console logs
 * @returns A function that can restore the original console methods
 */
export const disableConsoleLog = (): (() => void) => {
  // Store original console methods
  const originalConsole = { ...console };

  // Override console methods with empty functions
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.debug = () => {};

  // Return function to restore original console if needed
  return () => {
    Object.assign(console, originalConsole);
  };
};
