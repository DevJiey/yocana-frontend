import { Link } from "react-router-dom"
import {
  FiInstagram,
  FiFacebook,
  FiMail,
  FiArrowUp,
} from "react-icons/fi"

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="border-t border-white/10 bg-[#030303] px-5 pb-7 pt-12 md:px-8 md:pt-14">
      <div className="mx-auto max-w-7xl">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-lg font-semibold tracking-[0.32em] text-[#D4AF37]">
              YOCANA
            </p>

            <p className="mt-4 max-w-xs text-sm leading-6 text-white/35">
              Fragrances created to become part of your presence,
              identity, and signature.
            </p>

            <p className="mt-5 text-[8px] uppercase tracking-[0.3em] text-white/20">
              Your Presence. Your Signature.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="mb-5 text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]">
              Shop
            </p>

            <div className="flex flex-col gap-3">
              <Link
                to="/shop"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Collection
              </Link>

              <Link
                to="/cart"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Shopping Bag
              </Link>

              <Link
                to="/account"
                className="text-sm text-white/40 transition hover:text-white"
              >
                My Account
              </Link>
            </div>
          </div>

          {/* Information */}
          <div>
            <p className="mb-5 text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]">
              Information
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="#story"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Our Story
              </a>

              <Link
                to="/shipping"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Shipping
              </Link>

              <Link
                to="/returns"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Returns & Refunds
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]">
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

        {/* Bottom */}
        <div className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] tracking-[0.12em] text-white/20">
            © 2026 YOCANA. All rights reserved.
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
  )
}

export default Footer
