# Kenaz Automation — Beginner's Guide 📘

This is the learning documentation for the **kenaz-automation** project: an automated test suite
for the website **[kenazperfumes.com](https://kenazperfumes.com)**, built with **Playwright** using
the **Page Object Model (POM)** design pattern.

This is written for someone learning test automation for the first time. Read it top to bottom.

---

## 1. What is this project?

We are testing an online perfume store **automatically**, instead of clicking through it by hand
every time. We write code that:

1. Opens a browser
2. Goes to the website
3. Clicks buttons, fills forms, navigates pages — like a real user
4. **Checks** that the result is correct (e.g. "the cart shows 1 item")

If the check passes ✅ the test is green. If it fails ❌ something on the site (or in our code) is wrong.

We run everything on a **mobile screen size** (iPhone), because that's how most users shop.

---

## 2. The tools we use

| Tool | What it does |
|------|--------------|
| **Playwright** | The automation library. It controls the browser. |
| **@playwright/test** | The test runner — gives us `test()` and `expect()`. |
| **Node.js** | Runs our JavaScript code. |
| **Page Object Model (POM)** | A way of organising code so it's clean and reusable. |

---

## 3. Folder structure

```
kenaz-automation/
├── pages/                      ← "Page Objects" — one file per area of the site
│   ├── BasePage.js             ← shared helper methods used by all pages
│   ├── CollectionPage.js       ← product listing page
│   ├── PDPpage.js              ← Product Detail Page (single product)
│   ├── MiniCart.js             ← the cart drawer
│   ├── HamburgerMenu.js        ← the mobile ☰ menu
│   ├── ContactUs.js            ← Contact Us form
│   ├── CrazyDeal.js            ← "Build your own box" deal page
│   └── Footer.js               ← footer links + newsletter
│
├── tests/                      ← the actual tests (the "what to check")
│   ├── collectionpage-testing.spec.js
│   ├── pdppage-testing.spec.js
│   ├── cartpage-testing.spec.js
│   ├── hamburgermenu-testing.spec.js
│   ├── contactus-testing.spec.js
│   ├── crazydeal-testing.spec.js
│   └── footer-testing.spec.js
│
├── playwright.config.js        ← global settings (device, timeout, base URL)
└── package.json                ← project dependencies
```

### The golden rule of this project
- **`pages/` files** = *HOW* to do something ("how do I click Add To Cart?")
- **`tests/` files** = *WHAT* to check ("after I add to cart, is the cart open?")

This separation is the whole point of POM. If the website's HTML changes, you fix it in **one
place** (the page file), and every test that uses it keeps working.

---

## 4. How the Page Object Model (POM) works

### Step 1 — `BasePage.js` (the parent)
Every page file `extends BasePage`. BasePage holds common actions like `click`, `fill`,
`navigateTo`, `isVisible`. So we don't rewrite them everywhere.

```js
class BasePage {
  constructor(page) {
    this.page = page;          // "page" is the browser tab Playwright gives us
  }
  async click(selector) {
    await this.page.click(selector);
  }
}
```

### Step 2 — A page object (the child)
Example: `Footer.js` describes the footer. It has two parts:

**(a) Selectors** — *where* things are on the page (defined in the `constructor`):
```js
this.newsletterEmail = '#ContactFooter-email';   // [ID] the email box
```

**(b) Methods** — *actions* you can do on that page:
```js
async subscribeNewsletter(email) {
  await this.page.locator(this.newsletterEmail).fill(email);
  await this.page.locator(this.newsletterSubmit).click();
}
```

### Step 3 — A test uses the page object
```js
const Footer = require('../pages/Footer');   // import the page object

test('TC01 - newsletter subscription', async ({ page }) => {
  const footer = new Footer(page);           // create it
  await footer.navigateToHome();             // use its methods
  await footer.subscribeNewsletter('me@test.com');
  expect(await footer.isSubscriptionSuccessful()).toBe(true);  // check result
});
```

Notice the test reads like plain English. That's good automation.

---

## 5. Anatomy of a test

```js
const { test, expect } = require('@playwright/test');   // import the test tools
const HamburgerMenu = require('../pages/HamburgerMenu'); // import a page object

test.describe('Hamburger Menu - All Test Scenarios', () => {   // a GROUP of tests

  let hamburgerMenu;

  test.beforeEach(async ({ page }) => {     // runs BEFORE every test → fresh setup
    hamburgerMenu = new HamburgerMenu(page);
  });

  test('TC01 - menu opens', async ({ page }) => {   // ONE test
    await hamburgerMenu.navigateToHome();      // ARRANGE: go to the page
    await hamburgerMenu.openHamburgerMenu();   // ACT: do the action
    const isOpen = await hamburgerMenu.isMenuOpen();
    expect(isOpen).toBe(true);                 // ASSERT: check the result
  });

});
```

Key words:
- **`test.describe(...)`** — groups related tests under one heading.
- **`test.beforeEach(...)`** — code that runs before each test (so every test starts clean).
- **`test('name', async ({ page }) => {...})`** — a single test case.
- **`await`** — "wait for this to finish before the next line". Almost every Playwright call needs it.
- **`expect(x).toBe(y)`** — the assertion. This is what makes it a *test* and not just a script.

### The "AAA" pattern every test follows
1. **Arrange** — open the page / set up.
2. **Act** — do the thing (click, fill, navigate).
3. **Assert** — `expect(...)` the result is correct.

---

## 6. Selectors — how we find elements

A **selector** is the "address" of an element on the page. We use mostly **CSS selectors**:

| Type | Looks like | Means |
|------|-----------|-------|
| ID | `#submit-btn` | element with `id="submit-btn"` (best — unique) |
| Class | `.product__heading` | element with `class="product__heading"` |
| Attribute | `input[name="quantity"]` | input whose `name` is `quantity` |
| Attribute contains | `button[id*="Submit"]` | id **contains** "Submit" |
| Tag | `add-to-cart` | a `<add-to-cart>` element |
| Descendant | `#cart button` | a `<button>` **inside** `#cart` |
| Fallback (OR) | `'#a, .b'` | try `#a`, otherwise `.b` |
| XPath | `//h1` | a different syntax, starts with `//` |

Every selector in the `pages/` files has a `// [type]` comment telling you which kind it is.

**How do we find the right selector?** Open the site in Chrome → right-click the element →
**Inspect** → look at its `id`, `class`, or `name` in the DevTools panel. That's exactly what the
DevTools screenshots throughout this project were for.

---

## 7. Common Playwright commands you'll see

```js
await page.goto(url);                          // open a URL
await page.locator(selector).click();          // click an element
await page.locator(selector).fill('text');     // type into an input
await page.locator(selector).count();          // how many match (0 = none)
await page.locator(selector).isVisible();      // is it on screen?
await page.locator(selector).textContent();    // read its text
await page.locator(selector).scrollIntoViewIfNeeded();  // scroll to it
await page.waitForLoadState('domcontentloaded');// wait for page to load
```

### `.first()` and `.nth(i)`
If a selector matches **several** elements, `.first()` takes #1, `.nth(2)` takes #3 (counting from 0).
We often loop and pick the **first VISIBLE** one, because mobile pages have hidden duplicate elements.

---

## 8. How to RUN the tests

Open the terminal in the project folder and run:

```bash
# Run ALL tests
npx playwright test

# Run ONE file
npx playwright test tests/footer-testing.spec.js

# Run ONE test by name
npx playwright test -g "TC01"

# Run with the browser VISIBLE (headed mode) — great for watching/debugging
npx playwright test --headed

# Open the nice HTML report after a run
npx playwright show-report
```

Green = passed ✅  Red = failed ❌. A failed test shows the exact line + a screenshot/video.

---

## 9. Real lessons we learned on THIS site

These are the tricky, real-world things this project taught us. This is the gold. 👇

| Situation | What was happening | How we solved it |
|-----------|-------------------|------------------|
| **GoKwik checkout** | Clicking "Buy Now"/"Checkout" opens a **3rd-party iframe** popup — the page URL never changes. | We check the `#gokwik-iframe` becomes visible instead of checking the URL. To read inside it we use `page.frameLocator('#gokwik-iframe')`. |
| **Custom elements** (`<add-to-cart>`) | These ignore normal `.click()`. | Use `click({ force: true })`, or add to cart via Shopify's `/cart/add.js` API. |
| **Hidden duplicate elements** | Mobile pages have 2 copies of buttons (one hidden sticky one). `.first()` grabbed the hidden one. | Loop and click the **first VISIBLE** one. |
| **Cart totals update late** | The quantity number updates instantly but the price updates after a server response. | Wait for the network response: `Promise.all([waitForResponse(...), click()])`. |
| **Auto-rotating carousel** | "You May Also Like" keeps moving, so Playwright can't click it reliably. | Read the link's `href` and `goto()` it directly. |
| **Homepage hangs on load** | Heavy video/images mean the full `load` event never fires → 2-minute timeout. | Use `{ waitUntil: 'domcontentloaded' }` instead of waiting for full load. |
| **Drawer "closed" check** | The menu hides with a CSS animation (not removed from DOM), so Playwright still saw it as "visible". | Check the `<details open>` attribute instead. |
| **Social icons** | Open in a **new tab**. | Capture the popup: `const [popup] = await Promise.all([context.waitForEvent('page'), link.click()])`. |
| **Bundle in checkout** | "Build your own box" shows as **1 line item**, not 3 products. | Verify the box name/total, not each perfume. |
| **Cloudflare CAPTCHA** | After many runs the site shows "Verify you are human". | It's bot protection, not a code bug. Slow down, use real Chrome, or ask to allowlist the test IP. |

---

## 10. The config file (`playwright.config.js`)

```js
{
  baseURL: 'https://kenazperfumes.com',  // tests can use relative paths
  ...devices['iPhone 14 Pro Max'],       // emulate a mobile phone
  workers: 1,                            // run tests one at a time (not parallel)
  fullyParallel: false,
  timeout: 120000,                       // give each test up to 120 seconds
}
```

---

## 11. A note on `require` vs `import`

You'll see your IDE hint: *"File is a CommonJS module; it may be converted to an ES module."*
**Ignore it.** We intentionally use `require(...)` / `module.exports` (CommonJS style). It works
perfectly with Playwright. Don't let the editor "fix" it.

---

## 12. Glossary

- **POM (Page Object Model)** — design pattern: keep selectors + actions in `pages/`, keep checks in `tests/`.
- **Selector / Locator** — the address used to find an element on the page.
- **Assertion** — `expect(...)` — the check that decides pass/fail.
- **Spec file** — a test file (ends in `.spec.js`).
- **Headed / Headless** — browser visible / invisible while running.
- **Flaky test** — a test that sometimes passes, sometimes fails (usually a timing issue).
- **iframe** — a "page inside a page" (like the GoKwik checkout).

---

## 13. How to add a NEW test (your recipe)

1. **Find the selectors** — open the page in Chrome, Inspect the element, note its id/class/name.
2. **Add to the page object** — a selector in the `constructor`, and a method that uses it.
3. **Write the test** — in the matching `.spec.js`, follow Arrange → Act → Assert.
4. **Run it** — `npx playwright test tests/<file> --headed` and watch it work.
5. **Fix selectors if it fails** — re-check the DevTools, update the page object, re-run.

That's the exact loop this whole project was built with. 🎉

---

*Happy testing! Every test you write makes the next one easier.*
