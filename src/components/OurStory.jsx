import { motion } from "motion/react"

function OurStory() {
  return (
    <section
      id="story"
      className="relative overflow-hidden bg-[#050505] px-5 py-16 sm:py-20 md:px-8 md:py-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-14 lg:gap-20">

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="md:pr-4"
        >
          <p className="mb-3 text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] sm:text-[10px]">
            Our Story
          </p>

          <h2 className="max-w-xl text-3xl font-medium leading-tight tracking-[-0.03em] text-[#F5F5F5] sm:text-4xl md:text-5xl">
            More than a fragrance.

            <span className="block text-white/35">
              A part of your presence.
            </span>
          </h2>

          <div className="mt-6 max-w-lg space-y-4 text-sm leading-7 text-white/40 sm:text-[15px]">
            <p>
              YOCANA is created for people who understand that presence is
              remembered long after a moment has passed.
            </p>

            <p>
              Each fragrance is designed to become part of your identity —
              something personal, distinctive, and unforgettable.
            </p>
          </div>

          {/* Small detail */}
          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-10 bg-[#D4AF37]/60" />

            <span className="text-[8px] uppercase tracking-[0.35em] text-white/25">
              Your Presence. Your Signature.
            </span>
          </div>
        </motion.div>

        {/* Future Campaign Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative min-h-[330px] overflow-hidden border border-white/10 bg-[#0B0B0B] sm:min-h-[380px] md:min-h-[420px]">

            {/* Gold ambient lighting */}
            <div className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/6 blur-[90px]" />

            {/* Inner frame */}
            <div className="absolute inset-4 border border-[#D4AF37]/10 sm:inset-5" />

            {/* Decorative corners */}
            <div className="absolute left-4 top-4 h-8 w-px bg-[#D4AF37]/40 sm:left-5 sm:top-5" />

            <div className="absolute left-4 top-4 h-px w-8 bg-[#D4AF37]/40 sm:left-5 sm:top-5" />

            <div className="absolute bottom-4 right-4 h-8 w-px bg-[#D4AF37]/40 sm:bottom-5 sm:right-5" />

            <div className="absolute bottom-4 right-4 h-px w-8 bg-[#D4AF37]/40 sm:bottom-5 sm:right-5" />

            {/* Placeholder */}
            <div className="relative flex min-h-[330px] flex-col items-center justify-center px-8 text-center sm:min-h-[380px] md:min-h-[420px]">
              <span className="text-[8px] uppercase tracking-[0.4em] text-white/20">
                Brand Visual
              </span>

              <span className="mt-4 text-2xl tracking-[0.25em] text-[#D4AF37] sm:text-3xl">
                YOCANA
              </span>

              <div className="my-4 h-px w-10 bg-[#D4AF37]/30" />

              <span className="max-w-[220px] text-[8px] uppercase leading-5 tracking-[0.25em] text-white/20">
                Lifestyle / Campaign Image Coming Soon
              </span>
            </div>

            {/* Number */}
            <span className="absolute bottom-5 left-6 text-[8px] tracking-[0.3em] text-white/15">
              01 — YCN
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default OurStory
