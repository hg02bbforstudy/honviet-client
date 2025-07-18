// src/utils/cartUtils.js

export function getCurrentUserKey() {
  const user = localStorage.getItem("currentUser") || "guest";
  return user ? `cart_${user}` : null;
}

export function getCart() {
  const key = getCurrentUserKey();
  if (!key) return [];
  const cart = localStorage.getItem(key);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart) {
  const key = getCurrentUserKey();
  if (key) {
    localStorage.setItem(key, JSON.stringify(cart));
  }
}

export function addToCart(product) {
  const cart = getCart();
  const productId = product.id || product._id;

  if (!productId) return; // Không có id thì bỏ qua

  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: productId,
      image: product.image,
      brand: product.brand || '',
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice || null,
      quantity: 1
    });
  }

  saveCart(cart);
}
export function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== productId);
  saveCart(updatedCart);
}

export function updateCartItemQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((item) => item.id === productId);

  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

export function clearCart() {
  const key = getCurrentUserKey();
  if (key) {
    localStorage.removeItem(key);
  }
}
