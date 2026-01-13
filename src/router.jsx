import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import OrderDetails from "./routes/Dashboard";
import PrivateRoute from "./components/PrivateRoutes";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./routes/adminroutes/Dashboard";
import AdminLayout from "./layout/adminlayout/Layout";
import UserLayout from "./layout/userlayout/Layout";
import AddProduct from "./pages/adminPages/product/AddProduct";
import ManageProducts from "./pages/adminPages/product/ManageProducts";
import ManageOrders from "./pages/adminPages/orders/ManageOrders";
import DiagnosticPage from "./pages/adminPages/DiagnosticPage";
import ProductList from "./pages/clinetPages/ProductList";
import ProductDetail from "./pages/clinetPages/ProductDetail";
import CartPage from "./pages/clinetPages/CartPage";
import Checkout from "./pages/clinetPages/Checkout";
import Home from "./pages/clinetPages/Home";
import Testimonials from "./pages/clinetPages/Testimonials";
import Contact from "./pages/clinetPages/Contact";
import About from "./pages/clinetPages/About";
import Orders from "./pages/clinetPages/Orders";

const ErrorBoundary = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <a href="/" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
        Go to Home
      </a>
    </div>
  </div>
);

export const router = createBrowserRouter([
  { 
    path: "/signup", 
    element: (
      <ProtectedRoute>
        <Signup />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />
  },
  { 
    path: "/signin", 
    element: (
      <ProtectedRoute>
        <Signin />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />
  },

  // Admin Routes - Protected with AdminRoute
  {
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/admindashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/addproduct",
        element: <AddProduct />,
      },
      {
        path: "/admin/products",
        element: <ManageProducts />,
      },
      {
        path: "/admin/orders",
        element: <ManageOrders />,
      },
      {
        path: "/admin/diagnostic",
        element: <DiagnosticPage />,
      },
    ],
  },

  // User Routes - Public but some pages require authentication
  {
    element: <UserLayout />, // or PublicLayout if you want separate UI
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/productlist", element: <ProductList /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/testimonials", element: <Testimonials /> },
    ],
  }
,  
  {
    element: <UserLayout />,
    errorElement: <ErrorBoundary />,
    children: [
    //   {
    //     path: "/",
    //     element: (
    //       <PrivateRoute>
    //         <Home />
    //       </PrivateRoute> 
    //     ),
    //   },
    //   {
    //     path: "/order-details",
    //     element: (
    //       <PrivateRoute>
    //         <OrderDetails />
    //       </PrivateRoute>
    //     ),
    //   },
    //   {
    //     path: "/dashboard",
    //     element: (
    //       <PrivateRoute>
    //         <OrderDetails />
    //       </PrivateRoute>
    //     ),
    //   },
    //   {
    //     path: "/productlist",
    //     element: (
    //       <PrivateRoute>
    //         <ProductList />
    //       </PrivateRoute>
    //     ),
    //   },
    //   {
    //     path: "/product/:id",
    //     element: (
    //       <PrivateRoute>
    //         <ProductDetail />
    //       </PrivateRoute>
    //     ),
    //   },

      {
        path: "/cart",
        element: (
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        ),
      },
      // {
      //   path: "/testimonials",
      //   element: (
      //     <PrivateRoute>
      //       <Testimonials />
      //     </PrivateRoute>
      //   ),
      // },
      // {
      //   path: "/contact",
      //   element: (
      //     <PrivateRoute>
      //       <Contact />
      //     </PrivateRoute>
      //   ),
      // },
      // {
      //   path: "/about",
      //   element: (
      //     <PrivateRoute>
      //       <About />
      //     </PrivateRoute>
      //   ),
      // },
    ],
  },
  // Catch-all route for 404
  {
    path: "*",
    element: <ErrorBoundary />,
  },
]);
