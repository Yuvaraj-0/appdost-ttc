import { useEffect, useState } from "react";
import { getAllProducts } from "../../adminServices/addproduct";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { HiShoppingCart, HiEye, HiCheckCircle, HiSearch, HiFilter, HiStar, HiHeart, HiViewGrid, HiViewList } from "react-icons/hi";
import { MdImage } from "react-icons/md";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const [addedProducts, setAddedProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    if (priceRange !== "All") {
      const ranges = {
        "Under 500": [0, 500],
        "500-1000": [500, 1000],
        "1000-5000": [1000, 5000],
        "Above 5000": [5000, Infinity]
      };
      const [min, max] = ranges[priceRange];
      filtered = filtered.filter(product => product.price >= min && product.price < max);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, priceRange, sortBy, products]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedProducts((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProducts((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const categories = ["All", ...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Skeleton Loading */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 h-48 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-56 bg-gray-200 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:1000px_100%]"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <p className="p-8 text-red-500 text-center text-lg">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Animation */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover Amazing Products</h1>
          <p className="text-xl opacity-90 mb-6">Handpicked collections just for you</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2">
              <HiCheckCircle className="text-2xl" />
              <span>Premium Quality</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2">
              <HiCheckCircle className="text-2xl" />
              <span>Fast Shipping</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2">
              <HiCheckCircle className="text-2xl" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section with Sticky */}
      <div className="bg-white shadow-lg sticky top-16 z-40 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            {/* Search */}
            <div className="relative md:col-span-5">
              <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative md:col-span-3">
              <HiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none appearance-none bg-white cursor-pointer transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="md:col-span-2">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none appearance-none bg-white cursor-pointer transition-colors"
              >
                <option value="All">All Prices</option>
                <option value="Under 500">Under ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-5000">₹1000 - ₹5000</option>
                <option value="Above 5000">Above ₹5000</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none appearance-none bg-white cursor-pointer transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A-Z</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-medium">
              Showing <span className="text-primary-600 font-bold">{filteredProducts.length}</span> of <span className="font-bold">{products.length}</span> products
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="Grid View"
              >
                <HiViewGrid className="text-xl" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="List View"
              >
                <HiViewList className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center">
                <HiSearch className="text-6xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-6">We couldn't find any products matching your search criteria</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setPriceRange("All");
                }}
                className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-6"}>
            {filteredProducts.map((product, index) => 
              viewMode === "grid" ? (
                // Grid View
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-glow transition-all duration-500 transform hover:-translate-y-2 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* IMAGE with Wishlist */}
                  <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-gray-50">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex items-center justify-center">
                        <MdImage className="text-gray-300 text-7xl" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.stock === 0 && (
                        <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          Out of Stock
                        </span>
                      )}
                      {product.stock > 0 && product.stock <= 5 && (
                        <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                          Only {product.stock} Left!
                        </span>
                      )}
                    </div>
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <HiHeart className={`text-xl ${wishlist[product.id] ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform">
                        <HiEye className="text-2xl text-primary-600" />
                      </div>
                    </div>
                  </Link>

                  {/* CONTENT */}
                  <div className="p-5">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <HiStar key={i} className={`text-sm ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                    </div>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-lg mb-1 hover:text-primary-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">{product.category}</p>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                      {product.description || "Premium quality product with excellent features"}
                    </p>

                    {/* Price and Stock */}
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-3xl font-bold text-primary-600">₹{product.price}</div>
                        <div className="text-xs text-gray-500 line-through">₹{(product.price * 1.3).toFixed(0)}</div>
                      </div>
                      <div className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        product.stock > 10 ? 'bg-green-100 text-green-700' : 
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Sold Out'}
                      </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                          product.stock === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : addedProducts[product.id]
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-xl hover:scale-105'
                        }`}
                      >
                        {addedProducts[product.id] ? (
                          <>
                            <HiCheckCircle className="text-xl" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <HiShoppingCart className="text-xl" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-glow transition-all duration-300 group animate-fade-in"
                >
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    {/* IMAGE */}
                    <Link to={`/product/${product.id}`} className="md:w-64 flex-shrink-0 relative overflow-hidden rounded-xl bg-gray-50">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-48 md:h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <MdImage className="text-gray-300 text-6xl" />
                        </div>
                      )}
                      
                      {product.stock === 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                          Out of Stock
                        </span>
                      )}
                    </Link>

                    {/* CONTENT */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <HiStar key={i} className={`text-lg ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">(4.0) 128 reviews</span>
                        </div>

                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-bold text-2xl mb-2 hover:text-primary-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <p className="text-sm text-primary-600 uppercase tracking-wider mb-3 font-semibold">{product.category}</p>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {product.description || "Premium quality product with excellent features and outstanding performance"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div>
                            <div className="text-4xl font-bold text-primary-600">₹{product.price}</div>
                            <div className="text-sm text-gray-500 line-through">₹{(product.price * 1.3).toFixed(0)}</div>
                          </div>
                          <div className={`text-sm font-bold px-4 py-2 rounded-full ${
                            product.stock > 10 ? 'bg-green-100 text-green-700' : 
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Sold Out'}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                          >
                            <HiHeart className={`text-2xl ${wishlist[product.id] ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className={`py-3 px-8 rounded-xl font-bold flex items-center gap-2 transition-all ${
                              product.stock === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : addedProducts[product.id]
                                ? 'bg-green-500 text-white shadow-lg'
                                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-xl'
                            }`}
                          >
                            {addedProducts[product.id] ? (
                              <>
                                <HiCheckCircle className="text-xl" />
                                <span>Added to Cart</span>
                              </>
                            ) : (
                              <>
                                <HiShoppingCart className="text-xl" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                          <Link
                            to={`/product/${product.id}`}
                            className="py-3 px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold flex items-center gap-2 transition-all"
                          >
                            <HiEye className="text-xl" />
                            <span>View Details</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
