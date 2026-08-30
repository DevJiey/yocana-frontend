import { motion } from "motion/react"
import {
  FiFeather,
  FiClock,
  FiStar,
} from "react-icons/fi"

const features = [
  {
    icon: FiFeather,
    number: "01",
    title: "Distinctive",
    text: "Made to feel personal, refined, and memorable from the first impression.",
  },
  {
    icon: FiClock,
    number: "02",
    title: "Long Lasting",
    text: "Created to stay with you throughout the moments that matter.",
  },
  {
    icon: FiStar,
    number: "03",
    title: "Signature Presence",
    text: "A fragrance designed to become part of how people remember you.",
  },
]

function WhyYocana() {
  return (
    <section className="relative overflow-hidden bg-[#080808] px-5 py-16 sm:py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mb-9 max-w-3xl md:mb-11"
        >
          <p className="mb-3 text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] sm:text-[10px]">
            The YOCANA Experience
          </p>

          <h2 className="text-3xl font-medium leading-tight tracking-[-0.03em] text-[#F5F5F5] sm:text-4xl md:text-5xl">
            Made to be noticed.

            <span className="block text-white/35">
              Designed to be remembered.
            </span>
          </h2>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 border-t border-white/10 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                className="
                  group relative
                  border-b border-white/10
                  px-1 py-7
                  sm:py-8
                  md:border-b-0
                  md:border-r
                  md:px-7
                  md:py-9
                  first:md:pl-0
                  last:md:border-r-0
                  last:md:pr-0
                "
              >
                {/* Top */}
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center border border-[#D4AF37]/20 text-[#D4AF37] transition duration-300 group-hover:border-[#D4AF37]/60">
                    <Icon size={16} />
                  </div>

                  <span className="text-[8px] tracking-[0.3em] text-white/15">
                    {feature.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-medium text-[#F5F5F5] sm:text-[22px]">
                  {feature.title}
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-white/40">
                  {feature.text}
                </p>

                {/* Gold detail */}
                <div className="mt-6 h-px w-8 bg-[#D4AF37]/40 transition-all duration-500 group-hover:w-14" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyYocana
