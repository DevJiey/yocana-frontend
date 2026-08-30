import { useEffect, useRef, useState } from "react"
import {
  useLocation,
  useNavigate,
} from "react-router-dom"

import {
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiArrowLeft,
} from "react-icons/fi"

import {
  AnimatePresence,
  motion,
} from "motion/react"

import yocanaLogo from "../assets/yocana-logo-gold.png"

function CustomerAccountLayout({
  children,
  user,
  onLogout,
  actionLoading = false,
}) {
  const navigate = useNavigate()
  const location = useLocation()

  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false)

  const menuRef = useRef(null)

  const cameFromCheckout =
    location.state?.from === "/checkout"

  const fullName =
    [
      user?.first_name,
      user?.last_name,
    ]
      .filter(Boolean)
      .join(" ") || "YOCANA Customer"

  const initials = [
    user?.first_name?.[0],
    user?.last_name?.[0],
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "Y"

  /* ========================= */
  /* PRESERVE CHECKOUT STATE */
  /* ========================= */

  const preserveCheckoutState = (
    extra = {}
  ) => {
    return {
      ...extra,

      ...(cameFromCheckout
        ? {
            from: "/checkout",
          }
        : {}),
    }
  }

  /* ========================= */
  /* NAVIGATION */
  /* ========================= */

  const goToAccount = () => {
    setProfileMenuOpen(false)

    navigate("/account", {
      state: preserveCheckoutState({
        section: "overview",
      }),
    })
  }

  const goToProfile = () => {
    setProfileMenuOpen(false)

    navigate("/account", {
      state: preserveCheckoutState({
        section: "profile",
      }),
    })
  }

  const goHome = () => {
    setProfileMenuOpen(false)

    navigate("/")
  }

  const returnToCheckout = () => {
    setProfileMenuOpen(false)

    navigate("/checkout")
  }

  /* ========================= */
  /* CLOSE DROPDOWN OUTSIDE */
  /* ========================= */

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      )
    }
  }, [])

  /* ========================= */
  /* ESCAPE KEY */
  /* ========================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setProfileMenuOpen(false)
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    )

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      )
    }
  }, [])

  /* ========================= */
  /* CLOSE WHEN ROUTE CHANGES */
  /* ========================= */

  useEffect(() => {
    setProfileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ========================= */}
      {/* ACCOUNT HEADER */}
      {/* ========================= */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl">
        <div className="relative mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-4 sm:px-5 md:h-[72px] md:px-8">

          {/* LOGO */}
          <button
            type="button"
            onClick={goHome}
            className="flex shrink-0 items-center"
            aria-label="Go to YOCANA home"
          >
            <img
              src={yocanaLogo}
              alt="YOCANA"
              className="h-auto w-[64px] select-none object-contain sm:w-[70px] md:w-[78px]"
              draggable="false"
            />
          </button>

          {/* CENTER ACCOUNT LABEL */}
          <button
            type="button"
            onClick={goToAccount}
            className="absolute left-1/2 hidden -translate-x-1/2 md:block"
          >
            <p className="text-[9px] uppercase tracking-[0.28em] text-white/35 transition hover:text-[#D4AF37]">
              My Account
            </p>
          </button>

          {/* ========================= */}
          {/* PROFILE BUTTON */}
          {/* ========================= */}

          <div
            ref={menuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setProfileMenuOpen(
                  (current) => !current
                )
              }
              className={`flex h-10 items-center gap-2 transition sm:gap-3 ${
                profileMenuOpen
                  ? "text-[#D4AF37]"
                  : "text-white/60 hover:text-[#D4AF37]"
              }`}
              aria-label="Open account menu"
              aria-haspopup="menu"
              aria-expanded={
                profileMenuOpen
              }
            >
              {/* NAME - TABLET/DESKTOP */}
              <div className="hidden text-right sm:block">
                <p className="max-w-[150px] truncate text-[10px] font-medium text-white/65">
                  {fullName}
                </p>

                <p className="mt-0.5 text-[7px] uppercase tracking-[0.16em] text-white/20">
                  Customer
                </p>
              </div>

              {/* AVATAR */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[9px] font-medium transition ${
                  profileMenuOpen
                    ? "border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37]"
                    : "border-white/10 bg-[#0A0A0A] text-white/55"
                }`}
              >
                {user ? (
                  initials
                ) : (
                  <FiUser size={15} />
                )}
              </div>

              {/* ARROW */}
              <FiChevronDown
                size={12}
                className={`hidden transition-transform duration-300 sm:block ${
                  profileMenuOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* ========================= */}
            {/* PROFILE DROPDOWN */}
            {/* ========================= */}

            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                    scale: 0.98,
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
                    duration: 0.18,
                  }}
                  className="absolute right-0 top-[52px] w-[260px] max-w-[calc(100vw-2rem)] overflow-hidden border border-white/10 bg-[#080808] shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
                  role="menu"
                >

                  {/* ========================= */}
                  {/* CUSTOMER INFO */}
                  {/* ========================= */}

                  <div className="border-b border-white/10 px-4 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] text-[10px] font-medium text-[#D4AF37]">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-white/75">
                          {fullName}
                        </p>

                        <p className="mt-1 truncate text-[9px] text-white/25">
                          {user?.email ||
                            "YOCANA Account"}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* ========================= */}
                  {/* MY PROFILE ONLY */}
                  {/* ========================= */}

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={goToProfile}
                      className="flex min-h-12 w-full items-center gap-3 px-3 text-left text-white/45 transition hover:bg-white/[0.03] hover:text-[#D4AF37]"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                        <FiUser size={14} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.14em]">
                          My Profile
                        </p>

                        <p className="mt-1 text-[8px] text-white/20">
                          Personal information
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* ========================= */}
                  {/* RETURN TO CHECKOUT */}
                  {/* ONLY IF FROM CHECKOUT */}
                  {/* ========================= */}

                  {cameFromCheckout && (
                    <div className="border-t border-white/10 p-2">
                      <button
                        type="button"
                        onClick={
                          returnToCheckout
                        }
                        className="flex min-h-12 w-full items-center gap-3 px-3 text-left text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.04]"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                          <FiArrowLeft
                            size={14}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-[0.14em]">
                            Return to Checkout
                          </p>

                          <p className="mt-1 text-[8px] text-white/20">
                            Continue your order
                          </p>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* ========================= */}
                  {/* SIGN OUT */}
                  {/* ========================= */}

                  <div className="border-t border-white/10 p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(
                          false
                        )

                        onLogout?.()
                      }}
                      disabled={
                        actionLoading
                      }
                      className="flex min-h-12 w-full items-center gap-3 px-3 text-left text-red-400/65 transition hover:bg-red-500/[0.04] hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                        <FiLogOut size={14} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.14em]">
                          Sign Out
                        </p>

                        <p className="mt-1 text-[8px] text-white/20">
                          End your session
                        </p>
                      </div>
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
      {/* ========================= */}
      {/* PAGE CONTENT */}
      {/* ========================= */}

      <main className="min-w-0 px-4 py-6 sm:px-5 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-12">
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}

export default CustomerAccountLayout