import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AxiosSecure } from "../../Hooks/AxiosSecure";

export default function ProductsPage() {
  const [products, setProducts] = useState();
  const navigate = useNavigate();
  const axiosSecure = AxiosSecure();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosSecure.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-[cal(100vh-65px)]">
      {/* Top Add Product Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/admin/productsUpload")}
          className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors"
        >
          Add Product
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Products</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">${product.price}</td>

                  <td className="px-4 py-2">
                    <Link
                      to={`/admin/productEdit/${product._id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-400 py-4">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
