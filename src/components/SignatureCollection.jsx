import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { FiArrowUpRight } from "react-icons/fi"

import hommeImage from "../assets/yocana-homme.png"
import femmeImage from "../assets/yocana-femme.png"
import GoldDustGalaxy from "./GoldDustGalaxy"

const products = [
  {
    id: 1,
    number: "01",
    name: "Pour Homme",
    subtitle: "Eau De Parfum",
    image: hommeImage,
    glow: "rgba(0, 119, 255, 0.22)",
    glowStrong: "rgba(0, 145, 255, 0.30)",
    originalPrice: "₱2,199.00",
    price: "₱1,499.00",
    discount: "SAVE ₱700",
    description:
      "A confident expression crafted for a presence that speaks without saying a word.",
  },
  {
    id: 2,
    number: "02",
    name: "Pour Femme",
    subtitle: "Eau De Parfum",
    image: femmeImage,
    glow: "rgba(210, 15, 30, 0.22)",
    glowStrong: "rgba(255, 25, 35, 0.30)",
    originalPrice: "₱2,199.00",
    price: "₱1,499.00",
    discount: "SAVE ₱700",
    description:
      "An elegant expression designed to leave a graceful and unforgettable impression.",
  },
]

function SignatureCollection() {
  return (
    <section
      id="collection"
      className="relative overflow-hidden bg-[#050505] px-3.5 py-14 sm:px-6 sm:py-20 md:px-8 md:py-24"
    >
      {/* Animated Gold Dust Galaxy Background */}
      <GoldDustGalaxy />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <p className="mb-2 text-[8px] uppercase tracking-[0.4em] text-[#D4AF37] sm:mb-3 sm:text-[10px]">
            The Signature Collection
          </p>

          <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl text-2xl font-medium leading-tight tracking-[-0.03em] text-[#F5F5F5] sm:text-4xl md:text-5xl">
              Two expressions.
              <span className="block text-white/35">
                One unmistakable presence.
              </span>
            </h2>

            <p className="max-w-sm text-xs leading-6 text-white/40 sm:text-sm sm:leading-7">
              Discover fragrances created to become part of your identity,
              crafted for moments that deserve to be remembered.
            </p>
          </div>
        </motion.div>

        {/* Product Grid (Magkatabi / 2 Columns on Mobile) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{
                duration: 0.65,
                delay: index * 0.1,
              }}
            >
              <Link
                to={`/product/${product.id}`}
                aria-label={`View ${product.name}`}
                className="group relative block overflow-hidden rounded-xl sm:rounded-2xl border border-white/[0.12] bg-[#0c0c0c]/60 backdrop-blur-2xl shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.16),0_24px_50px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D4AF37]/80 hover:bg-[#121212]/80 hover:shadow-[inset_0_1px_2px_0_rgba(212,175,55,0.35),0_30px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.22)] cursor-pointer"
              >
                {/* Gold Top Specular Line (Glows gold matching the logo) */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent transition-all duration-500 group-hover:via-[#D4AF37]" />
                <div className="pointer-events-none absolute -inset-full bg-gradient-to-tr from-transparent via-[#D4AF37]/[0.04] to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                                                {/* AUTOMATIC LUXURY GLOW (Mobile Only: Soft feathered ambient glow, NO sharp lines) */}
                <div className="md:hidden">
                  {/* 1. Soft Ambient Diffuse Glow Spot (Feathered, sweeps top-left to bottom-right) */}
                  <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-xl">
                    <motion.div
                      aria-hidden="true"
                      className="absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none blur-2xl"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(212,175,55,0.45) 35%, rgba(212,175,55,0.12) 65%, transparent 80%)",
                      }}
                      animate={{
                        top: ["-10%", "110%"],
                        left: ["-10%", "110%"],
                        opacity: [0, 0.9, 0.9, 0],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        repeatDelay: 1.8,
                        ease: [0.35, 0, 0.25, 1],
                        delay: index * 0.9,
                      }}
                    />
                  </div>

                  {/* 2. Soft Golden Rim / Edge Glow (In sync with the glow travel) */}
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-30 rounded-xl border border-[#D4AF37]/70"
                    animate={{
                      opacity: [0, 0.9, 0],
                      boxShadow: [
                        "inset 0 0 0px rgba(212,175,55,0), 0 0 0px rgba(212,175,55,0)",
                        "inset 0 0 16px rgba(212,175,55,0.35), 0 0 22px rgba(212,175,55,0.3)",
                        "inset 0 0 0px rgba(212,175,55,0), 0 0 0px rgba(212,175,55,0)",
                      ],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      repeatDelay: 1.8,
                      ease: "easeInOut",
                      delay: index * 0.9,
                    }}
                  />
                </div>

                {/* IMAGE AREA (Translucent Glass Showcase) */}
                <div className="relative flex min-h-[160px] sm:min-h-[300px] md:min-h-[440px] items-center justify-center overflow-hidden bg-gradient-to-b from-white/[0.03] via-transparent to-black/30">

                  {/* Large colored ambient glow */}
                  <div
                    className="absolute left-1/2 top-[48%] h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[45px] sm:blur-[70px] transition-all duration-500 group-hover:scale-110 sm:h-[260px] sm:w-[260px] md:h-[320px] md:w-[320px]"
                    style={{
                      background: product.glow,
                    }}
                  />

                  {/* Stronger light directly behind the bottle */}
                  <div
                    className="absolute left-1/2 top-[55%] h-[60px] w-[90px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[25px] sm:blur-[40px] sm:h-[130px] sm:w-[220px]"
                    style={{
                      background: product.glowStrong,
                    }}
                  />

                  {/* Product number with glass pill */}
                  <span className="absolute right-2.5 top-2.5 sm:right-5 sm:top-5 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-medium tracking-[0.2em] sm:tracking-[0.25em] text-white/40 backdrop-blur-md transition-colors duration-300 group-hover:border-[#D4AF37]/40 group-hover:text-[#D4AF37]">
                    {product.number}
                  </span>

                  {/* Perfume Bottle */}
                  <motion.img
                    src={product.image}
                    alt={`YOCANA ${product.name}`}
                    animate={{
                      y: [0, -6, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    }}
                    className="relative z-10 h-auto w-[100px] select-none object-contain drop-shadow-[0_15px_22px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105 sm:w-[220px] md:w-[310px]"
                    draggable="false"
                  />

                  {/* Floor glow */}
                  <div
                    className="absolute bottom-[28px] sm:bottom-[56px] left-1/2 h-[3px] w-[60px] sm:w-[145px] md:w-[165px] -translate-x-1/2 rounded-full blur-[6px] sm:blur-[8px]"
                    style={{
                      background: product.glowStrong,
                    }}
                  />

                  {/* Bottom shadow */}
                  <div className="absolute bottom-[24px] sm:bottom-[48px] left-1/2 h-[12px] w-[80px] sm:w-[180px] -translate-x-1/2 rounded-full bg-black/85 blur-lg sm:blur-xl" />
                </div>

                {/* PRODUCT DETAILS (Frosted Glass Panel) */}
                <div className="border-t border-white/[0.08] bg-black/35 backdrop-blur-xl p-3 sm:p-5 md:p-6 transition-colors duration-500 group-hover:border-[#D4AF37]/30">
                  <p className="mb-1 text-[7px] sm:text-[8px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#D4AF37]">
                    {product.subtitle}
                  </p>

                  <div>
                    <h3 className="text-sm sm:text-xl md:text-2xl font-medium text-[#F5F5F5] transition-colors duration-300 group-hover:text-[#D4AF37] truncate">
                      {product.name}
                    </h3>

                    <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5 sm:mt-2 sm:gap-2.5">
                      <span className="text-[10px] font-medium text-white/40 line-through sm:text-xs">
                        {product.originalPrice}
                      </span>
                      <span className="text-xs font-semibold text-[#D4AF37] sm:text-base">
                        {product.price}
                      </span>
                      {/* Glass Discount Pill */}
                      <span className="rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/15 px-1.5 py-0.5 text-[7px] font-semibold tracking-wider text-[#D4AF37] backdrop-blur-md shadow-[inset_0_1px_0_rgba(212,175,55,0.25)] sm:px-2.5 sm:text-[9px]">
                        {product.discount}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-white/45 sm:line-clamp-none sm:text-sm sm:leading-6 sm:mt-3">
                      {product.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View Full Collection Button (Frosted Glass) */}
        <div className="mt-7 flex justify-center md:mt-9">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.14] bg-white/[0.04] px-4.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_6px_16px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/15 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_20px_rgba(212,175,55,0.25)] sm:px-5 sm:py-2 sm:text-[9px] sm:tracking-[0.24em]"
          >
            <span>View Full Collection</span>
            <FiArrowUpRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default SignatureCollection
