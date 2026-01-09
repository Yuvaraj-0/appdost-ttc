import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiHome, HiShoppingBag, HiShoppingCart, HiChevronRight, HiMenu, HiX } from "react-icons/hi";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: "/admindashboard", icon: HiHome, label: "Dashboard" },
    { path: "/addproduct", icon: HiShoppingBag, label: "Add Product" },
    { path: "/admin/products", icon: HiShoppingBag, label: "Manage Products" },
    { path: "/admin/orders", icon: HiShoppingCart, label: "Manage Orders" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`relative bg-gray-900 text-white transition-all duration-300 ${
        open ? "w-64" : "w-20"
      } min-h-screen`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-3 top-6 bg-gray-900 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-10"
      >
        {open ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
      </button>

      {/* Menu Items */}
      <nav className="pt-20 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className={`text-2xl ${active ? "text-gray-900" : ""}`} />
              {open && (
                <span className={`font-semibold ${active ? "text-gray-900" : ""}`}>
                  {item.label}
                </span>
              )}
              {open && active && <HiChevronRight className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {open && (
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Admin Panel</p>
            <p className="text-sm font-semibold">E-Shop v1.0</p>
          </div>
        </div>
      )}
    </div>
  );
}