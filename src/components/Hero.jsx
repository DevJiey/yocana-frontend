import { useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "motion/react"
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi"

import hommeImage from "../assets/yocana-homme.png"
import femmeImage from "../assets/yocana-femme.png"

const fragrances = [
  {
    id: "homme",
    name: "Pour Homme",
    shortName: "HOMME",
    image: hommeImage,
    accent: "#087DFF",
    glow: "rgba(0, 119, 255, 0.24)",
    description: "A confident signature with depth, clarity, and presence.",
  },
  {
    id: "femme",
    name: "Pour Femme",
    shortName: "FEMME",
    image: femmeImage,
    accent: "#E31B23",
    glow: "rgba(220, 20, 35, 0.24)",
    description: "A distinctive signature designed to linger long after you leave.",
  },
]

function Hero() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const introOpacity = useTransform(scrollYProgress, [0, 0.14, 0.22], [1, 1, 0])
  const introY = useTransform(scrollYProgress, [0, 0.22], [0, -100])

  const bottleScale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.45, 0.7, 1],
    [0.72, 0.92, 1.08, 0.96, 0.72]
  )

  const bottleY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55, 0.78, 1],
    [90, 0, -25, 20, -110]
  )

  const bottleRotateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-10, 0, 12]
  )

  const bottleRotateZ = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    [-2, 2, -1, 3]
  )

  const femmeX = useTransform(
    scrollYProgress,
    [0, 0.28, 0.55, 0.78, 1],
    [240, 150, 0, -70, -220]
  )

  const femmeOpacity = useTransform(
    scrollYProgress,
    [0, 0.24, 0.36, 0.7, 0.88, 1],
    [0, 0, 0.25, 1, 0.35, 0]
  )

  const femmeScale = useTransform(
    scrollYProgress,
    [0.25, 0.55, 0.8, 1],
    [0.8, 1, 1.04, 0.82]
  )

  const hommeX = useTransform(
    scrollYProgress,
    [0, 0.28, 0.5, 0.72, 1],
    [-240, -150, 0, 70, 220]
  )

  const hommeOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.18, 0.3, 0.7, 0.88, 1],
    [0, 0, 0.9, 1, 0.45, 0.9, 0]
  )

  const hommeScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.55, 0.82, 1],
    [0.72, 0.82, 1, 1.04, 0.8]
  )

  const collectionLabelOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.34, 0.68, 0.82],
    [0, 1, 1, 0]
  )

  const collectionLabelY = useTransform(
    scrollYProgress,
    [0.2, 0.38, 0.7, 0.82],
    [30, 0, 0, -25]
  )

  const femmeLabelOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.62, 0.78, 0.9],
    [0, 1, 1, 0]
  )

  const femmeLabelX = useTransform(
    scrollYProgress,
    [0.5, 0.62, 0.78, 0.9],
    [-35, 0, 0, -35]
  )

  const hommeLabelOpacity = useTransform(
    scrollYProgress,
    [0.13, 0.2, 0.34, 0.46],
    [0, 1, 1, 0]
  )

  const hommeLabelX = useTransform(
    scrollYProgress,
    [0.08, 0.18, 0.32, 0.44],
    [35, 0, 0, 35]
  )

  const endOpacity = useTransform(
    scrollYProgress,
    [0.76, 0.9, 1],
    [0, 1, 1]
  )

  return (
    <section
      ref={sectionRef}
      className="relative h-[280vh] overflow-clip bg-[#030303]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Ambient 3D atmosphere */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[42vw] w-[42vw] max-h-[620px] max-w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.7, 1, 0.75, 0.25]),
            background: useTransform(
              scrollYProgress,
              [0, 0.35, 0.62, 1],
              [
                "rgba(0,119,255,0.14)",
                "rgba(0,119,255,0.18)",
                "rgba(220,20,35,0.17)",
                "rgba(212,175,55,0.08)",
              ]
            ),
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.68)_85%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#030303] to-transparent" />

        {/* Fine grid / depth lines */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:90px_90px] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />

        {/* Header copy */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute inset-x-0 top-[17%] z-30 mx-auto w-full px-5 text-center"
        >
          <p className="text-[9px] uppercase tracking-[0.55em] text-[#D4AF37] sm:text-[10px]">
            YOCANA Fragrance House
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl text-[40px] font-medium leading-[0.94] tracking-[-0.055em] text-white sm:text-6xl md:text-8xl lg:text-[108px]">
            Your Presence.
            <span className="block text-[#D4AF37]">Your Signature.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-xs leading-6 text-white/35 sm:text-sm">
            Scroll to enter the world of YOCANA.
          </p>
        </motion.div>

        {/* 3D stage */}
        <div className="absolute inset-0 flex items-center justify-center [perspective:1400px]">
          <motion.div
            style={{
              scale: bottleScale,
              y: bottleY,
              rotateY: bottleRotateY,
              rotateZ: bottleRotateZ,
            }}
            className="relative mt-10 h-[55vh] w-[76vw] max-w-[560px] [transform-style:preserve-3d]"
          >
  
            {/* Homme */}
            <motion.img
              src={hommeImage}
              alt="YOCANA Pour Homme"
              style={{
                x: hommeX,
                opacity: hommeOpacity,
                scale: hommeScale,
              }}
              className="absolute left-1/2 top-1/2 z-20 h-auto w-[64vw] max-w-[430px] -translate-x-1/2 -translate-y-1/2 select-none object-contain drop-shadow-[0_45px_65px_rgba(0,0,0,0.9)]"
              draggable="false"
            />

            {/* Femme */}
            <motion.img
              src={femmeImage}
              alt="YOCANA Pour Femme"
              style={{
                x: femmeX,
                opacity: femmeOpacity,
                scale: femmeScale,
              }}
              className="absolute left-1/2 top-1/2 z-30 h-auto w-[64vw] max-w-[430px] -translate-x-1/2 -translate-y-1/2 select-none object-contain drop-shadow-[0_45px_65px_rgba(0,0,0,0.9)]"
              draggable="false"
            />

            {/* Mobile product label */}
            <motion.div
              style={{
                opacity: hommeLabelOpacity,
                y: useTransform(
                  scrollYProgress,
                  [0.13, 0.2, 0.34, 0.46],
                  [18, 0, 0, -18]
                ),
              }}
              className="absolute bottom-[12%] left-1/2 z-50 w-full -translate-x-1/2 text-center md:hidden"
            >
              <p className="text-[8px] uppercase tracking-[0.42em] text-[#087DFF]">
                Signature
              </p>
              <p className="mt-2 text-xl tracking-[0.12em] text-white">
                POUR HOMME
              </p>
              <p className="mx-auto mt-2 max-w-[230px] px-4 text-[10px] leading-5 text-white/35">
                A confident signature with depth, clarity, and presence.
              </p>
            </motion.div>

            {/* Mobile Femme label */}
            <motion.div
              style={{
                opacity: femmeLabelOpacity,
                y: useTransform(
                  scrollYProgress,
                  [0.5, 0.62, 0.78, 0.9],
                  [18, 0, 0, -18]
                ),
              }}
              className="absolute bottom-[12%] left-1/2 z-50 w-full -translate-x-1/2 text-center md:hidden"
            >
              <p className="text-[8px] uppercase tracking-[0.42em] text-[#E31B23]">
                Signature
              </p>
              <p className="mt-2 text-xl tracking-[0.12em] text-white">
                POUR FEMME
              </p>
              <p className="mx-auto mt-2 max-w-[230px] px-4 text-[10px] leading-5 text-white/35">
                A distinctive signature designed to linger long after you leave.
              </p>
            </motion.div>

            {/* Floor */}
            <motion.div
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.55, 1], [0.3, 0.75, 0.2]),
              }}
              className="absolute bottom-[7%] left-1/2 h-3 w-[45%] -translate-x-1/2 rounded-full bg-[#D4AF37]/20 blur-2xl"
            />
          </motion.div>
        </div>

        {/* Homme story label */}
        <motion.div
          style={{ opacity: hommeLabelOpacity, x: hommeLabelX }}
          className="absolute left-[7%] top-1/2 z-40 hidden -translate-y-1/2 md:block"
        >
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#087DFF]">
            Signature
          </p>
          <p className="mt-3 text-3xl tracking-[-0.03em] text-white lg:text-5xl">
            POUR HOMME
          </p>
          <p className="mt-4 max-w-[250px] text-xs leading-6 text-white/35">
            {fragrances[0].description}
          </p>
        </motion.div>

        {/* Femme story label */}
        <motion.div
          style={{ opacity: femmeLabelOpacity, x: femmeLabelX }}
          className="absolute right-[7%] top-1/2 z-40 hidden -translate-y-1/2 text-right md:block"
        >
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#E31B23]">
            Signature
          </p>
          <p className="mt-3 text-3xl tracking-[-0.03em] text-white lg:text-5xl">
            POUR FEMME
          </p>
          <p className="ml-auto mt-4 max-w-[250px] text-xs leading-6 text-white/35">
            {fragrances[1].description}
          </p>
        </motion.div>

        {/* Collection transition */}
        <motion.div
          style={{ opacity: collectionLabelOpacity, y: collectionLabelY }}
          className="absolute inset-x-0 bottom-[12%] z-40 text-center"
        >
          <p className="text-[8px] uppercase tracking-[0.5em] text-white/25">
            The Collection
          </p>
          <p className="mt-3 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            Two signatures. One presence.
          </p>
        </motion.div>

        {/* End CTA */}
        <motion.div
          style={{ opacity: endOpacity }}
          className="absolute inset-x-0 bottom-[13%] z-50 mx-auto flex max-w-xl flex-col items-center px-5 text-center"
        >
          <p className="text-[9px] uppercase tracking-[0.5em] text-[#D4AF37]">
            Discover YOCANA
          </p>

          <h2 className="mt-4 text-3xl tracking-[-0.04em] text-white sm:text-5xl">
            Find your signature.
          </h2>

          <Link
            to="/shop"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 bg-[#D4AF37] px-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#050505] transition hover:bg-[#E1C35B]"
          >
            Shop Now
            <FiArrowUpRight size={15} />
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]),
          }}
          className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 text-white/25"
        >
          <span className="text-[8px] uppercase tracking-[0.35em]">
            Scroll to explore
          </span>
          <FiArrowDown size={13} />
        </motion.div>

        {/* Progress line */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="absolute bottom-0 left-0 z-[60] h-px w-full origin-left bg-[#D4AF37]/70"
        />
      </div>
    </section>
  )
}

export default Hero
