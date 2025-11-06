import { useState } from "react";
import axios from "axios";
import { AxiosSecure } from "../../Hooks/AxiosSecure";

export default function OrderSidebar({ selected, price, subtotal, total }) {
  const [email, setEmail] = useState(""); // store user input
  const [orders, setOrders] = useState([]); // store fetched orders
  const [loading, setLoading] = useState(false);
  const axiosSecure = AxiosSecure();
  console.log(orders);

  const handleFetchOrders = async () => {
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Enter Your Email",
      });
    }

    setLoading(true);
    try {
      const response = await axiosSecure.get(`/orders?email=${email}`);
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="lg:col-span-1">
      <div className="rounded-xl border border-base-300 bg-base-100 p-4 sticky top-6">
        <h3 className="font-bold">Your order</h3>
        <div className="divider my-2" />

        {/* Email Input */}
        {!orders.length && (
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleFetchOrders}
              disabled={!email || loading}
            >
              {loading ? "Loading..." : "Show Orders"}
            </button>
          </div>
        )}

        {/* Orders List */}
        {orders.length > 0 &&
          orders.map((order) => (
            <div
              key={order._id}
              className="mt-4 border border-base-300 rounded-xl bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex gap-4"
            >
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={order.product?.img}
                  alt={order.product?.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/80x80?text=No+Image";
                  }}
                />
              </div>

              {/* Order Info */}
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-base-content">
                  {order.product?.name}
                </h4>
                <p className="text-sm text-base-content/70">
                  Quantity: <span className="font-medium">{order.qty}</span>
                </p>
                <p className="text-sm text-base-content/70">
                  Buyer: <span className="font-medium">{order.name}</span>
                </p>
                <p className="text-sm text-base-content/70">
                  Phone: <span className="font-medium">{order.phone}</span>
                </p>
                <p className="text-xs text-base-content/50">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Pricing Summary */}
              <div className="text-right">
                <p className="text-sm font-medium opacity-70">Subtotal</p>
                <p className="text-sm font-bold">{order.status}</p>
                {/* <p className="text-xs text-base-content/50">
                  + Shipping ৳{order.pricing?.shipping}
                </p> */}
                {/* <div className="divider my-1" /> */}
                <p className="text-base font-bold text-primary">
                  ৳{order.pricing?.total.toLocaleString("bn-BD")}
                </p>
              </div>
            </div>
          ))}

        {/* Initial Selected Product */}
        {/* {orders.length === 0 && selected && (
          <div className="flex items-center gap-3 mt-3">
            <img
              src={selected?.img}
              alt={selected?.name}
              className="h-14 w-14 rounded object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/80x80?text=Image";
              }}
            />
            <div className="flex-1">
              <div className="font-medium leading-tight">{selected?.name}</div>
              <div className="text-xs opacity-70">Quantity × 1</div>
            </div>
            <div className="text-sm">৳{price.toLocaleString("bn-BD")}</div>
          </div>
        )} */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed border-base-300 rounded-xl bg-base-100 shadow-sm">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No Orders"
              className="w-20 h-20 opacity-80 mb-4"
            />
            <h2 className="text-lg font-semibold text-base-content">
              No Orders Yet
            </h2>
            <p className="text-sm text-base-content/70 mt-1 max-w-xs">
              You haven’t placed any orders yet. Once you order something, it
              will appear here.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
