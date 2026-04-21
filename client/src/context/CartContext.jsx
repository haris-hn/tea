import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (variantId, quantity) => {
    try {
      const { data } = await api.post('/cart', { variantId, quantity });
      setCart(data);
      setIsDrawerOpen(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const updateQuantity = async (variantId, quantity) => {
    try {
      const { data } = await api.put('/cart', { variantId, quantity });
      setCart(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update quantity' };
    }
  };

  const removeFromCart = async (variantId) => {
    try {
      const { data } = await api.delete(`/cart/${variantId}`);
      setCart(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to remove from cart' };
    }
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const cartTotal = cart?.items?.reduce((acc, item) => acc + (item.variant?.price || 0) * item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart,
      cartCount, 
      cartTotal,
      isDrawerOpen,
      setIsDrawerOpen,
      toggleDrawer
    }}>
      {children}
    </CartContext.Provider>
  );
};
