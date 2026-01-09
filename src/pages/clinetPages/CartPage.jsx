import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { HiShoppingCart, HiTrash, HiPlus, HiMinus, HiArrowRight, HiTag, HiGift, HiHeart, HiShoppingBag } from "react-icons/hi";
import { MdImage } from "react-icons/md";
import { useState } from "react";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
  } = useCart();

  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [removingItems, setRemovingItems] = useState({});
  const [savedItems, setSavedItems] = useState([]);

  const handleRemove = (itemId) => {
    setRemovingItems(prev => ({ ...prev, [itemId]: true }));
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItems(prev => ({ ...prev, [itemId]: false }));
    }, 300);
  };

  const handleSaveForLater = (item) => {
    setSavedItems(prev => [...prev, item]);
    handleRemove(item.id);
  };

  const handleBuyNow = (item) => {
    // Navigate to checkout with this specific item
    navigate('/checkout', { state: { singleItem: item } });
  };

  const applyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoApplied(true);
    }
  };

  const subtotal = getCartTotal();
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 animate-fade-in-up">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <HiShoppingCart className="text-6xl text-gray-300" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Discover amazing products and start adding them to your cart!
            </p>
            <Link
              to="/productlist"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-primary-700 hover:to-indigo-700 font-bold transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              <span>Start Shopping</span>
              <HiArrowRight className="text-xl" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600 text-lg">Review your items and proceed to checkout</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items - Etsy Style */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all ${
                  removingItems[item.id] ? 'opacity-0 scale-95' : 'opacity-100'
                }`}
                style={{ transitionDuration: '300ms' }}
              >
                {/* Seller/Category Header */}
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">
                    {item.category || 'E-Shop'}
                  </p>
                </div>

                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-28 h-28 object-cover rounded-md hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="w-28 h-28 bg-gray-200 flex items-center justify-center rounded-md">
                          <MdImage className="text-gray-400 text-4xl" />
                        </div>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                              {item.name}
                            </h3>
                          </Link>
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Price */}
                        <div className="ml-4 text-right flex-shrink-0">
                          <p className="text-xl font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500 line-through">₹{(item.price * 1.2 * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Sale Badge */}
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          20% OFF - Sale ends soon
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                          <HiMinus className="text-gray-600 text-sm" />
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-12 text-center border border-gray-300 rounded py-1 text-sm font-semibold"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                          <HiPlus className="text-gray-600 text-sm" />
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 text-sm">
                        <button
                          onClick={() => handleBuyNow(item)}
                          className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                        >
                          Buy now
                        </button>
                        <button
                          onClick={() => handleSaveForLater(item)}
                          className="text-gray-700 hover:text-gray-900 font-semibold hover:underline"
                        >
                          Save for later
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-gray-700 hover:text-gray-900 font-semibold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Shipping:</span> FREE {shipping === 0 ? '✓' : `(Get it by adding ₹${(1000 - subtotal).toFixed(0)} more)`}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Saved for Later Section */}
            {savedItems.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <HiHeart className="text-2xl" />
                    Saved for Later ({savedItems.length} items)
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {savedItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={item.image_url || 'https://via.placeholder.com/150'}
                        alt={item.name}
                        className="w-full h-24 object-cover rounded-md mb-2"
                      />
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-sm font-bold text-gray-900">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-24 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <HiShoppingCart className="text-primary-600" />
                Order Summary
              </h2>

              {/* Promo Code */}
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <HiTag className="text-orange-600 text-xl" />
                  <label className="font-bold text-gray-900">Have a promo code?</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                    disabled={promoApplied}
                  />
                  <button
                    onClick={applyPromo}
                    disabled={promoApplied}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      promoApplied
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    {promoApplied ? '✓' : 'Apply'}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 font-semibold text-sm mt-2 flex items-center gap-1">
                    ✓ Code applied! You saved 10%
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600 font-semibold">Subtotal ({getCartCount()} items)</span>
                  <span className="font-bold text-lg">₹{subtotal.toFixed(2)}</span>
                </div>
                
                {promoApplied && (
                  <div className="flex justify-between items-center pb-4 border-b text-green-600">
                    <span className="font-semibold">Discount (10%)</span>
                    <span className="font-bold text-lg">-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600 font-semibold">Shipping</span>
                  <span className={`font-bold text-lg ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600 font-semibold">
                      Add ₹{(1000 - subtotal).toFixed(0)} more for FREE shipping!
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t-2">
                  <span className="text-2xl font-bold text-gray-900">Total</span>
                  <span className="text-4xl font-bold text-primary-600">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="w-full bg-blue-400 text-black px-6 py-5 rounded-2xl font-bold text-lg hover:bg-green-400 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 transform hover:scale-105"
                >
                  <span>Proceed to Checkout</span>
                  <HiArrowRight className="text-2xl" />
                </Link>
                
                <Link
                  to="/productlist"
                  className="w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue Shopping</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
