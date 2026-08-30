import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { FiPlus, FiMinus } from "react-icons/fi"

const faqs = [
  {
    id: 1,
    question: "How long does YOCANA fragrance last?",
    answer:
      "Longevity may vary depending on skin type, environment, and application. YOCANA fragrances are designed to provide a noticeable and lasting scent experience throughout the day.",
  },
  {
    id: 2,
    question: "What is the difference between Pour Homme and Pour Femme?",
    answer:
      "Pour Homme is crafted with a more confident and masculine character, while Pour Femme offers a more elegant and graceful expression. Both are designed to leave a distinctive presence.",
  },
  {
    id: 3,
    question: "How should I apply the fragrance?",
    answer:
      "For best results, apply lightly to pulse points such as the wrists and neck. Avoid rubbing the fragrance after application to help preserve its scent profile.",
  },
  {
    id: 4,
    question: "Do you offer delivery?",
    answer:
      "Yes. Delivery options and shipping details will be shown during checkout based on the customer's location.",
  },
  {
    id: 5,
    question: "Can I return or request a refund?",
    answer:
      "Return and refund requests are subject to YOCANA's return policy and the condition of the order. Eligible requests can be submitted through the customer's account.",
  },
]

function FAQ() {
  const [activeId, setActiveId] = useState(null)

  const toggleFAQ = (id) => {
    setActiveId((current) =>
      current === id ? null : id
    )
  }

  return (
    <section className="relative overflow-hidden bg-[#080808] px-5 py-16 sm:py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-12"
        >
          <p className="mb-3 text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] sm:text-[10px]">
            Frequently Asked Questions
          </p>

          <h2 className="max-w-2xl text-3xl font-medium leading-tight tracking-[-0.03em] text-[#F5F5F5] sm:text-4xl md:text-5xl">
            Everything you need
            <span className="block text-white/35">
              to know.
            </span>
          </h2>
        </motion.div>

        {/* FAQ List */}
        <div className="mx-auto max-w-5xl border-t border-white/10">
          {faqs.map((faq) => {
            const isOpen = activeId === faq.id

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4 }}
                className="border-b border-white/10"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex w-full items-center justify-between gap-5 py-5 text-left sm:py-6"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-sm font-medium transition duration-300 sm:text-base ${
                      isOpen
                        ? "text-[#D4AF37]"
                        : "text-[#F5F5F5]"
                    }`}
                  >
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center border transition duration-300 ${
                      isOpen
                        ? "border-[#D4AF37]/50 text-[#D4AF37]"
                        : "border-white/10 text-white/40"
                    }`}
                  >
                    {isOpen ? (
                      <FiMinus size={15} />
                    ) : (
                      <FiPlus size={15} />
                    )}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-white/40">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQ
