/**
 * Test utilities and helper functions
 */

/**
 * Format price string for comparison
 * @param {string} priceStr - Price string to format
 * @returns {string} Formatted price
 */
function formatPrice(priceStr) {
  return priceStr?.replace(/\s+/g, '').toLowerCase();
}

/**
 * Extract numeric value from price string
 * @param {string} priceStr - Price string (e.g., "$99.99")
 * @returns {number} Numeric price value
 */
function getPriceValue(priceStr) {
  const match = priceStr?.match(/\d+\.?\d*/);
  return match ? parseFloat(match[0]) : 0;
}

/**
 * Wait for element with retry logic
 * @param {object} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {object} options - Wait options
 * @returns {Promise} Element locator
 */
async function waitForElementWithRetry(page, selector, options = {}) {
  const { retries = 3, timeout = 5000, delayBetweenRetries = 500 } = options;
  
  for (let i = 0; i < retries; i++) {
    try {
      await page.waitForSelector(selector, { timeout, state: 'visible' });
      return page.locator(selector);
    } catch (error) {
      if (i < retries - 1) {
        await page.waitForTimeout(delayBetweenRetries);
      } else {
        throw error;
      }
    }
  }
}

/**
 * Generate test report summary
 * @param {object} testResults - Test results object
 * @returns {string} Report summary
 */
function generateTestReport(testResults) {
  const { totalTests, passed, failed, duration } = testResults;
  
  return `
  ==================== TEST REPORT ====================
  Total Tests: ${totalTests}
  Passed: ${passed}
  Failed: ${failed}
  Duration: ${duration}ms
  =====================================================
  `;
}

module.exports = {
  formatPrice,
  getPriceValue,
  waitForElementWithRetry,
  generateTestReport,
};
