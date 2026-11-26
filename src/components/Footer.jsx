import { useEffect, useState } from "react"
import {
  AnimatePresence,
  motion,
} from "motion/react"
import GoldDustGalaxy from "./GoldDustGalaxy"

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
      title: "Refund & Return Policy",
      updated: "Effective 2026",
      sections: [
        {
          heading: "1. Eligibility for Return or Replacement",
          text: "Returns, replacements, or refunds are accepted within 7 calendar days from the delivery date strictly for items that arrived damaged, leaking, defective, or incorrect (wrong fragrance or quantity).",
        },
        {
          heading: "2. Mandatory Unboxing Video",
          text: "To process any damage, leakage, or missing-item claim, customers must provide a clear, uncut, continuous unboxing video showing the sealed parcel and waybill prior to opening through the inspection of the bottle.",
        },
        {
          heading: "3. Sealed & Hygiene Standard",
          text: "For hygiene and fragrance integrity, opened, unsealed, or sprayed bottles cannot be returned or refunded due to change of mind or personal scent preference.",
        },
        {
          heading: "4. Order Cancellations & Refund Timeline",
          text: "Orders may be cancelled in your Account page while still in Pending status (prior to courier dispatch). Approved refunds for prepaid orders (GCash/Maya/Card) are processed within 3–7 business days after inspection.",
        },
      ],
    },

    privacy: {
      title: "Privacy Policy",
      updated: "Effective 2026 · RA 10173 Compliant",
      sections: [
        {
          heading: "1. Information We Collect",
          text: "We collect only the personal details required to fulfill your order and maintain your account: your full name, email address, phone number, and shipping address.",
        },
        {
          heading: "2. How We Use Your Information",
          text: "Your data is used strictly for order processing, payment verification, SPX Express courier delivery, and order status notifications. We never sell, rent, or trade your personal information to third parties.",
        },
        {
          heading: "3. Account Security & Google Sign-In",
          text: "All sessions and passwords are protected with industry-standard encryption. If you choose Google Sign-In, we only access your basic profile name and email to verify and manage your YOCANA account.",
        },
        {
          heading: "4. Your Privacy Rights",
          text: "In compliance with the Philippine Data Privacy Act of 2012 (RA 10173), you may review, update, or request deletion of your personal data anytime through your Account or official support channels.",
        },
      ],
    },

    terms: {
      title: "Terms of Service",
      updated: "Effective 2026",
      sections: [
        {
          heading: "1. Acceptance & Account Responsibility",
          text: "By accessing YOCANA and placing an order, you agree to provide accurate contact and delivery information to ensure smooth fulfillment by our courier partners.",
        },
        {
          heading: "2. Pricing, Promotions & Availability",
          text: "All prices are listed in Philippine Pesos (₱ PHP). Promotional offers (such as bundle discounts and Free Shipping on 2+ bottles) are subject to stock availability and may change without prior notice, except for already confirmed orders.",
        },
        {
          heading: "3. Payments & Cash on Delivery (COD)",
          text: "We accept Cash on Delivery (COD) and supported online payment methods. Online orders are processed upon payment confirmation. Repeated unexcused refusal of COD deliveries may limit future COD privileges.",
        },
        {
          heading: "4. Delivery & Intellectual Property",
          text: "Nationwide shipping is handled via SPX Express with tracking updates in your Account. All YOCANA trademarks, bottle designs, photography, and website materials belong exclusively to YOCANA.",
        },
      ],
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
      <footer className="relative overflow-hidden border-t border-white/10 bg-[#050505] px-5 pb-7 pt-10 md:px-8 md:pt-12">
        <GoldDustGalaxy />
        <div className="relative z-10 mx-auto max-w-7xl">

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
                  href="https://www.instagram.com/yocanaph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                >
                  <FiInstagram size={15} />
                </a>

                <a
                  href="https://www.facebook.com/yocanaph"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                >
                  <FiFacebook size={15} />
                </a>

                <a
                  href="mailto:yocana.ph@gmail.com"
                  aria-label="Email"
                  className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                >
                  <FiMail size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* INFO LINKS */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-white/10 py-6">
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
              <div className="mx-auto flex max-h-[78dvh] max-w-3xl flex-col">

                {/* HANDLE */}
                <div className="flex shrink-0 justify-center pt-3">
                  <div className="h-1 w-10 rounded-full bg-white/15" />
                </div>

                {/* HEADER */}
                <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.28em] text-[#D4AF37]">
                      YOCANA · {infoContent[activeInfo].updated}
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
                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:px-7">
                  {infoContent[activeInfo].sections.map((section, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#D4AF37]/90">
                        {section.heading}
                      </h3>
                      <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-white/55">
                        {section.text}
                      </p>
                    </div>
                  ))}
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