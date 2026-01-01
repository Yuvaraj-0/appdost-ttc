import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { HiCheckCircle, HiCreditCard, HiCash, HiTruck, HiUser, HiLocationMarker, HiPhone } from "react-icons/hi";
import { MdImage } from "react-icons/md";

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("paypal"); // "paypal" or "cod"

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
        <p className="text-gray-600">You need to be logged in to checkout.</p>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <HiCreditCard className="mx-auto text-8xl text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add items to your cart before checkout</p>
            <button
              onClick={() => navigate("/productlist")}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 font-semibold shadow-lg"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const createOrder = async (paymentStatus = "pending", transactionId = null) => {
    try {
      // Save order to database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: session.user.id,
            total_amount: getCartTotal(),
            payment_method: paymentMethod,
            payment_status: paymentStatus,
            transaction_id: transactionId,
            shipping_address: JSON.stringify(shippingInfo),
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Save order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const handleCODOrder = async (e) => {
    e.preventDefault();

    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city) {
      alert("Please fill in all required shipping information");
      return;
    }

    try {
      const order = await createOrder("pending", null);
      setOrderDetails(order);
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      alert("Failed to place order: " + error.message);
    }
  };

  // PayPal Integration
  const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture",
  };

  if (orderPlaced && orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
              <HiCheckCircle className="mx-auto text-8xl mb-4" />
              <h2 className="text-4xl font-bold mb-2">
                Order Placed Successfully!
              </h2>
              <p className="text-lg opacity-90">
                Thank you for your purchase. We'll send you a confirmation email shortly.
              </p>
            </div>
            
            <div className="p-8">
              <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Order ID</span>
                  <span className="text-xl font-bold text-blue-600">#{orderDetails.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">₹{orderDetails.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Payment Method</span>
                  <span className="font-semibold text-gray-900 uppercase">{orderDetails.payment_method}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate("/productlist")}
                  className="flex-1 bg-gray-100 text-gray-800 px-6 py-4 rounded-xl hover:bg-gray-200 font-bold transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
          <p className="text-gray-600">Complete your order in a few simple steps</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Shipping Information */}
          <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <HiTruck className="text-3xl text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Shipping Information</h3>
            </div>

            <form className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <HiUser className="text-blue-600" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <HiLocationMarker className="text-blue-600" />
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="123 Main Street, Apartment 4B"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="400001"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <HiPhone className="text-blue-600" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="+91 1234567890"
                />
              </div>
            </form>
          </div>

          {/* Right: Order Summary & Payment */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white shadow-lg rounded-2xl p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <MdImage className="text-gray-400 text-2xl" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-bold text-blue-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-3">
                  <span>Total</span>
                  <span className="text-blue-600">₹{getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <HiCreditCard className="text-3xl text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Payment Method</h3>
              </div>

              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-500 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <HiCreditCard className="text-2xl text-blue-600" />
                  <span className="font-bold text-gray-900">PayPal</span>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-500 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <HiCash className="text-2xl text-green-600" />
                  <span className="font-bold text-gray-900">Cash on Delivery</span>
                </label>
              </div>

            {paymentMethod === "paypal" ? (
              <div className="mt-4">
                <PayPalScriptProvider options={initialOptions}>
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: (getCartTotal() / 83).toFixed(2), // Convert INR to USD (approx)
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order.capture();
                      try {
                        const order = await createOrder(
                          "completed",
                          details.id
                        );
                        setOrderDetails(order);
                        setOrderPlaced(true);
                        clearCart();
                      } catch (error) {
                        alert("Error completing order: " + error.message);
                      }
                    }}
                    onError={(err) => {
                      console.error("PayPal error:", err);
                      alert("Payment failed. Please try again.");
                    }}
                  />
                </PayPalScriptProvider>
              </div>
              ) : (
                <button
                  onClick={handleCODOrder}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <HiCheckCircle className="text-2xl" />
                  <span>Place Order (Cash on Delivery)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
