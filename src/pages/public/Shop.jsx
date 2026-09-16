import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { FiArrowUpRight } from "react-icons/fi"
import PublicLayout from "../../layouts/PublicLayout"

import hommeImage from "../../assets/yocana-homme.png"
import femmeImage from "../../assets/yocana-femme.png"

const products = [
    {
        id: 1,
        name: "Pour Homme",
        type: "Eau De Parfum",
        image: hommeImage,
        glow: "rgba(0, 119, 255, 0.22)",
        price: "₱0.00",
    },
    {
        id: 2,
        name: "Pour Femme",
        type: "Eau De Parfum",
        image: femmeImage,
        glow: "rgba(210, 15, 30, 0.22)",
        price: "₱0.00",
    },
]

function Shop() {
    return (
        <PublicLayout>
            <main className="min-h-screen bg-[#050505] px-5 pb-20 pt-28 md:px-8 md:pb-24 md:pt-32">
                <div className="mx-auto max-w-7xl">

                    {/* HEADER */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-10 md:mb-14"
                    >
                        <p className="mb-3 text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] sm:text-[10px]">
                            The Collection
                        </p>

                        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <h1 className="max-w-2xl text-4xl font-medium leading-tight tracking-[-0.04em] text-[#F5F5F5] sm:text-5xl md:text-6xl">
                                Find your
                                <span className="block text-white/35">
                                    signature fragrance.
                                </span>
                            </h1>

                            <p className="max-w-sm text-sm leading-7 text-white/40">
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

                    {/* PRODUCTS */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-7">
                        {products.map((product, index) => (
                            <motion.article
                                key={product.id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                className="group overflow-hidden border border-white/10 bg-[#080808] transition duration-500 hover:border-[#D4AF37]/25"
                            >

                                {/* PRODUCT IMAGE */}
                                <div className="relative flex min-h-[370px] items-center justify-center overflow-hidden bg-[#060606] sm:min-h-[430px] md:min-h-[500px]">

                                    {/* Colored Glow */}
                                    <div
                                        className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] sm:h-[290px] sm:w-[290px] md:h-[330px] md:w-[330px]"
                                        style={{
                                            background: product.glow,
                                        }}
                                    />

                                    {/* Bottle */}
                                    <motion.img
                                        src={product.image}
                                        alt={`YOCANA ${product.name}`}
                                        animate={{
                                            y: [0, -8, 0],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.4,
                                        }}
                                        whileHover={{
                                            scale: 1.04,
                                        }}
                                        className="relative z-10 h-auto w-[230px] select-none object-contain drop-shadow-[0_30px_38px_rgba(0,0,0,0.8)] sm:w-[280px] md:w-[330px]"
                                        draggable="false"
                                    />

                                    {/* Bottom Shadow */}
                                    <div className="absolute bottom-12 left-1/2 h-[18px] w-[160px] -translate-x-1/2 rounded-full bg-black/80 blur-xl" />
                                </div>

                                {/* DETAILS */}
                                <div className="border-t border-white/10 p-5 sm:p-6">
                                    <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
                                        {product.type}
                                    </p>

                                    <div className="mt-3 flex items-end justify-between gap-5">
                                        <div>
                                            <h2 className="text-2xl font-medium text-[#F5F5F5]">
                                                {product.name}
                                            </h2>

                                            <p className="mt-2 text-sm text-white/35">
                                                {product.price}
                                            </p>
                                        </div>

                                        <Link
                                            to={`/product/${product.id}`}
                                            aria-label={`View ${product.name}`}
                                            className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 text-white/55 transition duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                                        >
                                            <FiArrowUpRight size={17} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </main>
        </PublicLayout>
    )
}

export default Shop
