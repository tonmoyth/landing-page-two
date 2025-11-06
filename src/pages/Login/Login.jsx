import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AxiosSecure } from "../../Hooks/AxiosSecure";
import Swal from "sweetalert2";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const axiosSecure = AxiosSecure();
  const navigation = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosSecure.post("/login", form);

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back, ${response.data.user?.name || "User"}!`,
        timer: 2000,
        showConfirmButton: false,
      });
      navigation("/admin");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed!",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-sm shadow-md bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="username"
              value={form.username}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>
          <p className="text-sm text-center mt-3">
            Don't have an account?{" "}
            <Link to="/register" className="link link-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
