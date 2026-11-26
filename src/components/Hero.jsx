import { useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "motion/react"
import { FiArrowDown, FiArrowUpRight, FiStar } from "react-icons/fi"

import boxFrame1 from "../assets/unboxing/box-frame-1.webp"
import boxFrame2 from "../assets/unboxing/box-frame-2.webp"
import boxFrame3 from "../assets/unboxing/box-frame-3.webp"
import boxFrame4 from "../assets/unboxing/box-frame-4.webp"
import boxFrame5 from "../assets/unboxing/box-frame-5.webp"
import bottleHommeImage from "../assets/bottle-homme.webp"
import bottleFemmeImage from "../assets/bottle-femme.webp"

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
     3. 5-FRAME SEQUENTIAL LUXURY BOX UNBOXING
     - Frame 1: Box is CLOSED shut with gold foil logo.
     - Frame 2: Box begins cracking open, showing gold interior rim.
     - Frame 3: Box opens to half, revealing velvet interior.
     - Frame 4: Box opens to ~75%, cavity fully accessible.
     - Frame 5: Box fully open upright with gold Yocana flower logo.
     - Reverse scroll smoothly closes the box frame-by-frame.
     ========================================================= */
  const frame1Opacity = useTransform(
    scrollYProgress,
    [0.08, 0.14, 0.18, 0.22],
    [0, 1, 1, 0]
  )
  const frame2Opacity = useTransform(
    scrollYProgress,
    [0.17, 0.22, 0.24, 0.28],
    [0, 1, 1, 0]
  )
  const frame3Opacity = useTransform(
    scrollYProgress,
    [0.23, 0.28, 0.30, 0.34],
    [0, 1, 1, 0]
  )
  const frame4Opacity = useTransform(
    scrollYProgress,
    [0.29, 0.34, 0.36, 0.40],
    [0, 1, 1, 0]
  )
  const frame5Opacity = useTransform(
    scrollYProgress,
    [0.35, 0.40, 0.42, 0.48],
    [0, 1, 1, 0]
  )

  // Golden cavity glow when lid opens
  const cavityGlowOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.36, 0.46],
    [0, 0.9, 0]
  )

  const cavityGlowScale = useTransform(
    scrollYProgress,
    [0.22, 0.36, 0.50],
    [0.4, 1.4, 1.7]
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
        {/* Luxury Atmosphere Glow (Static hardware-accelerated GPU layer, 0 CPU re-renders) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] max-h-[650px] max-w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,rgba(8,125,255,0.08)_45%,transparent_70%)] blur-2xl sm:blur-3xl opacity-80" />

        {/* Ambient Dark Gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(3,3,3,0.85)_90%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#030303] to-transparent" />

        {/* Delicate Golden Grid lines (Desktop only to prevent mobile compositing penalty) */}
        <div className="pointer-events-none absolute inset-0 hidden sm:block opacity-[0.05] [background-image:linear-gradient(rgba(212,175,55,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,.25)_1px,transparent_1px)] [background-size:100px_100px]" />

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

          <h1
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              e.currentTarget.style.setProperty("--tagline-x", `${e.clientX - rect.left}px`)
              e.currentTarget.style.setProperty("--tagline-y", `${e.clientY - rect.top}px`)
            }}
            className="group/tagline relative pointer-events-auto cursor-default mx-auto mt-4 sm:mt-5 flex max-w-4xl flex-col items-center text-[32px] sm:text-6xl md:text-7xl lg:text-[96px] font-medium leading-[0.96] tracking-[-0.05em] select-none"
          >
            {/* 1. Base Tagline: Always softly shining on both desktop & mobile */}
            <span className="yocana-presence-shine inline-block">
              Your Presence.
            </span>
            <span className="yocana-signature-shine mt-1.5 inline-block sm:mt-2.5">
              Your Signature.
            </span>

            {/* 2. Desktop White Light Spotlight (Ang mouse cursor mismo ang nagpapailaw sa text sa white kapag dumaan o naka-stop) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden sm:flex flex-col items-center opacity-0 transition-opacity duration-200 group-hover/tagline:opacity-100"
              style={{
                WebkitMaskImage:
                  "radial-gradient(160px circle at var(--tagline-x, 50%) var(--tagline-y, 50%), black 0%, black 40%, transparent 100%)",
                maskImage:
                  "radial-gradient(160px circle at var(--tagline-x, 50%) var(--tagline-y, 50%), black 0%, black 40%, transparent 100%)",
              }}
            >
              <span className="text-white inline-block drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
                Your Presence.
              </span>
              <span className="text-white mt-1.5 inline-block sm:mt-2.5 drop-shadow-[0_0_14px_rgba(255,255,255,0.95)]">
                Your Signature.
              </span>
            </div>
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
            5-FRAME UNBOXING & BOTTLE LAUNCH STAGE
           ========================================================= */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* CENTER LUXURY BOX ASSEMBLY */}
          <motion.div
            style={{
              opacity: boxAssemblyOpacity,
              scale: boxAssemblyScale,
              y: boxAssemblyY,
            }}
            className="relative flex items-center justify-center"
          >
            {/* Box Stack Container (768x1024 aspect ratio, base perfectly anchored) */}
            <div className="relative w-[210px] sm:w-[270px] md:w-[320px] lg:w-[360px] aspect-[3/4] flex items-center justify-center">
              {/* Golden Cavity Light Flare (Bursts when lid opens) */}
              <motion.div
                style={{
                  opacity: cavityGlowOpacity,
                  scale: cavityGlowScale,
                }}
                className="pointer-events-none absolute z-10 h-[220px] w-[220px] sm:h-[280px] sm:w-[280px] rounded-full bg-gradient-to-r from-[#D4AF37]/45 via-[#FFE28A]/35 to-transparent blur-2xl sm:blur-3xl"
              />

              {/* Frame 1: Closed Box */}
              <motion.img
                src={boxFrame1}
                alt="YOCANA Box Closed"
                style={{ opacity: frame1Opacity }}
                className="absolute inset-0 h-full w-full select-none object-contain transform-gpu"
                draggable="false"
              />

              {/* Frame 2: Box Cracking Open */}
              <motion.img
                src={boxFrame2}
                alt="YOCANA Box Opening"
                style={{ opacity: frame2Opacity }}
                className="absolute inset-0 h-full w-full select-none object-contain transform-gpu"
                draggable="false"
              />

              {/* Frame 3: Box Half Open */}
              <motion.img
                src={boxFrame3}
                alt="YOCANA Box Half Open"
                style={{ opacity: frame3Opacity }}
                className="absolute inset-0 h-full w-full select-none object-contain transform-gpu"
                draggable="false"
              />

              {/* Frame 4: Box 75% Open */}
              <motion.img
                src={boxFrame4}
                alt="YOCANA Box Nearly Open"
                style={{ opacity: frame4Opacity }}
                className="absolute inset-0 h-full w-full select-none object-contain transform-gpu"
                draggable="false"
              />

              {/* Frame 5: Box Fully Open with Gold Logo */}
              <motion.img
                src={boxFrame5}
                alt="YOCANA Box Fully Open"
                style={{ opacity: frame5Opacity }}
                className="absolute inset-0 h-full w-full select-none object-contain transform-gpu"
                draggable="false"
              />

              {/* Floor Ambient Shadow */}
              <div className="absolute -bottom-6 left-1/2 h-8 w-[75%] -translate-x-1/2 rounded-full bg-black/90 blur-xl pointer-events-none" />
            </div>
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
            className="absolute z-35 flex items-center gap-5 sm:gap-7 pointer-events-none transform-gpu will-change-transform"
          >
            {/* POUR HOMME BOTTLE PICTURE (Crystal-clear luxury bottle with halo aura BEHIND) */}
            <div className="relative flex items-center justify-center">
              {/* Sapphire Blue Ambient Halo strictly BEHIND the bottle */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#087DFF]/40 blur-2xl sm:blur-3xl"
              />

              {/* Crystal-clear bottle in FRONT with crisp depth */}
              <img
                src={bottleHommeImage}
                alt="YOCANA Pour Homme Bottle"
                className="relative z-10 h-[185px] w-auto select-none object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] sm:h-[260px] md:h-[320px] lg:h-[370px]"
                draggable="false"
              />
            </div>

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
                <span className="text-base font-semibold text-[#D4AF37]">₱1,699</span>
                <span className="text-xs text-white/40 line-through">₱2,299</span>
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
            className="absolute z-35 flex items-center gap-5 sm:gap-7 flex-row-reverse pointer-events-none transform-gpu will-change-transform"
          >
            {/* POUR FEMME BOTTLE PICTURE (Crystal-clear luxury bottle with halo aura BEHIND) */}
            <div className="relative flex items-center justify-center">
              {/* Ruby Red Ambient Halo strictly BEHIND the bottle */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E31B23]/40 blur-2xl sm:blur-3xl"
              />

              {/* Crystal-clear bottle in FRONT with crisp depth */}
              <img
                src={bottleFemmeImage}
                alt="YOCANA Pour Femme Bottle"
                className="relative z-10 h-[185px] w-auto select-none object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] sm:h-[260px] md:h-[320px] lg:h-[370px]"
                draggable="false"
              />
            </div>

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
                <span className="text-base font-semibold text-[#D4AF37]">₱1,699</span>
                <span className="text-xs text-white/40 line-through">₱2,299</span>
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
              <span className="font-semibold text-[#D4AF37]">₱1,699 each</span> · 50ml Extrait De Parfum
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
            ₱3,398 for both · Free Nationwide Shipping
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
