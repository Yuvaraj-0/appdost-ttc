import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import { HiShoppingBag, HiShoppingCart, HiCurrencyRupee, HiClock, HiTrendingUp, HiTrendingDown, HiUsers, HiChartBar, HiEye, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    todayRevenue: 0,
    monthRevenue: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueGrowth, setRevenueGrowth] = useState(0);
  const [ordersGrowth, setOrdersGrowth] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [profitLossData, setProfitLossData] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#1f2937', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch products count
        const { count: productsCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        // Fetch all orders
        const { data: allOrders, count: ordersCount, error: ordersError } = await supabase
          .from("orders")
          .select("*", { count: "exact" });

        console.log('Fetched orders:', ordersCount);
        console.log('Orders data:', allOrders);
        if (ordersError) console.error('Orders fetch error:', ordersError);

        // Fetch recent orders
        const { data: orders } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        // Fetch unique customers count (just count distinct user_ids from orders)
        const uniqueCustomers = new Set(allOrders?.filter(o => o.user_id).map(c => c.user_id) || []);

        // Calculate stats
        const totalRevenue = allOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
        const pendingOrders = allOrders?.filter((o) => o.status === "pending").length || 0;
        const completedOrders = allOrders?.filter((o) => o.status === "completed").length || 0;
        const cancelledOrders = allOrders?.filter((o) => o.status === "cancelled").length || 0;

        // Today's revenue
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayRevenue = allOrders?.filter(o => new Date(o.created_at) >= today)
          .reduce((sum, order) => sum + order.total_amount, 0) || 0;

        // This month's revenue
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthRevenue = allOrders?.filter(o => new Date(o.created_at) >= monthStart)
          .reduce((sum, order) => sum + order.total_amount, 0) || 0;

        // Last month's revenue for growth calculation
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        const lastMonthRevenue = allOrders?.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
        }).reduce((sum, order) => sum + order.total_amount, 0) || 0;

        // Calculate growth percentage
        const revenueGrowthCalc = lastMonthRevenue > 0 
          ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
          : 0;

        const lastMonthOrders = allOrders?.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
        }).length || 0;
        
        const thisMonthOrders = allOrders?.filter(o => new Date(o.created_at) >= monthStart).length || 0;
        const ordersGrowthCalc = lastMonthOrders > 0 
          ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 
          : 0;

        setStats({
          totalProducts: productsCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue,
          pendingOrders,
          completedOrders,
          cancelledOrders,
          todayRevenue,
          monthRevenue,
          totalCustomers: uniqueCustomers.size,
        });

        setRevenueGrowth(revenueGrowthCalc);
        setOrdersGrowth(ordersGrowthCalc);
        setRecentOrders(orders || []);

        // Generate sales data for last 7 days
        const salesByDay = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);
          
          const dayOrders = allOrders?.filter(o => {
            const orderDate = new Date(o.created_at);
            return orderDate >= date && orderDate < nextDay;
          }) || [];
          
          const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total_amount, 0);
          
          salesByDay.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sales: dayRevenue,
            orders: dayOrders.length
          });
        }
        setSalesData(salesByDay);

        // Generate monthly earnings for last 6 months
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          
          const monthOrders = allOrders?.filter(o => {
            const orderDate = new Date(o.created_at);
            return orderDate >= monthStart && orderDate <= monthEnd;
          }) || [];
          
          const revenue = monthOrders.reduce((sum, order) => sum + order.total_amount, 0);
          const estimatedCost = revenue * 0.6; // Assume 40% profit margin
          const profit = revenue - estimatedCost;
          
          monthlyData.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            earnings: revenue,
            profit: profit,
            loss: estimatedCost
          });
        }
        setMonthlyEarnings(monthlyData);

        // Profit/Loss data
        const profitData = monthlyData.map(m => ({
          month: m.month,
          profit: m.profit,
          loss: m.loss
        }));
        setProfitLossData(profitData);

        // Fetch products and calculate category-wise sales
        const { data: allProducts, error: productsError } = await supabase
          .from("products")
          .select("id, name, category");

        const { data: orderItems, error: orderItemsError } = await supabase
          .from("order_items")
          .select("product_id, quantity, price");

        console.log('Fetched products:', allProducts?.length || 0);
        console.log('Fetched order items:', orderItems?.length || 0);
        
        if (productsError) console.error('Products fetch error:', productsError);
        if (orderItemsError) console.error('Order items fetch error:', orderItemsError);

        if (allProducts && orderItems && orderItems.length > 0) {
          const categorySales = {};
          
          orderItems.forEach(item => {
            const product = allProducts.find(p => p.id === item.product_id);
            if (product && product.category) {
              if (!categorySales[product.category]) {
                categorySales[product.category] = 0;
              }
              categorySales[product.category] += item.quantity;
            }
          });

          const categoryChartData = Object.entries(categorySales).map(([category, value]) => ({
            name: category,
            value: value
          }));

          console.log('Category data:', categoryChartData);
          setCategoryData(categoryChartData);
        } else {
          console.log('No data for category chart');
          setCategoryData([]);
        }

        // Fetch top selling products from real data
        if (allProducts && orderItems && orderItems.length > 0) {
          const productSales = {};
          
          orderItems.forEach(item => {
            if (!productSales[item.product_id]) {
              productSales[item.product_id] = {
                quantity: 0,
                revenue: 0
              };
            }
            productSales[item.product_id].quantity += item.quantity;
            productSales[item.product_id].revenue += item.quantity * item.price;
          });

          const topProductsData = Object.entries(productSales)
            .map(([productId, data]) => {
              const product = allProducts.find(p => p.id === productId);
              return {
                name: product?.name || 'Unknown Product',
                sales: data.quantity,
                revenue: data.revenue
              };
            })
            .filter(p => p.revenue > 0) // Filter out products with 0 revenue
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

          console.log('Top Products Data:', topProductsData);
          setTopProducts(topProductsData.length > 0 ? topProductsData : []);
        } else {
          console.log('No order items found for top products');
          setTopProducts([]);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with E-Shop today.</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <HiCurrencyRupee className="text-3xl" />
            </div>
            {revenueGrowth >= 0 ? (
              <span className="flex items-center text-green-400 text-sm font-semibold">
                <HiTrendingUp className="mr-1" />
                {revenueGrowth.toFixed(1)}%
              </span>
            ) : (
              <span className="flex items-center text-red-400 text-sm font-semibold">
                <HiTrendingDown className="mr-1" />
                {Math.abs(revenueGrowth).toFixed(1)}%
              </span>
            )}
          </div>
          <div>
            <p className="text-sm opacity-80 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs opacity-60 mt-2">This Month: ₹{stats.monthRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <HiShoppingCart className="text-3xl" />
            </div>
            {ordersGrowth >= 0 ? (
              <span className="flex items-center text-green-200 text-sm font-semibold">
                <HiTrendingUp className="mr-1" />
                {ordersGrowth.toFixed(1)}%
              </span>
            ) : (
              <span className="flex items-center text-red-200 text-sm font-semibold">
                <HiTrendingDown className="mr-1" />
                {Math.abs(ordersGrowth).toFixed(1)}%
              </span>
            )}
          </div>
          <div>
            <p className="text-sm opacity-80 mb-1">Total Orders</p>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
            <p className="text-xs opacity-60 mt-2">Completed: {stats.completedOrders}</p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <HiShoppingBag className="text-3xl" />
            </div>
          </div>
          <div>
            <p className="text-sm opacity-80 mb-1">Total Products</p>
            <p className="text-3xl font-bold">{stats.totalProducts}</p>
            <p className="text-xs opacity-60 mt-2">Active listings</p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <HiUsers className="text-3xl" />
            </div>
          </div>
          <div>
            <p className="text-sm opacity-80 mb-1">Total Customers</p>
            <p className="text-3xl font-bold">{stats.totalCustomers}</p>
            <p className="text-xs opacity-60 mt-2">Unique buyers</p>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
            <HiClock className="text-4xl text-yellow-500" />
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.todayRevenue.toLocaleString()}</p>
            </div>
            <HiChartBar className="text-4xl text-green-500" />
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cancelled Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelledOrders}</p>
            </div>
            <HiXCircle className="text-4xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <HiTrendingUp className="mr-2 text-blue-600" />
            Sales Trend (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category-wise Orders Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <HiShoppingBag className="mr-2 text-purple-600" />
            Orders by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Earnings and Profit/Loss Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
        {/* Monthly Earnings */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <HiCurrencyRupee className="mr-2 text-green-600" />
            Monthly Earnings (Last 6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Profit vs Loss */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <HiChartBar className="mr-2 text-orange-600" />
            Profit vs Cost Analysis
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitLossData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="profit" fill="#10b981" name="Profit" />
              <Bar dataKey="loss" fill="#ef4444" name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <HiChartBar className="mr-2" />
          Quick Actions
        </h2>
        <div className="flex gap-4 flex-wrap">
          <Link
            to="/addproduct"
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg"
          >
            <HiShoppingBag className="transition-transform duration-300" />
            Add New Product
          </Link>
          <Link
            to="/admin/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg"
          >
            <HiEye className="transition-transform duration-300" />
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg"
          >
            <HiShoppingCart className="transition-transform duration-300" />
            View Orders
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <HiShoppingCart className="mr-2" />
            Recent Orders
          </h2>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <HiShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-900 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">#{order.id?.substring(0, 8) || 'N/A'}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span className="font-bold text-green-600">
                      ₹{order.total_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {order.payment_method}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <HiTrendingUp className="mr-2" />
            Top Selling Products
          </h2>
          {topProducts.length === 0 ? (
            <div className="text-center py-12">
              <HiTrendingUp className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500">No sales data yet</p>
            </div>
          ) : (
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{product.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">revenue</p>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Sales Analytics Summary */}
      <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl shadow-xl p-8 animate-fade-in hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '600ms' }}>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <HiChartBar className="mr-3 text-3xl" />
          Sales Analytics Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <p className="text-sm opacity-80 mb-2">Average Order Value</p>
            <p className="text-3xl font-bold">
              ₹{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : 0}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <p className="text-sm opacity-80 mb-2">Order Success Rate</p>
            <p className="text-3xl font-bold">
              {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <p className="text-sm opacity-80 mb-2">Revenue per Customer</p>
            <p className="text-3xl font-bold">
              ₹{stats.totalCustomers > 0 ? (stats.totalRevenue / stats.totalCustomers).toFixed(0) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;