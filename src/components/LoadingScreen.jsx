import { motion } from "motion/react"

import yocanaLogo from "../assets/yocana-logo-gold.png"

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030303]"
    >
      <div className="relative flex flex-col items-center">

        {/* GOLD GLOW */}
        <motion.div
          animate={{
            opacity: [0.08, 0.2, 0.08],
            scale: [0.9, 1.08, 0.9],
          }}
          transition={{
            duration: 2.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-[100px]"
        />

        {/* LOGO */}
        <motion.img
          src={yocanaLogo}
          alt="YOCANA"
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="relative z-10 h-auto w-[115px] select-none object-contain sm:w-[130px]"
          draggable="false"
        />

        {/* LOADING LINE */}
        <div className="relative z-10 mt-8 h-px w-[145px] overflow-hidden bg-white/10">
          <motion.div
            initial={{
              x: "-100%",
            }}
            animate={{
              x: "200%",
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-1/2 bg-[#D4AF37]"
          />
        </div>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.35,
            duration: 0.5,
          }}
          className="relative z-10 mt-5 text-[8px] uppercase tracking-[0.35em] text-white/30"
        >
          Eau De Parfum
        </motion.p>
      </div>
    </motion.div>
  )
}

export default LoadingScreen
