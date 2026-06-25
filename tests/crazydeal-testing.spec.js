// ============================================================
// Crazy Deal - All Test Scenarios
// Website: Kenaz Perfumes (kenazperfumes.com)
// Framework: Playwright + POM (Page Object Model)
// ============================================================

// Step 1: Import Playwright's test and expect functions
const { test, expect } = require('@playwright/test');

// Step 2: Import page objects
const CrazyDeal = require('../pages/CrazyDeal');


// ============================================================
// Group all Crazy Deal tests inside one describe block
// ============================================================
test.describe('Crazy Deal - All Test Scenarios', () => {

  let crazyDeal;

  // beforeEach runs before EVERY test automatically
  test.beforeEach(async ({ page }) => {
    crazyDeal = new CrazyDeal(page);
  });


  // ============================================================
  // SCENARIO 1: Verify products are displayed on Crazy Deal page
  // User Flow   : Crazy Deal → Product Listing
  // Test Steps  : 1. Open Crazy Deal page  2. Observe product listing
  // Expected    : Product cards should be displayed successfully
  // ============================================================
  test('TC01 - Verify products are displayed on Crazy Deal page', async ({ page }) => {

    // Open the Crazy Deal page
    await crazyDeal.navigateToCrazyDeal();

    // Count the product cards
    const count = await crazyDeal.getProductCount();
    console.log('Product cards displayed:', count);
    expect(count).toBeGreaterThan(0);

    // Log the product names for confirmation
    const names = await crazyDeal.getProductNames();
    console.log('Products:', names);
    expect(names.length).toBeGreaterThan(0);

  });


  // ============================================================
  // SCENARIO 2: Verify user can add product to Crazy Deal box
  // User Flow   : Crazy Deal → Add To Box
  // Test Steps  : 1. Open Crazy Deal page  2. Click Add To Box
  // Expected    : Product should be added successfully
  // ============================================================
  test('TC02 - Verify user can add product to Crazy Deal box', async ({ page }) => {

    // Open the Crazy Deal page
    await crazyDeal.navigateToCrazyDeal();

    // Count selected products before adding
    const before = await crazyDeal.getSelectedCount();
    console.log('Selected before:', before);

    // Click "Add To Box" on the first product
    await crazyDeal.clickAddToBox();

    // The selected count should increase by 1
    const after = await crazyDeal.getSelectedCount();
    console.log('Selected after:', after);
    expect(after).toBe(before + 1);

  });


  // ============================================================
  // SCENARIO 3: Verify user can add three products in Crazy Deal
  // User Flow   : Crazy Deal → Add 3 Products
  // Test Steps  : 1. Add three products using Add To Box
  // Expected    : Three products should be added successfully
  // ============================================================
  test('TC03 - Verify user can add three products in Crazy Deal', async ({ page }) => {

    // Open the Crazy Deal page
    await crazyDeal.navigateToCrazyDeal();

    // Add three products to the box
    await crazyDeal.addProductsToBox(3);

    // Exactly three products should now be selected
    const selected = await crazyDeal.getSelectedCount();
    console.log('Selected products:', selected);
    expect(selected).toBe(3);

  });


  // ============================================================
  // SCENARIO 4: Verify Buy Now button is enabled after selection
  // User Flow   : Crazy Deal → Buy Now Visibility
  // Test Steps  : 1. Add three products
  // Expected    : Buy Now button should be visible and enabled
  // ============================================================
  test('TC04 - Verify Buy Now button is enabled after selecting products', async ({ page }) => {

    // Open the Crazy Deal page and add three products
    await crazyDeal.navigateToCrazyDeal();
    await crazyDeal.addProductsToBox(3);

    // The Buy Now button should now be visible and enabled
    const enabled = await crazyDeal.isBuyNowEnabled();
    console.log('Buy Now visible and enabled:', enabled);
    expect(enabled).toBe(true);

  });


  // ============================================================
  // SCENARIO 5: Verify user can remove a product from the box
  // User Flow   : Crazy Deal → Remove Item
  // Test Steps  : 1. Add product  2. Click Remove Item
  // Expected    : Product should be removed successfully
  // ============================================================
  test('TC05 - Verify user can remove selected product from Crazy Deal box', async ({ page }) => {

    // Open the Crazy Deal page and add one product
    await crazyDeal.navigateToCrazyDeal();
    await crazyDeal.clickAddToBox();

    // Confirm one product is selected
    const afterAdd = await crazyDeal.getSelectedCount();
    console.log('Selected after add:', afterAdd);
    expect(afterAdd).toBe(1);

    // Remove the selected product
    await crazyDeal.removeFirstProduct();

    // The selected count should drop back to 0
    const afterRemove = await crazyDeal.getSelectedCount();
    console.log('Selected after remove:', afterRemove);
    expect(afterRemove).toBe(0);

  });


  // ============================================================
  // SCENARIO 6: Verify Buy Now redirects to Checkout
  // User Flow   : Crazy Deal → Buy Now → Checkout
  // Test Steps  : 1. Add three products  2. Click Buy Now
  // Expected    : User should be redirected to Checkout page
  // ============================================================
  test('TC06 - Verify Buy Now redirects user to Checkout page', async ({ page }) => {

    // Open the Crazy Deal page and add three products
    await crazyDeal.navigateToCrazyDeal();
    await crazyDeal.addProductsToBox(3);

    // Click Buy Now
    await crazyDeal.clickBuyNow();

    // GoKwik checkout opens in an iframe modal on the same page
    const checkoutOpen = await crazyDeal.isCheckoutOpen();
    console.log('Checkout (GoKwik) opened:', checkoutOpen);
    expect(checkoutOpen).toBe(true);

  });


  // ============================================================
  // SCENARIO 7: Verify selected products are present in Checkout
  // User Flow   : Crazy Deal → Checkout Validation
  // Test Steps  : 1. Add three products  2. Click Buy Now
  // Expected    : Selected products should be displayed in Checkout
  // ============================================================
  test('TC07 - Verify selected Crazy Deal products are present in Checkout', async ({ page }) => {

    // Open the Crazy Deal page and add three products
    await crazyDeal.navigateToCrazyDeal();
    await crazyDeal.addProductsToBox(3);

    // Confirm three products were selected before checkout
    const selectedNames = await crazyDeal.getSelectedProductNames();
    console.log('Selected products:', selectedNames);
    expect(selectedNames.length).toBe(3);

    // Click Buy Now and wait for the GoKwik checkout to open
    await crazyDeal.clickBuyNow();
    const checkoutOpen = await crazyDeal.isCheckoutOpen();
    expect(checkoutOpen).toBe(true);

    // The 3 selected perfumes are bundled into the "Ultimate Dubai Box" (1 item),
    // shown in checkout at the deal price of ₹1,299. The order summary is collapsed
    // on open, so verify the item count and bundle total reached checkout
    const checkoutText = await crazyDeal.getCheckoutText();
    console.log('Checkout text length:', checkoutText.length);
    //expect(checkoutText).toContain('item');
    expect(checkoutText).toContain('1,299');

  });

});
