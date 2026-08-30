import { motion } from "motion/react"
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
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.035] blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">

          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] sm:text-[10px]">
              Stay Connected
            </p>

            <h2 className="max-w-xl text-3xl font-medium leading-tight tracking-[-0.03em] text-[#F5F5F5] sm:text-4xl md:text-5xl">
              Be part of
              <span className="block text-white/35">
                the YOCANA story.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/40">
              Follow YOCANA for fragrance updates, new releases, and moments
              created around your signature presence.
            </p>

            {/* Social links */}
            <div className="mt-8 flex items-center gap-3">
              <a
                href="#"
                aria-label="YOCANA Instagram"
                className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/45 transition duration-300 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
              >
                <FiInstagram size={16} />
              </a>

              <a
                href="#"
                aria-label="YOCANA Facebook"
                className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/45 transition duration-300 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
              >
                <FiFacebook size={16} />
              </a>

              <a
                href="mailto:hello@yocana.com"
                aria-label="Email YOCANA"
                className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/45 transition duration-300 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
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
            <div className="w-full border border-white/10 bg-[#080808] p-6 sm:p-8 md:p-9">
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
                  className="min-h-12 flex-1 border border-white/10 bg-[#050505] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/50"
                />

                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#D4AF37] px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition duration-300 hover:bg-[#E1C35B]"
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
