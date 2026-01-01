import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useCart } from "../../context/CartContext";
import { HiArrowLeft, HiShoppingCart, HiCheckCircle, HiPlus, HiMinus, HiStar, HiTruck, HiShieldCheck } from "react-icons/hi";
import { MdImage } from "react-icons/md";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error)
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 text-lg mb-4">Error: {error}</p>
        <Link to="/productlist" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div>
    );

  if (!product)
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 text-lg mb-4">Product not found</p>
        <Link to="/productlist" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            to="/productlist"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <HiArrowLeft className="text-xl" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-[500px] object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-full h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl">
                  <MdImage className="text-gray-400 text-8xl" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} className={`text-xl ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.0) 128 Reviews</span>
                </div>

                <div className="text-5xl font-bold text-blue-600 mb-6">
                  ₹{product.price}
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-4 pb-6 border-b">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  product.stock > 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <HiCheckCircle className={`text-xl ${
                    product.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={`font-semibold ${
                    product.stock > 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || "Experience the perfect blend of quality and style with this amazing product. Crafted with care and attention to detail, it's designed to exceed your expectations."}
                </p>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <HiTruck className="text-2xl text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-600">On orders above ₹999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HiShieldCheck className="text-2xl text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Secure Payment</p>
                    <p className="text-sm text-gray-600">100% secure transactions</p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div>
                  <label className="block font-bold text-gray-900 mb-3">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold transition-colors"
                    >
                      <HiMinus />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1))
                        )
                      }
                      className="w-24 text-center text-xl font-bold border-2 border-gray-300 rounded-lg py-3"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold transition-colors"
                    >
                      <HiPlus />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
                    product.stock === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : addedToCart
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <HiCheckCircle className="text-2xl" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <HiShoppingCart className="text-2xl" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <Link
                  to="/cart"
                  className="bg-orange-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
