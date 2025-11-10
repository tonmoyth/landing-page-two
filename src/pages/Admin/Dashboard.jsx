import React, { useEffect, useState } from "react";
import { parseISO, format } from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AxiosSecure } from "../../Hooks/AxiosSecure";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const axiosSecure = AxiosSecure();
  const navigation = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosSecure.get("/ordersA");
        setOrders(response.data);
      } catch (error) {
        navigation("/login");
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [axiosSecure]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const res = await axiosSecure.get("/orders/recent?limit=5");
        setRecentOrders(res.data);
      } catch (err) {
        console.error("Error fetching recent orders:", err);
      }
    };

    fetchRecentOrders();
  }, []);

  // Create monthly overview
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }), // Jan, Feb, ...
    total: 0,
  }));

  orders.forEach((order) => {
    const date = parseISO(order.createdAt);
    const monthIndex = date.getMonth(); // 0-11
    monthlyData[monthIndex].total += order.pricing?.total || 0;
  });

  // Total Revenue
  const totalSum = orders.reduce(
    (acc, order) => acc + (order.pricing?.total || 0),
    0
  );

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="stats bg-base-100 shadow">
          <div className="stat">
            <div className="stat-title">Revenue</div>
            <div className="stat-value">৳{totalSum.toLocaleString()}</div>
          </div>
        </div>
        <div className="stats bg-base-100 shadow">
          <div className="stat">
            <div className="stat-title">Orders</div>
            <div className="stat-value">{orders.length}</div>
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="card bg-base-100 shadow mt-4">
        <div className="card-body">
          <h2 className="card-title">Monthly Overview</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `৳${value}`} />
                <Bar dataKey="total" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Recent Orders Table */}
      <section className="card bg-base-100 shadow mt-4">
        <div className="card-body">
          <h2 className="card-title">Recent Orders</h2>
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Customer Name</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders?.map((r) => (
                  <tr key={r._id}>
                    <td className="font-mono">{r.product.name}</td>
                    <td>{r.name}</td>
                    <td>৳{r.pricing?.total.toLocaleString()}</td>
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
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
