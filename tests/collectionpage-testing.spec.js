// ============================================================
// Collection Page - All Manual Test Scenarios
// Website: Kenaz Perfumes (kenazperfumes.com)
// Framework: Playwright + POM (Page Object Model)
// ============================================================

// Step 1: Import Playwright's test and expect functions
const { test, expect } = require('@playwright/test');

// Step 2: Import page objects
const CollectionPage = require('../pages/CollectionPage');
const MiniCart = require('../pages/MiniCart');
const PDPPage = require('../pages/PDPpage');


// ============================================================
// Group all Collection Page tests inside one describe block
// test.describe = a way to group related tests together
// ============================================================
test.describe('Collection Page - All Test Scenarios', () => {

  
  
  /** @type {import('../pages/CollectionPage')} */
  let collectionPage;
  
  
  /** @type {import('../pages/MiniCart')} */
  let miniCart;

  /** @type {import('../pages/PDPpage')} */
  let pdpPage;

  // beforeEach runs before EVERY test automatically
  test.beforeEach(async ({ page }) => {
    collectionPage = new CollectionPage(page);
    miniCart = new MiniCart(page);
    pdpPage = new PDPPage(page);
  });


  // ============================================================
  // SCENARIO 1: Verify Collection Page loads successfully
  // User Flow   : Website Launch → Collection Page
  // Test Steps  : Open Collection Page and wait for page load
  // Expected    : Page loads and products are displayed
  // ============================================================
  test('TC01 - Verify Collection Page loads successfully', async ({ page }) => {

    // Navigate and wait for load
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();

    // Verify correct URL
    expect(page.url()).toContain('/collections/all-products');

    // Verify page is loaded and products are visible
    const isLoaded = await collectionPage.isPageLoaded();
    expect(isLoaded).toBe(true);

    // Verify at least one product is displayed
    const productCount = await collectionPage.getProductCount();
    console.log('Total products on page:', productCount);
    expect(productCount).toBeGreaterThan(0);

  });


  // ============================================================
  // SCENARIO 2: Verify product listing is displayed
  // User Flow   : Collection Page → Product Listing
  // Expected    : Product image, title, price and ATC button are displayed
  // ============================================================
  test('TC02 - Verify product listing is displayed', async ({ page }) => {

    // Navigate and wait for load
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();

    // Check all product card elements
    const card = await collectionPage.verifyProductCardElements();

    console.log('Image:', card.imageVisible, '| Title:', card.titleVisible,
                '| Price:', card.priceVisible, '| ATC exists:', card.atcButtonExists);

    // NOTE: If imageVisible fails, please share the XPath/class for the product image
    expect(card.imageVisible).toBe(true);
    expect(card.titleVisible).toBe(true);
    expect(card.priceVisible).toBe(true);
    expect(card.atcButtonExists).toBe(true);

  });


  // ============================================================
  // SCENARIO 3: Verify product card redirects to PDP
  // User Flow   : Collection Page → PDP
  // Test Steps  : Click any product card from Collection Page
  // Expected    : User is redirected to corresponding PDP
  // ============================================================
  test('TC03 - Verify product card redirects to PDP', async ({ page }) => {

    // Navigate to collection page
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();

    // Get the first product name before clicking (to verify we land on correct PDP)
    const product = await collectionPage.getFirstProductDetails();
    console.log('Clicking product:', product.name);

    // Click the first product card
    await collectionPage.clickFirstProduct();

    // Verify the URL has changed to a product page
    const currentUrl = page.url();
    console.log('Redirected to:', currentUrl);
    expect(currentUrl).toContain('/products/');

  });


  // ============================================================
  // SCENARIO 4: Verify Add To Cart from Collection Page
  // User Flow   : Collection Page → Add To Cart
  // Test Steps  : Click Add To Cart on a product and open Cart
  // Expected    : Product is added successfully and cart drawer opens
  // ============================================================
  test('TC04 - Verify Add To Cart from Collection Page', async ({ page }) => {

    // Navigate to collection page
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();

    // Get first product details before adding to cart
    const product = await collectionPage.getFirstProductDetails();
    console.log('Adding to cart:', product.name, '|', product.price);

    // Click Add To Cart button on the first product
    await collectionPage.clickFirstProductATC();

    // Wait for cart drawer to open
    await miniCart.waitForMiniCartToAppear();

    // Verify cart drawer is visible
    const isCartOpen = await miniCart.isMiniCartVisible();
    console.log('Cart drawer open:', isCartOpen);
    expect(isCartOpen).toBe(true);

    // Verify product is in the cart
    const isInCart = await miniCart.isProductInCart(product.name);
    console.log('Product in cart:', isInCart);
    expect(isInCart).toBe(true);

    // Log subtotal for reference
    const subtotal = await miniCart.getSubtotal();
    console.log('Cart subtotal:', subtotal);

  });


  // ============================================================
  // SCENARIO 5: Verify cart badge updates after product addition
  // User Flow   : Collection Page → Cart Badge
  // Test Steps  : Add a product and verify cart count
  // Expected    : Cart badge count updates correctly
  // ============================================================
  test('TC05 - Verify cart badge updates after product addition', async ({ page }) => {

    // Navigate to collection page
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();

    // Read cart badge count BEFORE adding product
    const countBefore = await collectionPage.getCartBadgeCount();
    console.log('Cart badge count before:', countBefore);

    // Click Add To Cart on the first product
    await collectionPage.clickFirstProductATC();

    // Wait for cart to update
    await miniCart.waitForMiniCartToAppear();

    // Close the cart drawer so the badge is visible in the header
    await miniCart.closeMiniCart();

    // Read cart badge count AFTER adding product
    const countAfter = await collectionPage.getCartBadgeCount();
    console.log('Cart badge count after:', countAfter);

    // Badge count should be greater than before
    expect(countAfter).toBeGreaterThan(countBefore);

  });


  // ============================================================
  // SCENARIO 6: Verify user can search product successfully
  // User Flow   : Collection Page → Search
  // Test Steps  : Search using a valid keyword
  // Expected    : Relevant products are displayed
  // Product     : OUD Ameer
  // ============================================================
  test('TC06 - Verify user can search product successfully', async ({ page }) => {

    // Navigate to collection page
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();

    // Open the search modal
    await collectionPage.openSearch();

    // Type the search keyword
    await collectionPage.searchFor('OUD');

    // Get all product titles from predictive search results
    const results = await collectionPage.getSearchResultTitles();
    console.log('Search results found:', results);

    // Verify at least one result is returned
    expect(results.length).toBeGreaterThan(0);

    // Verify the expected product appears in results
    const hasOudAmeer = results.some(title =>
      title.toLowerCase().includes('oud ameer')
    );
    console.log('OUD Ameer found in results:', hasOudAmeer);
    expect(hasOudAmeer).toBe(true);

  });


  // ============================================================
  // SCENARIO 7: Verify user can open PDP from search results
  // User Flow   : Search → PDP
  // Test Steps  : Search product and click result
  // Expected    : Corresponding PDP opens successfully
  // ============================================================
  test('TC07 - Verify user can open PDP from search results', async ({ page }) => {

    // Navigate to collection page and open search
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.openSearch();

    // Search for OUD and land on search results page
    await collectionPage.searchFor('OUD');

    // Get the first product name from search results
    const product = await collectionPage.getFirstProductDetails();
    console.log('Clicking search result:', product.name);

    // Click the first product from search results
    await collectionPage.clickFirstProduct();

    // Verify PDP loaded
    const currentUrl = page.url();
    console.log('Redirected to:', currentUrl);
    expect(currentUrl).toContain('/products/');

  });


  // ============================================================
  // SCENARIO 8: Verify searched product can be added to cart
  // User Flow   : Search → PDP → Add To Cart
  // Test Steps  : Search product, open PDP and click Add To Cart
  // Expected    : Product is added successfully to Cart
  // ============================================================
  test('TC08 - Verify searched product can be added to cart', async ({ page }) => {

    // Navigate to collection page and search for OUD
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.openSearch();
    await collectionPage.searchFor('OUD');

    // Click first search result to open PDP
    await collectionPage.clickFirstProduct();
    const pdpUrl = page.url();
    console.log('PDP opened:', pdpUrl);
    expect(pdpUrl).toContain('/products/');

    // Get product title from PDP
    const productTitle = await pdpPage.getProductTitle();
    console.log('Product on PDP:', productTitle);

    // Click Add To Cart on PDP
    await pdpPage.clickAddToCart();

    // Verify cart drawer opens
    await miniCart.waitForMiniCartToAppear();
    const isCartOpen = await miniCart.isMiniCartVisible();
    console.log('Cart drawer open:', isCartOpen);
    expect(isCartOpen).toBe(true);

  });


  // ============================================================
  // SCENARIO 9: Verify Availability filter functionality
  // User Flow   : Collection Page → Filter
  // Test Steps  : Apply In Stock filter
  // Expected    : Only available products are displayed
  // ============================================================
  test('TC09 - Verify Availability filter functionality', async ({ page }) => {

    // Navigate to collection page
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();

    // Apply the "In Stock" availability filter
    await collectionPage.applyInStockFilter();

    // Verify the URL reflects the availability filter
    const currentUrl = page.url();
    console.log('Filtered URL:', currentUrl);
    expect(currentUrl).toContain('availability');

    // Verify products are still displayed after filtering
    const productCount = await collectionPage.getProductCount();
    console.log('Products after filter:', productCount);
    expect(productCount).toBeGreaterThan(0);

  });


  // ============================================================
  // SCENARIO 10: Verify Price Low To High sorting
  // User Flow   : Collection Page → Sorting
  // Test Steps  : Apply Price Low To High sorting
  // Expected    : Products are sorted in ascending order
  // ============================================================
  test('TC10 - Verify Price Low To High sorting', async ({ page }) => {

    // Navigate to collection page
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();

    // Apply "Price, low to high" sorting
    await collectionPage.applyPriceLowToHighSort();

    // Verify the URL reflects the price-ascending sort
    const currentUrl = page.url();
    console.log('Sorted URL:', currentUrl);
    expect(currentUrl).toContain('price-ascending');

    // Read all product prices and verify they are in ascending order
    const prices = await collectionPage.getAllProductPrices();
    console.log('Prices on page:', prices);
    expect(prices.length).toBeGreaterThan(0);

    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);

  });


  // ============================================================
  // SCENARIO 11: Verify Price High To Low sorting
  // User Flow   : Collection Page → Sorting
  // Test Steps  : Apply Price High To Low sorting
  // Expected    : Products are sorted in descending order
  // ============================================================
  test('TC11 - Verify Price High To Low sorting', async ({ page }) => {

    // Navigate to collection page
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();

    // Apply "Price, high to low" sorting
    await collectionPage.applyPriceHighToLowSort();

    // Verify the URL reflects the price-descending sort
    const currentUrl = page.url();
    console.log('Sorted URL:', currentUrl);
    expect(currentUrl).toContain('price-descending');

    // Read all product prices and verify they are in descending order
    const prices = await collectionPage.getAllProductPrices();
    console.log('Prices on page:', prices);
    expect(prices.length).toBeGreaterThan(0);

    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);

  });


  // ============================================================
  // SCENARIO 12: Verify filter and sorting work together
  // User Flow   : Collection Page → Filter + Sort
  // Test Steps  : Apply filter and sorting together
  // Expected    : Filtered products remain correctly sorted
  // ============================================================
  test('TC12 - Verify filter and sorting work together', async ({ page }) => {

    // Navigate to collection page
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();

    // Apply the "In Stock" filter first
    await collectionPage.applyInStockFilter();

    // Then apply "Price, low to high" sorting (filter stays active)
    await collectionPage.applyPriceLowToHighSort();

    // Verify the URL reflects BOTH the filter and the sort
    const currentUrl = page.url();
    console.log('Filtered + sorted URL:', currentUrl);
    expect(currentUrl).toContain('availability');
    expect(currentUrl).toContain('price-ascending');

    // Verify filtered products are still displayed
    const productCount = await collectionPage.getProductCount();
    console.log('Products after filter + sort:', productCount);
    expect(productCount).toBeGreaterThan(0);

    // Verify the filtered products remain sorted in ascending order
    const prices = await collectionPage.getAllProductPrices();
    console.log('Prices on page:', prices);
    const sortedAsc = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedAsc);

  });

});
