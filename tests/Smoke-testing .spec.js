// Import required libraries
const { test, expect } = require('@playwright/test');

// Import page objects
const CollectionPage = require('../pages/CollectionPage');
const MiniCart = require('../pages/MiniCart');

// Create a test
test.describe('Simple E2E Test - Add Product to Cart and cart open ', () => {
  
  let collectionPage;
  let miniCart;

  // Setup before each test
  test.beforeEach(async ({ page }) => {
    collectionPage = new CollectionPage(page);
    miniCart = new MiniCart(page);
  });

  // Main test - Simple flow
  test('Add product to cart and proceed to checkout', async ({ page }) => {
    
    // Step 1: Navigate to collection page
    console.log('Opening collection page...');
    await collectionPage.navigateToCollection();
    expect(page.url()).toContain('/collections/all-products');
    console.log('Collection page opened\n');
    
    
    // // Step 2: Wait for page to load
    // console.log('Waiting for products to load...');
    // await collectionPage.waitForPageLoad();
    // console.log('Products loaded\n');
    
    
    // Step 3: Get first product details
    console.log('Getting product details...');
    const product = await collectionPage.getFirstProductDetails();
    expect(product.name).toBeTruthy();
    console.log(`Product selected: ${product.name}\n`);
    
    
    // Step 4: Click Add to Cart button
    console.log('Clicking Add to Cart button...');
    await collectionPage.clickFirstProductATC();
    console.log('Add to Cart button clicked\n');
    
    
    // Step 5: Wait for cart to appear
    console.log('Waiting for cart to appear...');
    await miniCart.waitForMiniCartToAppear();
    const cartVisible = await miniCart.isMiniCartVisible();
    expect(cartVisible).toBe(true);
    console.log('Cart appeared\n');
    
    
    // Step 6: Verify product is in cart
    console.log('Verifying product in cart...');
    const productInCart = await miniCart.isProductInCart(product.name);
    expect(productInCart).toBe(true);
    console.log(`Product "${product.name}" added to cart\n`);

    // Step 7: Get subtotal
    console.log('Getting cart subtotal...');
    const subtotal = await miniCart.getSubtotal();
    console.log(`Cart subtotal: ${subtotal}\n`);
    
  
  });

});
