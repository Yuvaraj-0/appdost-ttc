import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/productlist",
        element: <ProductList />,
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
      {
        path: "/cart",
        element: <PrivateRoute><Cart /></PrivateRoute>,
      },
      {
        path: "/checkout",
        element: <PrivateRoute><Checkout /></PrivateRoute>,
      },
      {
        path: "/order",
        element: <PrivateRoute><Order /></PrivateRoute>,
      },
    ],
  },
]);

export default router;
