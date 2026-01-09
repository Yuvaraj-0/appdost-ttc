import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(
            *,
            products(name, image_url)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Fetch user emails separately
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(order => order.user_id).filter(Boolean))];
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, email")
          .in("id", userIds);

        if (!profilesError && profiles) {
          // Map emails to orders
          const emailMap = {};
          profiles.forEach(profile => {
            emailMap[profile.id] = profile.email;
          });

          const ordersWithEmails = data.map(order => ({
            ...order,
            user_email: emailMap[order.user_id] || "N/A"
          }));

          setOrders(ordersWithEmails);
        } else {
          setOrders(data || []);
        }
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert("Order status updated successfully");
    } catch (error) {
      alert("Error updating order: " + error.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No orders found
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    Customer: {order.user_email || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date:{" "}
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    ₹{order.total_amount.toFixed(2)}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      order.payment_status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    Payment: {order.payment_status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4 mb-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.order_items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {item.products?.image_url && (
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.products?.name || "Product"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₹{item.price} = ₹
                          {(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              {order.shipping_address && (
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-semibold mb-2">Shipping Address:</h4>
                  <div className="text-sm text-gray-700">
                    {(() => {
                      try {
                        const addr = JSON.parse(order.shipping_address);
                        return (
                          <>
                            <p>{addr.fullName}</p>
                            <p>{addr.address}</p>
                            <p>
                              {addr.city}, {addr.postalCode}
                            </p>
                            {addr.phone && <p>Phone: {addr.phone}</p>}
                          </>
                        );
                      } catch {
                        return <p>{order.shipping_address}</p>;
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Order Status */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Order Status:</h4>
                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="border rounded px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>

                  <span className="text-sm text-gray-500">
                    Payment Method: {order.payment_method.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
