import React from "react";

/**
 * Pure Honey Promo Section
 * Tech: React + TailwindCSS + daisyUI
 * Drop this component anywhere. It uses daisyUI button styles.
 */
export default function ProductsDetails() {
  const features = [
    "রোগপ্রতিরোধ ক্ষমতা স্বাভাবিকভাবে বৃদ্ধি করে",
    "ফ্রুট প্রাকৃতিক এনার্জি দেয় ও ক্লান্তি কমায়",
    "গলা ব্যথা, কাশি ও সর্দি-জ্বর আরাম দেয়",
    "অ্যান্টিঅক্সিডেন্টের সমৃদ্ধ — ফ্রি র‍্যাডিকেল উৎপাদন কমায়",
    "হজমে সহায়তা করে এবং গ্যাস/অম্বল কমাতে সাহায্য করে",
    "গরম লেবু পানি/দুধ/চিঁরা সালাদে সহজে ব্যবহার করা যায়",
    "১০০% খাঁটি — কোনো অ্যাডেড চিনি/কেমিক্যাল/কালারিং এজেন্ট নয়",
    "প্রতিটি ব্যাচ গুণগত মান পরীক্ষিত ও সরাসরি মৌচাষিদের কাছে থেকে সংগ্রহ",
  ];

  return (
    <section className="w-full py-6 sm:py-10 bg-base-100">
      <div className="mx-auto w-11/12 lg:w-10/12 rounded-2xl shadow-xl overflow-hidden">
        {/* Top banner */}
        <div className="relative bg-gradient-to-r from-base-200 to-base-100">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral leading-tight">
              <span className="text-neutral">
                প্রকৃতির খাঁটি মিষ্টি শক্তি —{" "}
              </span>
              <span className="text-emerald-900">Nutureal Pure Honey</span>
            </h1>

            {/* <div className="flex gap-2">
              <button className="btn  bg-emerald-900 text-white">
                অর্ডার করুন এখনই
              </button>
              <button className="btn btn-outline">উপকারিতা দেখুন</button>
            </div> */}
          </div>
        </div>

        {/* Benefits header bar */}
        <div className="bg-emerald-900 text-emerald-50 px-4 sm:px-6 py-3">
          <h2 className="text-xl sm:text-2xl font-bold">
            Nutureal Pure Honey – প্রধান উপকারিতা:
          </h2>
        </div>

        {/* Body */}
        <div className="bg-base-100 p-4 sm:p-6">
          <ul className="space-y-4">
            {features.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-emerald-700"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75 2.25 17.385 2.25 12Zm13.36-2.59a.75.75 0 0 0-1.22-.9l-3.66 4.96-1.69-1.69a.75.75 0 1 0-1.06 1.06l2.31 2.31c.33.33.86.29 1.13-.09l5.19-6.65Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <p className="text-base leading-relaxed text-neutral/90">
                  {item}
                </p>
              </li>
            ))}
          </ul>

          {/* Price stripe */}
          <div className="mt-8 rounded-xl bg-emerald-900 text-emerald-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-lg sm:text-xl font-extrabold tracking-tight">
              ৭ দিনের জন্য অফার মূল্য —{" "}
              <span className="text-warning">৳ ২০০</span>
            </p>
          </div>

          {/* CTA bottom */}
          <div className="py-6 flex justify-center">
            <button
              onClick={() => {
                const section = document.getElementById("orderSection");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="btn bg-emerald-900 btn-wide text-white"
            >
              এখনই অর্ডার করুন
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
