// Hero.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AxiosSecure } from "../../Hooks/AxiosSecure";
import heroImage from "../../assets/hero1.png";

function useBreakpoint() {
  const get = () => {
    if (typeof window === "undefined" || !("matchMedia" in window))
      return "desktop";
    if (window.matchMedia("(min-width:1280px)").matches) return "xl";
    if (window.matchMedia("(min-width:1024px)").matches) return "desktop";
    if (window.matchMedia("(min-width:768px)").matches) return "tablet";
    return "mobile";
  };
  const [bp, setBp] = useState(get);
  useEffect(() => {
    const mq = [
      window.matchMedia("(min-width:1280px)"),
      window.matchMedia("(min-width:1024px)"),
      window.matchMedia("(min-width:768px)"),
    ];
    const onChange = () => setBp(get());
    mq.forEach((m) => m.addEventListener?.("change", onChange));
    return () => mq.forEach((m) => m.removeEventListener?.("change", onChange));
  }, []);
  return bp;
}

/* ---------- HERO ---------- */
export function Hero() {
  const bp = useBreakpoint();

  // products state (array)
  const [products, setProducts] = useState([]);
  console.log(products);

  // UI state that depends on products (init as null/empty)
  const [mainImage, setMainImage] = useState(null);
  const [icons, setIcons] = useState([]);
  const axiosSecure = AxiosSecure();

  // normalize different key names from JSON
  // const normalize = (item) => ({
  //   id: item.id,
  //   alt: item.alt || item.name || "Product",
  //   src: item.src || item.img, // accept either src or img
  //   icon: item.icon || item.icons || [], // accept icon or icons
  // });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosSecure.get("/products");
        setProducts(res.data);

        if (res.data.length) {
          setMainImage(res.data[0].img); // use "img" instead of "src"
          setIcons(res.data[0].icons || []); //  use "icons" instead of "icon"
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const jarHeight = useMemo(() => {
    switch (bp) {
      case "mobile":
        return 320;
      case "tablet":
        return 440;
      case "desktop":
        return 520;
      default:
        return 560;
    }
  }, [bp]);

  const handleImageChange = (p) => {
    setMainImage(p.img);
    setIcons(p.icons || []);
  };

  return (
    <section className="relative w-full overflow-visible">
      <div
        className="relative mx-auto w-full overflow-visible h-[520px] sm:h-[600px] md:h-[680px] lg:h-[720px]"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* ---- MAIN IMAGE ---- */}
        {mainImage && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.img
              key={mainImage}
              src={mainImage}
              alt="Main product"
              className="drop-shadow-2xl"
              style={{ height: `${jarHeight}px`, width: "auto" }}
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 2, type: "spring" }}
            />
          </div>
        )}

        {/* ---- FLOATING ICONS ---- */}
        {icons?.map((src, i) => {
          let offsets = [];
          switch (bp) {
            case "mobile":
              offsets = [
                { x: -80, y: -60 },
                { x: 20, y: 0 },
                { x: -90, y: 40 },
                { x: 50, y: 40 },
                { x: 0, y: -100 },
              ];
              break;
            case "tablet":
              offsets = [
                { x: -140, y: -80 },
                { x: 130, y: -60 },
                { x: -100, y: 100 },
                { x: 140, y: 90 },
                { x: 0, y: -130 },
              ];
              break;
            case "desktop":
              offsets = [
                { x: -180, y: -100 },
                { x: 160, y: -80 },
                { x: -120, y: 120 },
                { x: 180, y: 100 },
                { x: 0, y: -160 },
              ];
              break;
            default:
              offsets = [
                { x: -120, y: -50 },
                { x: 30, y: 0 },
                { x: -140, y: 40 },
                { x: 200, y: 120 },
                { x: 0, y: -180 },
              ];
              break;
          }
          const pos = offsets[i % offsets.length];
          const delay = i * 0.6;

          return (
            <motion.img
              key={i}
              src={src}
              alt="floating icon"
              className="absolute pointer-events-none drop-shadow-md"
              style={{
                width:
                  bp === "desktop"
                    ? 130
                    : bp === "tablet"
                    ? 100
                    : bp === "mobile"
                    ? 100
                    : 150,
                height:
                  bp === "desktop"
                    ? 130
                    : bp === "tablet"
                    ? 100
                    : bp === "mobile"
                    ? 70
                    : 150,
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
              }}
              initial={{ opacity: 1, y: 10, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: [pos.y, pos.y - 12, pos.y],
                x: [pos.x, pos.x + (Math.random() > 0.5 ? 15 : -15), pos.x],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4 + i * 0.5, delay, repeat: Infinity }}
            />
          );
        })}

        {/* ---- PRODUCT BUTTONS ---- */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
          {products.map((p) => (
            <button
              key={p._id}
              type="button"
              onClick={() => handleImageChange(p)}
              className={`overflow-hidden rounded-lg border-2 transition ${
                mainImage === p.img
                  ? "border-primary ring ring-primary/50"
                  : "border-transparent hover:border-primary/50"
              }`}
              title={p?.name}
            >
              <img
                alt={p?.name}
                className="w-20 h-20 object-cover hover:opacity-90"
                src={p?.img}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
