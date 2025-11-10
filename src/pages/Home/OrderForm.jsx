import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { AxiosSecure } from "../../Hooks/AxiosSecure";
import Swal from "sweetalert2";
import OrderSidebar from "../../components/OrderChackSection/OrderChackSection";

export default function OrderForm() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const axiosSecure = AxiosSecure();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      productId: "",
      qty: 1,
      email: "",
      name: "",
      status: "pending",
      phone: "",
      address: "",
    },
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosSecure.get("/products");
        const list = Array.isArray(res.data) ? res.data : [];
        setProducts(list);

        // Auto-select first product
        if (list.length) {
          setValue("productId", String(list[0]._id), { shouldValidate: true });
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setErr("পণ্য লোড করা যায়নি। পরে আবার চেষ্টা করুন।");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [axiosSecure, setValue]);

  const productId = watch("productId");
  const qty = watch("qty") || 1;

  // Selected product by _id (Mongo)
  const selected = useMemo(() => {
    return products.find((p) => String(p._id) === String(productId)) || null;
  }, [productId, products]);

  // Totals
  const price = Number(selected?.price || 0);
  const subtotal = price * (Number(qty) || 1);
  const shipping = 0;
  const total = subtotal + shipping;

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      qty: Number(values.qty) || 1,
      product: selected, // send selected product snapshot
      pricing: { price, subtotal, shipping, total },
      createdAt: new Date().toISOString(),
    };

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to place this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, order it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await axiosSecure.post("/orders", payload);
      if (response?.data?.orderId) {
        Swal.fire({
          title: "Order Successfully",
          text: "Your order has been placed successfully. Thank you for shopping with us!",
          icon: "success",
        });
        reset({
          productId,
          qty: 1,
          email: "",
          name: "",
          status: "pending",
          phone: "",
          address: "",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Order failed",
        text: error?.response?.data?.message || error.message,
        icon: "error",
      });
    }
  };

  // Loading UI
  if (loading) {
    return (
      <section className="w-full py-6 sm:py-10">
        <div className="mx-auto w-11/12 lg:w-10/12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton h-10 w-1/2" />
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="skeleton h-28" />
              <div className="skeleton h-28" />
              <div className="skeleton h-28" />
            </div>
            <div className="skeleton h-8 w-40" />
            <div className="skeleton h-72" />
          </div>
          <div className="skeleton h-64" />
        </div>
      </section>
    );
  }

  // Error UI
  if (err) {
    return (
      <section className="w-full py-6 sm:py-10">
        <div className="mx-auto w-11/12 lg:w-10/12">
          <div className="alert alert-error">
            <span>{err}</span>
          </div>
        </div>
      </section>
    );
  }

  // No product UI
  if (!selected) {
    return (
      <section className="w-full py-6 sm:py-10">
        <div className="mx-auto w-11/12 lg:w-10/12">
          <div className="alert">
            <span>কোনো পণ্য পাওয়া যায়নি। দয়া করে পরে আবার চেষ্টা করুন।</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="orderSection" className="w-full py-6 sm:py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-11/12 lg:w-10/12 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* LEFT: Form & Selector */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-base-300 shadow-sm bg-base-100 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">সঠিক তথ্য দিয়ে অর্ডার করুন</h2>
              <span className="text-emerald-900 font-bold">অফার: ৳২০০!</span>
            </div>

            {/* Product Selector */}
            <div className="mt-5">
              <p className="mb-2 font-semibold">প্রোডাক্ট নির্বাচন করুন</p>

              <Controller
                name="productId"
                control={control}
                rules={{ required: "প্রোডাক্ট নির্বাচন করুন" }}
                render={({ field }) => (
                  <div className="grid sm:grid-cols-3 gap-3">
                    {products.map((p) => {
                      const id = String(p._id);
                      const isActive = String(field.value) === id;

                      return (
                        <label
                          key={id}
                          className={`card cursor-pointer border transition ${
                            isActive
                              ? "border-emerald-900 ring-2 ring-emerald-900/40"
                              : "border-emerald-900/40 hover:border-emerald-900/70"
                          }`}
                        >
                          <div className="card-body p-3">
                            <div className="flex items-center gap-3">
                              {/* Controlled radio */}
                              <input
                                type="radio"
                                className="radio"
                                name={field.name}
                                checked={isActive}
                                onChange={() => field.onChange(id)}
                              />
                              <img
                                src={p.img}
                                alt={p.name}
                                className="h-12 w-12 rounded object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://via.placeholder.com/80x80?text=Image";
                                }}
                              />
                            </div>
                            <div
                              className="mt-2"
                              onClick={() => field.onChange(id)}
                            >
                              <h4 className="font-semibold leading-tight">
                                {p.name}
                              </h4>
                              <p className="text-sm opacity-70">
                                ৳ {Number(p.price || 0).toLocaleString("bn-BD")}
                              </p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
              {errors.productId && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.productId.message}
                </p>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <label className="font-medium">পরিমাণ:</label>
                <div className="join">
                  <button
                    className="btn join-item"
                    type="button"
                    onClick={() =>
                      setValue("qty", Math.max(1, Number(qty) - 1), {
                        shouldValidate: true,
                      })
                    }
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min={1}
                    className="input input-bordered join-item w-20 text-center"
                    {...register("qty", {
                      required: true,
                      valueAsNumber: true,
                      min: { value: 1, message: "পরিমাণ কমপক্ষে ১ হতে হবে" },
                    })}
                  />

                  <button
                    className="btn join-item"
                    type="button"
                    onClick={() =>
                      setValue("qty", Number(qty) + 1, { shouldValidate: true })
                    }
                  >
                    +
                  </button>
                </div>
                {errors.qty && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.qty.message}
                  </p>
                )}
              </div>
            </div>

            {/* Customer form */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-base-100/70 p-6 rounded-2xl shadow-lg backdrop-blur">
              {/* Email */}
              <div className="form-control col-span-2">
                <label className="label">
                  <span className="label-text font-semibold text-gray-800">
                    Email Address <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input input-bordered w-full focus:ring-2 focus:ring-emerald-600 focus:outline-none transition ${
                    errors.email ? "input-error" : ""
                  }`}
                  {...register("email", {
                    required: "ইমেইল প্রয়োজন",
                    pattern: {
                      value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                      message: "সঠিক ইমেইল দিন",
                    },
                  })}
                />
                <span className="label-text-alt text-gray-500 mt-1">
                  অর্ডার সংক্রান্ত সব তথ্য এই ইমেইলে যাবে।
                </span>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-800">
                    নাম <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  className={`input input-bordered w-full focus:ring-2 focus:ring-emerald-600 focus:outline-none transition ${
                    errors.name ? "input-error" : ""
                  }`}
                  {...register("name", {
                    required: "নাম প্রয়োজন",
                    minLength: { value: 2, message: "কমপক্ষে ২ অক্ষর" },
                  })}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-800">
                    ফোন নাম্বার <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className={`input input-bordered w-full focus:ring-2 focus:ring-emerald-600 focus:outline-none transition ${
                    errors.phone ? "input-error" : ""
                  }`}
                  {...register("phone", {
                    required: "ফোন নাম্বার প্রয়োজন",
                    pattern: {
                      value: /^01[0-9]{9}$/, // 11 digits BD
                      message: "সঠিক ফোন নাম্বার দিন (১১ ডিজিট)",
                    },
                  })}
                />
                <span className="label-text-alt text-gray-500 mt-1">
                  ডেলিভারি সংক্রান্ত কল/এসএমএস আসবে এই নাম্বারে।
                </span>
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="form-control col-span-2">
                <label className="label">
                  <span className="label-text font-semibold text-gray-800">
                    ঠিকানা <span className="text-red-500">*</span>
                  </span>
                </label>
                <textarea
                  rows={2}
                  placeholder="এড্রেস/এপার্টমেন্ট/এলাকা"
                  className={`textarea textarea-bordered w-full focus:ring-2 focus:ring-emerald-600 focus:outline-none resize-none transition ${
                    errors.address ? "textarea-error" : ""
                  }`}
                  {...register("address", {
                    required: "ঠিকানা প্রয়োজন",
                    minLength: { value: 6, message: "আরও বিস্তারিত দিন" },
                  })}
                />
                <span className="label-text-alt text-gray-500 mt-1">
                  ডেলিভারির সঠিক ঠিকানা লিখুন।
                </span>
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <button
                className="btn bg-emerald-900 text-white"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : `Place Order (৳${total.toLocaleString("bn-BD")})`}
              </button>
              <p className="text-xs opacity-70 mt-2">
                অর্ডার করার মাধ্যমে আপনি আমাদের <a className="link">Terms</a> &
                <a className="link"> Privacy</a> নীতিমালা মেনে নিচ্ছেন।
              </p>
            </div>
          </div>

          {/* Bottom panels */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-base-300 bg-base-100 p-4">
              <h3 className="font-bold mb-2">ব্যবহারের নিয়ম</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="badge">1</span>
                  <span>
                    প্রতিদিন সকালে খালি পেটে অথবা গরম পানির সাথে ১ টেবিল চামচ
                    মধু নিন।
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="badge">2</span>
                  <span>
                    শিশুদের জন্য ডাক্তার/ডায়েটিশিয়ানের পরামর্শ অনুযায়ী দিন।
                    ডায়াবেটিকদের জন্যও উপযোগী অংশে ব্যবহার করুন।
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-base-300 bg-gradient-to-r from-base-200 to-base-100 p-4">
              <h3 className="font-bold mb-2">সহায়তা দরকার?</h3>
              <p className="text-sm opacity-80">
                সরাসরি কল করুন অর্ডার করতে:{" "}
                <span className="font-semibold">01832449539</span>
              </p>
              {/* <button
                className="btn bg-emerald-900 text-white mt-3"
                type="button"
              >
                এখনই অর্ডার করুন
              </button> */}
            </div>
          </div>
        </div>

        {/* RIGHT: Summary */}
        <OrderSidebar />
      </form>
    </section>
  );
}
