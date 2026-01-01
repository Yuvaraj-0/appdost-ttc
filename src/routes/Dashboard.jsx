import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { HiShoppingBag, HiShoppingCart, HiTruck, HiClock, HiCheckCircle } from "react-icons/hi";
import { MdImage } from "react-icons/md";

export default function Dashboard() {
  const { session, signOut } = UserAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        // Fetch user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUserProfile(profile);

        // Fetch user orders
        const { data: ordersData, error } = await supabase
          .from("orders")
          .select("*, order_items(*, products(name, image_url))")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(ordersData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("Logged out");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-10 mb-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <HiShoppingBag className="text-4xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
              <p className="text-lg text-blue-100">
                {session?.user?.email || "Customer"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/productlist"
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <HiShoppingBag className="text-3xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Browse Products</h3>
                <p className="text-gray-600 text-sm">Explore our collection</p>
              </div>
            </div>
          </Link>

          <Link
            to="/cart"
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <HiShoppingCart className="text-3xl text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">My Cart</h3>
                <p className="text-gray-600 text-sm">View your items</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <HiTruck className="text-3xl text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Total Orders</h3>
                <p className="text-4xl font-bold text-purple-600 mt-1">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Orders</h2>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <HiShoppingCart className="mx-auto text-8xl text-gray-300 mb-6" />
              <p className="text-gray-500 text-lg mb-6">No orders yet</p>
              <Link
                to="/productlist"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-xl text-gray-900">Order #{order.id}</p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.payment_status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.payment_status === "completed" ? (
                            <span className="flex items-center gap-1">
                              <HiCheckCircle /> Completed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <HiClock /> Pending
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <HiClock className="text-gray-400" />
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-500 mb-1">Order Total</p>
                      <p className="text-3xl font-bold text-blue-600">
                        ₹{order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-bold text-gray-700 mb-3">Order Items:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.order_items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                          {item.products?.image_url ? (
                            <img
                              src={item.products.image_url}
                              alt={item.products.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <MdImage className="text-gray-400 text-2xl" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {item.products?.name || "Product"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                            <p className="text-sm font-bold text-blue-600">
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
