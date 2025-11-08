import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Moon, Sun, Menu } from "lucide-react";
import { AxiosSecure } from "../../Hooks/AxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";



export default function Admin() {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const axiosSecure = AxiosSecure();
  const navigation = useNavigate()

  // Close drawer on resize up to lg to ensure correct state
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(true);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);


  // useEffect(() => {
  //   document.documentElement.setAttribute("data-theme", theme);
  // }, [theme]);

  const data = useMemo(
    () => [
      { name: "Jan", value: 12 },
      { name: "Feb", value: 15 },
      { name: "Mar", value: 18 },
      { name: "Apr", value: 16 },
      { name: "May", value: 20 },
      { name: "Jun", value: 21 },
    ],
    []
  );

  const rows = [
    { id: "#1001", name: "Arif Khan", total: 4200, status: "Paid" },
    { id: "#1002", name: "Nusrat Jahan", total: 1999, status: "Pending" },
    { id: "#1003", name: "Mehedi Hasan", total: 650, status: "Refunded" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosSecure.get("/ordersA");
        setOrders(response.data);
      } catch (error) {
        navigation("/login")
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [axiosSecure]);

  const logout = async () => {
    const res = await axiosSecure.post("/logout");
    if (res?.data?.message) {
      Swal.fire({
        title: " logout Successfully",
        // text: "Your order has been placed successfully. Thank you for shopping with us!",
        icon: "success",
      });
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
                <a className="active">Dashboard</a>
              </li>
              <li>
                <a>Orders</a>
              </li>
              <li>
                <a>Upload Images</a>
              </li>
              <li>
                <a onClick={logout}>Log Out</a>
              </li>
              {/* <li>
                <a>Reports</a>
              </li>
              <li>
                <a>Settings</a>
              </li> */}
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
          {/* <div className="flex-none">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() =>
                setTheme((t) => (t === "light" ? "emerald" : "light"))
              }
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              <span className="ml-2 hidden sm:inline">Theme</span>
            </button>
          </div> */}
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="stats bg-base-100 shadow">
              <div className="stat">
                <div className="stat-title">Revenue</div>
                <div className="stat-value">৳27k</div>
                <div className="stat-desc">+8% MoM</div>
              </div>
            </div>
            <div className="stats bg-base-100 shadow">
              <div className="stat">
                <div className="stat-title">Orders</div>
                {/* <div className="stat-value">590</div> */}
                <div className="stat-desc">{orders.length}</div>
              </div>
            </div>
            {/* <div className="stats bg-base-100 shadow">
              <div className="stat">
                <div className="stat-title">Customers</div>
                <div className="stat-value">148</div>
                <div className="stat-desc">+12%</div>
              </div>
            </div> */}
          </section>

          {/* Chart */}
          <section className="card bg-base-100 shadow mt-4">
            <div className="card-body">
              <h2 className="card-title">Monthly Overview</h2>
              <div className="w-full h-56 sm:h-64 lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Table */}
          <section className="card bg-base-100 shadow mt-4">
            <div className="card-body">
              <h2 className="card-title">Recent Orders</h2>
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <td className="font-mono">{r.id}</td>
                        <td>{r.name}</td>
                        <td>৳{r.total.toLocaleString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              r.status === "Paid"
                                ? "badge-success"
                                : r.status === "Pending"
                                ? "badge-warning"
                                : "badge-neutral"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
