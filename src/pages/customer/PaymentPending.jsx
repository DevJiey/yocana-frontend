import { API_URL } from "../../config/api"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import {
    FiClock,
    FiCreditCard,
    FiPackage,
    FiArrowRight,
    FiCheckCircle,
    FiCopy,
    FiCheck,
    FiAlertCircle,
    FiSend,
} from "react-icons/fi"
import { Link, useNavigate, useParams } from "react-router-dom"

import PublicLayout from "../../layouts/PublicLayout"
import gcashQrImage from "../../assets/gcash-qr.jpg"

function PaymentPending() {
    const { orderId } = useParams()
    const navigate = useNavigate()

    const [payment, setPayment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [referenceInput, setReferenceInput] = useState("")
    const [submittingRef, setSubmittingRef] = useState(false)
    const [refSuccessMsg, setRefSuccessMsg] = useState("")
    const [refErrorMsg, setRefErrorMsg] = useState("")
    const [copiedField, setCopiedField] = useState("")

    const token = localStorage.getItem("yocana_token")

    const formatPrice = (value) =>
        Number(value || 0).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })

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
        return new Date(value).toLocaleString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        })
    }

    const handleCopy = (text, fieldName) => {
        if (!text) return
        navigator.clipboard.writeText(String(text).trim())
        setCopiedField(fieldName)
        setTimeout(() => setCopiedField(""), 2000)
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

                if (response.status === 401 || response.status === 403) {
                    handleUnauthorized()
                    return
                }

                const data = await response.json()

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Unable to load payment"
                    )
                }

                setPayment(data.payment)
                if (data.payment.transaction_reference) {
                    setReferenceInput(data.payment.transaction_reference)
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPayment()
    }, [orderId])

    const handleSubmitReference = async (e) => {
        e.preventDefault()

        const cleanRef = referenceInput.trim()
        if (!cleanRef) {
            setRefErrorMsg("Please enter your reference number.")
            return
        }

        try {
            setSubmittingRef(true)
            setRefErrorMsg("")
            setRefSuccessMsg("")

            const response = await fetch(
                `${API_URL}/api/payments/order/${orderId}/submit-reference`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ reference_number: cleanRef }),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to submit reference number"
                )
            }

            setPayment(data.payment)
            setRefSuccessMsg(
                "Payment reference number submitted successfully! We are verifying your payment."
            )
        } catch (err) {
            setRefErrorMsg(err.message)
        } finally {
            setSubmittingRef(false)
        }
    }

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
                <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 pb-20 pt-24 md:px-8 md:pb-28 md:pt-28">
                    <div className="mx-auto max-w-md text-center">
                        <h1 className="mt-5 text-2xl text-white">
                            Payment unavailable
                        </h1>
                        <p className="mt-2 text-sm text-white/30">
                            {error || "Unable to find this payment."}
                        </p>
                        <Link
                            to="/orders"
                            className="mt-7 inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-6 text-[9px] uppercase tracking-[0.2em] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] active:scale-95"
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
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04]">
                            {isPaid ? (
                                <FiCheckCircle
                                    size={25}
                                    className="text-emerald-400"
                                />
                            ) : (
                                <FiClock
                                    size={25}
                                    className="text-[#D4AF37]"
                                />
                            )}
                        </div>

                        <p className="mt-7 text-[9px] uppercase tracking-[0.35em] text-[#D4AF37]">
                            {isPaid ? "Payment Verified" : "Online Payment"}
                        </p>

                        <h1 className="mt-3 text-2xl font-medium tracking-tight text-white sm:text-3xl md:text-4xl">
                            {isPaid
                                ? "Payment Confirmed"
                                : "Complete Your Payment"}
                        </h1>

                        <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-white/45 sm:text-sm">
                            {isPaid
                                ? "Your online payment has been confirmed by our team. Your order is now being prepared for SPX shipment."
                                : "Scan the QR code below or transfer via GCash / Maya, then enter your Reference Number to verify."}
                        </p>
                    </motion.div>

                    {/* QR CODE & PAYMENT INSTRUCTIONS */}
                    {!isPaid && (
                        <motion.section
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-8 border border-white/10 bg-[#080808] p-5 sm:p-7"
                        >
                            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37]/20 text-xs font-semibold text-[#D4AF37]">
                                    1
                                </span>
                                <h2 className="text-sm font-medium uppercase tracking-wider text-white/90">
                                    Scan & Send Payment
                                </h2>
                            </div>

                            <div className="mt-6 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                                {/* QR CODE IMAGE */}
                                <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-[#050505] p-5">
                                    <div className="relative overflow-hidden rounded border-2 border-[#D4AF37]/40 p-2 bg-white">
                                        <img
                                            src={gcashQrImage}
                                            alt="YOCANA GCash InstaPay QR Code"
                                            className="h-60 w-60 object-contain sm:h-64 sm:w-64"
                                        />
                                    </div>
                                    <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                                        InstaPay / GCash QR
                                    </p>
                                </div>

                                {/* ACCOUNT DETAILS & ACTIONS */}
                                <div className="space-y-4">
                                    {/* AMOUNT */}
                                    <div className="rounded border border-[#D4AF37]/20 bg-[#D4AF37]/[0.03] p-4">
                                        <p className="text-[8px] uppercase tracking-[0.25em] text-[#D4AF37]">
                                            Exact Amount to Send
                                        </p>
                                        <div className="mt-1 flex items-center justify-between">
                                            <p className="text-2xl font-bold text-[#D4AF37]">
                                                ₱{formatPrice(payment.amount)}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCopy(
                                                        payment.amount,
                                                        "amount"
                                                    )
                                                }
                                                className="inline-flex items-center gap-1.5 rounded border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 text-[9px] font-medium uppercase tracking-wider text-[#D4AF37] transition hover:bg-[#D4AF37]/20"
                                            >
                                                {copiedField === "amount" ? (
                                                    <>
                                                        <FiCheck size={12} className="text-emerald-400" />
                                                        <span className="text-emerald-400">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiCopy size={12} />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* ACCOUNT NAME */}
                                    <div className="rounded border border-white/10 bg-[#050505] p-3.5">
                                        <p className="text-[8px] uppercase tracking-[0.2em] text-white/30">
                                            Account Name
                                        </p>
                                        <p className="mt-1 font-medium text-white/90">
                                            Ian Mosher Pasco
                                        </p>
                                    </div>

                                    {/* MOBILE NUMBER */}
                                    <div className="rounded border border-white/10 bg-[#050505] p-3.5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[8px] uppercase tracking-[0.2em] text-white/30">
                                                    GCash Mobile Number
                                                </p>
                                                <p className="mt-1 font-mono text-base font-semibold text-white/90">
                                                    0917 105 4076
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCopy(
                                                        "09171054076",
                                                        "mobile"
                                                    )
                                                }
                                                className="inline-flex items-center gap-1.5 rounded border border-white/15 bg-white/5 px-3 py-1.5 text-[9px] font-medium uppercase tracking-wider text-white/70 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                                            >
                                                {copiedField === "mobile" ? (
                                                    <>
                                                        <FiCheck size={12} className="text-emerald-400" />
                                                        <span className="text-emerald-400">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiCopy size={12} />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-[10px] leading-5 text-white/40">
                                        Tip: Scan the QR code or send to{" "}
                                        <strong className="text-white/70">
                                            0917 105 4076
                                        </strong>
                                        . Make sure to save or screenshot the
                                        Reference Number after paying!
                                    </p>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* SUBMIT REFERENCE NUMBER */}
                    {!isPaid && (
                        <motion.section
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="mt-6 border border-white/10 bg-[#080808] p-5 sm:p-7"
                        >
                            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37]/20 text-xs font-semibold text-[#D4AF37]">
                                    2
                                </span>
                                <h2 className="text-sm font-medium uppercase tracking-wider text-white/90">
                                    Submit Reference Number
                                </h2>
                            </div>

                            {payment.transaction_reference && (
                                <div className="mt-5 rounded border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
                                    <div className="flex items-center gap-2">
                                        <FiCheckCircle className="text-emerald-400 shrink-0" size={16} />
                                        <p className="text-xs font-medium text-emerald-400">
                                            Reference Number Submitted
                                        </p>
                                    </div>
                                    <p className="mt-1 font-mono text-sm font-semibold text-white/90">
                                        {payment.transaction_reference}
                                    </p>
                                    <p className="mt-2 text-[10px] text-white/45">
                                        Status:{" "}
                                        <span className="text-[#D4AF37] font-medium">
                                            Awaiting Verification
                                        </span>
                                        . Our team is verifying your payment and
                                        will approve your order shortly.
                                    </p>
                                </div>
                            )}

                            {refSuccessMsg && (
                                <div className="mt-4 border border-emerald-500/20 bg-emerald-500/[0.04] p-3">
                                    <p className="text-xs text-emerald-400">
                                        {refSuccessMsg}
                                    </p>
                                </div>
                            )}

                            {refErrorMsg && (
                                <div className="mt-4 border border-red-500/20 bg-red-500/[0.04] p-3">
                                    <p className="text-xs text-red-400">
                                        {refErrorMsg}
                                    </p>
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmitReference}
                                className="mt-5 space-y-4"
                            >
                                <div>
                                    <label
                                        htmlFor="refNo"
                                        className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-white/40"
                                    >
                                        GCash / Maya Reference Number
                                    </label>
                                    <input
                                        id="refNo"
                                        type="text"
                                        value={referenceInput}
                                        onChange={(e) =>
                                            setReferenceInput(e.target.value)
                                        }
                                        placeholder="e.g. 1002345678901"
                                        className="h-12 w-full rounded border border-white/10 bg-[#050505] px-4 font-mono text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/60"
                                    />
                                    <p className="mt-2 text-[10px] text-white/30">
                                        Found on your GCash transaction slip or SMS confirmation.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submittingRef}
                                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#FFE28A]/40 bg-[#D4AF37]/95 px-6 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#050505] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_20px_rgba(212,175,55,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-[#E1C35B] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                >
                                    {submittingRef ? (
                                        "Submitting..."
                                    ) : (
                                        <>
                                            <span>
                                                {payment.transaction_reference
                                                    ? "Update Reference Number"
                                                    : "Submit Payment Proof"}
                                            </span>
                                            <FiSend size={12} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.section>
                    )}

                    {/* ORDER DETAILS SUMMARY */}
                    <motion.section
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 border border-white/10 bg-[#080808] p-5 sm:p-7"
                    >
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <FiPackage size={16} className="text-[#D4AF37]" />
                            <p className="text-xs uppercase tracking-wider text-white/80">
                                Order #{payment.order_number}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-5 sm:grid-cols-4 text-xs">
                            <div>
                                <p className="text-[8px] uppercase tracking-wider text-white/30">
                                    Method
                                </p>
                                <p className="mt-1 font-medium text-white/80">
                                    {formatPaymentMethod(payment.payment_method)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[8px] uppercase tracking-wider text-white/30">
                                    Status
                                </p>
                                <p
                                    className={`mt-1 font-semibold uppercase text-[9px] tracking-wider ${
                                        isPaid ? "text-emerald-400" : "text-[#D4AF37]"
                                    }`}
                                >
                                    {isPaid ? "Paid" : "Pending Verification"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[8px] uppercase tracking-wider text-white/30">
                                    Total Amount
                                </p>
                                <p className="mt-1 font-bold text-[#D4AF37]">
                                    ₱{formatPrice(payment.amount)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[8px] uppercase tracking-wider text-white/30">
                                    Payment ID
                                </p>
                                <p className="mt-1 font-mono text-white/50">
                                    #{payment.id}
                                </p>
                            </div>
                        </div>

                        {payment.paid_at && (
                            <div className="border-t border-white/5 pt-3 text-[10px] text-white/40">
                                Verified At: {formatDate(payment.paid_at)}
                            </div>
                        )}
                    </motion.section>

                    {/* NAVIGATION BUTTONS */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Link
                            to={`/orders/${orderId}`}
                            className="flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-[9px] uppercase tracking-[0.2em] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] active:scale-95"
                        >
                            View Order Details
                        </Link>

                        <Link
                            to="/orders"
                            className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#FFE28A]/40 bg-[#D4AF37]/95 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#050505] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(212,175,55,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-[#E1C35B] hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] active:scale-95"
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
