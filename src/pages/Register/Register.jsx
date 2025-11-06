import React, { useState } from "react";
import { AxiosSecure } from "../../Hooks/AxiosSecure";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const axiosSecure = AxiosSecure();
  const navigation = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosSecure.post("/register", form);
      // success alert
      Swal.fire({
        icon: "success",
        title: "Register Successful",
        text: `Welcome back, ${response.data.username || "User"}!`,
        timer: 2000,
        showConfirmButton: false,
      });
      navigation("/login");
    } catch (error) {
      // error alert
      Swal.fire({
        icon: "error",
        title: "Register Failed",
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
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
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
              Register
            </button>
          </form>
          <p className="text-sm text-center mt-3">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
