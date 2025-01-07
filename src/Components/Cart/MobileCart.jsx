import React from 'react';
import CartProduct from './CartProduct';
import OrderSummary from './OrderSummary';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../Assets/Css/Cart/MobileCart.scss';

const MobileCart = ({ 
  cartProducts, 
  handleQuantityChange, 
  handleDelete,
  subtotal,
  itemCount,
  onProceedToBuy 
}) => {
  return (
    <div className="mobile-cart">
      <div className="cart-info">
        <span className="item-count">{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</span>
        <span className="swipe-hint">Swipe to see more items</span>
      </div>
      
      <div className="cart-items-section">
        <Swiper
          modules={[Pagination]}
          spaceBetween={1}
          slidesPerView={1}
          pagination={{
            type: 'fraction',
          }}
          className="cart-swiper"
        >
          {cartProducts.map((product, index) => (
            <SwiperSlide key={`${product.product_id}-${product.variant_name}`}>
              <div className="product-counter">
                {index + 1} of {cartProducts.length}
              </div>
              <CartProduct
                product={product}
                onQuantityChange={handleQuantityChange}
                onDelete={() => handleDelete(product.product_id, product.variant_name)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="order-summary-section">
        <OrderSummary
          subtotal={subtotal}
          itemCount={itemCount}
          onProceedToBuy={onProceedToBuy}
        />
      </div>
    </div>
  );
};

export default MobileCart;
