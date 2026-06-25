// ============================================================
// Contact Us - All Test Scenarios
// Website: Kenaz Perfumes (kenazperfumes.com)
// Framework: Playwright + POM (Page Object Model)
// ============================================================

// Step 1: Import Playwright's test and expect functions
const { test, expect } = require('@playwright/test');

// Step 2: Import page objects
const ContactUs = require('../pages/ContactUs');


// ============================================================
// Group all Contact Us tests inside one describe block
// ============================================================
test.describe('Contact Us - All Test Scenarios', () => {

  let contactUs;

  // beforeEach runs before EVERY test automatically
  test.beforeEach(async ({ page }) => {
    contactUs = new ContactUs(page);
  });


  // ============================================================
  // SCENARIO 1: Verify Contact Us form submission with valid details
  // User Flow   : Contact Us → Form Submission
  // Test Steps  : Enter First Name, Last Name, Email, Message,
  //               select checkbox and click Submit
  // Expected    : Form should be submitted successfully
  // ============================================================
  test('TC01 - Verify Contact Us form submission with valid details', async ({ page }) => {

    // Open the Contact Us page
    await contactUs.navigateToContact();

    // Fill the form with valid details
    await contactUs.fillContactForm({
      firstName: 'keshav',
      lastName: 'sharma',
      email: 'keshav.sharma@oneguardian.in',
      message: 'This is a test message for automation testing.',
    });

    // Submit the form
    await contactUs.submitForm();

    // Verify the form was submitted successfully
    const isSuccess = await contactUs.isSubmitSuccessful();
    console.log('Form submitted successfully:', isSuccess);
    expect(isSuccess).toBe(true);

  });

});
