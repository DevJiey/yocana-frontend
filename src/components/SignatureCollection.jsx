import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { FiArrowUpRight } from "react-icons/fi"

import hommeImage from "../assets/collection-homme.webp"
import femmeImage from "../assets/collection-femme.webp"
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
    originalPrice: "₱2,299.00",
    price: "₱1,699.00",
    discount: "SAVE ₱600",
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
    originalPrice: "₱2,299.00",
    price: "₱1,699.00",
    discount: "SAVE ₱600",
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

                                                {/* AUTOMATIC LUXURY GLOW (Mobile Only: GPU-accelerated diffuse ambient glow, 0 layout reflow) */}
                <div className="md:hidden">
                  {/* 1. Soft Ambient Diffuse Glow Spot (Feathered, GPU-accelerated translate) */}
                  <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-xl">
                    <motion.div
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-44 w-44 rounded-full pointer-events-none blur-2xl transform-gpu will-change-transform"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(212,175,55,0.4) 35%, rgba(212,175,55,0.1) 65%, transparent 80%)",
                      }}
                      animate={{
                        x: ["-20%", "130%"],
                        y: ["-20%", "130%"],
                        opacity: [0, 0.85, 0.85, 0],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        repeatDelay: 2.5,
                        ease: [0.35, 0, 0.25, 1],
                        delay: index * 1.1,
                      }}
                    />
                  </div>

                  {/* 2. Soft Golden Rim Glow (Pure GPU opacity, 0 paint thrash) */}
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-30 rounded-xl border border-[#D4AF37]/50 shadow-[inset_0_0_12px_rgba(212,175,55,0.25)] transform-gpu"
                    animate={{
                      opacity: [0, 0.9, 0],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      repeatDelay: 2.5,
                      ease: "easeInOut",
                      delay: index * 1.1,
                    }}
                  />
                </div>

                {/* IMAGE AREA (Mobile: Full-Bleed 4:5 | Desktop: Framed Studio Showcase) */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#050505] sm:aspect-auto sm:flex sm:h-[360px] sm:items-center sm:justify-center sm:py-3 md:h-[460px] md:py-4">
                  {/* Product number with glass pill */}
                  <span className="absolute right-2.5 top-2.5 sm:right-5 sm:top-5 z-20 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-medium tracking-[0.2em] sm:tracking-[0.25em] text-white/60 backdrop-blur-md transition-colors duration-300 group-hover:border-[#D4AF37]/50 group-hover:text-[#D4AF37]">
                    {product.number}
                  </span>

                  {/* Studio Editorial Bottle Image */}
                  <img
                    src={product.image}
                    alt={`YOCANA ${product.name}`}
                    className="h-full w-full select-none object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 sm:w-auto sm:max-w-full sm:object-contain sm:[mask-image:linear-gradient(to_right,transparent,black_16%,black_84%,transparent)]"
                    draggable="false"
                  />

                  {/* Seamless Edge Vignette */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/25" />
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
