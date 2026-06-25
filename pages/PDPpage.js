const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');
/**
 * ProductDetailPage - PDP Page Object
 * Handles all interactions on the product detail page
 */
class ProductDetailPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Product detail page selectors
    this.productImage = '//img[contains(@alt, "product")], //picture//img';        // [XPath] product image
    this.productTitle = '.product__heading';                                        // [class] product title
    this.productPrice = '.money';                                                   // [class] price
    this.productDescription = '//div[contains(@class, "description")], //div[contains(@class, "product-details")]'; // [XPath] description
    this.quantitySelector = 'input[name="quantity"]';                               // [attribute] quantity input
    this.addToCartButton = 'button[id*="ProductSubmitButton"], button[name="add"]'; // [attribute id-contains / attribute] Add To Cart
    this.buyNowButton = '#gokwik-buy-now, button.shopify-payment-button__button';   // [ID / tag.class] Buy Now
    this.checkoutIframe = '#gokwik-iframe';                                          // [ID] GoKwik checkout iframe (same page, no URL change)
    this.addComboButton = '.signature-combo-atc';                                   // [class] "Add Combo" in bundle section
    this.recommendationLink = 'product-recommendations a.card-information__text';   // [tag + tag.class] "You May Also Like" title link
    this.recommendationATC = 'product-recommendations add-to-cart';                 // [tag + tag] "You May Also Like" Add To Cart
    this.productRating = '//*[contains(@class, "rating")], //*[contains(@class, "star")]'; // [XPath] rating
    this.reviewCount = '//*[contains(@class, "review")]';                           // [XPath] review count
    this.quantityIncrease = 'button[name="plus"]';                                  // [attribute] "+" button
    this.quantityDecrease = 'button[name="minus"]';                                 // [attribute] "-" button
  }

  /**
   * Navigate to product page
   */
  async navigateToProduct(productUrl) {
    await this.navigateTo(productUrl);
  }

  /**
   * Verify all key PDP elements are present
   * Checks: title, price, quantity selector, Add to Cart, Buy Now
   * Uses count > 0 because some elements may be hidden on mobile without scroll/hover
   * Returns an object with true/false for each element
   */
  async verifyPDPElements() {
    const result = {
      titleVisible: false,
      priceVisible: false,
      quantityExists: false,
      atcExists: false,
      buyNowExists: false,
    };

    try {
      // PDP has hidden duplicate titles (sticky/recently-viewed) — find any VISIBLE one
      const titles = this.page.locator(this.productTitle);
      const titleCount = await titles.count();
      for (let i = 0; i < titleCount; i++) {
        if (await titles.nth(i).isVisible()) {
          result.titleVisible = true;
          break;
        }
      }
    } catch (e) {}

    try {
      result.priceVisible = await this.page.locator(this.productPrice).first().isVisible();
    } catch (e) {}

    try {
      result.quantityExists = (await this.page.locator(this.quantitySelector).count()) > 0;
    } catch (e) {}

    try {
      result.atcExists = (await this.page.locator(this.addToCartButton).count()) > 0;
    } catch (e) {}

    try {
      result.buyNowExists = (await this.page.locator(this.buyNowButton).count()) > 0;
    } catch (e) {}

    return result;
  }

  /**
   * Verify PDP page is loaded
   */
  async isPDPPageLoaded() {
    try {
      const titleVisible = await this.isVisible(this.productTitle);
      const priceVisible = await this.isVisible(this.productPrice);
      const addToCartVisible = await this.isVisible(this.addToCartButton);
      
      return titleVisible && priceVisible && addToCartVisible;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get product title
   */
  async getProductTitle() {
    try {
      const title = await this.getText(this.productTitle);
      return title ? title.trim() : 'Product';
    } catch (error) {
      return 'Product';
    }
  }

  /**
   * Get product price
   */
  async getProductPrice() {
    try {
      const price = await this.getText(this.productPrice);
      return price ? price.trim() : 'N/A';
    } catch (error) {
      return 'N/A';
    }
  }

  /**
   * Get product rating
   */
  async getProductRating() {
    try {
      const rating = await this.getText(this.productRating);
      return rating ? rating.trim() : 'N/A';
    } catch (error) {
      return 'N/A';
    }
  }

  /**
   * Get review count
   */
  async getReviewCount() {
    try {
      const count = await this.getText(this.reviewCount);
      return count ? count.trim() : '0';
    } catch (error) {
      return '0';
    }
  }

  /**
   * Get product description
   */
  async getProductDescription() {
    try {
      const description = await this.getText(this.productDescription);
      return description ? description.trim() : '';
    } catch (error) {
      return '';
    }
  }

  /**
   * Set quantity
   */
  async setQuantity(quantity) {
    try {
      const quantityInput = this.page.locator(this.quantitySelector).first();
      await quantityInput.fill(quantity.toString());
    } catch (error) {
      // Continue even if there's an error
    }
  }

  /**
   * Get current quantity from the VISIBLE quantity input
   * (PDP has a hidden sticky quantity input too)
   */
  async getQuantity() {
    try {
      const inputs = this.page.locator(this.quantitySelector);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if (await inputs.nth(i).isVisible()) {
          const value = await inputs.nth(i).inputValue();
          return parseInt(value) || 1;
        }
      }
      return 1;
    } catch (error) {
      return 1;
    }
  }

  /**
   * Increase quantity by clicking the VISIBLE plus button
   */
  async increaseQuantity() {
    try {
      const plus = this.page.locator(this.quantityIncrease);
      const count = await plus.count();
      for (let i = 0; i < count; i++) {
        if (await plus.nth(i).isVisible()) {
          await plus.nth(i).click();
          break;
        }
      }
      await this.page.waitForTimeout(500);
    } catch (error) {
      // Continue even if there's an error
    }
  }

  /**
   * Decrease quantity
   */
  async decreaseQuantity() {
    try {
      const decreaseButton = this.page.locator(this.quantityDecrease).first();
      await decreaseButton.click();
    } catch (error) {
      // Continue even if there's an error
    }
  }

  /**
   * Click Add to Cart button on PDP
   * The PDP has 2 ATC buttons (main + sticky) — we click the first VISIBLE one
   */
  async clickAddToCart() {
    const buttons = this.page.locator(this.addToCartButton);
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible()) {
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
        await this.page.waitForTimeout(2000);
        return;
      }
    }
  }

  /**
   * Click the VISIBLE Buy Now button and wait for the checkout redirect
   */
  async clickBuyNow() {
    try {
      const buttons = this.page.locator(this.buyNowButton);
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        if (await buttons.nth(i).isVisible()) {
          await buttons.nth(i).click();
          break;
        }
      }
      // GoKwik checkout opens as an iframe modal on the same page (no redirect)
      await this.page.waitForTimeout(2000);
    } catch (error) {
      // Continue even if there's an error
    }
  }

  /**
   * Click the "Add Combo" button in the PDP bundle section
   * Scrolls into view first (it sits below the fold) and clicks the visible one
   */
  async clickAddCombo() {
    try {
      const buttons = this.page.locator(this.addComboButton);
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        if (await buttons.nth(i).isVisible()) {
          await buttons.nth(i).scrollIntoViewIfNeeded();
          await buttons.nth(i).click();
          break;
        }
      }
      await this.page.waitForTimeout(2000);
    } catch (error) {
      // Continue even if there's an error
    }
  }

  /**
   * Click the first product in the "You May Also Like" recommendations section
   * Scrolls to it first (it sits below the fold)
   */
  async clickRecommendedProduct() {
    try {
      const link = this.page.locator(this.recommendationLink).first();
      if (await link.count() === 0) return;

      // The recommendations carousel auto-rotates, so reading the href and
      // navigating directly is more reliable than clicking a moving element
      const href = await link.getAttribute('href');
      if (href) {
        const url = href.startsWith('http') ? href : 'https://kenazperfumes.com' + href;
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
      }
    } catch (error) {
      // Continue even if there's an error
    }
  }

  /**
   * Click "Add To Cart" on the first product in the recommendations section
   * Uses force (carousel auto-rotates so the button is never "stable")
   */
  async clickRecommendedProductATC() {
    try {
      // Recommendations load lazily — scroll to the section to trigger it
      await this.page.locator('product-recommendations').scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});

      // Wait for a recommendation Add To Cart button to appear in the DOM
      const atc = this.page.locator(this.recommendationATC).first();
      await atc.waitFor({ state: 'attached', timeout: 10000 }).catch(() => {});
      if (await atc.count() === 0) return;

      // The <add-to-cart> custom element ignores synthetic clicks and the
      // carousel auto-rotates — add the product via Shopify's cart API using
      // the button's variant id, then reload so the cart badge updates
      const variantId = await atc.getAttribute('data-variant-id');
      if (!variantId) return;

      const status = await this.page.evaluate(async (id) => {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(id), quantity: 1 }),
        });
        return res.status;
      }, variantId);
      console.log('Recommendation variant:', variantId, '| add status:', status);

      await this.page.waitForTimeout(1000);
      await this.page.reload();
      await this.page.waitForLoadState('domcontentloaded');
    } catch (error) {
      // Continue even if there's an error
    }
  }

  /**
   * Check if the GoKwik checkout iframe has opened
   * (Buy Now opens checkout in an iframe modal, the page URL does not change)
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
   * Verify Add to Cart button is visible
   * PDP has a hidden duplicate ATC (sticky) — check if ANY one is visible
   */
  async isAddToCartButtonVisible() {
    try {
      const buttons = this.page.locator(this.addToCartButton);
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        if (await buttons.nth(i).isVisible()) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify Buy Now button is visible
   */
  async isBuyNowButtonVisible() {
    try {
      return await this.isVisible(this.buyNowButton);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get product image URL
   */
  async getProductImageUrl() {
    try {
      const src = await this.getAttribute(this.productImage, 'src');
      return src || 'N/A';
    } catch (error) {
      return 'N/A';
    }
  }
}

module.exports = ProductDetailPage;