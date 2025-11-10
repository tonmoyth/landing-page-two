import axios from "axios";
import Swal from "sweetalert2"; // optional - সুন্দর অ্যালার্টের জন্য

const instance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Response interceptor for handling 401
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Swal.fire({
        icon: "warning",
        title: "Session expired",
        text: "Please log in again.",
        timer: 2500,
        showConfirmButton: false,
      });

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const AxiosSecure = () => {
  return instance;
};
