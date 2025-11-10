import React, { useState } from "react";
import { CloudUpload } from "lucide-react";
import { AxiosSecure } from "../../Hooks/AxiosSecure";
import Swal from "sweetalert2";

export default function ProductsUpload() {
  const [productPreview, setProductPreview] = useState(null);
  const [iconPreview1, setIconPreview1] = useState(null);
  const [iconPreview2, setIconPreview2] = useState(null);

  const [productFile, setProductFile] = useState(null);
  const [iconFile1, setIconFile1] = useState(null);
  const [iconFile2, setIconFile2] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const axiosSecure = AxiosSecure();

  const handlePick = (e, which) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);

    if (which === "product") {
      setProductFile(file);
      setProductPreview(url);
    } else if (which === "icon1") {
      setIconFile1(file);
      setIconPreview1(url);
    } else if (which === "icon2") {
      setIconFile2(file);
      setIconPreview2(url);
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    //  Move this to an env var in real apps
    const apiKey = "8297f70706848e1ac2e3cddf2c4eff73";

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data?.success) return data.data.url;
    throw new Error("Image upload failed");
  };

  const handleUpload = async () => {
    if (!name || !price || !productFile || !iconFile1 || !iconFile2) {
      Swal.fire({
        icon: "warning",
        title: "Missing info",
        text: "Please fill all fields and select the product photo plus two icons.",
      });
      return;
    }

    setLoading(true);
    try {
      const [productImage, icon1, icon2] = await Promise.all([
        uploadToImgBB(productFile),
        uploadToImgBB(iconFile1),
        uploadToImgBB(iconFile2),
      ]);

      const payload = {
        name,
        price,
        productImage,
        icons: [icon1, icon2],
      };

      await axiosSecure.post("/addProducts", payload);

      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: "Product and icons uploaded successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      // Reset
      setName("");
      setPrice("");
      setProductPreview(null);
      setIconPreview1(null);
      setIconPreview2(null);
      setProductFile(null);
      setIconFile1(null);
      setIconFile2(null);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: "Something went wrong while uploading images.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-6 bg-gradient-to-b from-blue-50 to-indigo-50 min-h-[calc(100vh-65px)] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        <CloudUpload className="w-14 h-14 text-blue-500 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Add New Product
        </h1>
        <p className="text-gray-500 mb-6 text-center">
          Upload one product picture and two icons.
        </p>

        {/* Product Image */}
        <div
          className="w-full border-2 border-dashed border-blue-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors mb-4"
          onClick={() => document.getElementById("fileProduct").click()}
        >
          <input
            type="file"
            id="fileProduct"
            accept="image/*"
            onChange={(e) => handlePick(e, "product")}
            className="hidden"
          />
          {productPreview ? (
            <img
              src={productPreview}
              alt="Product Preview"
              className="max-h-52 rounded-xl shadow-lg object-contain"
            />
          ) : (
            <p className="text-gray-400">Click to upload product picture</p>
          )}
        </div>

        {/* Icons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
          {/* Icon 1 */}
          <div
            className="w-full border-2 border-dashed border-blue-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => document.getElementById("fileIcon1").click()}
          >
            <input
              type="file"
              id="fileIcon1"
              accept="image/*"
              onChange={(e) => handlePick(e, "icon1")}
              className="hidden"
            />
            {iconPreview1 ? (
              <img
                src={iconPreview1}
                alt="Icon 1 Preview"
                className="max-h-40 rounded-xl shadow-lg object-contain"
              />
            ) : (
              <p className="text-gray-400">Click to upload icon 1</p>
            )}
          </div>

          {/* Icon 2 */}
          <div
            className="w-full border-2 border-dashed border-blue-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => document.getElementById("fileIcon2").click()}
          >
            <input
              type="file"
              id="fileIcon2"
              accept="image/*"
              onChange={(e) => handlePick(e, "icon2")}
              className="hidden"
            />
            {iconPreview2 ? (
              <img
                src={iconPreview2}
                alt="Icon 2 Preview"
                className="max-h-40 rounded-xl shadow-lg object-contain"
              />
            ) : (
              <p className="text-gray-400">Click to upload icon 2</p>
            )}
          </div>
        </div>

        {/* Name */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Product Price ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 rounded-xl hover:from-indigo-500 hover:to-blue-500 shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </div>
    </main>
  );
}
