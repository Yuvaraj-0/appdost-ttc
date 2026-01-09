import { Link, useLocation } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { HiShoppingCart, HiUser, HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";

export default function UserNavbar() {
  const { session, signOut } = UserAuth();
  const { getCartCount } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const cartCount = getCartCount();

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-gray-900 shadow-lg py-2" 
        : "bg-gray-900/95 backdrop-blur-md shadow-md py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl md:text-3xl font-extrabold text-white hover:scale-105 transition-transform"
          >
            E-Shop
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`font-semibold transition-colors ${isActive('/') ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}>
              Home
            </Link>
            <Link to="/productlist" className={`font-semibold transition-colors ${isActive('/productlist') ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}>
              Products
            </Link>
            <Link to="/orders" className={`font-semibold transition-colors ${isActive('/orders') ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}>
              Orders
            </Link>
            <Link to="/testimonials" className={`font-semibold transition-colors ${isActive('/testimonials') ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}>
              Testimonials
            </Link>
            <Link to="/contact" className={`font-semibold transition-colors ${isActive('/contact') ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}>
              Contact Us
            </Link>
            <Link to="/about" className={`font-semibold transition-colors ${isActive('/about') ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}>
              About Us
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <HiShoppingCart className="text-2xl text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {session?.user?.email ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-600 hover:scale-110">
                    <HiUser className="text-white" />
                  </div>
                  <HiChevronDown className={`text-white transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 origin-top-right transform transition-all duration-300 ease-out"
                    style={{
                      animation: 'slideDown 0.3s ease-out forwards'
                    }}
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      to="/order-details"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Order Details
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/signin"
                  className="px-4 py-2 text-white font-semibold hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <HiX className="text-2xl text-white" />
            ) : (
              <HiMenu className="text-2xl text-white" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in-down">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isActive('/') ? 'bg-gray-700 text-white border-l-4 border-white' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/productlist"
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isActive('/productlist') ? 'bg-gray-700 text-white border-l-4 border-white' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/orders"
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isActive('/orders') ? 'bg-gray-700 text-white border-l-4 border-white' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                to="/testimonials"
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isActive('/testimonials') ? 'bg-gray-700 text-white border-l-4 border-white' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isActive('/contact') ? 'bg-gray-700 text-white border-l-4 border-white' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isActive('/about') ? 'bg-gray-700 text-white border-l-4 border-white' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/cart"
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-between ${isActive('/cart') ? 'bg-gray-700 text-white border-l-4 border-white' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              {session?.user?.email ? (
                <>
                  <div className="px-4 py-2 bg-gray-800 rounded-lg">
                    <span className="text-sm font-semibold text-white">{session.user.email}</span>
                  </div>
                  <Link
                    to="/order-details"
                    className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg font-semibold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Order Details
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-left hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="px-4 py-2 text-white font-semibold hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
