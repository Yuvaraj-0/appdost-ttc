import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function DiagnosticPage() {
  const [data, setData] = useState({
    orders: [],
    orderItems: [],
    products: []
  });
  const [fixing, setFixing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch all orders
    const { data: orders } = await supabase
      .from('orders')
      .select('*');

    // Fetch all order_items
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('*');

    // Fetch all products
    const { data: products } = await supabase
      .from('products')
      .select('*');

    setData({ orders: orders || [], orderItems: orderItems || [], products: products || [] });

    console.log('=== DATABASE DIAGNOSTIC ===');
    console.log('Orders:', orders);
    console.log('Order Items:', orderItems);
    console.log('Products:', products);
  };

  const fixOrders = async () => {
    setFixing(true);
    try {
      // Get all orders with zero or incorrect total_amount
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total_amount');

      for (const order of orders || []) {
        // Get order items for this order
        const { data: items } = await supabase
          .from('order_items')
          .select('quantity, price')
          .eq('order_id', order.id);

        if (items && items.length > 0) {
          // Calculate correct total
          const correctTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
          
          if (correctTotal !== order.total_amount) {
            console.log(`Fixing order ${order.id}: ${order.total_amount} -> ${correctTotal}`);
            
            // Update the order
            await supabase
              .from('orders')
              .update({ total_amount: correctTotal })
              .eq('id', order.id);
          }
        }
      }
      
      alert('Orders fixed! Refresh to see changes.');
      fetchData();
    } catch (error) {
      console.error('Error fixing orders:', error);
      alert('Error fixing orders: ' + error.message);
    } finally {
      setFixing(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Database Diagnostic</h1>
      
      <div className="mb-6 flex gap-4">
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Refresh Data
        </button>
        <button
          onClick={fixOrders}
          disabled={fixing}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400"
        >
          {fixing ? 'Fixing...' : 'Fix Order Totals'}
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Orders ({data.orders.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="p-3 font-mono text-sm">{order.id.substring(0, 8)}</td>
                    <td className="p-3 font-bold">₹{order.total_amount || 0}</td>
                    <td className="p-3">{order.status}</td>
                    <td className="p-3">{order.payment_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Order Items ({data.orderItems.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Product ID</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.orderItems.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-3 font-mono text-sm">{item.order_id?.substring(0, 8)}</td>
                    <td className="p-3 font-mono text-sm">{item.product_id?.substring(0, 8)}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">₹{item.price}</td>
                    <td className="p-3 font-bold">₹{item.quantity * item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Products ({data.products.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map(product => (
                  <tr key={product.id} className="border-b">
                    <td className="p-3 font-mono text-sm">{product.id?.substring(0, 8)}</td>
                    <td className="p-3 font-semibold">{product.name}</td>
                    <td className="p-3">₹{product.price}</td>
                    <td className="p-3">{product.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
