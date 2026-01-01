import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { HiShoppingCart, HiLogout, HiUser, HiHome, HiViewGrid } from "react-icons/hi";

export default function UserNavbar() {
  const { session, signOut } = UserAuth();
  const { getCartCount } = useCart();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-bold hover:text-blue-100 transition-colors">
            <HiShoppingCart className="text-3xl" />
            <span className="hidden sm:inline">E-Shop</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 font-medium transition-all"
            >
              <HiHome className="text-xl" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/productlist"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 font-medium transition-all"
            >
              <HiViewGrid className="text-xl" />
              <span>Products</span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 font-medium transition-all relative"
            >
              <HiShoppingCart className="text-xl" />
              <span>Cart</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-3">
            {session?.user?.email && (
              <div className="hidden lg:flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <HiUser className="text-lg" />
                <span className="text-sm font-medium">{session.user.email}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-colors shadow-md"
            >
              <HiLogout className="text-lg" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around pb-3 border-t border-white/10 pt-3">
          <Link to="/dashboard" className="flex flex-col items-center gap-1 text-xs hover:text-blue-200">
            <HiHome className="text-xl" />
            <span>Home</span>
          </Link>
          <Link to="/productlist" className="flex flex-col items-center gap-1 text-xs hover:text-blue-200">
            <HiViewGrid className="text-xl" />
            <span>Products</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center gap-1 text-xs hover:text-blue-200 relative">
            <HiShoppingCart className="text-xl" />
            <span>Cart</span>
            {getCartCount() > 0 && (
              <span className="absolute -top-1 right-2 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
