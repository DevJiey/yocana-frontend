import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { FiArrowUpRight } from "react-icons/fi"

import hommeImage from "../assets/yocana-homme.png"
import femmeImage from "../assets/yocana-femme.png"

const products = [
  {
    id: 1,
    number: "01",
    name: "Pour Homme",
    subtitle: "Eau De Parfum",
    image: hommeImage,
    glow: "rgba(0, 119, 255, 0.22)",
    glowStrong: "rgba(0, 145, 255, 0.30)",
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
    description:
      "An elegant expression designed to leave a graceful and unforgettable impression.",
  },
]

function SignatureCollection() {
  return (
    <section
      id="collection"
      className="relative overflow-hidden bg-[#050505] px-5 py-16 sm:py-20 md:px-8 md:py-24"
    >
      {/* Dark section atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.02] blur-[180px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-12"
        >
          <p className="mb-3 text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] sm:text-[10px]">
            The Signature Collection
          </p>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl text-3xl font-medium leading-tight tracking-[-0.03em] text-[#F5F5F5] sm:text-4xl md:text-5xl">
              Two expressions.
              <span className="block text-white/35">
                One unmistakable presence.
              </span>
            </h2>

            <p className="max-w-sm text-sm leading-7 text-white/40">
              Discover fragrances created to become part of your identity,
              crafted for moments that deserve to be remembered.
            </p>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{
                duration: 0.65,
                delay: index * 0.1,
              }}
              className="group relative overflow-hidden border border-white/10 bg-[#080808] transition duration-500 hover:border-[#D4AF37]/25"
            >
              {/* IMAGE AREA */}
              <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden bg-[#060606] sm:min-h-[410px] md:min-h-[440px]">

                {/* Large colored ambient glow */}
                <div
                  className="absolute left-1/2 top-[48%] h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[85px] sm:h-[280px] sm:w-[280px] md:h-[320px] md:w-[320px]"
                  style={{
                    background: product.glow,
                  }}
                />

                {/* Stronger light directly behind the bottle */}
                <div
                  className="absolute left-1/2 top-[55%] h-[110px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[45px] sm:h-[130px] sm:w-[220px]"
                  style={{
                    background: product.glowStrong,
                  }}
                />

                {/* Gold outer ring */}
                <div className="absolute h-[250px] w-[250px] rounded-full border border-[#D4AF37]/10 sm:h-[310px] sm:w-[310px] md:h-[340px] md:w-[340px]" />

                {/* Inner dark ring */}
                <div className="absolute h-[195px] w-[195px] rounded-full border border-white/[0.035] sm:h-[245px] sm:w-[245px] md:h-[270px] md:w-[270px]" />

                {/* Product number */}
                <span className="absolute right-5 top-5 text-[9px] tracking-[0.3em] text-white/20">
                  {product.number}
                </span>

                {/* Perfume */}
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
                    delay: index * 0.5,
                  }}
                  whileHover={{
                    scale: 1.04,
                  }}
                  className="relative z-10 h-auto w-[220px] select-none object-contain drop-shadow-[0_28px_35px_rgba(0,0,0,0.8)] sm:w-[270px] md:w-[310px]"
                  draggable="false"
                />

                {/* Floor glow */}
                <div
                  className="absolute bottom-[56px] left-1/2 h-[4px] w-[110px] -translate-x-1/2 rounded-full blur-[8px] sm:w-[145px] md:w-[165px]"
                  style={{
                    background: product.glowStrong,
                  }}
                />

                {/* Bottom shadow */}
                <div className="absolute bottom-[48px] left-1/2 h-[18px] w-[150px] -translate-x-1/2 rounded-full bg-black/85 blur-xl sm:w-[180px]" />
              </div>

              {/* PRODUCT DETAILS */}
              <div className="border-t border-white/10 bg-[#080808] p-5 sm:p-6">
                <p className="mb-2 text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
                  {product.subtitle}
                </p>

                <div className="flex items-end justify-between gap-5">
                  <div>
                    <h3 className="text-2xl font-medium text-[#F5F5F5]">
                      {product.name}
                    </h3>

                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/40">
                      {product.description}
                    </p>
                  </div>

                  <Link
                    to={`/product/${product.id}`}
                    aria-label={`View ${product.name}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 text-white/55 transition duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                  >
                    <FiArrowUpRight size={17} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View Full Collection */}
        <div className="mt-8 flex justify-center md:mt-10">
          <Link
            to="/shop"
            className="border-b border-[#D4AF37]/40 pb-2 text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] transition duration-300 hover:border-[#D4AF37]"
          >
            View Full Collection
          </Link>
        </div>
      </div>
    </section>
  )
}

export default SignatureCollection
