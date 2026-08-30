import { AnimatePresence, motion } from "motion/react"
import { FiCheck } from "react-icons/fi"

import yocanaLogo from "../assets/yocana-logo-gold.png"

function BrandLoader({
  show = false,
  status = "loading",
  message = "Please wait",
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030303]/95 backdrop-blur-md"
        >
          {/* BACKGROUND GLOW */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                opacity: [0.12, 0.28, 0.12],
                scale: [0.9, 1.08, 0.9],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-[110px]"
            />
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.98,
            }}
            transition={{
              duration: 0.35,
            }}
            className="relative z-10 flex flex-col items-center px-6 text-center"
          >
            {/* LOGO */}
            <motion.img
              src={yocanaLogo}
              alt="YOCANA"
              animate={
                status === "loading"
                  ? {
                      opacity: [0.65, 1, 0.65],
                      scale: [1, 1.04, 1],
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                    }
              }
              transition={
                status === "loading"
                  ? {
                      duration: 1.7,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : {
                      duration: 0.25,
                    }
              }
              className="h-auto w-[115px] object-contain sm:w-[135px]"
              draggable="false"
            />

            {/* LOADING */}
            {status === "loading" && (
              <>
                <div className="mt-8 h-px w-36 overflow-hidden bg-white/10">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-full w-1/2 bg-[#D4AF37]"
                  />
                </div>

                <p className="mt-5 text-[9px] uppercase tracking-[0.32em] text-white/35">
                  {message}
                </p>
              </>
            )}

            {/* SUCCESS */}
            {status === "success" && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="mt-7"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#D4AF37]">
                  <FiCheck size={19} />
                </div>

                <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
                  {message}
                </p>

                <p className="mt-2 text-xs text-white/30">
                  Your selection has been added.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BrandLoader
