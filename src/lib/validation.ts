/**
 * Utility functions for API validation
 */

/**
 * Validate that a string is a valid URL
 * @param url - The URL string to validate
 * @returns true if valid URL, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate an array of URLs
 * @param urls - Array of URL strings to validate
 * @returns true if all URLs are valid, false otherwise
 */
export function areValidUrls(urls: string[]): boolean {
  return urls.every(url => isValidUrl(url));
}

/**
 * Filter and return only valid URLs from an array
 * @param urls - Array of URL strings
 * @returns Array of valid URL strings
 */
export function filterValidUrls(urls: string[]): string[] {
  return urls.filter(url => isValidUrl(url));
}
