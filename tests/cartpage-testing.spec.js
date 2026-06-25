// ============================================================
// Cart - All  Test Scenarios
// Website: Kenaz Perfumes (kenazperfumes.com)
// Framework: Playwright + POM (Page Object Model)
// ============================================================

// Step 1: Import Playwright's test and expect functions
const { test, expect } = require('@playwright/test');

// Step 2: Import page objects
const CollectionPage = require('../pages/CollectionPage');
const MiniCart = require('../pages/MiniCart');


// ============================================================
// Group all Cart tests inside one describe block
// ============================================================
test.describe('Cart - All Test Scenarios', () => {

  let collectionPage;
  let miniCart;

  // beforeEach runs before EVERY test automatically
  test.beforeEach(async ({ page }) => {
    collectionPage = new CollectionPage(page);
    miniCart = new MiniCart(page);
  });


  // ============================================================
  // SCENARIO 1: Verify products display correctly in Cart
  // User Flow   : Cart
  // Test Steps  : Add products and open Cart
  // Expected    : Products are displayed correctly with details
  // ============================================================
  test('TC01 - Verify products display correctly in Cart', async ({ page }) => {

    // Open collection page
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();

    // Get the first product details before adding
    const product = await collectionPage.getFirstProductDetails();
    console.log('Adding to cart:', product.name, '|', product.price);

    // Add the product and open the cart drawer
    await collectionPage.clickFirstProductATC();
    await miniCart.waitForMiniCartToAppear();

    // Verify the product name is displayed in the cart
    const names = await miniCart.getCartProductNames();
    console.log('Products in cart:', names);
    expect(names.length).toBeGreaterThan(0);

    // Verify the quantity is displayed
    const qty = await miniCart.getCartItemQuantity();
    console.log('Quantity in cart:', qty);
    expect(qty).toBeGreaterThan(0);

    // Verify the price/subtotal is displayed
    const subtotal = await miniCart.getSubtotal();
    console.log('Cart subtotal:', subtotal);
    expect(subtotal).toContain('₹');

  });


  // ============================================================
  // SCENARIO 2: Verify quantity increase in Cart
  // User Flow   : Cart → Quantity Increase
  // Test Steps  : Increase quantity from Cart
  // Expected    : Quantity and totals update correctly
  // ============================================================
  test('TC02 - Verify quantity increase in Cart', async ({ page }) => {

    // Open collection page, add a product and open the cart drawer
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProductATC();
    await miniCart.waitForMiniCartToAppear();

    // Read quantity and subtotal BEFORE increasing
    const qtyBefore = await miniCart.getCartItemQuantity();
    const subtotalBefore = await miniCart.getCartSubtotalAmount();
    console.log('Before -> qty:', qtyBefore, '| subtotal:', subtotalBefore);

    // Increase the quantity from the cart
    await miniCart.increaseCartQuantity();

    // Read quantity and subtotal AFTER increasing
    const qtyAfter = await miniCart.getCartItemQuantity();
    const subtotalAfter = await miniCart.getCartSubtotalAmount();
    console.log('After -> qty:', qtyAfter, '| subtotal:', subtotalAfter);

    // Quantity should increase by 1 and subtotal should go up
    expect(qtyAfter).toBe(qtyBefore + 1);
    expect(subtotalAfter).toBeGreaterThan(subtotalBefore);

  });


  // ============================================================
  // SCENARIO 3: Verify quantity decrease in Cart
  // User Flow   : Cart → Quantity Decrease
  // Test Steps  : Decrease quantity from Cart
  // Expected    : Quantity and totals update correctly
  // ============================================================
  test('TC03 - Verify quantity decrease in Cart', async ({ page }) => {

    // Open collection page, add a product and open the cart drawer
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProductATC();
    await miniCart.waitForMiniCartToAppear();

    // Increase to 2 first so the decrease is meaningful
    await miniCart.increaseCartQuantity();

    // Read quantity and subtotal BEFORE decreasing
    const qtyBefore = await miniCart.getCartItemQuantity();
    const subtotalBefore = await miniCart.getCartSubtotalAmount();
    console.log('Before -> qty:', qtyBefore, '| subtotal:', subtotalBefore);

    // Decrease the quantity from the cart
    await miniCart.decreaseCartQuantity();

    // Read quantity and subtotal AFTER decreasing
    const qtyAfter = await miniCart.getCartItemQuantity();
    const subtotalAfter = await miniCart.getCartSubtotalAmount();
    console.log('After -> qty:', qtyAfter, '| subtotal:', subtotalAfter);

    // Quantity should decrease by 1 and subtotal should go down
    expect(qtyAfter).toBe(qtyBefore - 1);
    expect(subtotalAfter).toBeLessThan(subtotalBefore);

  });


  // ============================================================
  // SCENARIO 4: Verify Order Summary calculation
  // User Flow   : Cart → Order Summary
  // Test Steps  : Verify subtotal and total values
  // Expected    : Amount calculations are accurate
  // ============================================================
  test('TC04 - Verify Order Summary calculation', async ({ page }) => {

    // Open collection page, add a product and open the cart drawer
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProductATC();
    await miniCart.waitForMiniCartToAppear();

    // Read subtotal and total at quantity 1
    const subtotal1 = await miniCart.getCartSubtotalAmount();
    const total1 = await miniCart.getCartTotalAmount();
    console.log('Qty 1 -> subtotal:', subtotal1, '| total:', total1);

    // Total should equal subtotal (no extra charges) and be greater than 0
    expect(subtotal1).toBeGreaterThan(0);
    expect(total1).toBe(subtotal1);

    // Increase to quantity 2 and re-read
    await miniCart.increaseCartQuantity();
    const subtotal2 = await miniCart.getCartSubtotalAmount();
    const total2 = await miniCart.getCartTotalAmount();
    console.log('Qty 2 -> subtotal:', subtotal2, '| total:', total2);

    // Subtotal should double and total should still equal subtotal
    expect(subtotal2).toBe(subtotal1 * 2);
    expect(total2).toBe(subtotal2);

  });


  // ============================================================
  // SCENARIO 5: Verify cart persists after page refresh
  // User Flow   : Cart → Refresh
  // Test Steps  : Add product and refresh page
  // Expected    : Product remains available in Cart
  // ============================================================
  test('TC05 - Verify cart persists after page refresh', async ({ page }) => {

    // Open collection page, add a product and open the cart drawer
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();

    const product = await collectionPage.getFirstProductDetails();
    console.log('Adding to cart:', product.name);

    await collectionPage.clickFirstProductATC();
    await miniCart.waitForMiniCartToAppear();

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Cart badge should still show items after refresh
    const badgeCount = await collectionPage.getCartBadgeCount();
    console.log('Cart badge count after refresh:', badgeCount);
    expect(badgeCount).toBeGreaterThan(0);

    // Open the cart and verify the product is still there
    await miniCart.openCart();
    const names = await miniCart.getCartProductNames();
    console.log('Products in cart after refresh:', names);
    expect(names.length).toBeGreaterThan(0);

  });


  // ============================================================
  // SCENARIO 6: Verify Checkout navigation from Cart
  // User Flow   : Cart → Checkout
  // Test Steps  : Click Checkout button
  // Expected    : User is redirected to Checkout page
  // ============================================================
  test('TC06 - Verify Checkout navigation from Cart', async ({ page }) => {

    // Oen collection page, add a product and open the cart drawer
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProductATC();
    await miniCart.waitForMiniCartToAppear();

    // Click the Checkout button
    await miniCart.clickCheckout();

    // Verify the checkout page (GoKwik) opens
    const checkoutOpen = await miniCart.isCheckoutOpen();
    console.log('Checkout page opened:', checkoutOpen);
    expect(checkoutOpen).toBe(true);

  });


  // ============================================================
  // SCENARIO 7: Verify Checkout amount matches Cart amount
  // User Flow   : Cart → Checkout Amount
  // Test Steps  : Compare Cart amount with Checkout amount
  // Expected    : Amount should match correctly
  // ============================================================
  test('TC07 - Verify Checkout amount matches Cart amount', async ({ page }) => {

    // Open collection page, add a product and open the cart drawer
    await collectionPage.navigateToCollection();
    await collectionPage.waitForPageLoad();
    await collectionPage.clickFirstProductATC();
    await miniCart.waitForMiniCartToAppear();

    // Read the cart total BEFORE going to checkout
    const cartTotal = await miniCart.getCartTotalAmount();
    console.log('Cart total:', cartTotal);
    expect(cartTotal).toBeGreaterThan(0);

    // Click Checkout and wait for the GoKwik checkout to open
    await miniCart.clickCheckout();
    const checkoutOpen = await miniCart.isCheckoutOpen();
    expect(checkoutOpen).toBe(true);

    // Read the amount shown on the checkout page (inside the iframe)
    const checkoutAmount = await miniCart.getCheckoutAmount();
    console.log('Checkout amount:', checkoutAmount);

    // Checkout amount should match the cart total
    expect(checkoutAmount).toBe(cartTotal);

  });

});
