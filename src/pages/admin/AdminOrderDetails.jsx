import { API_URL } from "../../config/api";
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
    FiArrowLeft,
    FiPackage,
    FiUser,
    FiMapPin,
    FiCreditCard,
    FiRefreshCw,
    FiTruck,
    FiCheck,
} from "react-icons/fi"

import AdminLayout from "../../layouts/AdminLayout"
import BrandLoader from "../../components/BrandLoader"

function AdminOrderDetails() {
    const { id } = useParams()

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [actionLoading, setActionLoading] = useState(false)
    const [actionError, setActionError] = useState("")

    const [showShipForm, setShowShipForm] = useState(false)
    const [courierName, setCourierName] = useState("")
    const [trackingNumber, setTrackingNumber] = useState("")
    const [trackingUrl, setTrackingUrl] = useState("")

    const [loaderOpen, setLoaderOpen] = useState(false)
    const [loaderStatus, setLoaderStatus] = useState("loading")
    const [loaderMessage, setLoaderMessage] = useState("")

    const token = localStorage.getItem("yocana_token")

    const formatPrice = (value) =>
        Number(value || 0).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })

    const formatDate = (value) => {
        if (!value) return "—"

        return new Date(value).toLocaleString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        })
    }

    const formatPaymentMethod = (method) => {
        const labels = {
            COD: "Cash on Delivery",
            GCASH: "GCash",
            MAYA: "Maya",
            CARD: "Card",
            BANK: "Online Banking",
        }

        return labels[method] || method
    }

    const loadOrder = async (silent = false) => {
        try {
            if (!silent) {
                setLoading(true)
            }

            setError("")

            const response = await fetch(
                `${API_URL}/api/orders/admin/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load order"
                )
            }

            setOrder(data.order)
        } catch (err) {
            setError(err.message)
        } finally {
            if (!silent) {
                setLoading(false)
            }
        }
    }

    const showActionSuccess = (message) => {
        setLoaderStatus("success")
        setLoaderMessage(message)

        setTimeout(() => {
            setLoaderOpen(false)
        }, 1400)
    }

    const handleConfirmCod = async () => {
        try {
            setActionLoading(true)
            setActionError("")

            setLoaderStatus("loading")
            setLoaderMessage("Confirming COD order")
            setLoaderOpen(true)

            const response = await fetch(
                `${API_URL}/api/orders/admin/${id}/confirm-cod`,
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
                    data.message || "Failed to confirm COD order"
                )
            }

            await loadOrder(true)

            showActionSuccess("COD Order Confirmed")
        } catch (err) {
            setLoaderOpen(false)
            setActionError(err.message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleShipOrder = async (event) => {
        event.preventDefault()

        if (!courierName.trim() || !trackingNumber.trim()) {
            setActionError(
                "Courier name and tracking number are required."
            )
            return
        }

        try {
            setActionLoading(true)
            setActionError("")

            setLoaderStatus("loading")
            setLoaderMessage("Preparing shipment")
            setLoaderOpen(true)

            const response = await fetch(
                `${API_URL}/api/orders/admin/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        order_status: "shipped",
                        courier_name: courierName.trim(),
                        tracking_number: trackingNumber.trim(),
                        tracking_url: trackingUrl.trim() || null,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to ship order"
                )
            }

            setShowShipForm(false)
            setCourierName("")
            setTrackingNumber("")
            setTrackingUrl("")

            await loadOrder(true)

            showActionSuccess("Order Shipped")
        } catch (err) {
            setLoaderOpen(false)
            setActionError(err.message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleMarkDelivered = async () => {
        try {
            setActionLoading(true)
            setActionError("")

            setLoaderStatus("loading")
            setLoaderMessage("Updating delivery")
            setLoaderOpen(true)

            const response = await fetch(
                `${API_URL}/api/orders/admin/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        order_status: "delivered",
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to mark order as delivered"
                )
            }

            await loadOrder(true)

            showActionSuccess("Order Delivered")
        } catch (err) {
            setLoaderOpen(false)
            setActionError(err.message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleConfirmCodPayment = async () => {
        try {
            setActionLoading(true)
            setActionError("")

            setLoaderStatus("loading")
            setLoaderMessage("Confirming COD payment")
            setLoaderOpen(true)

            // Get payment record using Order ID
            const paymentResponse = await fetch(
                `${API_URL}/api/payments/admin/order/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const paymentData = await paymentResponse.json()

            if (!paymentResponse.ok || !paymentData.success) {
                throw new Error(
                    paymentData.message ||
                    "Failed to load COD payment"
                )
            }

            const paymentId = paymentData.payment.id

            // Confirm actual COD payment
            const response = await fetch(
                `${API_URL}/api/payments/admin/${paymentId}/confirm-cod`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({}),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to confirm COD payment"
                )
            }

            await loadOrder(true)

            showActionSuccess("COD Payment Confirmed")
        } catch (err) {
            setLoaderOpen(false)
            setActionError(err.message)
        } finally {
            setActionLoading(false)
        }
    }

    useEffect(() => {
        loadOrder()
    }, [id])

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex min-h-[70vh] items-center justify-center px-4">
                    <div className="text-center">
                        <FiRefreshCw
                            size={22}
                            className="mx-auto animate-spin text-[#D4AF37]"
                        />

                        <p className="mt-4 text-[8px] uppercase tracking-[0.25em] text-white/30">
                            Loading Order
                        </p>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    if (error || !order) {
        return (
            <AdminLayout>
                <div className="px-4 py-8 sm:px-5 md:px-8">
                    <div className="mx-auto max-w-6xl">
                        <Link
                            to="/admin/orders"
                            className="inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-white/30 transition hover:text-[#D4AF37]"
                        >
                            <FiArrowLeft size={13} />
                            Orders
                        </Link>

                        <div className="mt-6 border border-red-500/20 bg-red-500/[0.04] p-5">
                            <p className="text-sm text-red-400">
                                {error || "Order not found"}
                            </p>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <BrandLoader
                show={loaderOpen}
                status={loaderStatus}
                message={loaderMessage}
            />

            <div className="px-4 py-7 sm:px-5 md:px-8">
                <div className="mx-auto max-w-6xl">

                    {/* BACK */}
                    <Link
                        to="/admin/orders"
                        className="inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-white/30 transition hover:text-[#D4AF37]"
                    >
                        <FiArrowLeft size={13} />
                        Back to Orders
                    </Link>

                    {/* HEADER */}
                    <div className="mt-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
                                Order Details
                            </p>

                            <h1 className="mt-3 break-all text-xl font-medium text-white sm:text-2xl">
                                {order.order_number}
                            </h1>

                            <p className="mt-2 text-xs text-white/30">
                                {formatDate(order.created_at)}
                            </p>
                        </div>

                        <div className="w-fit border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] px-3 py-2">
                            <span className="text-[8px] uppercase tracking-[0.2em] text-[#D4AF37]">
                                {order.order_status}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">

                        {/* LEFT */}
                        <div className="min-w-0 space-y-5">

                            {/* ORDER ITEMS */}
                            <section className="border border-white/10 bg-[#080808] p-4 sm:p-5">
                                <div className="flex items-center gap-3">
                                    <FiPackage
                                        size={15}
                                        className="text-[#D4AF37]"
                                    />

                                    <h2 className="text-xs font-medium text-white/70">
                                        Order Items
                                    </h2>
                                </div>

                                <div className="mt-5 divide-y divide-white/10">
                                    {order.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                                        >
                                            <div className="min-w-0">
                                                <p className="break-words text-sm text-white/70">
                                                    {item.product_name}
                                                </p>

                                                <p className="mt-1 text-xs text-white/25">
                                                    ₱{formatPrice(item.price)}
                                                    {" × "}
                                                    {item.quantity}
                                                </p>
                                            </div>

                                            <p className="shrink-0 text-sm text-[#D4AF37]">
                                                ₱{formatPrice(item.subtotal)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* CUSTOMER */}
                            <section className="border border-white/10 bg-[#080808] p-4 sm:p-5">
                                <div className="flex items-center gap-3">
                                    <FiUser
                                        size={15}
                                        className="text-[#D4AF37]"
                                    />

                                    <h2 className="text-xs font-medium text-white/70">
                                        Customer
                                    </h2>
                                </div>

                                <div className="mt-5 space-y-2">
                                    <p className="text-sm text-white/70">
                                        {order.first_name} {order.last_name}
                                    </p>

                                    <p className="break-all text-xs text-white/35">
                                        {order.email}
                                    </p>

                                    <p className="break-all text-xs text-white/35">
                                        {order.phone || "No phone number"}
                                    </p>
                                </div>
                            </section>

                            {/* SHIPPING */}
                            <section className="border border-white/10 bg-[#080808] p-4 sm:p-5">
                                <div className="flex items-center gap-3">
                                    <FiMapPin
                                        size={15}
                                        className="text-[#D4AF37]"
                                    />

                                    <h2 className="text-xs font-medium text-white/70">
                                        Shipping
                                    </h2>
                                </div>

                                <div className="mt-5">
                                    <p className="break-words text-sm leading-6 text-white/60">
                                        {order.shipping_address}
                                    </p>

                                    <p className="mt-2 text-xs text-white/30">
                                        {order.shipping_region}
                                    </p>

                                    {order.courier_name && (
                                        <div className="mt-5 border-t border-white/10 pt-4">
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Courier
                                            </p>

                                            <p className="mt-2 text-sm text-white/60">
                                                {order.courier_name}
                                            </p>
                                        </div>
                                    )}

                                    {order.tracking_number && (
                                        <div className="mt-4">
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Tracking Number
                                            </p>

                                            <p className="mt-2 break-all text-sm text-white/60">
                                                {order.tracking_number}
                                            </p>
                                        </div>
                                    )}

                                    {order.tracking_url && (
                                        <div className="mt-4">
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Tracking Link
                                            </p>

                                            <a
                                                href={order.tracking_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-2 inline-block break-all text-xs text-[#D4AF37] transition hover:text-[#E1C35B]"
                                            >
                                                Open Tracking
                                            </a>
                                        </div>
                                    )}

                                    {order.shipped_at && (
                                        <div className="mt-4">
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Shipped
                                            </p>

                                            <p className="mt-2 text-xs text-white/40">
                                                {formatDate(order.shipped_at)}
                                            </p>
                                        </div>
                                    )}

                                    {order.delivered_at && (
                                        <div className="mt-4">
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Delivered
                                            </p>

                                            <p className="mt-2 text-xs text-white/40">
                                                {formatDate(order.delivered_at)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* RIGHT */}
                        <div className="min-w-0 space-y-5">

                            {/* MANAGE ORDER */}
                            <section className="border border-[#D4AF37]/15 bg-[#D4AF37]/[0.025] p-4 sm:p-5">
                                <p className="text-[8px] uppercase tracking-[0.25em] text-[#D4AF37]">
                                    Manage Order
                                </p>

                                <p className="mt-2 text-xs leading-5 text-white/30">
                                    Process this order based on its current status.
                                </p>

                                {actionError && (
                                    <div className="mt-4 border border-red-500/20 bg-red-500/[0.04] p-3">
                                        <p className="text-xs leading-5 text-red-400">
                                            {actionError}
                                        </p>
                                    </div>
                                )}

                                {/* COD PENDING */}
                                {order.payment_method === "COD" &&
                                    order.order_status === "pending" && (
                                        <div className="mt-5">
                                            <p className="text-xs leading-5 text-white/35">
                                                Confirm this COD order before preparing it for shipment.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={handleConfirmCod}
                                                disabled={actionLoading}
                                                className="mt-4 flex h-10 w-full items-center justify-center bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
                                            >
                                                Confirm COD Order
                                            </button>
                                        </div>
                                    )}

                                {/* ONLINE PENDING */}
                                {order.payment_method !== "COD" &&
                                    order.order_status === "pending" && (
                                        <div className="mt-5 border border-white/10 bg-[#050505] p-4">
                                            <p className="text-xs leading-5 text-white/35">
                                                This online order is waiting for payment confirmation.
                                            </p>

                                            <p className="mt-2 text-[8px] uppercase tracking-[0.18em] text-[#D4AF37]">
                                                Payment: {order.payment_status}
                                            </p>
                                        </div>
                                    )}

                                {/* PREPARING */}
                                {order.order_status === "preparing" && (
                                    <div className="mt-5">
                                        {!showShipForm ? (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <FiTruck
                                                        size={15}
                                                        className="mt-0.5 shrink-0 text-[#D4AF37]"
                                                    />

                                                    <p className="text-xs leading-5 text-white/35">
                                                        This order is ready to be shipped.
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowShipForm(true)
                                                        setActionError("")
                                                    }}
                                                    className="mt-4 flex h-10 w-full items-center justify-center bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] sm:w-fit"
                                                >
                                                    Ship Order
                                                </button>
                                            </>
                                        ) : (
                                            <form
                                                onSubmit={handleShipOrder}
                                                className="space-y-4"
                                            >
                                                <div>
                                                    <label
                                                        htmlFor="courier"
                                                        className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/25"
                                                    >
                                                        Courier Name
                                                    </label>

                                                    <input
                                                        id="courier"
                                                        type="text"
                                                        value={courierName}
                                                        onChange={(event) =>
                                                            setCourierName(event.target.value)
                                                        }
                                                        placeholder="e.g. J&T Express"
                                                        className="h-11 w-full min-w-0 border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/40"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="trackingNumber"
                                                        className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/25"
                                                    >
                                                        Tracking Number
                                                    </label>

                                                    <input
                                                        id="trackingNumber"
                                                        type="text"
                                                        value={trackingNumber}
                                                        onChange={(event) =>
                                                            setTrackingNumber(event.target.value)
                                                        }
                                                        placeholder="Enter tracking number"
                                                        className="h-11 w-full min-w-0 border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/40"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="trackingUrl"
                                                        className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/25"
                                                    >
                                                        Tracking URL
                                                    </label>

                                                    <input
                                                        id="trackingUrl"
                                                        type="url"
                                                        value={trackingUrl}
                                                        onChange={(event) =>
                                                            setTrackingUrl(event.target.value)
                                                        }
                                                        placeholder="Optional"
                                                        className="h-11 w-full min-w-0 border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/40"
                                                    />

                                                    <p className="mt-2 text-[9px] leading-4 text-white/20">
                                                        Optional courier tracking link.
                                                    </p>
                                                </div>

                                                <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                                                    <button
                                                        type="submit"
                                                        disabled={actionLoading}
                                                        className="flex h-10 w-full items-center justify-center bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
                                                    >
                                                        Confirm Shipment
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={actionLoading}
                                                        onClick={() => {
                                                            setShowShipForm(false)
                                                            setActionError("")
                                                        }}
                                                        className="flex h-10 w-full items-center justify-center border border-white/10 px-4 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-white/20 hover:text-white disabled:opacity-40 sm:w-fit"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                )}

                                {/* SHIPPED */}
                                {order.order_status === "shipped" && (
                                    <div className="mt-5">
                                        <div className="flex items-start gap-3">
                                            <FiTruck
                                                size={15}
                                                className="mt-0.5 shrink-0 text-[#D4AF37]"
                                            />

                                            <div className="min-w-0">
                                                <p className="text-xs leading-5 text-white/40">
                                                    This order is currently in transit.
                                                </p>

                                                {order.courier_name && (
                                                    <p className="mt-2 break-words text-[9px] uppercase tracking-[0.15em] text-white/25">
                                                        {order.courier_name}
                                                        {order.tracking_number
                                                            ? ` • ${order.tracking_number}`
                                                            : ""}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleMarkDelivered}
                                            disabled={actionLoading}
                                            className="mt-5 flex h-10 w-full items-center justify-center gap-2 bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
                                        >
                                            <FiCheck size={13} />
                                            Mark Delivered
                                        </button>
                                    </div>
                                )}

                                {/* DELIVERED */}
                                {order.order_status === "delivered" && (
                                    <div className="mt-5 space-y-4">
                                        <div className="border border-[#D4AF37]/15 bg-[#D4AF37]/[0.035] p-4">
                                            <div className="flex items-start gap-3">
                                                <FiCheck
                                                    size={15}
                                                    className="mt-0.5 shrink-0 text-[#D4AF37]"
                                                />

                                                <div>
                                                    <p className="text-xs text-[#D4AF37]">
                                                        Order completed
                                                    </p>

                                                    <p className="mt-2 text-[9px] leading-4 text-white/25">
                                                        This order has been successfully delivered to the customer.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* COD PAYMENT STILL PENDING */}
                                        {order.payment_method === "COD" &&
                                            order.payment_status !== "paid" && (
                                                <div className="border border-yellow-500/20 bg-yellow-500/[0.035] p-4">
                                                    <p className="text-xs text-yellow-400">
                                                        COD payment not yet recorded
                                                    </p>

                                                    <p className="mt-2 text-[9px] leading-4 text-white/30">
                                                        Confirm that the cash payment was collected from the customer.
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={handleConfirmCodPayment}
                                                        disabled={actionLoading}
                                                        className="mt-4 flex h-10 w-fit items-center justify-center gap-2 bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <FiCreditCard size={13} />
                                                        Confirm COD Payment
                                                    </button>
                                                </div>
                                            )}

                                        {/* COD PAYMENT PAID */}
                                        {order.payment_method === "COD" &&
                                            order.payment_status === "paid" && (
                                                <div className="flex items-center gap-3 border border-green-500/20 bg-green-500/[0.035] p-4">
                                                    <FiCheck
                                                        size={14}
                                                        className="shrink-0 text-green-400"
                                                    />

                                                    <div>
                                                        <p className="text-xs text-green-400">
                                                            COD payment recorded
                                                        </p>

                                                        <p className="mt-1 text-[9px] text-white/25">
                                                            Payment for this order has been confirmed.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                )}

                                {/* CANCELLED */}
                                {order.order_status === "cancelled" && (
                                    <p className="mt-5 text-xs leading-5 text-red-400">
                                        This order has been cancelled.
                                    </p>
                                )}

                                {/* RETURNED */}
                                {order.order_status === "returned" && (
                                    <p className="mt-5 text-xs leading-5 text-orange-300">
                                        This order has been returned.
                                    </p>
                                )}
                            </section>

                            {/* PAYMENT */}
                            <section className="border border-white/10 bg-[#080808] p-4 sm:p-5">
                                <div className="flex items-center gap-3">
                                    <FiCreditCard
                                        size={15}
                                        className="text-[#D4AF37]"
                                    />

                                    <h2 className="text-xs font-medium text-white/70">
                                        Payment
                                    </h2>
                                </div>

                                <div className="mt-5 space-y-4">
                                    <div>
                                        <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                            Method
                                        </p>

                                        <p className="mt-1 text-sm text-white/60">
                                            {formatPaymentMethod(order.payment_method)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                            Status
                                        </p>

                                        <p className="mt-1 text-xs uppercase text-[#D4AF37]">
                                            {order.payment_status}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* SUMMARY */}
                            <section className="border border-white/10 bg-[#080808] p-4 sm:p-5">
                                <h2 className="text-xs font-medium text-white/70">
                                    Order Summary
                                </h2>

                                <div className="mt-5 space-y-3 text-xs">
                                    <div className="flex justify-between gap-4">
                                        <span className="text-white/30">
                                            Subtotal
                                        </span>

                                        <span className="text-white/60">
                                            ₱{formatPrice(order.subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-white/30">
                                            Shipping
                                        </span>

                                        <span className="text-white/60">
                                            ₱{formatPrice(order.shipping_fee)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-white/30">
                                            Discount
                                        </span>

                                        <span className="text-white/60">
                                            -₱{formatPrice(order.discount_amount)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4 border-t border-white/10 pt-4">
                                        <span className="text-white/50">
                                            Total
                                        </span>

                                        <span className="text-base font-medium text-[#D4AF37]">
                                            ₱{formatPrice(order.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminOrderDetails
