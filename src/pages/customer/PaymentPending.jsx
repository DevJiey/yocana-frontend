import { API_URL } from "../../config/api";
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import {
    FiClock,
    FiCreditCard,
    FiPackage,
    FiArrowRight,
    FiCheckCircle,
} from "react-icons/fi"
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom"

import PublicLayout from "../../layouts/PublicLayout"

function PaymentPending() {
    const { orderId } = useParams()
    const navigate = useNavigate()

    const [payment, setPayment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const token =
        localStorage.getItem("yocana_token")

    const formatPrice = (value) =>
        Number(value || 0).toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )

    const formatPaymentMethod = (method) => {
        const labels = {
            GCASH: "GCash",
            MAYA: "Maya",
            CARD: "Credit / Debit Card",
            BANK: "Online Banking",
        }

        return labels[method] || method
    }

    const formatDate = (value) => {
        if (!value) return null

        return new Date(value).toLocaleString(
            "en-PH",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        )
    }

    const handleUnauthorized = () => {
        localStorage.removeItem("yocana_token")
        localStorage.removeItem("yocana_user")

        navigate("/login", {
            state: {
                from: `/payment/${orderId}`,
            },
        })
    }

    useEffect(() => {
        const fetchPayment = async () => {
            if (!token) {
                handleUnauthorized()
                return
            }

            try {
                setLoading(true)
                setError("")

                const response = await fetch(
                    `${API_URL}/api/payments/order/${orderId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {
                    handleUnauthorized()
                    return
                }

                const data = await response.json()

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message ||
                            "Unable to load payment"
                    )
                }

                setPayment(data.payment)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPayment()
    }, [orderId])

    if (loading) {
        return (
            <PublicLayout>
                <div className="flex min-h-screen items-center justify-center bg-[#050505] px-5">
                    <div className="text-center">
                        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-[#D4AF37]" />

                        <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-white/30">
                            Loading payment
                        </p>
                    </div>
                </div>
            </PublicLayout>
        )
    }

    if (error || !payment) {
        return (
            <PublicLayout>
                <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5">
                    <div className="text-center">
                        <FiCreditCard
                            size={28}
                            className="mx-auto text-white/20"
                        />

                        <h1 className="mt-5 text-2xl text-white">
                            Payment unavailable
                        </h1>

                        <p className="mt-2 text-sm text-white/30">
                            {error ||
                                "Unable to find this payment."}
                        </p>

                        <Link
                            to="/orders"
                            className="mt-7 inline-flex h-11 items-center justify-center border border-white/15 px-6 text-[9px] uppercase tracking-[0.2em] text-white/60"
                        >
                            Back to Orders
                        </Link>
                    </div>
                </main>
            </PublicLayout>
        )
    }

    const isPaid = payment.status === "paid"

    return (
        <PublicLayout>
            <main className="min-h-screen bg-[#050505] px-5 pb-20 pt-24 md:px-8 md:pb-28 md:pt-28">
                <div className="mx-auto max-w-3xl">

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="text-center"
                    >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04]">
                            {isPaid ? (
                                <FiCheckCircle
                                    size={25}
                                    className="text-[#D4AF37]"
                                />
                            ) : (
                                <FiClock
                                    size={25}
                                    className="text-[#D4AF37]"
                                />
                            )}
                        </div>

                        <p className="mt-7 text-[9px] uppercase tracking-[0.35em] text-[#D4AF37]">
                            {isPaid
                                ? "Payment Successful"
                                : "Payment Pending"}
                        </p>

                        <h1 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
                            {isPaid
                                ? "Your payment has been confirmed"
                                : "Your order has been created"}
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/35">
                            {isPaid
                                ? "Your online payment was successfully confirmed and your order is now being processed."
                                : "Your online payment is still pending confirmation. This payment flow is currently running in development mode."}
                        </p>
                    </motion.div>

                    <motion.section
                        initial={{
                            opacity: 0,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.1,
                        }}
                        className="mt-10 border border-white/10 bg-[#080808] p-5 sm:p-7"
                    >
                        <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                            <FiPackage
                                size={16}
                                className="text-[#D4AF37]"
                            />

                            <div>
                                <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                    Order Number
                                </p>

                                <p className="mt-1 text-sm text-white">
                                    {payment.order_number}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                    Payment Method
                                </p>

                                <p className="mt-2 text-sm text-white/70">
                                    {formatPaymentMethod(
                                        payment.payment_method
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                    Payment Status
                                </p>

                                <div className="mt-2 inline-flex border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] px-3 py-1.5">
                                    <span className="text-[8px] uppercase tracking-[0.2em] text-[#D4AF37]">
                                        {isPaid
                                            ? "Paid"
                                            : "Pending"}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                    Amount
                                </p>

                                <p className="mt-2 text-lg font-medium text-[#D4AF37]">
                                    ₱
                                    {formatPrice(
                                        payment.amount
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                    Payment ID
                                </p>

                                <p className="mt-2 text-sm text-white/50">
                                    #{payment.id}
                                </p>
                            </div>

                            {payment.transaction_reference && (
                                <div>
                                    <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                        Transaction Reference
                                    </p>

                                    <p className="mt-2 break-all text-xs text-white/50">
                                        {
                                            payment.transaction_reference
                                        }
                                    </p>
                                </div>
                            )}

                            {payment.paid_at && (
                                <div>
                                    <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                        Paid At
                                    </p>

                                    <p className="mt-2 text-xs text-white/50">
                                        {formatDate(
                                            payment.paid_at
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>

                        {!isPaid && (
                            <div className="border-t border-white/10 pt-5">
                                <div className="flex items-start gap-3">
                                    <FiCreditCard
                                        size={15}
                                        className="mt-0.5 shrink-0 text-white/25"
                                    />

                                    <p className="text-xs leading-5 text-white/30">
                                        Payment confirmation is
                                        currently handled using the
                                        development payment simulator.
                                        No real payment will be
                                        processed.
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.section>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Link
                            to={`/orders/${orderId}`}
                            className="flex h-12 items-center justify-center border border-white/10 text-[9px] uppercase tracking-[0.2em] text-white/50 transition hover:border-white/25 hover:text-white"
                        >
                            View Order
                        </Link>

                        <Link
                            to="/orders"
                            className="flex h-12 items-center justify-center gap-2 bg-[#D4AF37] text-[9px] font-semibold uppercase tracking-[0.2em] text-[#050505] transition hover:bg-[#E1C35B]"
                        >
                            My Orders
                            <FiArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </main>
        </PublicLayout>
    )
}

export default PaymentPending
