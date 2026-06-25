/**
 * BasePage - Base class for all page objects
 * Contains common methods used by all page classes
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   */
  async navigateTo(url) {
    await this.page.goto(url);
  }

  /**
   * Click on an element
   */
  async click(selector) {
    await this.page.click(selector);
  }

  /**
   * Fill text in an input field
   */
  async fill(selector, text) {
    await this.page.fill(selector, text);
  }

  /**
   * Get text from an element
   */
  async getText(selector) {
    return await this.page.textContent(selector);
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout, state: 'visible' });
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  /**
   * Get all elements matching selector
   */
  async getElements(selector) {
    return await this.page.locator(selector).all();
  }

  /**
   * Count elements matching selector
   */
  async getElementCount(selector) {
    return await this.page.locator(selector).count();
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get element attribute value
   */
  async getAttribute(selector, attribute) {
    return await this.page.getAttribute(selector, attribute);
  }
}

module.exports = BasePage;