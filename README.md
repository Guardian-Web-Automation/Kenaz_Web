# Kenaz Perfumes E2E Automation Testing

This project provides automated E2E testing for the Kenaz Perfumes website using Playwright and the Page Object Model (POM) design pattern.

## 📋 Project Overview

- **Website**: https://kenazperfumes.com
- **Testing Framework**: Playwright
- **Language**: JavaScript
- **Test Runner**: Playwright Test
- **Design Pattern**: Page Object Model (POM)

## 📁 Project Structure

```
kenaz-automation/
├── pages/                      # Page Object classes
│   ├── BasePage.js            # Base class with common methods
│   ├── CollectionPage.js      # Collection page interactions
│   └── MiniCart.js            # Mini cart interactions
├── tests/                      # Test specifications
│   └── addToCart.spec.js      # E2E test cases
├── utils/                      # Utility functions
│   └── testHelpers.js         # Helper functions
├── config/                     # Configuration files
├── playwright.config.js        # Playwright configuration
├── package.json               # Project dependencies
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone/Navigate to project directory**
```bash
cd kenaz-automation
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Playwright browsers**
```bash
npx playwright install
```

## 🧪 Test Cases

### TC-001: Collection Page Loading Verification
- Navigate to collection page
- Verify page loads properly
- Verify ATC buttons are visible
- Get product count

### TC-002: Add to Cart Button Interaction
- Navigate to collection page
- Get first product details
- Click ATC button for first product
- Verify mini cart appears

### TC-003: Product Addition Verification
- Navigate to collection page
- Get first product details
- Click ATC button
- Verify product is in cart
- Verify product details in cart

### TC-004: Complete E2E Journey (Main Test)
**Full journey from collection page to cart with all assertions:**
1. Navigate to collection page
2. Verify collection page loads properly
3. Get first product details
4. Click Add to Cart button
5. Verify mini cart opens
6. Verify mini cart structure
7. Verify product added to cart
8. Verify cart item count
9. Verify product details in cart
10. Verify product name match
11. Verify cart subtotal

### TC-005: Multiple Products Addition
- Add first product to cart
- Add second product to cart
- Verify both products in cart
- Verify cart updates correctly
- Verify subtotal calculation

## 📝 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### View test report
```bash
npm run report
```

## 🔍 Page Objects

### BasePage
Base class providing common methods used across all page objects:
- `navigateTo(url)` - Navigate to URL
- `click(selector)` - Click element
- `fill(selector, text)` - Fill input field
- `getText(selector)` - Get text content
- `waitForElement(selector, timeout)` - Wait for element visibility
- `isVisible(selector)` - Check if element is visible
- `getElements(selector)` - Get all matching elements
- `getElementCount(selector)` - Get element count
- `getAttribute(selector, attribute)` - Get attribute value

### CollectionPage
Handles interactions on the collection page:
- `navigateToCollection()` - Navigate to collection page
- `waitForPageLoad()` - Wait for products to load
- `isPageLoaded()` - Verify page is loaded
- `getProductCount()` - Get total products
- `getFirstProductDetails()` - Get first product name and price
- `clickFirstProductATC()` - Click ATC for first product
- `clickProductATCByIndex(index)` - Click ATC for specific product
- `areATCButtonsVisible()` - Verify ATC buttons visibility

### MiniCart
Handles interactions on the mini cart:
- `waitForMiniCartToAppear()` - Wait for mini cart to open
- `isMiniCartVisible()` - Check mini cart visibility
- `getCartItemCount()` - Get number of items in cart
- `getCartProducts()` - Get all products in cart with details
- `isProductInCart(productName)` - Check if product is in cart
- `getSubtotal()` - Get cart subtotal
- `removeItemByIndex(index)` - Remove item from cart
- `proceedToCheckout()` - Click checkout button
- `closeMiniCart()` - Close mini cart
- `verifyMiniCartStructure()` - Verify mini cart structure

## 🎯 Key Assertions

- ✓ Page URL verification
- ✓ Element visibility checks
- ✓ Element count verification
- ✓ Product details validation
- ✓ Cart item count verification
- ✓ Product name matching
- ✓ Price validation
- ✓ Quantity verification
- ✓ Subtotal calculation

## 📊 Test Configuration

### Browsers
Tests run on multiple browsers:
- Chromium
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)

### Timeouts
- Default element wait: 5000ms
- Page load wait: 10000ms
- Navigation timeout: 30000ms

### Screenshots & Videos
- Screenshots captured on test failure
- Videos retained on failure
- HTML reports generated automatically

## 🛠️ Debugging

### Using Playwright Inspector
```bash
npm run test:debug
```

### View HTML Report
```bash
npm run report
```

### Check test results
Test results are saved in `test-results/` directory

## 📦 Dependencies

- `@playwright/test` - Testing framework
- `dotenv` - Environment variable management

## 🔧 XPath Locators Used

- **Add to Cart Button**: `//add-to-cart[@class="button button--small button--secondary"]`
- **Mini Cart Container**: `//mini-cart[@id="mini-cart"]`

## 📌 Notes

- All tests include comprehensive logging for debugging
- Each test has multiple assertion checkpoints
- Tests are idempotent and can run independently
- Mini cart automatically waits for appearance before verifying products

## 🤝 Contributing

Feel free to extend this automation suite with additional test cases and page objects.

## 📄 License

This project is provided for testing purposes.

---

**Created**: 2024
**Framework Version**: Playwright 1.40+
**Node Version**: 14+
