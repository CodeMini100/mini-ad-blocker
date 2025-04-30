/**
 * @fileoverview Exports default CSS selectors used by content.js
 * @module utils/selectors
 */

/**
 * @typedef {Object} Selectors
 * @property {string} container - The primary container selector
 * @property {string} header - The header section selector
 * @property {string} footer - The footer section selector
 * @property {string} button - The button element selector
 * @property {string} link - The link element selector
 */

/**
 * Default CSS selectors used by content.js
 * TODO: Add additional selectors or utilities as needed
 * @type {Selectors}
 */
const defaultSelectors = {
  container: '.container',
  header: 'header',
  footer: 'footer',
  button: '.btn',
  link: 'a'
};

export default defaultSelectors;