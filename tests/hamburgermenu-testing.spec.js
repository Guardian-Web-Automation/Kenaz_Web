// ============================================================
// Hamburger Menu - All Test Scenarios
// Website: Kenaz Perfumes (kenazperfumes.com)
// Framework: Playwright + POM (Page Object Model)
// ============================================================

// Step 1: Import Playwright's test and expect functions
const { test, expect } = require('@playwright/test');

// Step 2: Import page objects
const HamburgerMenu = require('../pages/HamburgerMenu');


// ============================================================
// Group all Hamburger Menu tests inside one describe block
// ============================================================
test.describe('Hamburger Menu - All Test Scenarios', () => {

  let hamburgerMenu;

  // beforeEach runs before EVERY test automatically
  test.beforeEach(async ({ page }) => {
    hamburgerMenu = new HamburgerMenu(page);
  });


  // ============================================================
  // SCENARIO 1: Verify Hamburger Menu opens successfully
  // User Flow   : Homepage → Hamburger Menu
  // Test Steps  : 1. Open website  2. Click Hamburger icon
  // Expected    : Hamburger Menu should open successfully
  // ============================================================
  test('TC01 - Verify Hamburger Menu opens successfully', async ({ page }) => {

    // Open the website
    await hamburgerMenu.navigateToHome();

    // Click the hamburger icon
    await hamburgerMenu.openHamburgerMenu();

    // Verify the menu drawer opened
    const isOpen = await hamburgerMenu.isMenuOpen();
    console.log('Hamburger menu open:', isOpen);
    expect(isOpen).toBe(true);

  });


  // ============================================================
  // SCENARIO 2: Verify Hamburger Menu closes on clicking X icon
  // User Flow   : Hamburger Menu → Close
  // Test Steps  : 1. Open Hamburger Menu  2. Click X button
  // Expected    : Hamburger Menu should close successfully
  // ============================================================
  test('TC02 - Verify Hamburger Menu closes on clicking X icon', async ({ page }) => {

    // Open the website and the hamburger menu
    await hamburgerMenu.navigateToHome();
    await hamburgerMenu.openHamburgerMenu();

    // Confirm the menu is open first
    const isOpen = await hamburgerMenu.isMenuOpen();
    console.log('Hamburger menu open:', isOpen);
    expect(isOpen).toBe(true);

    // Click the X button to close the menu
    await hamburgerMenu.closeHamburgerMenu();

    // Verify the menu closed
    const isClosed = await hamburgerMenu.isMenuClosed();
    console.log('Hamburger menu closed:', isClosed);
    expect(isClosed).toBe(true);

  });


  // ============================================================
  // SCENARIO 3: Verify Crazy Deal navigation
  // User Flow   : Hamburger Menu → Crazy Deal
  // Test Steps  : 1. Open Hamburger Menu  2. Click Crazy Deal
  // Expected    : User should be redirected to Crazy Deal page
  // ============================================================
  test('TC03 - Verify Crazy Deal navigation', async ({ page }) => {

    // Open the website and the hamburger menu
    await hamburgerMenu.navigateToHome();
    await hamburgerMenu.openHamburgerMenu();

    // Click the "Crazy Deal" menu item
    await hamburgerMenu.clickMenuItem('Crazy Deal');

    // Verify the user is redirected to the Crazy Deal product page
    const url = page.url();
    console.log('Redirected to:', url);
    expect(url).toContain('/products/ultimate-dubai-box');

  });


  // ============================================================
  // SCENARIO 4: Verify About Us navigation
  // User Flow   : Hamburger Menu → About Us
  // Test Steps  : 1. Open Hamburger Menu  2. Click About Us
  // Expected    : User should be redirected to About Us page
  // ============================================================
  test('TC04 - Verify About Us navigation', async ({ page }) => {

    // Open the website and the hamburger menu
    await hamburgerMenu.navigateToHome();
    await hamburgerMenu.openHamburgerMenu();

    // Click the "About Us" menu item
    await hamburgerMenu.clickMenuItem('About Us');

    // Verify the user is redirected to the About Us page
    const url = page.url();
    console.log('Redirected to:', url);
    expect(url).toContain('/pages/about-us');

  });


  // ============================================================
  // SCENARIO 5: Verify Contact Us navigation
  // User Flow   : Hamburger Menu → Contact Us
  // Test Steps  : 1. Open Hamburger Menu  2. Click Contact Us
  // Expected    : User should be redirected to Contact Us page
  // ============================================================
  test('TC05 - Verify Contact Us navigation', async ({ page }) => {

    // Open the website and the hamburger menu
    await hamburgerMenu.navigateToHome();
    await hamburgerMenu.openHamburgerMenu();

    // Click the "Contact Us" menu item
    await hamburgerMenu.clickMenuItem('Contact Us');

    // Verify the user is redirected to the Contact Us page
    const url = page.url();
    console.log('Redirected to:', url);
    expect(url).toContain('/pages/contact');

  });


  // ============================================================
  // SCENARIO 6: Verify Instagram icon redirects correctly
  // User Flow   : Hamburger Menu → Instagram
  // Test Steps  : 1. Open Hamburger Menu  2. Click Instagram icon
  // Expected    : Instagram page should open successfully
  // ============================================================
  test('TC06 - Verify Instagram icon redirects correctly', async ({ page }) => {

    // Open the website and the hamburger menu
    await hamburgerMenu.navigateToHome();
    await hamburgerMenu.openHamburgerMenu();

    // Click the Instagram icon (opens in a new tab)
    const popupUrl = await hamburgerMenu.clickSocialIcon('Instagram');

    // Verify the new tab opened the Instagram page
    console.log('Instagram tab opened:', popupUrl);
    expect(popupUrl).toContain('instagram.com');

  });


  // ============================================================
  // SCENARIO 7: Verify Facebook icon redirects correctly
  // User Flow   : Hamburger Menu → Facebook
  // Test Steps  : 1. Open Hamburger Menu  2. Click Facebook icon
  // Expected    : Facebook page should open successfully
  // ============================================================
  test('TC07 - Verify Facebook icon redirects correctly', async ({ page }) => {

    // Open the website and the hamburger menu
    await hamburgerMenu.navigateToHome();
    await hamburgerMenu.openHamburgerMenu();

    // Click the Facebook icon (opens in a new tab)
    const popupUrl = await hamburgerMenu.clickSocialIcon('Facebook');

    // Verify the new tab opened the Facebook page
    console.log('Facebook tab opened:', popupUrl);
    expect(popupUrl).toContain('facebook.com');

  });


  // ============================================================
  // SCENARIO 8: Verify YouTube icon redirects correctly
  // User Flow   : Hamburger Menu → YouTube
  // Test Steps  : 1. Open Hamburger Menu  2. Click YouTube icon
  // Expected    : YouTube page should open successfully
  // ============================================================
  test('TC08 - Verify YouTube icon redirects correctly', async ({ page }) => {

    // Open the website and the hamburger menu
    await hamburgerMenu.navigateToHome();
    await hamburgerMenu.openHamburgerMenu();

    // Click the YouTube icon (opens in a new tab)
    const popupUrl = await hamburgerMenu.clickSocialIcon('YouTube');

    // Verify the new tab opened the YouTube page
    console.log('YouTube tab opened:', popupUrl);
    expect(popupUrl).toContain('youtube.com');

  });

});
