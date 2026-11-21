import { useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "motion/react"
import { FiArrowDown, FiArrowUpRight, FiStar } from "react-icons/fi"

import studioBaseImage from "../assets/studio-box-base.png"
import studioLidOutsideImage from "../assets/studio-box-lid-outside.png"
import studioLidInsideImage from "../assets/studio-box-lid-inside.png"
import bottleHommeImage from "../assets/bottle-homme.png"
import bottleFemmeImage from "../assets/bottle-femme.png"

const fragrances = [
  {
    id: "homme",
    name: "Pour Homme",
    shortName: "HOMME",
    image: bottleHommeImage,
    accent: "#087DFF",
    glow: "rgba(0, 119, 255, 0.35)",
    description: "A confident signature with depth, clarity, and undeniable presence.",
  },
  {
    id: "femme",
    name: "Pour Femme",
    shortName: "FEMME",
    image: bottleFemmeImage,
    accent: "#E31B23",
    glow: "rgba(220, 20, 35, 0.35)",
    description: "A distinctive signature designed to linger long after you leave.",
  },
]

function Hero() {
  const sectionRef = useRef(null)

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isSmallScreen = windowWidth < 1024
  const isMobileScreen = windowWidth < 640

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  /* =========================================================
     1. INTRO HERO COPY
     - At scroll = 0: Perfectly centered typography, clean luxury.
     - As soon as user scrolls (0.04 to 0.12): Fades out & hides completely!
     - Can NEVER block the box when unboxing starts!
     ========================================================= */
  const introOpacity = useTransform(scrollYProgress, [0, 0.04, 0.12], [1, 1, 0])
  const introY = useTransform(scrollYProgress, [0, 0.12], [0, -60])
  const introScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.94])
  const introDisplay = useTransform(scrollYProgress, (v) => (v > 0.13 ? "none" : "flex"))

  /* =========================================================
     2. MASTER BOX ASSEMBLY
     - At scroll = 0: Completely invisible (opacity: 0)
     - Desktop: Box opens and stays in center between both bottles
     - MOBILE/TABLET: Box opens, then smoothly disappears as both perfumes
       launch out so the bottles take full center stage with no clutter!
     ========================================================= */
  const boxDesktopOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.18, 0.38, 0.48],
    [0, 0, 1, 0.7, 0]
  )
  const boxMobileOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.18, 0.36, 0.46],
    [0, 0, 1, 0.7, 0]
  )
  const boxAssemblyOpacity = isSmallScreen ? boxMobileOpacity : boxDesktopOpacity

  const boxAssemblyScale = useTransform(
    scrollYProgress,
    [0.08, 0.18, 0.45, 0.75, 1],
    [0.85, 0.96, 1.02, 0.95, 0.82]
  )

  const boxAssemblyY = useTransform(
    scrollYProgress,
    [0.08, 0.18, 0.45, 0.75, 1],
    [50, 40, 15, 20, -35]
  )

  /* =========================================================
     3. PHYSICAL 3D BOX UNBOXING
     - 0.18: Box is CLOSED shut. Closed lid covers base.
     - 0.18 to 0.46: Scroll down slowly -> Box physically OPENS in 3D!
     - Closed lid rotates backward in 3D (-95deg) and lifts.
     - Golden cavity glow flares out from inside.
     - Open inside lid unfolds upright (0deg) with gold logo.
     - Reverse scroll -> Lid reverses and CLOSES shut smoothly!
     ========================================================= */
  // CLOSED LID (Outer leather + gold logo): Lifts and tilts back in 3D
  const lidOutsideRotateX = useTransform(
    scrollYProgress,
    [0.18, 0.28, 0.42],
    [0, -45, -95]
  )

  const lidOutsideY = useTransform(
    scrollYProgress,
    [0.18, 0.28, 0.42],
    [0, -35, -90]
  )

  const lidOutsideOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.30, 0.38],
    [1, 1, 0]
  )

  // OPEN LID (Inner velvet + gold logo): Unfolds upright into position
  const lidInsideRotateX = useTransform(
    scrollYProgress,
    [0.26, 0.38, 0.48],
    [85, 30, 0]
  )

  const lidInsideY = useTransform(
    scrollYProgress,
    [0.26, 0.38, 0.48],
    [45, 15, 0]
  )

  const lidInsideOpacity = useTransform(
    scrollYProgress,
    [0.26, 0.34, 0.44],
    [0, 0.5, 1]
  )

  // Golden cavity glow when lid opens
  const cavityGlowOpacity = useTransform(
    scrollYProgress,
    [0.20, 0.36, 0.48],
    [0, 1, 0]
  )

  const cavityGlowScale = useTransform(
    scrollYProgress,
    [0.20, 0.36, 0.55],
    [0.4, 1.5, 1.8]
  )

  /* =========================================================
     4. PERFUMES LAUNCH OUT TO LEFT & RIGHT ("para ibabato")
     - Starts inside the cavity (y: 40, scale: 0.3)
     - As lid opens (0.36 to 0.48), bottles launch upward in an arc (y: -55)
       and fling outward with dynamic rotation!
     - Desktop: Fly to -360px & +360px with story cards alongside
     - Mobile: Fly to -78px & +78px so they sit beautifully side-by-side
       in the center while the box disappears!
     ========================================================= */
  const targetX = isMobileScreen ? 78 : isSmallScreen ? 140 : 360
  const maxTargetX = isMobileScreen ? 88 : isSmallScreen ? 160 : 410

  // POUR HOMME: Launches to Left
  const hommeXDesktop = useTransform(
    scrollYProgress,
    [0.36, 0.46, 0.60, 0.82, 0.98],
    [0, -180, -360, -360, -410]
  )
  const hommeXMobile = useTransform(
    scrollYProgress,
    [0.36, 0.46, 0.60, 0.82, 0.98],
    [0, -35, -targetX, -targetX, -maxTargetX]
  )
  const hommeX = isSmallScreen ? hommeXMobile : hommeXDesktop

  const hommeY = useTransform(
    scrollYProgress,
    [0.36, 0.46, 0.60, 0.82, 0.98],
    [40, -55, -10, -10, -25]
  )

  const hommeRotateZ = useTransform(
    scrollYProgress,
    [0.36, 0.46, 0.60, 0.82],
    [0, -14, -2, 0]
  )

  const hommeScale = useTransform(
    scrollYProgress,
    [0.36, 0.46, 0.60, 0.82, 0.98],
    [0.3, 0.88, 1.05, 1.0, 0.85]
  )

  const hommeOpacity = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.50, 0.88, 0.98],
    [0, 0.7, 1, 1, 0.2]
  )

  // POUR FEMME: Launches to Right
  const femmeXDesktop = useTransform(
    scrollYProgress,
    [0.36, 0.46, 0.60, 0.82, 0.98],
    [0, 180, 360, 360, 410]
  )
  const femmeXMobile = useTransform(
    scrollYProgress,
    [0.36, 0.46, 0.60, 0.82, 0.98],
    [0, 35, targetX, targetX, maxTargetX]
  )
  const femmeX = isSmallScreen ? femmeXMobile : femmeXDesktop

  const femmeY = useTransform(
    scrollYProgress,
    [0.36, 0.46, 0.60, 0.82, 0.98],
    [40, -55, -10, -10, -25]
  )

  const femmeRotateZ = useTransform(
    scrollYProgress,
    [0.36, 0.46, 0.60, 0.82],
    [0, 14, 2, 0]
  )

  const femmeScale = useTransform(
    scrollYProgress,
    [0.36, 0.46, 0.60, 0.82, 0.98],
    [0.3, 0.88, 1.05, 1.0, 0.85]
  )

  const femmeOpacity = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.50, 0.88, 0.98],
    [0, 0.7, 1, 1, 0.2]
  )

  // Details cards fade in alongside each bottle
  const cardsOpacity = useTransform(
    scrollYProgress,
    [0.48, 0.58, 0.82, 0.92],
    [0, 1, 1, 0]
  )

  const unboxHintOpacity = useTransform(
    scrollYProgress,
    [0.10, 0.18, 0.26],
    [0, 1, 0]
  )

  const finaleOpacity = useTransform(
    scrollYProgress,
    [0.82, 0.92, 1],
    [0, 1, 1]
  )

  return (
    <section
      ref={sectionRef}
      className="relative h-[340vh] overflow-clip bg-[#030303]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Dynamic 3D Luxury Atmosphere Glow */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[55vw] w-[55vw] max-h-[750px] max-w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.65, 0.95, 0.85, 0.3]),
            background: useTransform(
              scrollYProgress,
              [0, 0.30, 0.58, 0.85, 1],
              [
                "radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(0,0,0,0) 70%)",
                "radial-gradient(circle, rgba(212,175,55,0.32) 0%, rgba(0,0,0,0) 70%)",
                "radial-gradient(circle, rgba(0,119,255,0.22) 30%, rgba(220,20,35,0.22) 70%)",
                "radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(0,0,0,0) 70%)",
                "radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%)",
              ]
            ),
          }}
        />

        {/* Ambient Dark Gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(3,3,3,0.85)_90%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#030303] to-transparent" />

        {/* Delicate Golden Grid lines */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(212,175,55,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,.25)_1px,transparent_1px)] [background-size:100px_100px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />

        {/* =========================================================
            HEADER TITLE / INTRO (Scroll to Unbox)
            - Initial state: Pristine, centered, NO box.
            - Vanishes as soon as scroll begins, leaving the center clear!
           ========================================================= */}
        <motion.div
          style={{
            opacity: introOpacity,
            y: introY,
            scale: introScale,
            display: introDisplay,
          }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-5 text-center pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/[0.06] px-3.5 py-1 text-[8px] sm:text-[9px] uppercase tracking-[0.4em] sm:tracking-[0.45em] text-[#D4AF37]">
            <FiStar size={11} />
            <span>YOCANA FRAGRANCE HOUSE</span>
          </div>

          <h1 className="mx-auto mt-4 sm:mt-5 flex max-w-4xl flex-col items-center text-[32px] sm:text-6xl md:text-7xl lg:text-[96px] font-medium leading-[0.96] tracking-[-0.05em]">
            <span className="yocana-shimmer-presence inline-block">
              Your Presence.
            </span>
            <span className="yocana-shimmer-signature mt-1.5 inline-block sm:mt-2.5">
              Your Signature.
            </span>
          </h1>
        </motion.div>

        {/* Unboxing Scroll Hint */}
        <motion.div
          style={{ opacity: unboxHintOpacity }}
          className="absolute inset-x-0 top-[12%] z-30 mx-auto w-full px-5 text-center pointer-events-none"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
            ✦ THE UNBOXING ✦
          </p>
          <p className="mt-1.5 text-xs text-white/70">
            Scroll slowly to open the luxury vault...
          </p>
        </motion.div>

        {/* =========================================================
            PHYSICAL 3D UNBOXING & BOTTLE LAUNCH STAGE
           ========================================================= */}
        <div className="absolute inset-0 flex items-center justify-center [perspective:1600px] pointer-events-none">
          {/* CENTER LUXURY BOX ASSEMBLY */}
          <motion.div
            style={{
              opacity: boxAssemblyOpacity,
              scale: boxAssemblyScale,
              y: boxAssemblyY,
            }}
            className="relative flex flex-col items-center justify-center [transform-style:preserve-3d]"
          >
            {/* Golden Cavity Light Flare (Bursts when lid opens) */}
            <motion.div
              style={{
                opacity: cavityGlowOpacity,
                scale: cavityGlowScale,
              }}
              className="pointer-events-none absolute z-10 h-[280px] w-[280px] rounded-full bg-gradient-to-r from-[#D4AF37]/45 via-[#FFE28A]/35 to-transparent blur-3xl"
            />

            {/* 1. OPEN LID (Upright standing lid with gold Yocana flower) */}
            <motion.div
              style={{
                rotateX: lidInsideRotateX,
                y: lidInsideY,
                opacity: lidInsideOpacity,
                transformOrigin: "bottom center",
              }}
              className="relative z-15 flex items-center justify-center [transform-style:preserve-3d]"
            >
              <img
                src={studioLidInsideImage}
                alt="YOCANA Open Box Lid Interior"
                className="h-auto w-[180px] select-none object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.9)] sm:w-[240px] md:w-[280px]"
                draggable="false"
              />
            </motion.div>

            {/* 2. BASE + CLOSED LID STACK */}
            <div className="relative z-20 flex items-center justify-center -mt-1 sm:-mt-1.5 [transform-style:preserve-3d]">
              {/* Base with gold rim & velvet cutout */}
              <img
                src={studioBaseImage}
                alt="YOCANA Box Base"
                className="h-auto w-[180px] select-none object-contain drop-shadow-[0_45px_70px_rgba(0,0,0,0.98)] sm:w-[240px] md:w-[280px]"
                draggable="false"
              />

              {/* Closed Lid (Tilts backward in 3D to uncover the gold rim and cavity) */}
              <motion.div
                style={{
                  rotateX: lidOutsideRotateX,
                  y: lidOutsideY,
                  opacity: lidOutsideOpacity,
                  transformOrigin: "top center",
                }}
                className="absolute inset-0 z-25 flex items-center justify-center [transform-style:preserve-3d]"
              >
                <img
                  src={studioLidOutsideImage}
                  alt="YOCANA Box Closed Lid"
                  className="h-auto w-[180px] select-none object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] sm:w-[240px] md:w-[280px]"
                  draggable="false"
                />
              </motion.div>
            </div>

            {/* Floor Ambient Shadow */}
            <div className="absolute -bottom-8 left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-full bg-black/90 blur-2xl" />
          </motion.div>

          {/* =======================================================
              3. POUR HOMME (LAUNCHES OUT TO THE LEFT)
              - Dynamic curved trajectory + rotation ("parang binato")
              - High-res crisp bottle image + Sapphire glow + Story Card!
             ======================================================= */}
          <motion.div
            style={{
              x: hommeX,
              y: hommeY,
              rotateZ: hommeRotateZ,
              scale: hommeScale,
              opacity: hommeOpacity,
            }}
            className="absolute z-35 flex items-center gap-5 sm:gap-7 pointer-events-none"
          >
            {/* POUR HOMME BOTTLE PICTURE (Continuous Luxury Floating Physics) */}
            <motion.div
              animate={{
                y: [-7, 7, -7],
                rotateZ: [-1.5, 1.2, -1.5],
                rotateY: [-3.5, 3.5, -3.5],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative flex items-center justify-center [transform-style:preserve-3d]"
            >
              {/* Sapphire Blue Ambient Glow (Breathing luxury aura) */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.65, 0.95, 0.65],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -inset-8 rounded-full bg-[#087DFF]/35 blur-3xl"
              />

              <img
                src={bottleHommeImage}
                alt="YOCANA Pour Homme Bottle"
                className="h-[185px] w-auto select-none object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)] sm:h-[260px] md:h-[320px] lg:h-[370px]"
                draggable="false"
              />
            </motion.div>

            {/* POUR HOMME EDITORIAL STORY (Desktop) */}
            <motion.div
              style={{ opacity: cardsOpacity }}
              className="hidden lg:flex flex-col max-w-[210px] text-left"
            >
              <span className="rounded bg-[#087DFF]/15 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.3em] text-[#087DFF] w-fit">
                Signature 01
              </span>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-white lg:text-3xl">
                POUR HOMME
              </h2>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-base font-semibold text-[#D4AF37]">₱1,499</span>
                <span className="text-xs text-white/40 line-through">₱2,199</span>
              </div>
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]">
                Extrait de Parfum · 50 ML
              </p>
              <p className="mt-2 text-xs leading-5 text-white/50">
                {fragrances[0].description}
              </p>
              <Link
                to="/product/1"
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#087DFF]/40 bg-[#087DFF]/10 px-4 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#087DFF] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#087DFF] hover:bg-[#087DFF]/25 hover:text-white w-fit pointer-events-auto active:scale-95"
              >
                Explore Pour Homme
                <FiArrowUpRight size={13} />
              </Link>
            </motion.div>
          </motion.div>

          {/* =======================================================
              4. POUR FEMME (LAUNCHES OUT TO THE RIGHT)
              - Dynamic curved trajectory + rotation ("parang binato")
              - High-res crisp bottle image + Ruby glow + Story Card!
             ======================================================= */}
          <motion.div
            style={{
              x: femmeX,
              y: femmeY,
              rotateZ: femmeRotateZ,
              scale: femmeScale,
              opacity: femmeOpacity,
            }}
            className="absolute z-35 flex items-center gap-5 sm:gap-7 flex-row-reverse pointer-events-none"
          >
            {/* POUR FEMME BOTTLE PICTURE (Continuous Luxury Floating Physics, Offset Phase) */}
            <motion.div
              animate={{
                y: [7, -7, 7],
                rotateZ: [1.5, -1.2, 1.5],
                rotateY: [3.5, -3.5, 3.5],
              }}
              transition={{
                duration: 5.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="relative flex items-center justify-center [transform-style:preserve-3d]"
            >
              {/* Ruby Red Ambient Glow (Breathing luxury aura) */}
              <motion.div
                animate={{
                  scale: [1.15, 1, 1.15],
                  opacity: [0.95, 0.65, 0.95],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
                className="pointer-events-none absolute -inset-8 rounded-full bg-[#E31B23]/35 blur-3xl"
              />

              <img
                src={bottleFemmeImage}
                alt="YOCANA Pour Femme Bottle"
                className="h-[185px] w-auto select-none object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)] sm:h-[260px] md:h-[320px] lg:h-[370px]"
                draggable="false"
              />
            </motion.div>

            {/* POUR FEMME EDITORIAL STORY (Desktop) */}
            <motion.div
              style={{ opacity: cardsOpacity }}
              className="hidden lg:flex flex-col text-right items-end max-w-[210px]"
            >
              <span className="rounded bg-[#E31B23]/15 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.3em] text-[#E31B23] w-fit">
                Signature 02
              </span>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-white lg:text-3xl">
                POUR FEMME
              </h2>
              <div className="mt-1 flex items-baseline justify-end gap-2">
                <span className="text-base font-semibold text-[#D4AF37]">₱1,499</span>
                <span className="text-xs text-white/40 line-through">₱2,199</span>
              </div>
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]">
                Extrait de Parfum · 50 ML
              </p>
              <p className="mt-2 text-xs leading-5 text-white/50">
                {fragrances[1].description}
              </p>
              <Link
                to="/product/2"
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#E31B23]/40 bg-[#E31B23]/10 px-4 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#E31B23] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#E31B23] hover:bg-[#E31B23]/25 hover:text-white w-fit pointer-events-auto active:scale-95"
              >
                Explore Pour Femme
                <FiArrowUpRight size={13} />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* =========================================================
            MOBILE PRODUCT LABELS (Centered beneath bottles)
           ========================================================= */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.48, 0.60, 0.80, 0.88], [0, 1, 1, 0]),
            y: useTransform(scrollYProgress, [0.48, 0.60], [25, 0]),
          }}
          className="absolute bottom-[9%] inset-x-0 z-40 px-4 text-center lg:hidden pointer-events-auto"
        >
          <div className="mx-auto max-w-xs sm:max-w-sm rounded-2xl border border-white/[0.12] bg-[#0c0c0c]/85 p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
            <p className="text-[8px] uppercase tracking-[0.35em] text-[#D4AF37]">
              The Dual Collection
            </p>
            <h3 className="mt-1 text-base font-medium text-white sm:text-lg">
              Pour Homme &amp; Pour Femme
            </h3>
            <p className="mt-0.5 text-[11px] text-white/60">
              <span className="font-semibold text-[#D4AF37]">₱1,499 each</span> · 50ml Extrait De Parfum
            </p>
            <div className="mt-2.5 flex items-center justify-center gap-2">
              <Link
                to="/product/1"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#087DFF]/50 bg-[#087DFF]/15 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-wider text-[#087DFF] backdrop-blur-md transition hover:bg-[#087DFF]/25 active:scale-95"
              >
                Pour Homme <FiArrowUpRight size={11} />
              </Link>
              <Link
                to="/product/2"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E31B23]/50 bg-[#E31B23]/15 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-wider text-[#E31B23] backdrop-blur-md transition hover:bg-[#E31B23]/25 active:scale-95"
              >
                Pour Femme <FiArrowUpRight size={11} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* =========================================================
            FINALE CALL TO ACTION (0.85 to 1.0)
           ========================================================= */}
        <motion.div
          style={{ opacity: finaleOpacity }}
          className="absolute inset-x-0 bottom-[10%] z-50 mx-auto flex max-w-xl flex-col items-center px-5 text-center"
        >
          <p className="text-[9px] uppercase tracking-[0.45em] text-[#D4AF37]">
            The Signature Duo
          </p>

          <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
            Find your signature.
          </h2>

          <p className="mt-2 text-xs text-white/60">
            ₱2,998 for both · Free Nationwide Shipping
          </p>

          <div className="mt-5 flex items-center justify-center">
            <Link
              to="/shop"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#FFE28A]/40 bg-[#D4AF37]/90 px-6 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#050505] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_20px_rgba(212,175,55,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-[#E1C35B] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] active:scale-95 sm:h-10 sm:px-7 sm:text-[9px]"
            >
              Shop Collection
              <FiArrowUpRight size={12} />
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator (Enlarged, clear text + prominent bouncing gold glass arrow) */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]),
          }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2.5 pointer-events-none"
        >
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.35em] text-[#D4AF37] drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)]">
            Scroll to explore
          </span>
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#FFE28A]/40 bg-black/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_20px_rgba(212,175,55,0.35)] backdrop-blur-xl">
            <FiArrowDown size={17} className="animate-bounce text-[#D4AF37]" />
          </div>
        </motion.div>

        {/* Golden Progress Bar at bottom */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="absolute bottom-0 left-0 z-[60] h-[2px] w-full origin-left bg-[#D4AF37]"
        />
      </div>
    </section>
  )
}

export default Hero
