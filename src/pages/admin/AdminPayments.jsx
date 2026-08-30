import { API_URL } from "../../config/api";
import { useEffect, useState } from "react"
import {
    FiCreditCard,
    FiRefreshCw,
    FiCheckCircle,
    FiClock,
    FiUser,
} from "react-icons/fi"

import AdminLayout from "../../layouts/AdminLayout"

function AdminPayments() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [simulatingId, setSimulatingId] = useState(null)
    const [simulateError, setSimulateError] = useState("")

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

    const formatDate = (value) => {
        if (!value) return "—"

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

    const formatPaymentMethod = (method) => {
        const labels = {
            GCASH: "GCash",
            MAYA: "Maya",
            CARD: "Card",
            BANK: "Online Banking",
        }

        return labels[method] || method
    }

    const loadPayments = async () => {
        try {
            setLoading(true)
            setError("")

            const response = await fetch(
                `${API_URL}/api/payments/admin`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to load payments"
                )
            }

            setPayments(data.payments || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSimulateSuccess = async (paymentId) => {
        try {
            setSimulatingId(paymentId)
            setSimulateError("")

            const response = await fetch(
                `${API_URL}/api/payments/admin/${paymentId}/simulate-online-success`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to simulate payment"
                )
            }

            await loadPayments()
        } catch (err) {
            setSimulateError(err.message)
        } finally {
            setSimulatingId(null)
        }
    }

    useEffect(() => {
        loadPayments()
    }, [])

    return (
        <AdminLayout>
            <div className="px-5 py-8 md:px-8">
                <div className="mx-auto max-w-6xl">

                    {/* HEADER */}
                    <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37]">
                                Administration
                            </p>

                            <h1 className="mt-3 text-3xl font-medium">
                                Payments
                            </h1>

                            <p className="mt-2 text-sm text-white/30">
                                Review online payment records in development mode.
                            </p>
                        </div>

                        <button
                            onClick={loadPayments}
                            disabled={loading}
                            className="flex h-9 w-fit items-center justify-center gap-2 self-start border border-white/10 px-4 text-[8px] uppercase tracking-[0.2em] text-white/50 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
                        >
                            <FiRefreshCw
                                size={13}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                            Refresh
                        </button>
                    </div>

                    {/* SIMULATE ERROR */}
                    {simulateError && (
                        <div className="mt-6 border border-red-500/20 bg-red-500/[0.04] p-4">
                            <p className="text-sm text-red-400">
                                {simulateError}
                            </p>
                        </div>
                    )}

                    {/* LOADING */}
                    {loading ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="text-center">
                                <FiRefreshCw
                                    size={22}
                                    className="mx-auto animate-spin text-[#D4AF37]"
                                />

                                <p className="mt-4 text-[9px] uppercase tracking-[0.25em] text-white/30">
                                    Loading payments
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="mt-8 border border-red-500/20 bg-red-500/[0.04] p-4">
                            <p className="text-sm text-red-400">
                                {error}
                            </p>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="mt-8 border border-white/10 bg-[#080808] p-10 text-center">
                            <FiCreditCard
                                size={28}
                                className="mx-auto text-white/20"
                            />

                            <h2 className="mt-4 text-lg text-white/70">
                                No online payments
                            </h2>

                            <p className="mt-2 text-sm text-white/30">
                                Online payment records will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 space-y-4">
                            {payments.map((payment) => {
                                const isPaid =
                                    payment.status === "paid"

                                const isPending =
                                    payment.status === "pending"

                                const isSimulating =
                                    simulatingId === payment.id

                                return (
                                    <div
                                        key={payment.id}
                                        className="border border-white/10 bg-[#080808] p-5 transition hover:border-white/15 md:p-6"
                                    >
                                        {/* TOP */}
                                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <FiCreditCard
                                                        size={15}
                                                        className="text-[#D4AF37]"
                                                    />

                                                    <p className="text-sm font-medium text-white">
                                                        {
                                                            payment.order_number
                                                        }
                                                    </p>
                                                </div>

                                                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/30">
                                                    <FiUser size={12} />

                                                    <span>
                                                        {
                                                            payment.customer_name
                                                        }
                                                    </span>

                                                    <span>
                                                        •
                                                    </span>

                                                    <span>
                                                        {
                                                            payment.customer_email
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-start gap-3 md:items-end">

                                                {/* STATUS */}
                                                <div
                                                    className={`inline-flex w-fit items-center gap-2 border px-3 py-1.5 ${
                                                        isPaid
                                                            ? "border-[#D4AF37]/20 bg-[#D4AF37]/[0.04]"
                                                            : "border-white/10 bg-white/[0.02]"
                                                    }`}
                                                >
                                                    {isPaid ? (
                                                        <FiCheckCircle
                                                            size={12}
                                                            className="text-[#D4AF37]"
                                                        />
                                                    ) : (
                                                        <FiClock
                                                            size={12}
                                                            className="text-white/40"
                                                        />
                                                    )}

                                                    <span
                                                        className={`text-[8px] uppercase tracking-[0.2em] ${
                                                            isPaid
                                                                ? "text-[#D4AF37]"
                                                                : "text-white/40"
                                                        }`}
                                                    >
                                                        {
                                                            payment.status
                                                        }
                                                    </span>
                                                </div>

                                                {/* SIMULATE BUTTON */}
                                                {isPending && (
                                                    <button
                                                        onClick={() =>
                                                            handleSimulateSuccess(
                                                                payment.id
                                                            )
                                                        }
                                                        disabled={
                                                            isSimulating
                                                        }
                                                        className="flex h-10 items-center justify-center bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {isSimulating
                                                            ? "Processing..."
                                                            : "Simulate Success"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* DETAILS */}
                                        <div className="mt-6 grid grid-cols-2 gap-5 border-t border-white/10 pt-5 md:grid-cols-4">
                                            <div>
                                                <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                    Method
                                                </p>

                                                <p className="mt-2 text-sm text-white/60">
                                                    {formatPaymentMethod(
                                                        payment.payment_method
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                    Amount
                                                </p>

                                                <p className="mt-2 text-sm text-[#D4AF37]">
                                                    ₱
                                                    {formatPrice(
                                                        payment.amount
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                    Payment ID
                                                </p>

                                                <p className="mt-2 text-sm text-white/50">
                                                    #
                                                    {
                                                        payment.id
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                    Created
                                                </p>

                                                <p className="mt-2 text-xs text-white/40">
                                                    {formatDate(
                                                        payment.created_at
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* TRANSACTION REFERENCE */}
                                        {payment.transaction_reference && (
                                            <div className="mt-5 border-t border-white/10 pt-5">
                                                <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                    Transaction Reference
                                                </p>

                                                <p className="mt-2 break-all text-xs text-white/40">
                                                    {
                                                        payment.transaction_reference
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {/* PAID DATE */}
                                        {payment.paid_at && (
                                            <div className="mt-4">
                                                <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                    Paid At
                                                </p>

                                                <p className="mt-2 text-xs text-white/40">
                                                    {formatDate(
                                                        payment.paid_at
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* DEVELOPMENT NOTICE */}
                    <div className="mt-8 border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] p-5">
                        <div className="flex items-start gap-3">
                            <FiCheckCircle
                                size={17}
                                className="mt-0.5 shrink-0 text-[#D4AF37]"
                            />

                            <p className="text-xs leading-5 text-white/35">
                                Development mode only. No real money is processed through the payment simulator.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminPayments
