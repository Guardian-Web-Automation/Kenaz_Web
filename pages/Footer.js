const BasePage = require('./BasePage');

/**
 * Footer - Footer Page Object
 * Handles the footer newsletter subscription
 */
class Footer extends BasePage {
  constructor(page) {
    super(page);

    // Footer newsletter selectors (from the live DOM)
    this.newsletterEmail = '#ContactFooter-email';                  // [ID] email input
    this.newsletterSubmit = '#ContactFooter button[name="commit"]'; // [ID + attribute] Subscribe button inside the form
    this.newsletterSuccess = '#ContactFooter-success';              // [ID] "Thank you for subscribing!" (hidden until success)
  }

  /**
   * Open the homepage (footer lives on every page)
   */
  async navigateToHome() {
    await this.page.goto('https://kenazperfumes.com', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Click a footer link by its visible text (e.g. "Contact us")
   * Waits for navigation to complete
   */
  async clickFooterLink(name) {
    const link = this.page.locator('.footer-block__details-content a', { hasText: name }).first();
    await link.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      link.click(),
    ]);
  }

  /**
   * Click a footer social icon (Facebook / Instagram / YouTube) by its label
   * The link opens in a new tab — capture the popup and return its URL
   */
  async clickFooterSocialIcon(name) {
    const link = this.page.locator('.footer__list-social .list-social__link', { hasText: name }).first();
    await link.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    const [popup] = await Promise.all([
      this.page.context().waitForEvent('page'),
      link.click(),
    ]);
    await popup.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    return popup.url();
  }

  /**
   * Subscribe to the newsletter with the given email
   */
  async subscribeNewsletter(email) {
    const input = this.page.locator(this.newsletterEmail).first();
    await input.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await input.fill(email);

    // Submitting reloads the page with the result
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      this.page.locator(this.newsletterSubmit).first().click(),
    ]);
  }

  /**
   * Check if the newsletter subscription succeeded
   * Shopify reloads with a success notice (and ?customer_posted=true)
   */
  async isSubscriptionSuccessful() {
    // The URL gets the customer_posted flag on a successful subscribe
    if (this.page.url().includes('customer_posted=true')) return true;
    try {
      const msg = this.page.locator(this.newsletterSuccess).first();
      await msg.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = Footer;
