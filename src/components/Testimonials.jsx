import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"

const testimonials = [
  {
    id: 1,
    name: "Customer One",
    text: "The scent feels elegant and noticeable without being overwhelming. It easily became one of my go-to fragrances.",
  },
  {
    id: 2,
    name: "Customer Two",
    text: "What I like most is how refined it smells. It feels premium and lasts long enough for everyday use.",
  },
  {
    id: 3,
    name: "Customer Three",
    text: "The fragrance leaves a clean and memorable impression. The presentation also feels very premium.",
  },
  {
    id: 4,
    name: "Customer Four",
    text: "It has a distinctive character that feels sophisticated and easy to wear throughout the day.",
  },
]

function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    )
  }

  const previousSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    )
  }

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      nextSlide()
    }, 4500)

    return () => clearInterval(interval)
  }, [current, isPaused])

  const testimonial = testimonials[current]

  return (
    <section className="relative overflow-hidden bg-[#050505] px-5 py-14 sm:py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-9 md:mb-11"
        >
          <p className="mb-3 text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] sm:text-[10px]">
            What They Say
          </p>

          <h2 className="max-w-2xl text-3xl font-medium leading-tight tracking-[-0.03em] text-[#F5F5F5] sm:text-4xl md:text-5xl">
            Worn with confidence.
            <span className="block text-white/35">
              Remembered by others.
            </span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative mx-auto max-w-5xl"
        >
          <div className="overflow-hidden border border-white/10 bg-[#0B0B0B]">
            <AnimatePresence mode="wait">
              <motion.article
                key={testimonial.id}
                initial={{
                  opacity: 0,
                  x: 24,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -24,
                }}
                transition={{
                  duration: 0.32,
                  ease: "easeOut",
                }}
                className="flex flex-col justify-between p-6 sm:p-8 md:p-10"
              >
                <div>
                  {/* Stars */}
                  <div className="mb-6 flex gap-1 text-[#D4AF37]">
                    {[...Array(5)].map((_, index) => (
                      <FiStar
                        key={index}
                        size={14}
                        fill="currentColor"
                      />
                    ))}
                  </div>

                  {/* Review */}
                  <p className="max-w-3xl text-base leading-7 text-white/65 sm:text-lg md:text-xl md:leading-8">
                    “{testimonial.text}”
                  </p>
                </div>

                {/* Customer */}
                <div className="mt-7 border-t border-white/10 pt-5">
                  <p className="text-sm font-medium text-[#F5F5F5]">
                    {testimonial.name}
                  </p>

                  <p className="mt-1.5 text-[8px] uppercase tracking-[0.28em] text-[#D4AF37]/70">
                    YOCANA Customer
                  </p>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-5 flex items-center justify-between">

            {/* Indicators */}
            <div className="flex gap-2">
              {testimonials.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`h-[2px] transition-all duration-300 ${
                    current === index
                      ? "w-8 bg-[#D4AF37]"
                      : "w-4 bg-white/15"
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={previousSlide}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/50 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37] sm:h-10 sm:w-10"
                aria-label="Previous testimonial"
              >
                <FiChevronLeft size={17} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/50 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37] sm:h-10 sm:w-10"
                aria-label="Next testimonial"
              >
                <FiChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Temporary note */}
        <p className="mt-6 text-center text-[8px] uppercase tracking-[0.22em] text-white/15">
          Temporary testimonials for design preview.
        </p>
      </div>
    </section>
  )
}

export default Testimonials
