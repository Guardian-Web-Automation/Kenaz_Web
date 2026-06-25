const BasePage = require('./BasePage');

/**
 * CrazyDeal - Crazy Deal (Ultimate Dubai Box) Page Object
 * Handles the Crazy Deal product listing
 */
class CrazyDeal extends BasePage {
  constructor(page) {
    super(page);

    // Crazy Deal page selectors
    this.productCard = '#collection-list li.collection-item';                    // [ID + tag.class] each product card
    this.productName = '#collection-list li.collection-item .product_flexi_title'; // [ID + class] product title text
    this.addToBoxButton = '.line-item-property__field.add-to-box label';         // [class + tag] "Add To Box" label/toggle
    this.selectedCheckbox = '#checkboxes input[type="checkbox"]:checked';         // [ID + attribute :checked] selected products
    this.buyNowButton = '#submit-btn';                                           // [ID] Buy Now button
    this.checkoutIframe = '#gokwik-iframe';                                       // [ID] GoKwik checkout iframe (same page, no URL change)
  }

  /**
   * Open the Crazy Deal page
   */
  async navigateToCrazyDeal() {
    await this.page.goto('https://kenazperfumes.com/products/ultimate-dubai-box', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Count the product cards shown on the page
   */
  async getProductCount() {
    return await this.page.locator(this.productCard).count();
  }

  /**
   * Click the first visible "Add To Box" button
   */
  async clickAddToBox() {
    const buttons = this.page.locator(this.addToBoxButton);
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      if (await buttons.nth(i).isVisible()) {
        await buttons.nth(i).scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
        await buttons.nth(i).click();
        break;
      }
    }
    await this.page.waitForTimeout(1000);
  }

  /**
   * Add N products to the box by clicking unchecked "Add To Box" buttons
   */
  async addProductsToBox(n) {
    for (let added = 0; added < n; added++) {
      const labels = this.page.locator(this.addToBoxButton);
      const total = await labels.count();
      for (let i = 0; i < total; i++) {
        const label = labels.nth(i);
        const checkbox = label.locator('input[type="checkbox"]');
        if (!(await checkbox.isChecked()) && (await label.isVisible())) {
          await label.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
          await label.click();
          await this.page.waitForTimeout(800);
          break;
        }
      }
    }
  }

  /**
   * Remove the first selected product (clicks its "Remove Item" toggle)
   */
  async removeFirstProduct() {
    const labels = this.page.locator(this.addToBoxButton);
    const total = await labels.count();
    for (let i = 0; i < total; i++) {
      const label = labels.nth(i);
      const checkbox = label.locator('input[type="checkbox"]');
      if ((await checkbox.isChecked()) && (await label.isVisible())) {
        await label.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
        await label.click();
        await this.page.waitForTimeout(800);
        break;
      }
    }
  }

  /**
   * Count how many products are selected (added to the box)
   */
  async getSelectedCount() {
    return await this.page.locator(this.selectedCheckbox).count();
  }

  /**
   * Check if the Buy Now button is visible and enabled
   */
  async isBuyNowEnabled() {
    try {
      const button = this.page.locator(this.buyNowButton).first();
      await button.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
      const visible = await button.isVisible();
      const enabled = await button.isEnabled();
      return visible && enabled;
    } catch (error) {
      return false;
    }
  }

  /**
   * Click the Buy Now button
   * GoKwik checkout opens in an iframe modal on the same page (no URL change)
   */
  async clickBuyNow() {
    const button = this.page.locator(this.buyNowButton).first();
    await button.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await button.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Check if the GoKwik checkout iframe has opened
   */
  async isCheckoutOpen() {
    try {
      await this.page.locator(this.checkoutIframe).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the names of the currently selected products
   * (read from each checked label's data-params product_name)
   */
  async getSelectedProductNames() {
    const labels = this.page.locator(this.addToBoxButton);
    const total = await labels.count();
    const names = [];
    for (let i = 0; i < total; i++) {
      const label = labels.nth(i);
      const checkbox = label.locator('input[type="checkbox"]');
      if (await checkbox.isChecked()) {
        const params = await label.getAttribute('data-params');
        try {
          const obj = JSON.parse(params);
          if (obj.product_name) names.push(obj.product_name.trim());
        } catch (e) {}
      }
    }
    return names;
  }

  /**
   * Get all text inside the GoKwik checkout iframe
   * (used to verify the selected products appear in checkout)
   */
  async getCheckoutText() {
    const frame = this.page.frameLocator(this.checkoutIframe);
    return (await frame.locator('body').textContent({ timeout: 10000 })) || '';
  }

  /**
   * Get the product names shown on the page
   */
  async getProductNames() {
    const names = this.page.locator(this.productName);
    const count = await names.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      const text = (await names.nth(i).textContent()) || '';
      if (text.trim()) texts.push(text.trim());
    }
    return texts;
  }
}

module.exports = CrazyDeal;
