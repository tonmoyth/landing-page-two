import { useState } from "react";
import { AxiosSecure } from "../../Hooks/AxiosSecure";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function Register() {
  const axiosSecure = AxiosSecure();
  const navigate = useNavigate();
  

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin", 
  });


  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosSecure.post("/register", form,);

      // Success alert
      Swal.fire({
        icon: "success",
        title: "Register Successful",
        text: ` ${response.data.message || "User"}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (error) {
      // Error alert
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
  name="name"      
  placeholder="Name"
  value={form.name}
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
