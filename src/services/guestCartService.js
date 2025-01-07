const GUEST_CART_KEY = 'guestCart';

export const getGuestCart = () => {
  const cart = localStorage.getItem(GUEST_CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const getGuestCartCount = () => {
  const cart = getGuestCart();
  return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
};

export const addToGuestCart = (productData, variant, quantity, isUpdate = false) => {
  try {
    const cart = getGuestCart();
    
    // Validate variant name
    if (!['50ml', '150ml', '250ml'].includes(variant.name)) {
      throw new Error('Invalid variant name. Must be 50ml, 150ml, or 250ml');
    }

    // Validate quantity and price
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    if (variant.price < 0) {
      throw new Error('Price cannot be negative');
    }

    const existingItemIndex = cart.findIndex(
      item => item.product_id === productData._id && item.variant_name === variant.name
    );

    // Create cart item matching the schema structure
    const cartItem = {
      product_id: productData._id,
      variant_name: variant.name,
      quantity: quantity,
      price: variant.price,
      total_price: quantity * variant.price,
      // Additional fields for display purposes only
      _display: {
        name: productData.name,
        image_urls: productData.image_urls,
        description: productData.description,
        variants: productData.variants
      }
    };

    if (existingItemIndex !== -1) {
      if (isUpdate) {
        cart[existingItemIndex] = {
          ...cart[existingItemIndex],
          quantity: quantity,
          total_price: quantity * variant.price
        };
      } else {
        const newQuantity = cart[existingItemIndex].quantity + quantity;
        cart[existingItemIndex].quantity = newQuantity;
        cart[existingItemIndex].total_price = newQuantity * variant.price;
      }
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error('Error adding to guest cart:', error);
    throw error;
  }
};

export const removeFromGuestCart = (productId, variantName) => {
  try {
    const cart = getGuestCart();
    
    if (!productId || !variantName) {
      console.error('Missing required parameters:', { productId, variantName });
      return cart;
    }

    const updatedCart = cart.filter(item => {
      if (!item || !item.product_id) {
        return false;
      }
      return !(item.product_id === productId && item.variant_name === variantName);
    });
    
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedCart));
    return updatedCart;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    const currentCart = getGuestCart();
    return currentCart;
  }
};

export const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};

export const validateCartItem = (item) => {
  if (!item.product_id) throw new Error('Product ID is required');
  if (!['50ml', '150ml', '250ml'].includes(item.variant_name)) {
    throw new Error('Invalid variant name');
  }
  if (item.quantity < 1) throw new Error('Quantity must be at least 1');
  if (item.price < 0) throw new Error('Price cannot be negative');
  if (item.total_price < 0) throw new Error('Total price cannot be negative');
  return true;
};