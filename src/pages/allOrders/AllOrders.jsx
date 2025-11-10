import React, { useState, useEffect } from "react";
import axios from "axios";
import { AxiosSecure } from "../../Hooks/AxiosSecure";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosSecure = AxiosSecure();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosSecure.get("/ordersA");
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // navigation("/login");
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [axiosSecure, refresh]);

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Optionally, send PATCH request
      await axiosSecure.patch(`/orders/${orderId}`, { status: newStatus });

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Order marked as ${newStatus}`,
        timer: 1500,
        showConfirmButton: false,
      });

      //  সফল হলে trigger পরিবর্তন করো
      setRefresh((prev) => !prev);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: `${err.message}`,
      });
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-4 lg:p-6 bg-white shadow rounded-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-3 lg:mb-0">
          Orders
        </h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder=" Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none p-2 rounded-lg w-full lg:w-80 transition"
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-900 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-center">Total</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-3">{order.name}</td>
                  <td className="px-4 py-3">{order.email}</td>
                  <td className="px-4 py-3">{order.phone}</td>
                  <td className="px-4 py-3">{order.product.name}</td>
                  <td className="px-4 py-3 text-center">{order.qty}</td>
                  <td className="px-4 py-3 text-center font-medium text-gray-800">
                    ৳{order.pricing.total}
                  </td>

                  {/* ✅ Dropdown for status change */}
                  <td className="px-4 py-3 text-center">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-md border focus:ring-1 focus:ring-blue-400 text-sm ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : order.status === "Delivered"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
