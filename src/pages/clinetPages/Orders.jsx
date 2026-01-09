import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import {
  HiShoppingBag,
  HiClock,
  HiCheckCircle,
  HiTruck,
  HiX,
  HiChevronDown,
  HiChevronUp,
  HiEye,
} from "react-icons/hi";

export default function Orders() {
  const { session } = UserAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (session?.user) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Fetch orders for the current user
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items with product details for each order
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from("order_items")
            .select(
              `
              *,
              products (
                id,
                name,
                image_url,
                description,
                category
              )
            `
            )
            .eq("order_id", order.id);

          if (itemsError) throw itemsError;

          return {
            ...order,
            items: itemsData || [],
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <HiClock className="text-xl" />,
      processing: <HiShoppingBag className="text-xl" />,
      shipped: <HiTruck className="text-xl" />,
      delivered: <HiCheckCircle className="text-xl" />,
      cancelled: <HiX className="text-xl" />,
    };
    return icons[status] || <HiClock className="text-xl" />;
  };

  const getPaymentStatusColor = (status) => {
    return status === "completed"
      ? "bg-green-100 text-green-800"
      : status === "failed"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            View and track all your orders in one place
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <HiShoppingBag className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here!
            </p>
            <Link
              to="/productlist"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-semibold text-gray-900">
                          #{order.id}
                        </p>
                      </div>
                      <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
                      <div className="hidden sm:block">
                        <p className="text-sm text-gray-600">Placed On</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="hidden md:block w-px h-10 bg-gray-300"></div>
                      <div className="hidden md:block">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-semibold text-gray-900">
                          ₹{order.total_amount?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <button
                        onClick={() => toggleOrderExpand(order.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {expandedOrders[order.id] ? (
                          <HiChevronUp className="text-xl text-gray-600" />
                        ) : (
                          <HiChevronDown className="text-xl text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mobile View Additional Info */}
                  <div className="sm:hidden mt-4 flex gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total</p>
                      <p className="font-semibold text-gray-900">
                        ₹{order.total_amount?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details - Expandable */}
                {expandedOrders[order.id] && (
                  <div className="p-6">
                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Order Items ({order.items.length})
                      </h3>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                          >
                            <div className="relative">
                              <img
                                src={
                                  item.products?.image_url ||
                                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
                                }
                                alt={item.products?.name || "Product"}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1 truncate">
                                {item.products?.name || "Product Not Available"}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {item.products?.description || "No description"}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-600">
                                  Quantity: {item.quantity}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="font-semibold text-gray-900">
                                  ₹{item.price?.toFixed(2)} each
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="font-bold text-gray-900">
                                  Total: ₹
                                  {(item.quantity * item.price)?.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            {item.products && (
                              <button
                                onClick={() => setSelectedOrder(item)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-200 rounded-lg h-fit"
                                title="View Details"
                              >
                                <HiEye className="text-xl text-gray-600" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Information Grid */}
                    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                      {/* Payment Information */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Payment Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Payment Method:
                            </span>
                            <span className="font-semibold text-gray-900 uppercase">
                              {order.payment_method}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Payment Status:
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(
                                order.payment_status
                              )}`}
                            >
                              {order.payment_status.toUpperCase()}
                            </span>
                          </div>
                          {order.transaction_id && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Transaction ID:
                              </span>
                              <span className="font-mono text-xs text-gray-900">
                                {order.transaction_id}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Shipping Information */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Shipping Address
                        </h4>
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {order.shipping_address || "No address provided"}
                        </p>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                      {order.status === "delivered" && (
                        <Link
                          to="/productlist"
                          className="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                        >
                          Reorder Items
                        </Link>
                      )}
                      {order.status === "pending" && (
                        <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                          Cancel Order
                        </button>
                      )}
                      {(order.status === "shipped" ||
                        order.status === "processing") && (
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                          Track Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedOrder && selectedOrder.products && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Product Details
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiX className="text-2xl text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <img
                  src={
                    selectedOrder.products.image_url ||
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop"
                  }
                  alt={selectedOrder.products.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedOrder.products.name}
                  </h4>
                  {selectedOrder.products.category && (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                      {selectedOrder.products.category}
                    </span>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h5>
                  <p className="text-gray-700">
                    {selectedOrder.products.description ||
                      "No description available"}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-semibold text-gray-900 mb-2">
                    Order Details
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Quantity Ordered:</span>
                      <p className="font-semibold text-gray-900">
                        {selectedOrder.quantity}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Price per Unit:</span>
                      <p className="font-semibold text-gray-900">
                        ₹{selectedOrder.price?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Subtotal:</span>
                      <p className="font-bold text-gray-900 text-lg">
                        ₹
                        {(
                          selectedOrder.quantity * selectedOrder.price
                        )?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Link
                    to={`/product/${selectedOrder.products.id}`}
                    className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    onClick={() => setSelectedOrder(null)}
                  >
                    View Product Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
