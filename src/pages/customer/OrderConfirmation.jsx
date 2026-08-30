import {
    Link,
    Navigate,
    useLocation,
} from "react-router-dom"
import { motion } from "motion/react"
import {
    FiCheck,
    FiArrowRight,
    FiShoppingBag,
    FiPackage,
    FiCreditCard,
    FiMapPin,
} from "react-icons/fi"

import PublicLayout from "../../layouts/PublicLayout"

function OrderConfirmation() {
    const location = useLocation()

    const order = location.state?.order

    if (!order) {
        return <Navigate to="/account" replace />
    }

    const formatPrice = (value) => {
        return Number(value || 0).toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )
    }

    const getPaymentLabel = (method) => {
        const labels = {
            COD: "Cash on Delivery",
            GCASH: "GCash",
            MAYA: "Maya",
            CARD: "Credit / Debit Card",
            BANK: "Online Banking",
        }

        return labels[method] || method
    }

    return (
        <PublicLayout>
            <main className="min-h-screen bg-[#050505] px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-32">
                <div className="mx-auto max-w-3xl">

                    {/* SUCCESS */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                        }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{
                                scale: 0.7,
                                opacity: 0,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}
                            transition={{
                                delay: 0.15,
                                duration: 0.4,
                            }}
                            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/[0.04]"
                        >
                            <FiCheck
                                size={26}
                                className="text-[#D4AF37]"
                            />
                        </motion.div>

                        <p className="mt-7 text-[9px] uppercase tracking-[0.35em] text-[#D4AF37]">
                            Order Confirmed
                        </p>

                        <h1 className="mt-3 text-4xl font-medium tracking-[-0.04em] text-[#F5F5F5] sm:text-5xl">
                            Thank You.
                        </h1>

                        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/35">
                            Your YOCANA order has been
                            received. We'll keep you updated
                            as your fragrance makes its way
                            to you.
                        </p>
                    </motion.div>

                    {/* ORDER NUMBER */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.15,
                            duration: 0.45,
                        }}
                        className="mt-10 border border-[#D4AF37]/20 bg-[#D4AF37]/[0.025] px-5 py-6 text-center sm:px-8"
                    >
                        <p className="text-[8px] uppercase tracking-[0.3em] text-white/25">
                            Order Number
                        </p>

                        <p className="mt-2 text-xl font-medium tracking-[0.08em] text-[#D4AF37] sm:text-2xl">
                            {order.order_number}
                        </p>

                        <p className="mt-2 text-[10px] text-white/25">
                            Keep this number for your order
                            reference.
                        </p>
                    </motion.div>

                    {/* DETAILS */}
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <div className="border border-white/10 bg-[#080808] p-5">
                            <div className="flex items-center gap-3">
                                <FiPackage
                                    size={15}
                                    className="text-[#D4AF37]"
                                />

                                <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                    Order Status
                                </p>
                            </div>

                            <p className="mt-4 capitalize text-sm text-white/75">
                                {order.order_status}
                            </p>
                        </div>

                        <div className="border border-white/10 bg-[#080808] p-5">
                            <div className="flex items-center gap-3">
                                <FiCreditCard
                                    size={15}
                                    className="text-[#D4AF37]"
                                />

                                <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                    Payment
                                </p>
                            </div>

                            <p className="mt-4 text-sm text-white/75">
                                {getPaymentLabel(
                                    order.payment_method
                                )}
                            </p>

                            <p className="mt-1 text-[10px] capitalize text-white/25">
                                {order.payment_status}
                            </p>
                        </div>
                    </div>

                    {/* SHIPPING */}
                    <div className="mt-3 border border-white/10 bg-[#080808] p-5 sm:p-6">
                        <div className="flex items-center gap-3">
                            <FiMapPin
                                size={15}
                                className="text-[#D4AF37]"
                            />

                            <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                Shipping Information
                            </p>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-white/65">
                            {order.shipping_address}
                        </p>

                        <p className="mt-1 text-[10px] text-white/25">
                            {order.shipping_region}
                        </p>
                    </div>

                    {/* TOTAL */}
                    <div className="mt-3 border border-white/10 bg-[#080808] p-5 sm:p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/30">
                                    Subtotal
                                </span>

                                <span className="text-white/60">
                                    ₱
                                    {formatPrice(
                                        order.subtotal
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-white/30">
                                    Shipping
                                </span>

                                <span className="text-white/60">
                                    ₱
                                    {formatPrice(
                                        order.shipping_fee
                                    )}
                                </span>
                            </div>

                            {Number(
                                order.discount_amount
                            ) > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/30">
                                            Discount
                                        </span>

                                        <span className="text-white/60">
                                            -₱
                                            {formatPrice(
                                                order.discount_amount
                                            )}
                                        </span>
                                    </div>
                                )}

                            <div className="flex items-end justify-between border-t border-white/10 pt-5">
                                <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                                    Total
                                </span>

                                <span className="text-2xl font-medium text-[#D4AF37]">
                                    ₱
                                    {formatPrice(
                                        order.total_amount
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Link
                            to="/orders"
                            className="flex h-12 items-center justify-center gap-2 border border-white/15 text-[9px] uppercase tracking-[0.2em] text-white/60 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                        >
                            <FiPackage size={14} />
                            View My Orders
                        </Link>

                        <Link
                            to="/shop"
                            className="flex h-12 items-center justify-center gap-2 bg-[#D4AF37] text-[9px] font-semibold uppercase tracking-[0.2em] text-[#050505] transition hover:bg-[#E1C35B]"
                        >
                            <FiShoppingBag size={14} />
                            Continue Shopping
                            <FiArrowRight size={13} />
                        </Link>
                    </div>

                    <p className="mt-7 text-center text-[9px] leading-5 text-white/20">
                        A confirmation email will be sent
                        with your order information.
                    </p>
                </div>
            </main>
        </PublicLayout>
    )
}

export default OrderConfirmation
