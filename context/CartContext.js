import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [checkoutItem, setCheckoutItem] = useState(null);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const setItemForCheckout = (item) => {
    setCheckoutItem(item);
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  // Increase / decrease quantity
  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Add order to history
  const addToHistory = (order) => {
    setPurchaseHistory((prev) => [order, ...prev]);
  };

  // ✅ Complete purchase (handles both Buy Now & Cart checkout)
  const completePurchase = (method, itemsToPurchase = null) => {
    const purchaseItems =
      itemsToPurchase || (checkoutItem ? [checkoutItem] : cartItems);

    if (!purchaseItems || purchaseItems.length === 0) return;

    const total = purchaseItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    const order = {
      id: Date.now(), // unique ID
      items: purchaseItems.map((item) => ({ ...item })), // deep copy
      method,
      total,
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
    };

    addToHistory(order);

    // If Buy Now was used → clear checkoutItem
    if (checkoutItem) {
      setCheckoutItem(null);
    }

    // If Cart purchase → clear cart
    if (!itemsToPurchase && !checkoutItem) {
      clearCart();
    }
  };

  // Total price (cart only)
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        completePurchase,
        addToHistory,
        purchaseHistory,
        totalPrice,
        checkoutItem, // ✅ expose
        setCheckoutItem, // ✅ expose
        setItemForCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
