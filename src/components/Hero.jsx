import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { FiArrowUpRight } from "react-icons/fi"

import hommeImage from "../assets/yocana-homme.png"
import femmeImage from "../assets/yocana-femme.png"

const fragrances = [
  {
    id: "homme",
    name: "Pour Homme",
    image: hommeImage,
    glow: "rgba(0, 119, 255, 0.22)",
    glowStrong: "rgba(0, 145, 255, 0.28)",
  },
  {
    id: "femme",
    name: "Pour Femme",
    image: femmeImage,
    glow: "rgba(210, 15, 30, 0.22)",
    glowStrong: "rgba(255, 25, 35, 0.28)",
  },
]

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) =>
        current === fragrances.length - 1 ? 0 : current + 1
      )
    }, 5500)

    return () => clearInterval(interval)
  }, [])

  const activeProduct = fragrances[activeIndex]

  return (
    <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#030303]">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">

        {/* Very subtle gold atmosphere */}
        <div className="absolute left-[35%] top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.025] blur-[160px]" />

        {/* Dark vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#030303] to-transparent" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl grid-cols-1 items-center px-5 py-8 md:grid-cols-2 md:gap-12 md:px-8 md:py-14">

        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 z-20 pb-6 text-center md:order-1 md:pb-0 md:text-left"
        >
          <p className="mb-4 text-[10px] uppercase tracking-[0.45em] text-[#D4AF37] sm:text-xs">
            Signature Eau De Parfum
          </p>

          <h1 className="text-[43px] font-medium leading-[0.96] tracking-[-0.04em] text-[#F5F5F5] sm:text-6xl md:text-7xl lg:text-[82px]">
            Your Presence.

            <span className="block text-[#D4AF37]">
              Your Signature.
            </span>
          </h1>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mt-5"
            >
              <p className="text-[9px] uppercase tracking-[0.35em] text-white/30">
                Currently Featuring
              </p>

              <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/65">
                YOCANA {activeProduct.name}
              </p>
            </motion.div>
          </AnimatePresence>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/40 md:mx-0 md:text-base">
            A fragrance crafted to leave an impression long after you leave
            the room.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link
              to="/shop"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#D4AF37] px-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#050505] transition duration-300 hover:bg-[#E1C35B]"
            >
              Explore Collection
              <FiArrowUpRight size={16} />
            </Link>

            <a
              href="#story"
              className="inline-flex min-h-12 items-center justify-center border border-white/15 px-7 text-xs uppercase tracking-[0.18em] text-white/65 transition duration-300 hover:border-[#D4AF37]/60 hover:text-[#D4AF37]"
            >
              Our Story
            </a>
          </div>

          {/* Product selectors */}
          <div className="mt-8 flex items-center justify-center gap-3 md:justify-start">
            {fragrances.map((product, index) => (
              <button
                key={product.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${product.name}`}
                className={`h-[2px] transition-all duration-500 ${
                  activeIndex === index
                    ? "w-10 bg-[#D4AF37]"
                    : "w-5 bg-white/15"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* PRODUCT */}
        <div className="order-1 relative flex min-h-[360px] items-center justify-center sm:min-h-[460px] md:order-2 md:min-h-[590px]">

          {/* LARGE COLORED AMBIENT GLOW */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`ambient-${activeProduct.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute h-[260px] w-[260px] rounded-full blur-[100px] sm:h-[330px] sm:w-[330px] md:h-[400px] md:w-[400px]"
              style={{
                background: activeProduct.glow,
              }}
            />
          </AnimatePresence>

          {/* STRONGER GLOW DIRECTLY BEHIND BOTTLE */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`inner-glow-${activeProduct.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute top-[54%] h-[120px] w-[190px] -translate-y-1/2 rounded-full blur-[50px] sm:h-[150px] sm:w-[240px] md:h-[180px] md:w-[290px]"
              style={{
                background: activeProduct.glowStrong,
              }}
            />
          </AnimatePresence>

          {/* SUBTLE GOLD OUTER RING */}
          <div className="absolute h-[290px] w-[290px] rounded-full border border-[#D4AF37]/10 sm:h-[380px] sm:w-[380px] md:h-[460px] md:w-[460px]" />

          {/* INNER DARK RING */}
          <div className="absolute h-[230px] w-[230px] rounded-full border border-white/[0.04] sm:h-[305px] sm:w-[305px] md:h-[370px] md:w-[370px]" />

          {/* PERFUME */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{
                opacity: 0,
                scale: 0.94,
                x: 24,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                x: -24,
              }}
              transition={{
                duration: 0.65,
                ease: "easeOut",
              }}
              className="relative z-10"
            >
              <motion.img
                src={activeProduct.image}
                alt={`YOCANA ${activeProduct.name}`}
                animate={{
                  y: [0, -10, 0],
                  rotate: [-0.3, 0.3, -0.3],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-auto w-[255px] select-none object-contain drop-shadow-[0_30px_35px_rgba(0,0,0,0.8)] sm:w-[330px] md:w-[420px]"
                draggable="false"
              />
            </motion.div>
          </AnimatePresence>

          {/* FLOOR GLOW */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`floor-${activeProduct.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute bottom-[65px] left-1/2 h-[5px] w-[130px] -translate-x-1/2 rounded-full blur-[10px] sm:w-[170px] md:bottom-[75px] md:w-[210px]"
              style={{
                background: activeProduct.glowStrong,
              }}
            />
          </AnimatePresence>

          {/* Floor shadow */}
          <div className="absolute bottom-[55px] left-1/2 h-[20px] w-[180px] -translate-x-1/2 rounded-full bg-black/90 blur-xl sm:w-[220px] md:bottom-[60px]" />

          {/* Decorative text */}
          <div className="absolute bottom-1 hidden items-center gap-3 text-[8px] uppercase tracking-[0.35em] text-white/20 sm:flex">
            <span className="h-px w-7 bg-[#D4AF37]/30" />
            Eau De Parfum
            <span className="h-px w-7 bg-[#D4AF37]/30" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
