import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useCart } from "../../context/CartContext";
import { HiArrowLeft, HiShoppingCart, HiCheckCircle, HiPlus, HiMinus, HiStar, HiTruck, HiShieldCheck, HiRefresh, HiHeart, HiShare } from "react-icons/hi";
import { MdImage, MdVerified } from "react-icons/md";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    setTimeout(() => setAddedToCart(false), 3000);
  };

  // Mock images array - in real app, would come from database
  const productImages = product?.image_url ? [product.image_url, product.image_url, product.image_url] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-[500px] bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Product</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <Link to="/productlist" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 font-semibold transition-colors">
            <HiArrowLeft />
            Back to Products
          </Link>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed</p>
          <Link to="/productlist" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 font-semibold transition-colors">
            <HiArrowLeft />
            Browse Products
          </Link>
        </div>
      </div>
    );

  const reviews = [
    { id: 1, name: "Rajesh Kumar", rating: 5, comment: "Excellent product! Highly recommended.", date: "2 days ago" },
    { id: 2, name: "Priya Sharma", rating: 4, comment: "Good quality, fast delivery.", date: "5 days ago" },
    { id: 3, name: "Amit Patel", rating: 5, comment: "Amazing value for money!", date: "1 week ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/productlist" className="hover:text-primary-600 transition-colors">Products</Link>
            <span>/</span>
            <Link to="/productlist" className="hover:text-primary-600 transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold truncate max-w-md">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 animate-fade-in-up">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Product Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group">
                {product.image_url ? (
                  <div className="relative overflow-hidden rounded-2xl bg-gray-50 shadow-lg">
                    <img
                      src={productImages[selectedImage]}
                      alt={product.name}
                      className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                          Only {product.stock} Left - Hurry!
                        </span>
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-xl">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-[500px] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex items-center justify-center rounded-2xl shadow-lg">
                    <MdImage className="text-gray-300 text-9xl" />
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative overflow-hidden rounded-xl transition-all ${
                      selectedImage === idx
                        ? 'ring-4 ring-primary-500 shadow-lg scale-105'
                        : 'hover:scale-105 shadow-md'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-28 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-primary-600 font-bold uppercase tracking-wider flex items-center gap-2">
                    <MdVerified className="text-lg" />
                    {product.category}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="w-12 h-12 bg-gray-100 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors group"
                    >
                      <HiHeart className={`text-2xl ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400 group-hover:text-red-500'}`} />
                    </button>
                    <button className="w-12 h-12 bg-gray-100 hover:bg-primary-50 rounded-full flex items-center justify-center transition-colors group">
                      <HiShare className="text-2xl text-gray-400 group-hover:text-primary-500" />
                    </button>
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} className={`text-2xl ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">4.0</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm text-gray-600">328 reviews</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm text-green-600 font-semibold">845 sold</span>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-5xl font-bold text-primary-600">₹{product.price}</div>
                    <div>
                      <div className="text-xl text-gray-500 line-through">₹{(product.price * 1.3).toFixed(0)}</div>
                      <div className="text-green-600 font-bold text-lg">Save 23%</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Inclusive of all taxes • Free Shipping</p>
                </div>
              </div>

              {/* Availability */}
              <div className={`flex items-center gap-3 px-6 py-4 rounded-xl ${
                product.stock > 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
              }`}>
                <HiCheckCircle className={`text-2xl ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`} />
                <div>
                  <p className={`font-bold ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {product.stock > 0 ? `In Stock` : "Currently Unavailable"}
                  </p>
                  {product.stock > 0 && (
                    <p className="text-sm text-green-600">{product.stock} units available</p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <HiTruck className="text-2xl text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Free Delivery</p>
                    <p className="text-xs text-gray-600">Above ₹999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <HiShieldCheck className="text-2xl text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Secure Payment</p>
                    <p className="text-xs text-gray-600">100% Protected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <HiRefresh className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Easy Returns</p>
                    <p className="text-xs text-gray-600">30 Days Policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MdVerified className="text-2xl text-orange-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Verified Quality</p>
                    <p className="text-xs text-gray-600">Premium Grade</p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div>
                  <label className="block font-bold text-gray-900 mb-3 text-lg">Select Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-2xl font-bold transition-all hover:scale-110 shadow-md"
                    >
                      <HiMinus />
                    </button>
                    <div className="flex-1 max-w-[120px]">
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
                        className="w-full text-center text-2xl font-bold border-2 border-gray-300 rounded-xl py-3 focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-2xl font-bold transition-all hover:scale-110 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <HiPlus />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {product.stock <= 10 && `Only ${product.stock} items left in stock`}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-5 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
                    product.stock === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : addedToCart
                      ? "bg-green-500 hover:bg-green-600 text-black scale-105"
                      : "bg-primary-600 hover:bg-primary-700 text-black hover:scale-105"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <HiCheckCircle className="text-2xl animate-bounce" />
                      <span>Added to Cart Successfully!</span>
                    </>
                  ) : (
                    <>
                      <HiShoppingCart className="text-2xl" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/cart"
                    className="bg-orange-500 text-white py-4 px-6 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <HiShoppingCart className="text-xl" />
                    <span>View Cart</span>
                  </Link>
                  <Link
                    to="/checkout"
                    className="bg-indigo-500 text-white py-4 px-6 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 animate-fade-in-up">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex-1 py-4 px-6 font-bold transition-colors ${
                  activeTab === "description"
                    ? "text-primary-600 border-b-4 border-primary-600 bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 py-4 px-6 font-bold transition-colors ${
                  activeTab === "reviews"
                    ? "text-primary-600 border-b-4 border-primary-600 bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Reviews (328)
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`flex-1 py-4 px-6 font-bold transition-colors ${
                  activeTab === "shipping"
                    ? "text-primary-600 border-b-4 border-primary-600 bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Shipping Info
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === "description" && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description || "Experience the perfect blend of quality and style with this amazing product. Crafted with care and attention to detail, it's designed to exceed your expectations and deliver outstanding performance."}
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-2">
                        <span className="text-primary-500">✓</span> Premium quality materials
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary-500">✓</span> Long-lasting durability
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary-500">✓</span> Modern design
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary-500">✓</span> Easy to use
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-2">Specifications:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li><span className="font-semibold">Category:</span> {product.category}</li>
                      <li><span className="font-semibold">SKU:</span> {product.id}</li>
                      <li><span className="font-semibold">Availability:</span> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</li>
                      <li><span className="font-semibold">Warranty:</span> 1 Year</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                  <button className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                    Write a Review
                  </button>
                </div>
                
                <div className="bg-primary-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary-600">4.0</div>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <HiStar key={i} className={`text-xl ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">328 reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map(star => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm font-semibold w-12">{star} Star</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 10}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{review.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <HiStar key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Shipping Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 rounded-2xl">
                    <HiTruck className="text-4xl text-primary-600 mb-3" />
                    <h4 className="font-bold text-lg mb-2">Standard Delivery</h4>
                    <p className="text-gray-700 mb-2">Delivered in 5-7 business days</p>
                    <p className="text-2xl font-bold text-primary-600">FREE</p>
                    <p className="text-sm text-gray-600">On orders above ₹999</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl">
                    <HiTruck className="text-4xl text-orange-600 mb-3" />
                    <h4 className="font-bold text-lg mb-2">Express Delivery</h4>
                    <p className="text-gray-700 mb-2">Delivered in 2-3 business days</p>
                    <p className="text-2xl font-bold text-orange-600">₹99</p>
                    <p className="text-sm text-gray-600">Get it faster!</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h4 className="font-bold text-lg mb-3">Return Policy</h4>
                  <p className="text-gray-700 mb-4">We offer a 30-day return policy for all our products. If you're not completely satisfied, you can return the item for a full refund or exchange.</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Product must be unused and in original packaging
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Free return pickup available
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Refund processed within 7-10 business days
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
