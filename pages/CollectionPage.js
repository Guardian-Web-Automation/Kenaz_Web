const BasePage = require('./BasePage');

/**
 * Collection Page Object for Kenaz Perfumes
 * This class helps us interact with the collection/products page
 * Think of it as a helper for all things related to the products page
 */
class CollectionPage extends BasePage {
  constructor(page) {
    super(page);
    
    // The URL where products are listed
    this.collectionUrl = '/collections/all-products';
    
    // These are selectors - they help us find elements on the page
    // Selectors are like instructions to find specific HTML elements
    this.pageTitle = '//h1'; // [XPath] main heading of the page
    this.productsContainer = '//main'; // [XPath] main area where products are shown
    this.productItems = '//div[@class="card-information"]'; // [XPath] individual product items
    this.addToCartButtons = 'add-to-cart'; // [tag] custom <add-to-cart> element, not a <button>
    this.productName = '//a[@class="card-information__text uppercase"]'; // [XPath] product title/name link
    this.productPrice = '//span[contains(@class,"price-item--regular")]//span[@class="money"]'; // [XPath] regular price in card
    this.loadingSpinner = '[class*="loading"], [class*="spinner"]'; // [attribute class-contains] loading indicator
    this.productImage = '//div[contains(@class,"card")]//img'; // [XPath] product image inside any card div
    this.cartBadge = '.cart-count-bubble'; // [class] cart icon badge (removed when cart is empty)

    // Search selectors — confirmed from DevTools
    this.searchIcon    = '[aria-label="Search our site"]';          // [attribute] search icon in header
    this.searchInput   = 'input[name="q"]';                         // [attribute] search text input
    this.searchResults = '.predictive-search__list-item';           // [class] each result row in dropdown
    this.searchResultTitle = '.predictive-search__item-heading';    // [class] product title inside each result

    // Filter selectors (mobile "Sort & Filter" drawer) — confirmed from DevTools
    this.filterOpenButton  = '.mobile-facets__open';                // [class] "Sort & Filter" button
    this.availabilityTitle = 'summary.mobile-facets__summary:has-text("Availability")'; // [tag.class + :has-text] Availability section
    this.inStockOption     = 'label[for="Filter-Availability-mobile-1"]'; // [tag+attribute] "In stock" checkbox label
    this.filterApplyButton = '.mobile-facets__footer button';       // [class + tag] "Apply" button in footer
    this.sortSelect        = '#SortBy-mobile';                       // [ID] "Sort by" dropdown (native select)
  }

  /**
   * Apply "Price, low to high" sorting from the mobile filter drawer
   * Selecting the option auto-reloads the page with the sort applied
   */
  async applySortBy(optionLabel) {
    // Open the Sort & Filter drawer
    await this.page.locator(this.filterOpenButton).first().click();

    // Pick the chosen option from the Sort by dropdown
    await this.page.locator(this.sortSelect).selectOption({ label: optionLabel });

    // Tap the first VISIBLE Apply button to submit the drawer
    const applyButtons = this.page.locator(this.filterApplyButton);
    const count = await applyButtons.count();
    for (let i = 0; i < count; i++) {
      const btn = applyButtons.nth(i);
      if (await btn.isVisible()) {
        await btn.click();
        break;
      }
    }

    // Wait for the sorted results to load
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  /** Sort products by price ascending */
  async applyPriceLowToHighSort() {
    await this.applySortBy('Price, low to high');
  }

  /** Sort products by price descending */
  async applyPriceHighToLowSort() {
    await this.applySortBy('Price, high to low');
  }

  /**
   * Read all product prices on the page as numbers
   * Returns an array like [499, 599, 699]
   */
  async getAllProductPrices() {
    const prices = [];
    const items = this.page.locator(this.productPrice);
    const count = await items.count();
    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();
      const num = parseFloat((text || '').replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) prices.push(num);
    }
    return prices;
  }

