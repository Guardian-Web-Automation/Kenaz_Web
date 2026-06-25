// ============================================================
// PDP (Product Detail Page) - All  Test Scenarios
// Website: Kenaz Perfumes (kenazperfumes.com)
// Framework: Playwright + POM (Page Object Model)
// ============================================================

// Step 1: Import Playwright's test and expect functions
const { test, expect } = require('@playwright/test');

// Step 2: Import page objects
const CollectionPage = require('../pages/CollectionPage');
const PDPPage = require('../pages/PDPpage');
const MiniCart = require('../pages/MiniCart');


// ============================================================
// Group all PDP tests inside one describe block
// ============================================================
test.describe('PDP - All Test Scenarios', () => {

  let collectionPage;
  let pdpPage;
  let miniCart;

  // beforeEach runs before EVERY test automatically
  test.beforeEach(async ({ page }) => {
    collectionPage = new CollectionPage(page);
    pdpPage = new PDPPage(page);
    miniCart = new MiniCart(page);
  });


  // ============================================================
  // SCENARIO 1: Verify PDP displays product information
  // User Flow   : Collection Page → PDP
  // Test Steps  : Open a product and check its details
  // Expected    : Product details, price, quantity selector,
  //               ATC and Buy Now are displayed
  // ============================================================
  test('TC01 - Verify PDP displays product information', async ({ page }) => {

    // Open collection page and click the first product to land on PDP
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProduct();

    // Confirm we are on a product page
    expect(page.url()).toContain('/products/');

    // Check all key PDP elements
    const pdp = await pdpPage.verifyPDPElements();
    console.log('Title:', pdp.titleVisible, '| Price:', pdp.priceVisible,
                '| Quantity:', pdp.quantityExists, '| ATC:', pdp.atcExists,
                '| Buy Now:', pdp.buyNowExists);

    expect(pdp.titleVisible).toBe(true);
    expect(pdp.priceVisible).toBe(true);
    expect(pdp.quantityExists).toBe(true);
    expect(pdp.atcExists).toBe(true);
    expect(pdp.buyNowExists).toBe(true);

  });


  // ============================================================
  // SCENARIO 2: Verify quantity increase functionality
  // User Flow   : PDP → Quantity Increase
  // Test Steps  : Increase product quantity on PDP
  // Expected    : Quantity increases correctly
  // ============================================================
  test('TC02 - Verify quantity increase functionality', async ({ page }) => {

    // Open collection page and go to the first product's PDP
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProduct();
    expect(page.url()).toContain('/products/');

    // Read the quantity before increasing
    const before = await pdpPage.getQuantity();
    console.log('Quantity before:', before);

    // Click the "+" button to increase quantity
    await pdpPage.increaseQuantity();

    // Read the quantity after increasing
    const after = await pdpPage.getQuantity();
    console.log('Quantity after:', after);

    // Quantity should increase by 1
    expect(after).toBe(before + 1);

  });


  // ============================================================
  // SCENARIO 3: Verify Add To Cart from PDP
  // User Flow   : PDP → Add To Cart
  // Test Steps  : Click Add To Cart on PDP
  // Expected    : Product is added successfully to Cart
  // ============================================================
  test('TC03 - Verify Add To Cart from PDP', async ({ page }) => {

    // Open collection page and go to the first product's PDP
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProduct();
    expect(page.url()).toContain('/products/');

    // Read the product title from PDP
    const productTitle = await pdpPage.getProductTitle();
    console.log('Adding to cart:', productTitle);

    // Click Add To Cart on the PDP
    await pdpPage.clickAddToCart();

    // Verify the cart drawer opens
    await miniCart.waitForMiniCartToAppear();
    const isCartOpen = await miniCart.isMiniCartVisible();
    console.log('Cart drawer open:', isCartOpen);
    expect(isCartOpen).toBe(true);

  });


  // ============================================================
  // SCENARIO 4: Verify selected quantity is reflected in Cart
  // User Flow   : PDP → Quantity → Cart
  // Test Steps  : Select quantity and add product to Cart
  // Expected    : Same quantity is displayed in Cart
  // ============================================================
  test('TC04 - Verify selected quantity is reflected in Cart', async ({ page }) => {

    // Open collection page and go to the first product's PDP
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProduct();
    expect(page.url()).toContain('/products/');

    // Increase the quantity to 2
    await pdpPage.increaseQuantity();
    const pdpQty = await pdpPage.getQuantity();
    console.log('Quantity selected on PDP:', pdpQty);
    expect(pdpQty).toBe(2);

    // Add the product to cart
    await pdpPage.clickAddToCart();
    await miniCart.waitForMiniCartToAppear();

    // Verify the same quantity shows in the cart
    const cartQty = await miniCart.getCartItemQuantity();
    console.log('Quantity in cart:', cartQty);
    expect(cartQty).toBe(pdpQty);

  });


  // ============================================================
  // SCENARIO 5: Verify Buy Now redirects to Checkout
  // User Flow   : PDP → Buy Now
  // Test Steps  : Click Buy Now button
  // Expected    : User is redirected directly to Checkout
  // ============================================================
  test('TC05 - Verify Buy Now redirects to Checkout', async ({ page }) => {

    // Open collection page and go to the first product's PDP
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProduct();
    expect(page.url()).toContain('/products/');

    // Click the Buy Now button
    await pdpPage.clickBuyNow();

    // GoKwik checkout opens in an iframe modal on the same page (no URL change)
    const checkoutOpen = await pdpPage.isCheckoutOpen();
    console.log('GoKwik checkout iframe opened:', checkoutOpen);
    expect(checkoutOpen).toBe(true);

  });


  // ============================================================
  // SCENARIO 6: Verify Add Combo functionality
  // User Flow   : PDP → Bundle Section
  // Test Steps  : Click Add Combo from Bundle section
  // Expected    : Bundle products are added successfully
  // ============================================================
  test('TC06 - Verify Add Combo functionality', async ({ page }) => {

    // Open collection page and go to the first product's PDP
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProduct();
    expect(page.url()).toContain('/products/');

    // Click "Add Combo" in the bundle section
    await pdpPage.clickAddCombo();

    // Verify the cart drawer opens with the bundle products
    await miniCart.waitForMiniCartToAppear();
    const isCartOpen = await miniCart.isMiniCartVisible();
    console.log('Cart drawer open:', isCartOpen);
    expect(isCartOpen).toBe(true);

  });


  // ============================================================
  // SCENARIO 7: Verify bundle products appear in Cart
  // User Flow   : Bundle → Cart
  // Test Steps  : Add bundle products and open Cart
  // Expected    : All bundle products are displayed correctly
  // ============================================================
  test('TC07 - Verify bundle products appear in Cart', async ({ page }) => {

    // Open collection page and go to the first product's PDP
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProduct();
    expect(page.url()).toContain('/products/');

    // Add the bundle (combo) products
    await pdpPage.clickAddCombo();
    await miniCart.waitForMiniCartToAppear();

    // Read the product names shown in the cart
    const cartProducts = await miniCart.getCartProductNames();
    console.log('Products in cart:', cartProducts);

    // A combo has more than one product — verify at least 2 appear
    expect(cartProducts.length).toBeGreaterThanOrEqual(2);

  });


  // ============================================================
  // SCENARIO 8: Verify navigation from recommendation section
  // User Flow   : PDP → You May Also Like → PDP
  // Test Steps  : Click product from You May Also Like section
  // Expected    : User is redirected to selected PDP
  // ============================================================
  test('TC08 - Verify navigation from recommendation section', async ({ page }) => {

    // Open collection page and go to the first product's PDP
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProduct();
    expect(page.url()).toContain('/products/');

    // Remember the current PDP url
    const firstProductUrl = page.url();
    console.log('Starting PDP:', firstProductUrl);

    // Click a product from the "You May Also Like" section
    await pdpPage.clickRecommendedProduct();

    // Verify we landed on a different product page
    const newProductUrl = page.url();
    console.log('Recommended PDP:', newProductUrl);
    expect(newProductUrl).toContain('/products/');
    expect(newProductUrl).not.toBe(firstProductUrl);

  });


  // ============================================================
  // SCENARIO 9: Verify Add To Cart from recommendation section
  // User Flow   : PDP → You May Also Like → Add To Cart
  // Test Steps  : Click Add To Cart from recommendation section
  // Expected    : Product is added successfully to Cart
  // ============================================================
  test('TC09 - Verify Add To Cart from recommendation section', async ({ page }) => {

    // Open collection page and go to the first product's PDP
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProduct();
    expect(page.url()).toContain('/products/');

    // Read the cart badge count before adding
    const countBefore = await collectionPage.getCartBadgeCount();
    console.log('Cart count before:', countBefore);

    // Click Add To Cart on a product in the "You May Also Like" section
    await pdpPage.clickRecommendedProductATC();

    // Read the cart badge count after adding — it should increase
    const countAfter = await collectionPage.getCartBadgeCount();
    console.log('Cart count after:', countAfter);
    expect(countAfter).toBeGreaterThan(countBefore);

  });

});
