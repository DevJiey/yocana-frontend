import { motion } from "motion/react"
import GoldDustGalaxy from "./GoldDustGalaxy"
import {
  FiArrowUpRight,
  FiInstagram,
  FiFacebook,
  FiMail,
} from "react-icons/fi"

function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#050505] px-5 py-16 sm:py-20 md:px-8 md:py-24"
    >
      <GoldDustGalaxy />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">

          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-2 text-[8px] uppercase tracking-[0.4em] text-[#D4AF37] sm:mb-3 sm:text-[10px]">
              Stay Connected
            </p>

            <h2 className="max-w-xl text-2xl font-medium leading-tight tracking-[-0.03em] text-[#F5F5F5] sm:text-4xl md:text-5xl">
              Be part of
              <span className="block text-white/35">
                the YOCANA story.
              </span>
            </h2>

            <p className="mt-4 max-w-md text-xs leading-6 text-white/40 sm:mt-5 sm:text-sm sm:leading-7">
              Follow YOCANA for fragrance updates, new releases, and moments
              created around your signature presence.
            </p>

            {/* Social links */}
            <div className="mt-8 flex items-center gap-3">
              <a
                href="https://www.instagram.com/yocanaph/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YOCANA Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/50 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] active:scale-95"
              >
                <FiInstagram size={16} />
              </a>

              <a
                href="https://www.facebook.com/yocanaph"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YOCANA Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/50 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] active:scale-95"
              >
                <FiFacebook size={16} />
              </a>

              <a
                href="mailto:yocana.ph@gmail.com"
                aria-label="Email YOCANA"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/50 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] active:scale-95"
              >
                <FiMail size={16} />
              </a>
            </div>
          </motion.div>

          {/* RIGHT SIDE / NEWSLETTER */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="flex items-center"
          >
            <div className="w-full rounded-2xl border border-white/[0.12] bg-[#0c0c0c]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl p-5 sm:p-8 md:p-9">
              <div className="mb-7">
                <span className="text-[8px] uppercase tracking-[0.35em] text-[#D4AF37]">
                  Newsletter
                </span>

                <h3 className="mt-3 text-xl font-medium text-[#F5F5F5] sm:text-2xl">
                  Stay in the know.
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-white/35">
                  Get updates about new fragrances, collections, and exclusive
                  YOCANA releases.
                </p>
              </div>

              {/* Newsletter form */}
              <form
                onSubmit={(event) => event.preventDefault()}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="min-h-12 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm text-white backdrop-blur-md outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/50"
                />

                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#FFE28A]/40 bg-[#D4AF37]/95 px-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#050505] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(212,175,55,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-[#E1C35B] hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] active:scale-95"
                >
                  Subscribe
                  <FiArrowUpRight size={15} />
                </button>
              </form>

              <p className="mt-4 text-[9px] leading-5 text-white/20">
                By subscribing, you agree to receive updates from YOCANA.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
