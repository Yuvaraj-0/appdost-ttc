import { Link } from "react-router-dom";
import { HiShoppingCart, HiMail, HiPhone, HiLocationMarker, HiHeart } from "react-icons/hi";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-primary-100">Get the latest deals and updates delivered to your inbox</p>
            </div>
            <div className="w-full md:w-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white w-full md:w-80"
              />
              <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white mb-4">
              <HiShoppingCart className="text-3xl text-primary-500" />
              <span className="text-2xl font-bold">E-Shop</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your one-stop destination for premium quality products at unbeatable prices. Shop with confidence and enjoy a seamless shopping experience.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <FaLinkedin className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <FaYoutube className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/productlist" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> My Account
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Track Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Wishlist
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <HiLocationMarker className="text-primary-500 text-xl mt-1 flex-shrink-0" />
                <span className="text-sm">123 Commerce Street, Business District, City 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <HiPhone className="text-primary-500 text-xl flex-shrink-0" />
                <a href="tel:+1234567890" className="text-sm hover:text-primary-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <HiMail className="text-primary-500 text-xl flex-shrink-0" />
                <a href="mailto:support@eshop.com" className="text-sm hover:text-primary-400 transition-colors">
                  support@eshop.com
                </a>
              </li>
            </ul>
            
            {/* Trust Badges */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free Shipping Over ₹500</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} E-Shop. All rights reserved. Made with <HiHeart className="inline text-red-500" /> by E-Shop Team
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">We Accept:</span>
              <div className="flex gap-2">
                <div className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-800">VISA</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-800">MC</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-800">AMEX</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-800">PayPal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
