import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { FiArrowUpRight } from "react-icons/fi"
import PublicLayout from "../../layouts/PublicLayout"
import GoldDustGalaxy from "../../components/GoldDustGalaxy"

import hommeImage from "../../assets/collection-homme.webp"
import femmeImage from "../../assets/collection-femme.webp"

const products = [
    {
        id: 1,
        name: "Pour Homme",
        type: "Eau De Parfum",
        image: hommeImage,
        glow: "rgba(0, 119, 255, 0.22)",
        originalPrice: "₱2,299.00",
        price: "₱1,699.00",
        discount: "SAVE ₱600",
    },
    {
        id: 2,
        name: "Pour Femme",
        type: "Eau De Parfum",
        image: femmeImage,
        glow: "rgba(210, 15, 30, 0.22)",
        originalPrice: "₱2,299.00",
        price: "₱1,699.00",
        discount: "SAVE ₱600",
    },
]

function Shop() {
    return (
        <PublicLayout>
            <main className="relative min-h-screen overflow-hidden bg-[#050505] px-5 pb-20 pt-28 md:px-8 md:pb-24 md:pt-32">
                {/* Animated Gold Dust Galaxy Background */}
                <GoldDustGalaxy />

                <div className="relative mx-auto max-w-7xl">

                    {/* HEADER */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-10 md:mb-14"
                    >
                        <p className="mb-2 text-[8px] uppercase tracking-[0.4em] text-[#D4AF37] sm:mb-3 sm:text-[10px]">
                            The Collection
                        </p>

                        <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between">
                            <h1 className="max-w-2xl text-2xl font-medium leading-tight tracking-[-0.04em] text-[#F5F5F5] sm:text-5xl md:text-6xl">
                                Find your
                                <span className="block text-white/35">
                                    signature fragrance.
                                </span>
                            </h1>

                            <p className="max-w-sm text-xs leading-6 text-white/40 sm:text-sm sm:leading-7">
                                Explore YOCANA fragrances crafted to leave a distinctive
                                and memorable presence.
                            </p>
                        </div>
                    </motion.div>

                    {/* DIVIDER */}
                    <div className="mb-8 border-t border-white/10 pt-5">
                        <p className="text-[9px] uppercase tracking-[0.28em] text-white/25">
                            {products.length} Fragrances
                        </p>
                    </div>

                    {/* PRODUCTS (Magkatabi / 2 Columns on Mobile) */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                            >
                                <Link
                                    to={`/product/${product.id}`}
                                    aria-label={`View ${product.name}`}
                                    className="group relative block overflow-hidden rounded-xl sm:rounded-2xl border border-white/[0.12] bg-[#0c0c0c]/60 backdrop-blur-2xl shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.16),0_24px_50px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D4AF37]/80 hover:bg-[#121212]/80 hover:shadow-[inset_0_1px_2px_0_rgba(212,175,55,0.35),0_30px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.22)] cursor-pointer"
                                >
                                    {/* Gold Top Specular Highlight (Glows gold matching the logo) */}
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

                                    {/* PRODUCT IMAGE (Mobile: Full-Bleed 4:5 | Desktop: Framed Studio Showcase) */}
                                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#050505] sm:aspect-auto sm:flex sm:h-[360px] sm:items-center sm:justify-center sm:py-3 md:h-[480px] md:py-4">
                                        <img
                                            src={product.image}
                                            alt={`YOCANA ${product.name}`}
                                            className="h-full w-full select-none object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 sm:w-auto sm:max-w-full sm:object-contain sm:[mask-image:linear-gradient(to_right,transparent,black_16%,black_84%,transparent)]"
                                            draggable="false"
                                        />

                                        {/* Seamless Edge Vignette */}
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/25" />
                                    </div>

                                    {/* DETAILS */}
                                    <div className="border-t border-white/[0.08] bg-black/35 backdrop-blur-xl p-3 sm:p-5 md:p-6 transition-colors duration-500 group-hover:border-[#D4AF37]/30">
                                        <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#D4AF37]">
                                            {product.type}
                                        </p>

                                        <div className="mt-1 sm:mt-2">
                                            <h2 className="text-sm sm:text-xl md:text-2xl font-medium text-[#F5F5F5] transition-colors duration-300 group-hover:text-[#D4AF37] truncate">
                                                {product.name}
                                            </h2>

                                            <div className="mt-1 flex flex-wrap items-baseline gap-1.5 sm:mt-2 sm:gap-2.5">
                                                <span className="text-[10px] font-medium text-white/40 line-through sm:text-sm">
                                                    {product.originalPrice}
                                                </span>
                                                <span className="text-xs font-semibold text-[#D4AF37] sm:text-lg">
                                                    {product.price}
                                                </span>
                                                <span className="rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/15 px-1.5 py-0.5 text-[7px] font-semibold tracking-wider text-[#D4AF37] backdrop-blur-md shadow-[inset_0_1px_0_rgba(212,175,55,0.25)] sm:px-2.5 sm:text-[9px]">
                                                    {product.discount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </PublicLayout>
    )
}

export default Shop
