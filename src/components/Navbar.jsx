import { API_URL } from "../config/api";
import { useEffect, useState } from "react"
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom"

import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi"

import {
  motion,
  AnimatePresence,
} from "motion/react"

import yocanaLogo from "../assets/yocana-logo-gold.png"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const [activeSection, setActiveSection] =
    useState("home")

  const [cartCount, setCartCount] = useState(0)
  const [cartPulse, setCartPulse] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const isCollectionPage =
    location.pathname === "/shop" ||
    location.pathname.startsWith("/product/")

  /* ========================= */
  /* NAVBAR SCROLL + SCROLL SPY */
  /* ========================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      if (location.pathname !== "/") {
        return
      }

      const story =
        document.getElementById("story")

      const contact =
        document.getElementById("contact")

      if (!story || !contact) {
        setActiveSection("home")
        return
      }

      const scrollPosition =
        window.scrollY + 160

      const storyTop =
        story.offsetTop

      const contactTop =
        contact.offsetTop

      if (scrollPosition >= contactTop) {
        setActiveSection("contact")
      } else if (
        scrollPosition >= storyTop
      ) {
        setActiveSection("story")
      } else {
        setActiveSection("home")
      }
    }

    handleScroll()

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    )

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      )
    }
  }, [location.pathname])

  /* ========================= */
  /* CLOSE MOBILE MENU */
  /* ========================= */

  useEffect(() => {
    setIsOpen(false)

    if (location.pathname === "/") {
      setActiveSection("home")
    }
  }, [location.pathname])

  /* ========================= */
  /* CART COUNT */
  /* ========================= */

  const fetchCartCount = async (
    animate = false
  ) => {
    const token =
      localStorage.getItem("yocana_token")

    if (!token) {
      setCartCount(0)
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        return
      }

      setCartCount(
        Number(
          data.cart?.total_items || 0
        )
      )

      if (animate) {
        setCartPulse(true)

        setTimeout(() => {
          setCartPulse(false)
        }, 650)
      }
    } catch (error) {
      console.error(
        "Unable to load cart count:",
        error
      )
    }
  }

  useEffect(() => {
    fetchCartCount(false)

    const handleCartUpdated = () => {
      fetchCartCount(true)
    }

    window.addEventListener(
      "yocana-cart-updated",
      handleCartUpdated
    )

    return () => {
      window.removeEventListener(
        "yocana-cart-updated",
        handleCartUpdated
      )
    }
  }, [])

  /* ========================= */
  /* SCROLL TO HOME SECTION */
  /* ========================= */

  const scrollToSection = (id) => {
    setIsOpen(false)

    if (location.pathname !== "/") {
      navigate("/")

      setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
      }, 150)

      return
    }

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
  }

  const desktopItemClass = (
    section
  ) => {
    const active =
      location.pathname === "/" &&
      activeSection === section

    return `relative text-[10px] uppercase tracking-[0.22em] transition duration-300 ${
      active
        ? "text-[#D4AF37]"
        : "text-white/50 hover:text-white/80"
    }`
  }

  const mobileItemClass = (
    section
  ) => {
    const active =
      location.pathname === "/" &&
      activeSection === section

    return `border-b border-white/[0.06] py-4 text-left text-[11px] uppercase tracking-[0.22em] transition ${
      active
        ? "text-[#D4AF37]"
        : "text-white/65 hover:text-[#D4AF37]"
    }`
  }

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "border-white/10 bg-[#030303]/95 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-white/[0.06] bg-[#030303]/80 backdrop-blur-lg"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 md:h-[72px] md:px-8">
        {/* LOGO */}
        <button
          type="button"
          onClick={() =>
            scrollToSection("home")
          }
          className="flex items-center"
          aria-label="Go to home"
        >
          <img
            src={yocanaLogo}
            alt="YOCANA"
            className="h-auto w-[72px] select-none object-contain sm:w-[76px] md:w-[82px]"
            draggable="false"
          />
        </button>

        {/* ===================== */}
        {/* DESKTOP NAV */}
        {/* ===================== */}

        <nav className="hidden items-center gap-8 md:flex">
          {/* HOME */}
          <button
            type="button"
            onClick={() =>
              scrollToSection("home")
            }
            className={desktopItemClass(
              "home"
            )}
          >
            Home
          </button>

          {/* COLLECTION */}
          <Link
            to="/shop"
            className={`relative text-[10px] uppercase tracking-[0.22em] transition duration-300 ${
              isCollectionPage
                ? "text-[#D4AF37]"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Collection
          </Link>

          {/* OUR STORY */}
          <button
            type="button"
            onClick={() =>
              scrollToSection("story")
            }
            className={desktopItemClass(
              "story"
            )}
          >
            Our Story
          </button>

          {/* CONTACT */}
          <button
            type="button"
            onClick={() =>
              scrollToSection("contact")
            }
            className={desktopItemClass(
              "contact"
            )}
          >
            Contact
          </button>
        </nav>

        {/* ===================== */}
        {/* ACTIONS */}
        {/* ===================== */}

        <div className="flex items-center gap-3 sm:gap-4">
          {/* ACCOUNT */}
          <Link
            to="/account"
            className="hidden h-9 w-9 items-center justify-center text-white/60 transition duration-300 hover:text-[#D4AF37] sm:flex"
            aria-label="Account"
          >
            <FiUser size={18} />
          </Link>

          {/* CART */}
          <motion.div
            animate={
              cartPulse
                ? {
                    scale: [
                      1,
                      1.18,
                      0.94,
                      1,
                    ],
                  }
                : {
                    scale: 1,
                  }
            }
            transition={{
              duration: 0.55,
            }}
            className="relative"
          >
            <Link
              id="yocana-cart-target"
              to="/cart"
              className="relative flex h-9 w-9 items-center justify-center text-white/60 transition duration-300 hover:text-[#D4AF37]"
              aria-label={`Cart with ${cartCount} items`}
            >
              <motion.div
                animate={
                  cartPulse
                    ? {
                        rotate: [
                          0,
                          -10,
                          10,
                          -6,
                          0,
                        ],
                      }
                    : {
                        rotate: 0,
                      }
                }
                transition={{
                  duration: 0.5,
                }}
              >
                <FiShoppingBag size={19} />
              </motion.div>

              <AnimatePresence mode="popLayout">
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 24,
                    }}
                    className="absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[8px] font-semibold leading-none text-[#030303]"
                  >
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>

          {/* MOBILE MENU */}
          <button
            type="button"
            onClick={() =>
              setIsOpen(
                (current) => !current
              )
            }
            className="flex h-9 w-9 items-center justify-center text-white/70 transition duration-300 hover:text-[#D4AF37] md:hidden"
            aria-label={
              isOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <FiX size={22} />
            ) : (
              <FiMenu size={22} />
            )}
          </button>
        </div>
      </div>

      {/* ========================= */}
      {/* MOBILE MENU */}
      {/* ========================= */}

      <div
        className={`overflow-hidden border-t border-white/[0.06] bg-[#050505] transition-all duration-500 md:hidden ${
          isOpen
            ? "max-h-[520px] opacity-100"
            : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <div className="px-5 py-6">
          <nav className="flex flex-col">
            {/* HOME */}
            <button
              type="button"
              onClick={() =>
                scrollToSection("home")
              }
              className={mobileItemClass(
                "home"
              )}
            >
              Home
            </button>

            {/* COLLECTION */}
            <Link
              to="/shop"
              onClick={() =>
                setIsOpen(false)
              }
              className={`border-b border-white/[0.06] py-4 text-[11px] uppercase tracking-[0.22em] transition ${
                isCollectionPage
                  ? "text-[#D4AF37]"
                  : "text-white/65 hover:text-[#D4AF37]"
              }`}
            >
              Collection
            </Link>

            {/* OUR STORY */}
            <button
              type="button"
              onClick={() =>
                scrollToSection("story")
              }
              className={mobileItemClass(
                "story"
              )}
            >
              Our Story
            </button>

            {/* CONTACT */}
            <button
              type="button"
              onClick={() =>
                scrollToSection("contact")
              }
              className={mobileItemClass(
                "contact"
              )}
            >
              Contact
            </button>
          </nav>

          {/* MOBILE ACCOUNT */}
          <Link
            to="/account"
            onClick={() =>
              setIsOpen(false)
            }
            className="mt-5 flex items-center justify-between border border-white/10 px-4 py-4 transition duration-300 hover:border-[#D4AF37]/40"
          >
            <div className="flex items-center gap-3">
              <FiUser
                size={17}
                className="text-[#D4AF37]"
              />

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
                  My Account
                </p>

                <p className="mt-1 text-[9px] text-white/25">
                  Sign in or view your
                  profile
                </p>
              </div>
            </div>

            <span className="text-[#D4AF37]">
              →
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
