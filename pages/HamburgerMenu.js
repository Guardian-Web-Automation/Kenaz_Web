const BasePage = require('./BasePage');

/**
 * HamburgerMenu - Mobile Hamburger Menu Page Object
 * Handles opening the hamburger menu and reading its links
 */
class HamburgerMenu extends BasePage {
  constructor(page) {
    super(page);

    // Hamburger menu selectors  (comma = "try any of these" fallback list)
    this.hamburgerButton = 'header-drawer summary, .header__icon--menu, summary[aria-label*="menu" i]'; // [tag / class / attribute] open button
    this.menuDrawer = '#menu-drawer, .menu-drawer, header-drawer details[open]';                        // [ID / class / tag+attribute] the drawer
    this.menuLinks = '#menu-drawer a, .menu-drawer__navigation a';                                      // [ID + tag / class + tag] menu links
    this.closeButton = 'drawer-close-button, .menu-drawer__close-button, #menu-drawer button[aria-label*="close" i]'; // [tag / class / ID+attribute] X button
  }

  /**
   * Open the homepage
   */
  async navigateToHome() {
    // Use domcontentloaded — the homepage (video/images) may never fire full "load"
    await this.page.goto('https://kenazperfumes.com', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Click the hamburger icon to open the mobile menu
   * Clicks the first VISIBLE matching button (theme has duplicates)
   */
  async openHamburgerMenu() {
    const buttons = this.page.locator(this.hamburgerButton);
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      if (await buttons.nth(i).isVisible()) {
        await buttons.nth(i).click();
        break;
      }
    }
  }

  /**
   * Check if the hamburger menu drawer is open/visible
   * The drawer toggles open instantly, so a short wait is enough
   */
  async isMenuOpen() {
    try {
      const drawer = this.page.locator(this.menuDrawer).first();
      await drawer.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Click the X icon to close the hamburger menu
   * Clicks the first VISIBLE close button
   */
  async closeHamburgerMenu() {
    const buttons = this.page.locator(this.closeButton);
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      if (await buttons.nth(i).isVisible()) {
        // force: custom element <drawer-close-button> can ignore normal clicks
        await buttons.nth(i).click({ force: true });
        break;
      }
    }
    await this.page.waitForTimeout(500);

    // Fallback: if the drawer is still open, remove the [open] attribute
    // (Shopify details-disclosure also closes on Escape)
    if ((await this.page.locator('header-drawer details[open]').count()) > 0) {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Check if the hamburger menu drawer is closed
   * The drawer hides via CSS transform (not display:none), so the reliable
   * signal is the <details> losing its [open] attribute — poll for it
   */
  async isMenuClosed() {
    const openDrawer = this.page.locator('header-drawer details[open]');
    for (let i = 0; i < 6; i++) {
      if ((await openDrawer.count()) === 0) return true;
      await this.page.waitForTimeout(500);
    }
    return false;
  }

  /**
   * Click a menu item by its visible text (e.g. "Crazy Deal")
   * Waits for navigation to complete
   */
  async clickMenuItem(name) {
    const link = this.page.locator('.menu-drawer__menu-item', { hasText: name }).first();
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      link.click(),
    ]);
  }

  /**
   * Click a social icon (Facebook / Instagram / YouTube) by its label
   * The link opens in a new tab — capture the popup and return its URL
   */
  async clickSocialIcon(name) {
    const link = this.page.locator('.list-social__link', { hasText: name }).first();
    const [popup] = await Promise.all([
      this.page.context().waitForEvent('page'),
      link.click(),
    ]);
    await popup.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    return popup.url();
  }

  /**
   * Get all the menu link texts shown in the drawer
   */
  async getMenuLinks() {
    const links = this.page.locator(this.menuLinks);
    const count = await links.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      const text = (await links.nth(i).textContent()) || '';
      if (text.trim()) texts.push(text.trim());
    }
    return texts;
  }
}

module.exports = HamburgerMenu;
