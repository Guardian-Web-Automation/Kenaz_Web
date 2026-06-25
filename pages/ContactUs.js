const BasePage = require('./BasePage');

/**
 * ContactUs - Contact Us Page Object
 * Handles filling and submitting the Contact Us form
 */
class ContactUs extends BasePage {
  constructor(page) {
    super(page);

    // Contact Us form selectors (from the live DOM)
    this.firstNameInput = 'input[name="contact[First Name]"]';      // [attribute] First Name field
    this.lastNameInput = 'input[name="contact[Last Name]"]';        // [attribute] Last Name field
    this.emailInput = 'input[name="contact[email]"]';               // [attribute] Email field
    this.messageInput = 'textarea[name="contact[Your Message]"]';   // [attribute] Message field
    this.consentCheckbox = 'input[name="consent_terms"]';           // [attribute] consent checkbox
    this.submitButton = 'form.contact-form button[type="submit"]';  // [tag.class + tag+attribute] Submit button
    this.successMessage = '.form-status-list, .form__message';      // [class / class] success notice (comma = fallback)
  }

  /**
   * Open the Contact Us page
   */
  async navigateToContact() {
    await this.page.goto('https://kenazperfumes.com/pages/contact', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Fill the contact form with the given details
   */
  async fillContactForm({ firstName, lastName, email, message }) {
    await this.page.locator(this.firstNameInput).first().fill(firstName);
    await this.page.locator(this.lastNameInput).first().fill(lastName);
    await this.page.locator(this.emailInput).first().fill(email);
    await this.page.locator(this.messageInput).first().fill(message);

    // Tick the consent checkbox if present
    const checkbox = this.page.locator(this.consentCheckbox).first();
    if ((await checkbox.count()) > 0) {
      await checkbox.check({ force: true });
    }
  }

  /**
   * Click the Submit button and wait for the page to settle
   */
  async submitForm() {
    const button = this.page.locator(this.submitButton).first();
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      button.click(),
    ]);
  }

  /**
   * Check if the form was submitted successfully
   * Shopify reloads the page with a success notice on submit
   */
  async isSubmitSuccessful() {
    try {
      const msg = this.page.locator(this.successMessage).first();
      await msg.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = ContactUs;
