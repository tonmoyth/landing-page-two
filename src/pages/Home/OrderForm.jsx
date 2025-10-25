import React, { useEffect, useMemo, useState } from "react";

/**
 * OrderForm.jsx
 * React + Tailwind + daisyUI
 * - Fetches products from /json/products.json (public/json/products.json)
 * - Radio card selector, quantity control, live summary
 * - Bengali labels
 */
export default function OrderForm() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Fetch products (adjust the path if your file is in another folder)
  useEffect(() => {
    setLoading(true);
    setErr("");
    fetch("/products.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProducts(list);
        if (list.length) setSelectedId(list[0].id); // default select first
      })
      .catch((e) => setErr(`Failed to load products: ${e.message}`))
      .finally(() => setLoading(false));
  }, []);

  // Selected product (depends on both selectedId and products)
  const selected = useMemo(() => {
    return products.find((p) => p.id === selectedId) || null;
  }, [selectedId, products]);

  // Totals (safe guards)
  const price = Number(selected?.price || 0);
  const subtotal = price * qty;
  const shipping = 0;
  const total = subtotal + shipping;

  // UI states
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
    <section className="w-full py-6 sm:py-10">
      <div className="mx-auto w-11/12 lg:w-10/12 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <div className="grid sm:grid-cols-3 gap-3">
                {products.map((p) => (
                  <label
                    key={p.id}
                    className={`card cursor-pointer border transition ${
                      selectedId === p.id
                        ? "border-emerald-900 ring-2 ring-emerald-900/40"
                        : "border-emerald-900/40 hover:border-emerald-900/70"
                    }`}
                  >
                    <div className="card-body p-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="product"
                          className="radio"
                          checked={selectedId === p.id}
                          onChange={() => setSelectedId(p.id)}
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
                      <div className="mt-2">
                        <h4 className="font-semibold leading-tight">
                          {p.name}
                        </h4>
                        <p className="text-sm opacity-70">
                          ৳ {Number(p.price || 0).toLocaleString("bn-BD")}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <label className="font-medium">পরিমাণ:</label>
                <div className="join">
                  <button
                    className="btn join-item"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    type="button"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    className="input input-bordered join-item w-20 text-center"
                    value={qty}
                    onChange={(e) =>
                      setQty(Math.max(1, Number(e.target.value) || 1))
                    }
                  />
                  <button
                    className="btn join-item"
                    onClick={() => setQty((q) => q + 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Customer form */}

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-base-100/70 p-6 rounded-2xl shadow-lg backdrop-blur">
              {/* Email */}
              <div className="form-control col-span-2">
                <label className="label">
                  <span className="label-text font-semibold text-gray-800">
                    📧 Email Address <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full focus:ring-2 focus:ring-emerald-600 focus:outline-none transition"
                />
                <span className="label-text-alt text-gray-500 mt-1">
                  অর্ডার সংক্রান্ত সব তথ্য এই ইমেইলে যাবে।
                </span>
              </div>

              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-800">
                    👤 নাম <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  className="input input-bordered w-full focus:ring-2 focus:ring-emerald-600 focus:outline-none transition"
                />
              </div>

              {/* Phone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-800">
                    📞 ফোন নাম্বার <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className="input input-bordered w-full focus:ring-2 focus:ring-emerald-600 focus:outline-none transition"
                />
                <span className="label-text-alt text-gray-500 mt-1">
                  ডেলিভারি সংক্রান্ত কল/এসএমএস আসবে এই নাম্বারে।
                </span>
              </div>

              {/* Address */}
              <div className="form-control col-span-2">
                <label className="label">
                  <span className="label-text font-semibold text-gray-800">
                    🏠 ঠিকানা <span className="text-red-500">*</span>
                  </span>
                </label>
                <textarea
                  rows="2"
                  placeholder="এড্রেস/এপার্টমেন্ট/এলাকা"
                  className="textarea textarea-bordered w-full focus:ring-2 focus:ring-emerald-600 focus:outline-none resize-none transition"
                ></textarea>
                <span className="label-text-alt text-gray-500 mt-1">
                  ডেলিভারির সঠিক ঠিকানা লিখুন।
                </span>
              </div>

              {/* Floor/Flat */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-800">
                    🏢 ফ্লোর/ফ্ল্যাট
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="যদি প্রযোজ্য (যেমন: ১, ২, ৩)"
                  className="input input-bordered w-full focus:ring-2 focus:ring-emerald-600 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="mt-5">
              <button className="btn bg-emerald-900 text-white">
                Place Order (৳{total.toLocaleString("bn-BD")})
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
              <button className="btn bg-emerald-900 text-white mt-3">
                এখনই অর্ডার করুন
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Summary */}
        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-base-300 bg-base-100 p-4 sticky top-6">
            <h3 className="font-bold">Your order</h3>
            <div className="divider my-2" />
            <div className="flex items-center gap-3">
              <img
                src={selected.img}
                alt={selected.name}
                className="h-14 w-14 rounded object-cover"
              />
              <div className="flex-1">
                <div className="font-medium leading-tight">{selected.name}</div>
                <div className="text-xs opacity-70">Quantity × {qty}</div>
              </div>
              <div className="text-sm">
                ৳{(price * qty).toLocaleString("bn-BD")}
              </div>
            </div>

            <div className="divider my-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString("bn-BD")}</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-semibold">
                  ৳{total.toLocaleString("bn-BD")}
                </span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-warning/20 text-sm">
              📦 ফ্রি হোম ডেলিভারি · পণ্য হাতে পেয়ে টাকা নিন · ক্যাশব্যাক · ফ্রি
              রিটার্ন সাপোর্ট
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
