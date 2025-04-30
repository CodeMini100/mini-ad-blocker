/**
 * Logs debug-level messages to the console.
 * Debug messages are suppressed in production environment.
 * @param {...any} msg - The messages to log at debug level.
 * @returns {void}
 */
export function debug(...msg) {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof console !== 'undefined' && typeof console.debug === 'function') {
      console.debug('[DEBUG]', ...msg);
    }
  }
}

/**
 * Logs info-level messages to the console.
 * @param {...any} msg - The messages to log at info level.
 * @returns {void}
 */
export function info(...msg) {
  if (typeof console !== 'undefined' && typeof console.info === 'function') {
    console.info('[INFO]', ...msg);
  }
}

/**
 * Logs error-level messages to the console.
 * @param {...any} msg - The messages to log at error level.
 * @returns {void}
 */
export function error(...msg) {
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error('[ERROR]', ...msg);
  }
}