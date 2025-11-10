import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home/Home";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Admin from "./pages/Admin/Admin";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import AllOrders from "./pages/allOrders/AllOrders";
import Dashboard from "./pages/Admin/Dashboard";
import ProductsPage from "./pages/Admin/ProductsPage";
import ProductsUpload from "./pages/Admin/ProductsUpload";
import ProductEdit from "./pages/Admin/ProductEdit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "register",
    Component: Register,
  },
  {
    path: "login",
    Component: Login,
  },
  {
    path: "admin",
    Component: Admin,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "orders",
        Component: AllOrders,
      },
      {
        path: "productsImage",
        Component: ProductsPage,
      },
      {
        path: "productsUpload",
        Component: ProductsUpload,
      },
      {
        path: "productEdit/:id",
        Component: ProductEdit,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
