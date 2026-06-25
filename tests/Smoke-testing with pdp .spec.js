const { test, expect } = require('@playwright/test');
const CollectionPage = require('../pages/CollectionPage');
const ProductDetailPage = require('../pages/PDPpage');
const MiniCart = require('../pages/MiniCart');

test.describe('Kenaz Perfumes - Mobile E2E Journey', () => {
  
  let collectionPage;
  let productDetailPage;
  let miniCart;

  test.beforeEach(async ({ page }) => {
    // Initialize all page objects
    collectionPage = new CollectionPage(page);
    productDetailPage = new ProductDetailPage(page);
    miniCart = new MiniCart(page);
    
    // Add custom logging for errors only
   // page.on('pageerror', err => console.log('Page Error:', err));
  });

  test('Complete Mobile Journey: Collection → PDP → Add to Cart → Verify Cart', async ({ page }) => {
    console.log('Starting Mobile E2E Journey Test');
    
    // Step 1: Navigate to Collection Page
    console.log('Step 1: Navigate to Collection Page');
    await collectionPage.navigateToCollection();
    //await page.waitForLoadState('domcontentloaded');
   // await page.waitForTimeout(1500);
    
    expect(page.url()).toContain('/collections/all-products');
    
    // Step 2: Get Product Details and Click First Product
    console.log('Step 2: Click on First Product');
    //await collectionPage.waitForPageLoad();
    const productCount = await collectionPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    const collectionProduct = await collectionPage.getFirstProductDetails();
    console.log(`Product Selected: ${collectionProduct.name} - ${collectionProduct.price}`);
    
    await collectionPage.clickFirstProduct();
    //await page.waitForLoadState('domcontentloaded');
    //await page.waitForTimeout(1500);
    
    // Step 3: Verify PDP and Click Add to Cart
    console.log('Step 3: Click Add to Cart on PDP');
    expect(page.url()).toContain('/products/');
    
    const pdpTitle = await productDetailPage.getProductTitle();
    const pdpPrice = await productDetailPage.getProductPrice();
    expect(pdpTitle).toBeTruthy();
    expect(pdpPrice).toBeTruthy();
    
    const isATCVisible = await productDetailPage.isAddToCartButtonVisible();
    expect(isATCVisible).toBe(true);
    
    await productDetailPage.clickAddToCart();
    
    // Step 4: Wait for Mini Cart and Verify
    console.log('Step 4: Verify Mini Cart');
    await miniCart.waitForMiniCartToAppear();
    await page.waitForTimeout(1000);
    
    const cartVisible = await miniCart.isMiniCartVisible();
    expect(cartVisible).toBe(true);
    
    // Step 5: Check Cart Contents and Subtotal
    console.log('Step 5: Verify Cart Contents and Subtotal');
    const cartProducts = await miniCart.getCartProducts();
    expect(cartProducts.length).toBeGreaterThan(0);
    
    const firstProduct = cartProducts[0];
    console.log(`Cart Product: ${firstProduct.name} - ${firstProduct.price} - Qty: ${firstProduct.quantity}`);
    
    const subtotal = await miniCart.getSubtotal();
    console.log(`Cart Subtotal: ${subtotal}`);
    expect(subtotal).toBeTruthy();
    
    console.log('Mobile E2E Journey Test PASSED - All Steps Completed!\n');
  });
});
