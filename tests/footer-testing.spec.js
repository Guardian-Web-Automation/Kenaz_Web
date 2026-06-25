// ============================================================
// Footer - All Test Scenarios
// Website: Kenaz Perfumes (kenazperfumes.com)
// Framework: Playwright + POM (Page Object Model)
// ============================================================

// Step 1: Import Playwright's test and expect functions
const { test, expect } = require('@playwright/test');

// Step 2: Import page objects
const Footer = require('../pages/Footer');


// ============================================================
// Group all Footer tests inside one describe block
// ============================================================
test.describe('Footer - All Test Scenarios', () => {

  let footer;

  // beforeEach runs before EVERY test automatically
  test.beforeEach(async ({ page }) => {
    footer = new Footer(page);
  });


  // ============================================================
  // SCENARIO 1: Verify newsletter subscription using valid email
  // User Flow   : Footer → Newsletter
  // Test Steps  : 1. Enter valid email  2. Click Subscribe
  // Expected    : Newsletter subscription should be successful
  // ============================================================
  test('TC01 - Verify newsletter subscription using valid email', async ({ page }) => {

    // Open the website (footer is on the homepage)
    await footer.navigateToHome();

    // Enter a valid email and click Subscribe
    await footer.subscribeNewsletter('keshav.sharma@oneguardian.in');

    // Verify the subscription was successful
    const isSuccess = await footer.isSubscriptionSuccessful();
    console.log('Newsletter subscription successful:', isSuccess);
    expect(isSuccess).toBe(true);

  });


  // ============================================================
  // SCENARIO 2: Verify Contact Us link navigation
  // User Flow   : Footer → Contact Us
  // Test Steps  : 1. Click Contact Us link
  // Expected    : Contact Us page should open successfully
  // ============================================================
  test('TC02 - Verify Contact Us link navigation', async ({ page }) => {

    // Open the website
    await footer.navigateToHome();

    // Click the "Contact Us" footer link
    await footer.clickFooterLink('Contact us');

    // Verify the Contact Us page opened
    const url = page.url();
    console.log('Redirected to:', url);
    expect(url).toContain('/pages/contact');

  });


  // ============================================================
  // SCENARIO 3: Verify About Us link navigation
  // User Flow   : Footer → About Us
  // Test Steps  : 1. Click About Us link
  // Expected    : About Us page should open successfully
  // ============================================================
  test('TC03 - Verify About Us link navigation', async ({ page }) => {

    // Open the website
    await footer.navigateToHome();

    // Click the "About Us" footer link
    await footer.clickFooterLink('About us');

    // Verify the About Us page opened
    const url = page.url();
    console.log('Redirected to:', url);
    expect(url).toContain('/pages/about-us');

  });


  // ============================================================
  // SCENARIO 4: Verify Terms & Conditions page navigation
  // User Flow   : Footer → Terms & Conditions
  // Test Steps  : 1. Click Terms & Conditions link
  // Expected    : Terms & Conditions page should open successfully
  // ============================================================
  test('TC04 - Verify Terms & Conditions page navigation', async ({ page }) => {

    // Open the website
    await footer.navigateToHome();

    // Click the "Terms & Conditions" footer link
    await footer.clickFooterLink('Terms');

    // Verify the Terms & Conditions page opened
    const url = page.url();
    console.log('Redirected to:', url);
    expect(url).toContain('/pages/terms-conditions');

  });


  // ============================================================
  // SCENARIO 5: Verify Privacy Policy page navigation
  // User Flow   : Footer → Privacy Policy
  // Test Steps  : 1. Click Privacy Policy link
  // Expected    : Privacy Policy page should open successfully
  // ============================================================
  test('TC05 - Verify Privacy Policy page navigation', async ({ page }) => {

    // Open the website
    await footer.navigateToHome();

    // Click the "Privacy Policy" footer link
    await footer.clickFooterLink('Privacy Policy');

    // Verify the Privacy Policy page opened
    const url = page.url();
    console.log('Redirected to:', url);
    expect(url).toContain('/pages/privacy-policy');

  });


  // ============================================================
  // SCENARIO 6: Verify Refund Policy page navigation
  // User Flow   : Footer → Refund Policy
  // Test Steps  : 1. Click Refund Policy link
  // Expected    : Refund Policy page should open successfully
  // ============================================================
  test('TC06 - Verify Refund Policy page navigation', async ({ page }) => {

    // Open the website
    await footer.navigateToHome();

    // Click the "Refund Policy" footer link
    await footer.clickFooterLink('Refund');

    // Verify the Refund Policy page opened
    const url = page.url();
    console.log('Redirected to:', url);
    expect(url).toContain('refund');

  });


  // ============================================================
  // SCENARIO 7: Verify Shipping Policy page navigation
  // User Flow   : Footer → Shipping Policy
  // Test Steps  : 1. Click Shipping Policy link
  // Expected    : Shipping Policy page should open successfully
  // ============================================================
  test('TC07 - Verify Shipping Policy page navigation', async ({ page }) => {

    // Open the website
    await footer.navigateToHome();

    // Click the "Shipping Policy" footer link
    await footer.clickFooterLink('Shipping Policy');

    // Verify the Shipping Policy page opened
    const url = page.url();
    console.log('Redirected to:', url);
    expect(url).toContain('/pages/shipping-policy');

  });


  // ============================================================
  // SCENARIO 8: Verify Scent Journal page navigation
  // User Flow   : Footer → Scent Journal
  // Test Steps  : 1. Click Scent Journal link
  // Expected    : Scent Journal page should open successfully
  // ============================================================
  test('TC08 - Verify Scent Journal page navigation', async ({ page }) => {

    // Open the website
    await footer.navigateToHome();

    // Click the "The Scent Journal" footer link
    await footer.clickFooterLink('Scent Journal');

    // Verify the Scent Journal (blog) page opened
    const url = page.url();
    console.log('Redirected to:', url);
    expect(url).toContain('/blogs');

  });


  // ============================================================
  // SCENARIO 9: Verify Instagram icon navigation from footer
  // User Flow   : Footer → Instagram
  // Test Steps  : 1. Click Instagram icon
  // Expected    : Instagram page should open successfully
  // ============================================================
  test('TC09 - Verify Instagram icon navigation from footer', async ({ page }) => {

    // Open the website
    await footer.navigateToHome();

    // Click the Instagram icon in the footer (opens in a new tab)
    const popupUrl = await footer.clickFooterSocialIcon('Instagram');

    // Verify the new tab opened the Instagram page
    console.log('Instagram tab opened:', popupUrl);
    expect(popupUrl).toContain('instagram.com');

  });


  // ============================================================
  // SCENARIO 10: Verify Facebook icon navigation from footer
  // User Flow   : Footer → Facebook
  // Test Steps  : 1. Click Facebook icon
  // Expected    : Facebook page should open successfully
  // ============================================================
  test('TC10 - Verify Facebook icon navigation from footer', async ({ page }) => {

    // Open the website
    await footer.navigateToHome();

    // Click the Facebook icon in the footer (opens in a new tab)
    const popupUrl = await footer.clickFooterSocialIcon('Facebook');

    // Verify the new tab opened the Facebook page
    console.log('Facebook tab opened:', popupUrl);
    expect(popupUrl).toContain('facebook.com');

  });


  // ============================================================
  // SCENARIO 11: Verify YouTube icon navigation from footer
  // User Flow   : Footer → YouTube
  // Test Steps  : 1. Click YouTube icon
  // Expected    : YouTube page should open successfully
  // ============================================================
  test('TC11 - Verify YouTube icon navigation from footer', async ({ page }) => {

    // Open the website
    await footer.navigateToHome();

    // Click the YouTube icon in the footer (opens in a new tab)
    const popupUrl = await footer.clickFooterSocialIcon('YouTube');

    // Verify the new tab opened the YouTube page
    console.log('YouTube tab opened:', popupUrl);
    expect(popupUrl).toContain('youtube.com');

  });

});
