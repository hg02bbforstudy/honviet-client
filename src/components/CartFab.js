import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { getCart } from '../utils/cartUtils';
import { useNavigate } from 'react-router-dom';

export const cartFabDomId = 'global-cart-fab';
export default function CartFab() {
  const cartRef = useRef(null);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    try {
      const cart = getCart();
      setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  return (
    <div
      id={cartFabDomId}
      ref={cartRef}
      className="fixed bottom-4 right-4 z-40 bg-honvietRed text-white p-3 rounded-full shadow-lg"
      onClick={() => navigate('/cart')}
    >
      <ShoppingCart className="w-6 h-6" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-yellow-400 text-honvietRed text-xs font-bold rounded-full px-2 py-0.5 border border-white shadow">
          {cartCount}
        </span>
      )}
    </div>
  );
}
