import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { HiShoppingBag, HiShoppingCart, HiTruck, HiClock, HiCheckCircle, HiGift, HiTrendingUp, HiHeart } from "react-icons/hi";
import { MdImage } from "react-icons/md";

export default function Dashboard() {
  const { session, signOut } = UserAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

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

        // Calculate stats
        const totalSpent = ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
        const completed = ordersData?.filter(o => o.payment_status === 'completed').length || 0;
        const pending = ordersData?.filter(o => o.payment_status !== 'completed').length || 0;
        
        setStats({
          totalOrders: ordersData?.length || 0,
          totalSpent,
          completedOrders: completed,
          pendingOrders: pending,
        });
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="h-64 bg-gray-200 rounded-3xl animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 text-white rounded-3xl p-10 mb-8 shadow-2xl relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <HiShoppingBag className="text-5xl" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome Back!</h1>
                  <p className="text-xl text-primary-100">
                    {session?.user?.email || "Valued Customer"}
                  </p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl text-center">
                <p className="text-sm text-primary-100 mb-1">Member Since</p>
                <p className="text-2xl font-bold">
                  {new Date(session?.user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Total Orders</p>
                <p className="text-4xl font-bold text-blue-600">{stats.totalOrders}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <HiShoppingCart className="text-3xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Total Spent</p>
                <p className="text-4xl font-bold text-green-600">₹{stats.totalSpent.toFixed(0)}</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <HiTrendingUp className="text-3xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Completed</p>
                <p className="text-4xl font-bold text-purple-600">{stats.completedOrders}</p>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                <HiCheckCircle className="text-3xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Pending</p>
                <p className="text-4xl font-bold text-orange-600">{stats.pendingOrders}</p>
              </div>
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                <HiClock className="text-3xl text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <Link
            to="/productlist"
            className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <HiShoppingBag className="text-4xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Shop Now</h3>
                <p className="text-primary-100 text-sm">Explore latest products</p>
              </div>
            </div>
            <p className="text-white/80">Discover amazing deals →</p>
          </Link>

          <Link
            to="/cart"
            className="bg-gradient-to-br from-green-500 to-emerald-700 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <HiShoppingCart className="text-4xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">My Cart</h3>
                <p className="text-green-100 text-sm">View your selections</p>
              </div>
            </div>
            <p className="text-white/80">Ready to checkout →</p>
          </Link>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 group cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <HiGift className="text-4xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Rewards</h3>
                <p className="text-orange-100 text-sm">Exclusive offers</p>
              </div>
            </div>
            <p className="text-white/80">Check your rewards →</p>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Recent Orders</h2>
            {orders.length > 3 && (
              <Link to="/orders" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2">
                View All
                <span>→</span>
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <HiShoppingCart className="text-6xl text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No Orders Yet</h3>
              <p className="text-gray-500 text-lg mb-8">Start exploring our amazing products</p>
              <Link
                to="/productlist"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 font-bold transition-all shadow-lg hover:shadow-xl"
              >
                <HiShoppingBag className="text-xl" />
                <span>Start Shopping</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {recentOrders.map((order, index) => (
                <div
                  key={order.id}
                  className="border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-primary-200 transition-all group animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <p className="font-bold text-xl text-gray-900">Order #{order.id.substring(0, 8)}</p>
                          {order.order_items && order.order_items.length > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                              {order.order_items[0]?.products?.name || "Product"}
                              {order.order_items.length > 1 && (
                                <span className="text-gray-500"> + {order.order_items.length - 1} more item{order.order_items.length - 1 > 1 ? 's' : ''}</span>
                              )}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${
                            order.payment_status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.payment_status === "completed" ? (
                            <>
                              <HiCheckCircle className="text-sm" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <HiClock className="text-sm" />
                              <span>Processing</span>
                            </>
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
                    <div className="text-left lg:text-right">
                      <p className="text-sm text-gray-500 mb-1 font-semibold">Order Total</p>
                      <p className="text-4xl font-bold text-primary-600">
                        ₹{order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <HiShoppingBag className="text-gray-400" />
                      Order Items ({order.order_items?.length || 0})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.order_items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors">
                          {item.products?.image_url ? (
                            <img
                              src={item.products.image_url}
                              alt={item.products.name}
                              className="w-16 h-16 object-cover rounded-lg shadow-md"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                              <MdImage className="text-gray-400 text-2xl" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm truncate">
                              {item.products?.name || "Product"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} × ₹{item.price}
                            </p>
                            <p className="text-sm font-bold text-primary-600 mt-1">
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <HiTruck className="text-xl" />
                      <span className="text-sm">
                        {order.payment_status === "completed" ? "Delivered" : "In Transit"}
                      </span>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
                      Track Order →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Personalized Recommendations */}
        {orders.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-500 to-purple-700 text-white rounded-3xl p-8 shadow-2xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <HiHeart className="text-4xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Just For You</h2>
                <p className="text-indigo-100">Personalized recommendations based on your shopping history</p>
              </div>
            </div>
            <Link
              to="/productlist"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-indigo-50 font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <span>Discover More</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