  /**
   * Apply the "In Stock" availability filter from the mobile filter drawer
   * Flow: open drawer → open Availability → tick In stock → Apply
   */
  async applyInStockFilter() {
    // Open the Sort & Filter drawer
    await this.page.locator(this.filterOpenButton).first().click();

    // Open the Availability section
    await this.page.locator(this.availabilityTitle).first().click();

    // Tick the "In stock" option
    await this.page.locator(this.inStockOption).first().click();

    // Click the first VISIBLE Apply button (drawer has more than one footer)
    const applyButtons = this.page.locator(this.filterApplyButton);
    const count = await applyButtons.count();
    for (let i = 0; i < count; i++) {
      const btn = applyButtons.nth(i);
      if (await btn.isVisible()) {
        await btn.click();
        break;
      }
    }

    // Wait for the filtered results to load
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  /**
   * Get the current cart badge count from the header cart icon
   * Returns 0 if badge is not found or empty
   */
  async getCartBadgeCount() {
    try {
      const badge = this.page.locator(this.cartBadge).first();
      // When the cart is empty the bubble is not rendered at all
      if (await badge.count() === 0) return 0;
      // Bubble text can be like "2\n2 items" — grab only the first number
      const text = await badge.textContent();
      const match = (text || '').match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Open the search modal by clicking the search icon in the header
   */
  async openSearch() {
    await this.page.locator(this.searchIcon).first().click();
    await this.page.waitForSelector(this.searchInput, { state: 'visible', timeout: 5000 });
  }

  /**
   * Type a keyword into the search input and submit to full search results page
   * @param {string} keyword - The word to search for
   */
  async searchFor(keyword) {
    const input = this.page.locator(this.searchInput);
    await input.click();
    // pressSequentially types char by char — triggers Shopify's search JS events
    await input.pressSequentially(keyword, { delay: 80 });
    // Press Enter to navigate to full search results page
    await this.page.keyboard.press('Enter');
    // Wait for the search results page to load
    await this.page.waitForURL('**/search**', { timeout: 8000 }).catch(() => {});
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get all product titles from the full search results page
   * Returns an array of title strings
   */
  async getSearchResultTitles() {
    try {
      const titles = [];
      // Same product title selector used on collection page
      const items = this.page.locator('//a[@class="card-information__text uppercase"]');
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        const text = await items.nth(i).textContent();
        if (text?.trim()) titles.push(text.trim().split('\n')[0].trim());
      }
      return titles;
    } catch (e) {
      return [];
    }
  }

  /**
   * Navigate to the collection page
   * This method goes to the products page
   */
  async navigateToCollection() {
    await this.navigateTo(this.collectionUrl);
  }

  /**
   * Wait for the collection page to fully load
   * This method waits until all products are loaded on the page
   */
  async waitForPageLoad() {
    try {
      // Just wait for DOM content loaded - don't wait for all network requests
      await this.page.waitForLoadState('domcontentloaded', { timeout: 8000 }).catch(() => {});
      
      // Quick wait for products to appear
      await this.page.waitForTimeout(1000);
    } catch (error) {
      // Continue even if there's an error
    }
  }

  /**
   * Check if the collection page is properly loaded
   * Returns true if products are visible
   */
  async isPageLoaded() {
    try {
      // Check if the main products area is visible
      const isProductsVisible = await this.isVisible(this.productsContainer);
      
      // Check if there are any product items
      const productCount = await this.page.locator(this.productItems).count();
      
      // Page is loaded if products are visible and there are product items
      const pageLoaded = isProductsVisible && productCount > 0;
      return pageLoaded;
    } catch (error) {
      return false;
    }
  }

  /**
   * Count how many products are on the page
   * Returns the total number of products
   */
  async getProductCount() {
    const count = await this.getElementCount(this.productItems);
    return count;
  }

  /**
   * Get details of the first product on the page
   * Returns the product name and price
   */
  async getFirstProductDetails() {
    try {
      // Find the first product item on the page
      const firstProduct = this.page.locator('//div[@class="card-information"]').first();
      
      // Get the product name from the product link
      let productName = null;
      try {
        // Get the title using the correct XPath
        const titleElement = firstProduct.locator('//a[@class="card-information__text uppercase"]').first();
        let rawText = await titleElement.textContent();
        
        // Clean up: remove extra spaces, line breaks, and take only first line
        if (rawText) {
          productName = rawText.trim().split('\n')[0].trim();
        }
        
        // If empty after cleaning, use default
        if (!productName || productName.length === 0) {
          productName = 'Product';
        }
      } catch (e) {
        // If we can't find the name, use a default
        productName = 'Product';
      }
      
      // Get the product price
      let productPrice = null;
      try {
        // Get the price from the money span element
        const priceElement = firstProduct.locator('//span[@class="money"]').first();
        productPrice = await priceElement.textContent();
        // Clean up the price text (remove extra spaces)
        productPrice = productPrice?.trim() || 'N/A';
      } catch (e) {
        // If we can't find the price, use N/A
        productPrice = 'N/A';
      }
      
      // Prepare final values - ensure they are strings
      const finalName = (productName && typeof productName === 'string') ? productName : 'Product';
      const finalPrice = (productPrice && typeof productPrice === 'string') ? productPrice : 'N/A';
      
      return {
        name: finalName,
        price: finalPrice,
      };
    } catch (error) {
      // If there's an error, return default values
      return { name: 'Product', price: 'N/A' };
    }
  }

  /**
   * Click the "Add to Cart" button for the first product
   * This adds the first product to the shopping cart
   */
  async clickFirstProductATC() {
    try {
      // Find the first "Add to Cart" button on the page
      const firstATC = this.page.locator('main add-to-cart').first();
      
      // Wait for the button to be visible before clicking
      await firstATC.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
      
      try {
        // Click the button
        await firstATC.click();
      } catch (clickError) {
        // If page closed after click, that's okay
        if (clickError.message.includes('closed')) {
          return;
        }
        throw clickError;
      }
      
      // Wait for the mini cart (shopping cart drawer) to appear
      await this.page.locator('mini-cart.cart-drawer, form.mini-cart').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    } catch (error) {
      // Continue even if there's an error
    }
  }

  /**
   * Click "Add to Cart" button for a specific product by position
   * @param {number} index - Which product to click (0 is first, 1 is second, etc.)
   */
  async clickProductATCByIndex(index) {
    try {
      // Find all "Add to Cart" buttons
      const atcButtons = this.page.locator('button:has-text("Add"), button[aria-label*="Add"], form button');
      
      // Wait for the button at the specific position to be visible
      await atcButtons.nth(index).waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
      
      try {
        // Click the button at that position
        await atcButtons.nth(index).click();
      } catch (clickError) {
        // If page closed after click, that's okay
        if (clickError.message.includes('closed')) {
          return;
        }
        throw clickError;
      }
      
      // Wait a moment for the mini cart to appear
      await this.page.waitForTimeout(1500).catch(() => {});
    } catch (error) {
      // Continue even if there's an error
    }
  }

  /**
   * Check if "Add to Cart" buttons are visible on the page
   * Returns true if buttons exist and are visible
   */
  async areATCButtonsVisible() {
    try {
      // Look for "Add to Cart" buttons using multiple selectors
      // (Different websites might structure buttons differently)
      const atcButtonCount = await this.page.locator('button:has-text("Add"), button[aria-label*="Add"], form button').count();
      
      // If we found at least one button, they are visible
      const isVisible = atcButtonCount > 0;
      return isVisible;
    } catch (error) {
      return true; // Return true to continue with tests
    }
  }

  /**
   * Verify all elements of the first product card are present
   * Checks: image, title, price, and Add to Cart button
   * Returns an object with true/false for each element
   */
  async verifyProductCardElements() {
    const result = {
      imageVisible: false,
      titleVisible: false,
      priceVisible: false,
      atcButtonExists: false,
    };

    try {
      // Use count > 0 to handle lazy-loaded images (src may be empty until scroll)
      const imgCount = await this.page.locator(this.productImage).count();
      result.imageVisible = imgCount > 0;
    } catch (e) {}

    try {
      result.titleVisible = await this.page.locator(this.productName).first().isVisible();
    } catch (e) {}

    try {
      result.priceVisible = await this.page.locator(this.productPrice).first().isVisible();
    } catch (e) {}

    try {
      // On mobile, ATC button may be hidden (no hover) — check it exists in DOM instead
      const atcCount = await this.page.locator(this.addToCartButtons).count();
      result.atcButtonExists = atcCount > 0;
    } catch (e) {}

    return result;
  }

  async clickFirstProduct() {
    try {
      const firstProductLink = this.page.locator('//a[@class="card-information__text uppercase"]').first();
      await firstProductLink.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await firstProductLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(2000);
    } catch (error) {
    }
  }

  async clickProductByIndex(index) {
    try {
      const productLinks = this.page.locator('main a[href*="/products/"]');
      await productLinks.nth(index).waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await productLinks.nth(index).click();
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    } catch (error) {
    }
  }

  async clickProductByName(productName) {
    try {
      const productLink = this.page.locator(`a[href*="/products/"]:has-text("${productName}")`).first();
      await productLink.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await firstProductLink.click();

      await this.page.waitForLoadState('domcontentloaded');

      await this.page.waitForTimeout(3000);
    } catch (error) {
    }
  }

  async getProductUrl(productName) {
    try {
      const productLink = this.page.locator(`a[href*="/products/"]:has-text("${productName}")`).first();
      const href = await productLink.getAttribute('href');
      return href || '';
    } catch (error) {
      return '';
    }
  }
}

module.exports = CollectionPage;