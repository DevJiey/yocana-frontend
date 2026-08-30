import { useEffect, useState } from "react"
import {
  AnimatePresence,
  motion,
} from "motion/react"

import {
  FiInstagram,
  FiFacebook,
  FiMail,
  FiArrowUp,
  FiX,
} from "react-icons/fi"

function Footer() {
  const [activeInfo, setActiveInfo] =
    useState(null)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const infoContent = {
    refund: {
      title: "Refund Policy",
      content:
        "Refund policy details will be added soon.",
    },

    shipping: {
      title: "Shipping",
      content:
        "Shipping information will be added soon.",
    },

    privacy: {
      title: "Privacy Policy",
      content:
        "Privacy policy details will be added soon.",
    },

    terms: {
      title: "Terms of Service",
      content:
        "Terms of service will be added soon.",
    },

    legal: {
      title: "Legal Notice",
      content:
        "Legal information will be added soon.",
    },

    contact: {
      title: "Contact",
      content:
        "For inquiries, you may contact YOCANA through our official email and social media channels.",
    },
  }

  useEffect(() => {
    if (!activeInfo) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      "hidden"

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [activeInfo])

  useEffect(() => {
    const handleEscape = (event) => {
      if (
        event.key === "Escape" &&
        activeInfo
      ) {
        setActiveInfo(null)
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    )

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      )
    }
  }, [activeInfo])

  return (
    <>
      <footer className="border-t border-white/10 bg-[#030303] px-5 pb-7 pt-10 md:px-8 md:pt-12">
        <div className="mx-auto max-w-7xl">

          {/* TOP */}
          <div className="flex flex-col gap-8 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">

            {/* BRAND */}
            <div>
              <p className="text-lg font-semibold tracking-[0.32em] text-[#D4AF37]">
                YOCANA
              </p>

              <p className="mt-3 max-w-sm text-sm leading-6 text-white/30">
                Fragrances created to become
                part of your presence,
                identity, and signature.
              </p>

              <p className="mt-4 text-[8px] uppercase tracking-[0.3em] text-white/20">
                Your Presence. Your Signature.
              </p>
            </div>

            {/* SOCIAL */}
            <div>
              <p className="mb-3 text-[8px] uppercase tracking-[0.25em] text-white/25">
                Follow YOCANA
              </p>

              <div className="flex gap-2">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                >
                  <FiInstagram size={15} />
                </a>

                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                >
                  <FiFacebook size={15} />
                </a>

                <a
                  href="mailto:hello@yocana.com"
                  aria-label="Email"
                  className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                >
                  <FiMail size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* INFO LINKS */}
          <div className="flex flex-wrap gap-x-5 gap-y-3 border-b border-white/10 py-6">
            <button
              type="button"
              onClick={() =>
                setActiveInfo("refund")
              }
              className="text-[10px] text-white/40 underline decoration-white/20 underline-offset-4 transition hover:text-[#D4AF37]"
            >
              Refund Policy
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveInfo("shipping")
              }
              className="text-[10px] text-white/40 underline decoration-white/20 underline-offset-4 transition hover:text-[#D4AF37]"
            >
              Shipping
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveInfo("privacy")
              }
              className="text-[10px] text-white/40 underline decoration-white/20 underline-offset-4 transition hover:text-[#D4AF37]"
            >
              Privacy Policy
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveInfo("terms")
              }
              className="text-[10px] text-white/40 underline decoration-white/20 underline-offset-4 transition hover:text-[#D4AF37]"
            >
              Terms of Service
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveInfo("legal")
              }
              className="text-[10px] text-white/40 underline decoration-white/20 underline-offset-4 transition hover:text-[#D4AF37]"
            >
              Legal Notice
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveInfo("contact")
              }
              className="text-[10px] text-white/40 underline decoration-white/20 underline-offset-4 transition hover:text-[#D4AF37]"
            >
              Contact
            </button>
          </div>

          {/* BOTTOM */}
          <div className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[9px] tracking-[0.12em] text-white/20">
              © 2026 YOCANA. All rights
              reserved.
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex w-fit items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-white/30 transition hover:text-[#D4AF37]"
            >
              Back to top
              <FiArrowUp size={13} />
            </button>
          </div>
        </div>
      </footer>

      {/* ========================= */}
      {/* FOOTER INFO DRAWER */}
      {/* ========================= */}

      <AnimatePresence>
        {activeInfo && (
          <>
            {/* OVERLAY */}
            <motion.button
              type="button"
              aria-label="Close information panel"
              onClick={() =>
                setActiveInfo(null)
              }
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="fixed inset-0 z-[100] cursor-default bg-black/65 backdrop-blur-[2px]"
            />

            {/* DRAWER */}
            <motion.div
              initial={{
                y: "100%",
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: "100%",
              }}
              transition={{
                type: "tween",
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed bottom-0 left-0 right-0 z-[110] max-h-[78dvh] overflow-hidden border-t border-white/10 bg-[#080808] shadow-[0_-30px_80px_rgba(0,0,0,0.5)]"
            >
              <div className="mx-auto flex max-w-3xl flex-col">

                {/* HANDLE */}
                <div className="flex justify-center pt-3">
                  <div className="h-1 w-10 rounded-full bg-white/15" />
                </div>

                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.28em] text-[#D4AF37]">
                      YOCANA
                    </p>

                    <h2 className="mt-1 text-xl font-medium text-white">
                      {
                        infoContent[
                          activeInfo
                        ].title
                      }
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveInfo(null)
                    }
                    className="flex h-10 w-10 items-center justify-center text-white/35 transition hover:text-[#D4AF37]"
                    aria-label="Close"
                  >
                    <FiX size={19} />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="overflow-y-auto px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:px-7">
                  <p className="text-sm leading-7 text-white/40">
                    {
                      infoContent[
                        activeInfo
                      ].content
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Footer