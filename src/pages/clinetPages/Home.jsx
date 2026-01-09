import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllProducts } from "../../adminServices/addproduct";
import { useCart } from "../../context/CartContext";
import { HiShoppingCart, HiTruck, HiShieldCheck, HiStar, HiArrowRight, HiChevronLeft, HiChevronRight, HiHeart, HiEye, HiClock, HiTag, HiGift, HiLightningBolt, HiUserGroup, HiCheckCircle, HiTrendingUp, HiChatAlt2 } from "react-icons/hi";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [viewerCount, setViewerCount] = useState(78);
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56
  });
  const { addToCart } = useCart();

  // Dynamic viewer count
  useEffect(() => {
    const updateViewers = () => {
      setViewerCount(prev => {
        // Random change between -5 and +8 to simulate realistic fluctuation
        const change = Math.floor(Math.random() * 14) - 5;
        const newCount = prev + change;
        // Keep between 450 and 650
        return Math.max(450, Math.min(250, newCount));
      });
    };

    // Update every 3-8 seconds randomly
    const scheduleNextUpdate = () => {
      const delay = Math.floor(Math.random() * 5000) + 3000; // 3-8 seconds
      return setTimeout(() => {
        updateViewers();
        scheduleNextUpdate();
      }, delay);
    };

    const timeout = scheduleNextUpdate();
    return () => clearTimeout(timeout);
  }, []);

  // Countdown timer for flash sale
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset to 24 hours when timer ends
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Hero Carousel Images
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop",
      title: "Summer Sale 2026",
      subtitle: "Up to 50% OFF on Selected Items",
      cta: "Shop Now",
      bg: "from-orange-500 to-red-600"
    },
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop",
      title: "New Arrivals",
      subtitle: "Discover the Latest Trends",
      cta: "Explore",
      bg: "from-blue-500 to-purple-600"
    },
    {
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=600&fit=crop",
      title: "Premium Collection",
      subtitle: "Quality Products at Best Prices",
      cta: "View Collection",
      bg: "from-green-500 to-teal-600"
    },
    {
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&h=600&fit=crop",
      title: "Tech Deals",
      subtitle: "Latest Gadgets & Electronics",
      cta: "Shop Tech",
      bg: "from-indigo-500 to-blue-600"
    }
  ];

  const features = [
    {
      icon: HiTruck,
      title: "Free Shipping",
      description: "On orders over ₹999"
    },
    {
      icon: HiShieldCheck,
      title: "Secure Payment",
      description: "100% secure transactions"
    },
    {
      icon: HiStar,
      title: "Best Quality",
      description: "Premium products guaranteed"
    },
    {
      icon: HiClock,
      title: "24/7 Support",
      description: "Always here to help"
    }
  ];

  const categories = [
    {
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
      color: "bg-blue-500"
    },
    {
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
      color: "bg-pink-500"
    },
    {
      name: "Home & Living",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop",
      color: "bg-green-500"
    },
    {
      name: "Sports",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
      color: "bg-orange-500"
    },
    {
      name: "Books",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop",
      color: "bg-purple-500"
    },
    {
      name: "Toys & Games",
      image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop",
      color: "bg-yellow-500"
    }
  ];

  // Auto-scroll carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Load products
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Dummy products for when no products are loaded
  const dummyProducts = [
    { id: 1, name: "Premium Headphones", price: 2999, image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", description: "High-quality wireless headphones with noise cancellation" },
    { id: 2, name: "Smart Watch", price: 4999, image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", description: "Fitness tracker with heart rate monitor" },
    { id: 3, name: "Laptop Bag", price: 1499, image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", description: "Durable and stylish laptop carrying case" },
    { id: 4, name: "Wireless Mouse", price: 799, image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop", description: "Ergonomic wireless mouse for comfort" },
    { id: 5, name: "Coffee Maker", price: 3499, image_url: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop", description: "Automatic coffee machine for fresh brew" },
    { id: 6, name: "Running Shoes", price: 2499, image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", description: "Comfortable sports shoes for running" },
    { id: 7, name: "Backpack", price: 1999, image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", description: "Multi-pocket travel backpack" },
    { id: 8, name: "Sunglasses", price: 1299, image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", description: "UV protection polarized sunglasses" },
    { id: 9, name: "Water Bottle", price: 499, image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop", description: "Insulated stainless steel bottle" },
    { id: 10, name: "Yoga Mat", price: 899, image_url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop", description: "Non-slip exercise yoga mat" }
  ];

  // Get best sellers (first 6 products)
  const bestSellers = products.length > 0 ? products.slice(0, 6) : dummyProducts.slice(0, 6);
  
  // Get featured products (next 4 products)
  const featuredProducts = products.length > 0 ? products.slice(6, 10) : dummyProducts.slice(6, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Offer Marquee */}
      <div className="bg-white text-red-600 py-2 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content">
            <span className="mx-8 font-semibold flex items-center gap-2">
              <HiGift className="text-xl" />
               FLASH SALE: Get 50% OFF on all electronics! Use code: FLASH50
            </span>
            <span className="mx-8 font-semibold flex items-center gap-2">
              <HiLightningBolt className="text-xl" />
               Limited Time Offer: Free Shipping on orders above ₹999!
            </span>
            <span className="mx-8 font-semibold flex items-center gap-2">
              <HiTag className="text-xl" />
               New Year Special: Buy 2 Get 1 FREE on selected items!
            </span>
            <span className="mx-8 font-semibold flex items-center gap-2">
              <HiGift className="text-xl" />
               Weekend Deal: Extra 20% OFF on fashion products!
            </span>
            <span className="mx-8 font-semibold flex items-center gap-2">
              <HiLightningBolt className="text-xl" />
               Clearance Sale: Up to 70% OFF - Don't Miss Out!
            </span>
            {/* Duplicate content for seamless loop */}
            <span className="mx-8 font-semibold flex items-center gap-2">
              <HiGift className="text-xl" />
               FLASH SALE: Get 50% OFF on all electronics! Use code: FLASH50
            </span>
            <span className="mx-8 font-semibold flex items-center gap-2">
              <HiLightningBolt className="text-xl" />
               Limited Time Offer: Free Shipping on orders above ₹999!
            </span>
            <span className="mx-8 font-semibold flex items-center gap-2">
              <HiTag className="text-xl" />
               New Year Special: Buy 2 Get 1 FREE on selected items!
            </span>
            <span className="mx-8 font-semibold flex items-center gap-2">
              <HiGift className="text-xl" />
               Weekend Deal: Extra 20% OFF on fashion products!
            </span>
            <span className="mx-8 font-semibold flex items-center gap-2">
              <HiLightningBolt className="text-xl" />
               Clearance Sale: Up to 70% OFF - Don't Miss Out!
            </span>
          </div>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-gray-900">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-60`}></div>
            </div>
            <div className="relative h-full flex items-center justify-center text-center px-6">
              <div className="max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  {slide.subtitle}
                </p>
                <Link
                  to="/productlist"
                  className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-xl transform hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: '400ms' }}
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-3 rounded-full transition-all z-10"
        >
          <HiChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-3 rounded-full transition-all z-10"
        >
          <HiChevronRight className="text-2xl" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="text-2xl text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              to="/productlist"
              className="group relative overflow-hidden rounded-xl aspect-square bg-gray-200 hover:shadow-xl transition-all"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-sm">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <HiLightningBolt className="text-3xl text-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
            </div>
            <Link to="/productlist" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2">
              View All <HiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {bestSellers.map((product) => (
                <div key={product.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      BESTSELLER
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button className="bg-white p-2 rounded-full hover:bg-gray-100 transition-all">
                        <HiHeart className="text-xl text-red-500" />
                      </button>
                      <Link to={`/product/${product.id}`} className="bg-white p-2 rounded-full hover:bg-gray-100 transition-all">
                        <HiEye className="text-xl text-gray-700" />
                      </Link>
                    </div>
                  </div>
                  <div className="p-3">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm hover:text-primary-600">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-2">
                      <HiStar className="text-yellow-400 text-sm" />
                      <HiStar className="text-yellow-400 text-sm" />
                      <HiStar className="text-yellow-400 text-sm" />
                      <HiStar className="text-yellow-400 text-sm" />
                      <HiStar className="text-gray-300 text-sm" />
                      <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-all"
                      >
                        <HiShoppingCart className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Deals Banner */}
      <div className="relative h-[300px] overflow-hidden my-16">
        <img
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1920&h=600&fit=crop"
          alt="Deals"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90 flex items-center justify-center text-center px-6">
          <div>
            <HiTag className="text-6xl text-yellow-400 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Flash Deals - Today Only!
            </h2>
            <p className="text-xl text-white/90 mb-6">
              Limited time offers on selected products
            </p>
            <Link
              to="/productlist"
              className="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all shadow-xl"
            >
              Shop Deals Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/productlist" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2">
            See More <HiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&h=500&fit=crop"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    NEW
                  </div>
                </div>
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description || "Premium quality product with best features"}
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <HiStar key={star} className="text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">(5.0)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all font-semibold flex items-center gap-2"
                    >
                      <HiShoppingCart className="text-xl" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gift Section */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 py-20 my-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <HiGift className="text-6xl text-pink-600 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Perfect Gifts for Everyone
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Find the perfect gift for your loved ones from our curated collection
          </p>
          <Link
            to="/productlist"
            className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all"
          >
            Browse Gift Ideas
          </Link>
        </div>
      </div>

      {/* Flash Sale Countdown */}
      <div className="bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100 py-16 my-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-200 px-4 py-2 rounded-full mb-4">
              <HiLightningBolt className="text-2xl text-orange-600 animate-pulse" />
              <span className="text-orange-700 font-bold">⚡ FLASH SALE ⚡</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Ends Soon!</h2>
            <p className="text-gray-700 text-lg">Don't miss out on these incredible deals</p>
          </div>
          
          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 md:gap-8 mb-8">
            <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
              <div className="text-3xl md:text-5xl font-bold text-orange-600 mb-1">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-gray-600 text-xs md:text-sm font-semibold">HOURS</div>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
              <div className="text-3xl md:text-5xl font-bold text-orange-600 mb-1">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-gray-600 text-xs md:text-sm font-semibold">MINUTES</div>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
              <div className="text-3xl md:text-5xl font-bold text-orange-600 mb-1">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-gray-600 text-xs md:text-sm font-semibold">SECONDS</div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/productlist"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Shop Flash Sale Now
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Badges & Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 my-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <HiUserGroup className="text-5xl mx-auto mb-3 text-blue-600" />
              <div className="text-4xl font-bold mb-2 text-gray-900">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <HiShoppingCart className="text-5xl mx-auto mb-3 text-indigo-600" />
              <div className="text-4xl font-bold mb-2 text-gray-900">100K+</div>
              <div className="text-gray-600">Orders Delivered</div>
            </div>
            <div>
              <HiCheckCircle className="text-5xl mx-auto mb-3 text-green-600" />
              <div className="text-4xl font-bold mb-2 text-gray-900">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div>
              <HiTrendingUp className="text-5xl mx-auto mb-3 text-purple-600" />
              <div className="text-4xl font-bold mb-2 text-gray-900">4.8/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Shop With Us?</h2>
            <p className="text-gray-600 text-lg">Experience the difference of quality and service</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: HiShieldCheck,
                title: "Secure Shopping",
                description: "Your data is safe with SSL encryption and secure payment gateways"
              },
              {
                icon: HiTruck,
                title: "Fast Delivery",
                description: "Free shipping on orders above ₹999 with express delivery options"
              },
              {
                icon: HiChatAlt2,
                title: "24/7 Support",
                description: "Our dedicated team is always ready to help you anytime"
              },
              {
                icon: HiCheckCircle,
                title: "Easy Returns",
                description: "Hassle-free 30-day return policy with full refund guarantee"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-3xl text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 py-20 my-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Exclusive Deals & Updates
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            Subscribe to our newsletter and get 10% off on your first order!
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => {
            e.preventDefault();
            alert(`Thanks for subscribing with ${email}!`);
            setEmail("");
          }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-6 py-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-xl transition-all whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>
          <p className="text-gray-600 text-sm mt-4">🎁 Plus get a surprise gift on your birthday!</p>
        </div>
      </div>

      {/* Social Proof Banner */}
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 py-4 border-y border-green-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4">
            <HiLightningBolt className="text-2xl text-green-600 animate-bounce" />
            <p className="font-semibold text-lg text-gray-700">
              🔥 <span className="text-green-700 font-bold">523 people</span> are viewing products right now!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

