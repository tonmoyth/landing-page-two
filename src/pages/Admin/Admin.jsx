import React, { useEffect, useState } from "react";

import { Menu } from "lucide-react";
import { AxiosSecure } from "../../Hooks/AxiosSecure";
import Swal from "sweetalert2";
import { NavLink, Outlet } from "react-router";

export default function Admin() {
  const [open, setOpen] = useState(false);
  const axiosSecure = AxiosSecure();

  // Close drawer on resize up to lg to ensure correct state
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(true);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const logout = async () => {
    // Step 1: Confirmation alert দেখাও
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    });

    // Step 2: যদি ইউজার 'Yes' ক্লিক করে
    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.post(
          "/logout",
          {},
          { withCredentials: true }
        );

        if (res?.data?.message) {
          // Step 3: Success alert দেখাও
          await Swal.fire({
            title: "Logged out successfully!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          // Step 4: Page reload করাও
          window.location.reload();
        }
      } catch (err) {
        Swal.fire({
          title: "Logout failed!",
          text: err.response?.data?.message || "Something went wrong.",
          icon: "error",
        });
      }
    }
  };
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      {/* Drawer Toggle (controlled) */}
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={open}
        onChange={() => setOpen(!open)}
        aria-hidden
      />

      {/* Sidebar */}
      <div className="drawer-side z-40">
        {/* Overlay for small screens */}
        <label
          htmlFor="sidebar-drawer"
          className="drawer-overlay"
          onClick={() => setOpen(false)}
        />
        <aside className="w-64 lg:w-72 bg-base-100 border-r border-base-300 h-full lg:h-screen flex flex-col">
          <div className="p-4 border-b border-base-300 flex items-center justify-between">
            <span className="text-lg font-bold">Zentrix</span>
            <button
              className="btn btn-ghost btn-xs lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="menu p-4 gap-1">
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "active font-bold text-blue-600"
                      : "text-gray-700"
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/orders"
                  className={({ isActive }) =>
                    isActive
                      ? "active font-bold text-blue-600"
                      : "text-gray-700"
                  }
                >
                  Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/productsImage"
                  className={({ isActive }) =>
                    isActive
                      ? "active font-bold text-blue-600"
                      : "text-gray-700"
                  }
                >
                  Products
                </NavLink>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="w-full text-left text-gray-700 hover:text-red-500"
                >
                  Log Out
                </button>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-base-300 text-xs opacity-60">
            © {new Date().getFullYear()} Zentrix
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-10 px-2 sm:px-4">
          <div className="flex-none lg:hidden">
            <button
              className="btn btn-ghost btn-square"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="sidebar-drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 text-base sm:text-lg font-semibold">
            Dashboard
          </div>
        </header>

        {/* Content */}
        <Outlet></Outlet>
      </div>
    </div>
  );
}
