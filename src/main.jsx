import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home/Home";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Admin from "./pages/Admin/Admin";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

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
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
