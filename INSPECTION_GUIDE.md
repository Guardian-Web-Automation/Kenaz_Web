# 🔎 QUICK INSPECTION GUIDE

## What You Need to Find on https://kenazperfumes.com/collections/all-products

### Step 1: Open Inspector
```
Press: F12 (Windows/Linux) or Cmd+Option+I (Mac)
```

### Step 2: Find Product Selector
```
1. Click the "Select Element" button (arrow icon in top-left of Inspector)
2. Click on a PRODUCT CARD (anywhere on the product)
3. In Inspector, look for the HTML:

   LOOK FOR THIS STRUCTURE:
   <div class="???">           ← This is your productItems selector
     <a href="/products/...">
       <span class="???">      ← This is your productName selector
       <span class="???">      ← This is your productPrice selector
     </a>
   </div>

4. Write down the class names you see
```

### Step 3: Find Add to Cart Button
```
1. Click "Select Element" again
2. Click the "ADD TO CART" button
3. In Inspector, look for:

   LOOK FOR THIS:
   <button class="???" aria-label="???">Add to Cart</button>
   
   OR
   
   <form>
     <button class="???">Add to Cart</button>
   </form>

4. Write down: class name and/or aria-label value
```

### Step 4: Find Mini Cart (After Adding to Cart)
```
1. Click an "Add to Cart" button
2. Watch what appears (drawer/modal/popup)
3. Right-click on it → Inspect
4. In Inspector, find:

   LOOK FOR THIS STRUCTURE:
   <div class="???">           ← Mini cart container
     <div class="???">         ← Cart items container
       <div class="???">       ← Individual cart item
         <span>Product Name</span>
         <span>Price</span>
       </div>
     </div>
     <div class="???">Subtotal: $XX</div>
   </div>

5. Write down all the class names
```

---

## 📋 Template to Fill In

```
PRODUCT SELECTORS (from Collection Page):
- Product container class: _______________________
- Product name element: _________________________
- Product price element: ________________________
- Product link href pattern: /products/...

ADD TO CART BUTTON:
- Button class: _________________________________
- Button text: __________________________________
- Button aria-label: ____________________________
- Parent form class: ____________________________

MINI CART (appears after clicking Add to Cart):
- Cart container class/id: ______________________
- Cart items container: __________________________
- Single cart item class: ________________________
- Cart item name element: ________________________
- Cart item price element: _______________________
- Subtotal/Total element: ________________________
- Close button: __________________________________
```

---

## 🎯 Examples of Real Selectors Found

### Example 1: Shopify Store
```javascript
// Products
this.productItems = 'a[href*="/products/"]';
this.productName = '.product-title';
this.productPrice = '.price';

// Add to Cart
this.addToCartButtons = 'button[aria-label*="Add"]';

// Mini Cart
this.miniCartVisible = '.cart-drawer';
this.cartItems = '.cart-item';
```

### Example 2: Custom Store
```javascript
// Products
this.productItems = '.product-card';
this.productName = 'h3.card-title';
this.productPrice = '.card-price';

// Add to Cart
this.addToCartButtons = '.add-btn';

// Mini Cart
this.miniCartVisible = '#cart-modal';
this.cartItems = 'li.cart-item';
```

### Example 3: WooCommerce
```javascript
// Products
this.productItems = '.woocommerce-LoopProduct-link';
this.productName = '.woocommerce-loop-product__title';
this.productPrice = '.woocommerce-Price-amount';

// Add to Cart
this.addToCartButtons = '.add_to_cart_button';

// Mini Cart
this.miniCartVisible = '.woocommerce-mini-cart';
this.cartItems = '.woocommerce-mini-cart-item';
```

---

## ✅ Checklist

- [ ] Opened Inspector (F12)
- [ ] Found product card selectors
- [ ] Found Add to Cart button selector
- [ ] Clicked Add to Cart
- [ ] Found mini cart selectors
- [ ] Wrote down all class names
- [ ] Ready to update files

---

## 📸 Taking a Screenshot

If you want to show me:
```
1. Open https://kenazperfumes.com/collections/all-products
2. Press F12 to open Inspector
3. Select a product (click Select Element, then click product)
4. Take screenshot of Inspector showing the HTML
5. Show me the mini cart (after clicking Add to Cart)
6. Take screenshot of mini cart Inspector
```

Then I can update selectors FOR YOU!
