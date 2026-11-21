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
    FiCopy,
    FiExternalLink,
    FiClipboard,
} from "react-icons/fi"

import AdminLayout from "../../layouts/AdminLayout"
import hommeImage from "../../assets/yocana-homme.png"
import femmeImage from "../../assets/yocana-femme.png"
import BrandLoader from "../../components/BrandLoader"

function AdminOrderDetails() {
    const { id } = useParams()

    const [order, setOrder] = useState(null)
    const [payment, setPayment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [actionLoading, setActionLoading] = useState(false)
    const [actionError, setActionError] = useState("")

    const [showShipForm, setShowShipForm] = useState(false)
    const [courierName, setCourierName] = useState("SPX Express")
    const [trackingNumber, setTrackingNumber] = useState("")
    const [trackingUrl, setTrackingUrl] = useState("")
    const [copiedField, setCopiedField] = useState("")

    const [loaderOpen, setLoaderOpen] = useState(false)
    const [loaderStatus, setLoaderStatus] = useState("loading")
    const [loaderMessage, setLoaderMessage] = useState("")

    const token = localStorage.getItem("yocana_token")

    const getItemImage = (item) => {
        if (item?.image_url && typeof item.image_url === "string" && item.image_url.startsWith("http")) {
            return item.image_url;
        }
        const name = (item?.product_name || item?.name || "").toLowerCase();
        if (name.includes("femme") || name.includes("women") || name.includes("red")) {
            return femmeImage;
        }
        return hommeImage;
    };

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

            const orderPromise = fetch(`${API_URL}/api/orders/admin/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            const paymentPromise = fetch(
                `${API_URL}/api/payments/admin/order/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            ).catch(() => null)

            const [orderRes, paymentRes] = await Promise.all([
                orderPromise,
                paymentPromise,
            ])

            const data = await orderRes.json()

            if (!orderRes.ok || !data.success) {
                throw new Error(data.message || "Failed to load order")
            }

            setOrder(data.order)

            if (paymentRes && paymentRes.ok) {
                const paymentData = await paymentRes.json()
                if (paymentData.success) {
                    setPayment(paymentData.payment)
                }
            }
        } catch (err) {
            setError(err.message)
        } finally {
            if (!silent) {
                setLoading(false)
            }
        }
    }

    const handleCopy = (text, fieldName) => {
        if (!text) return
        navigator.clipboard.writeText(String(text).trim())
        setCopiedField(fieldName)
        setTimeout(() => setCopiedField(""), 2000)
    }

    const handleCopyAllForSpx = () => {
        if (!order) return
        const recipient = order.recipient_name || `${order.first_name || ""} ${order.last_name || ""}`.trim()
        const phone = order.recipient_phone || order.phone || ""
        const address = order.shipping_address || ""
        const codAmount =
            order.payment_method === "COD" && order.payment_status !== "paid"
                ? `PHP ${formatPrice(order.total_amount)}`
                : "PHP 0.00 (Paid / Non-COD)"

        const spxText = `[SPX SHIPMENT BOOKING]\nReceiver: ${recipient}\nPhone: ${phone}\nAddress: ${address}\nRegion: ${order.shipping_region || ""}\nCOD Collection: ${codAmount}\nParcel: Perfume (50ml)`

        handleCopy(spxText, "all_spx")
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

    const handleConfirmOnlinePayment = async () => {
        if (!payment?.id) return

        try {
            setActionLoading(true)
            setActionError("")

            setLoaderStatus("loading")
            setLoaderMessage("Confirming online payment")
            setLoaderOpen(true)

            const response = await fetch(
                `${API_URL}/api/payments/admin/${payment.id}/confirm-online`,
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
                    data.message || "Failed to confirm online payment"
                )
            }

            await loadOrder(true)

            showActionSuccess("Payment Confirmed")
        } catch (err) {
            setLoaderOpen(false)
            setActionError(err.message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleShipOrder = async (event) => {
        event.preventDefault()

        const selectedCourier = (courierName || "SPX Express").trim()
        const cleanTracking = trackingNumber.trim()

        if (!cleanTracking) {
            setActionError(
                "Tracking number is required."
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
                        courier_name: selectedCourier,
                        tracking_number: cleanTracking,
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
            setCourierName("SPX Express")
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
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[8px] uppercase tracking-[0.2em] text-white/40 backdrop-blur-md transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
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
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[8px] uppercase tracking-[0.2em] text-white/40 backdrop-blur-md transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
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
                            <section className="rounded-2xl border border-white/10 bg-[#080808]/80 p-4 sm:p-5 backdrop-blur-md transition hover:border-[#D4AF37]/30">
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
                                            className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                                        >
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] via-[#080808] to-black/60 p-1.5">
                                                    <div className="pointer-events-none absolute inset-0 bg-[#D4AF37]/5 blur-sm" />
                                                    <img
                                                        src={getItemImage(item)}
                                                        alt={item.product_name}
                                                        className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="break-words text-sm font-medium text-white/90">
                                                        {item.product_name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-white/40">
                                                        ₱{formatPrice(item.price)}
                                                        {" × "}
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="shrink-0 text-sm font-semibold text-[#D4AF37]">
                                                ₱{formatPrice(item.subtotal)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* CUSTOMER */}
                            <section className="rounded-2xl border border-white/10 bg-[#080808]/80 p-4 sm:p-5 backdrop-blur-md transition hover:border-[#D4AF37]/30">
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
                            <section className="rounded-2xl border border-white/10 bg-[#080808]/80 p-4 sm:p-5 backdrop-blur-md transition hover:border-[#D4AF37]/30">
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
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="break-words text-sm leading-6 text-white/60">
                                            {order.shipping_address}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(order.shipping_address, "address_main")}
                                            className="shrink-0 p-1 text-white/40 transition hover:text-[#D4AF37]"
                                            title="Copy full address"
                                        >
                                            {copiedField === "address_main" ? (
                                                <FiCheck size={13} className="text-emerald-400" />
                                            ) : (
                                                <FiCopy size={13} />
                                            )}
                                        </button>
                                    </div>

                                    <p className="mt-2 text-xs text-white/30">
                                        {order.shipping_region}
                                    </p>

                                    {/* SPX BOOKING HELPER */}
                                    <div className="mt-5 border-t border-white/10 pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1.5 rounded bg-orange-500/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-orange-400 border border-orange-500/20">
                                                SPX Booking Helper
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleCopyAllForSpx}
                                                className="inline-flex items-center gap-1.5 text-[8px] uppercase tracking-wider text-[#D4AF37] transition hover:text-[#E1C35B]"
                                            >
                                                {copiedField === "all_spx" ? (
                                                    <>
                                                        <FiCheck size={12} className="text-emerald-400" />
                                                        <span className="text-emerald-400">Copied All!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiClipboard size={12} />
                                                        <span>Copy All for SPX</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className="mt-3 space-y-2 text-xs">
                                            {/* Recipient */}
                                            <div className="flex items-center justify-between rounded border border-white/5 bg-[#050505] px-3 py-2">
                                                <div className="min-w-0 pr-2">
                                                    <p className="text-[7px] uppercase tracking-wider text-white/30">Receiver Name</p>
                                                    <p className="truncate font-medium text-white/80">
                                                        {order.recipient_name || `${order.first_name || ""} ${order.last_name || ""}`.trim()}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(order.recipient_name || `${order.first_name || ""} ${order.last_name || ""}`.trim(), "spx_name")}
                                                    className="p-1 text-white/40 hover:text-[#D4AF37]"
                                                    title="Copy Receiver Name"
                                                >
                                                    {copiedField === "spx_name" ? <FiCheck size={12} className="text-emerald-400" /> : <FiCopy size={12} />}
                                                </button>
                                            </div>

                                            {/* Phone */}
                                            <div className="flex items-center justify-between rounded border border-white/5 bg-[#050505] px-3 py-2">
                                                <div className="min-w-0 pr-2">
                                                    <p className="text-[7px] uppercase tracking-wider text-white/30">Receiver Phone</p>
                                                    <p className="truncate font-medium text-white/80">
                                                        {order.recipient_phone || order.phone || "—"}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(order.recipient_phone || order.phone, "spx_phone")}
                                                    className="p-1 text-white/40 hover:text-[#D4AF37]"
                                                    title="Copy Phone Number"
                                                >
                                                    {copiedField === "spx_phone" ? <FiCheck size={12} className="text-emerald-400" /> : <FiCopy size={12} />}
                                                </button>
                                            </div>

                                            {/* COD Amount */}
                                            <div className="flex items-center justify-between rounded border border-white/5 bg-[#050505] px-3 py-2">
                                                <div className="min-w-0 pr-2">
                                                    <p className="text-[7px] uppercase tracking-wider text-white/30">COD Collection</p>
                                                    <p className="font-semibold text-[#D4AF37]">
                                                        {order.payment_method === "COD" && order.payment_status !== "paid"
                                                            ? `₱${formatPrice(order.total_amount)}`
                                                            : "₱0.00 (Non-COD / Paid)"}
                                                    </p>
                                                </div>
                                                {order.payment_method === "COD" && order.payment_status !== "paid" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(order.total_amount, "spx_cod")}
                                                        className="p-1 text-white/40 hover:text-[#D4AF37]"
                                                        title="Copy COD Amount"
                                                    >
                                                        {copiedField === "spx_cod" ? <FiCheck size={12} className="text-emerald-400" /> : <FiCopy size={12} />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

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

                                            <div className="mt-1 flex items-center gap-2">
                                                <p className="break-all font-mono text-sm text-[#D4AF37]">
                                                    {order.tracking_number}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(order.tracking_number, "tracking_no")}
                                                    className="p-1 text-white/40 hover:text-[#D4AF37]"
                                                    title="Copy Tracking Number"
                                                >
                                                    {copiedField === "tracking_no" ? (
                                                        <FiCheck size={12} className="text-emerald-400" />
                                                    ) : (
                                                        <FiCopy size={12} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {order.tracking_url && (
                                        <div className="mt-4">
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Live Tracking Link
                                            </p>

                                            <a
                                                href={order.tracking_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-2 inline-flex items-center gap-2 rounded border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-medium text-[#D4AF37] transition hover:bg-[#D4AF37]/20"
                                            >
                                                <span>Track on SPX / Courier</span>
                                                <FiExternalLink size={12} />
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
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-medium text-white/80">
                                                    Online Payment Verification
                                                </p>
                                                <span className="rounded bg-yellow-500/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-yellow-400 border border-yellow-500/20">
                                                    {order.payment_status}
                                                </span>
                                            </div>

                                            {payment?.transaction_reference ? (
                                                <div className="mt-3 rounded border border-[#D4AF37]/20 bg-[#D4AF37]/[0.03] p-3">
                                                    <p className="text-[8px] uppercase tracking-wider text-[#D4AF37]">
                                                        Customer GCash Reference Number
                                                    </p>
                                                    <div className="mt-1 flex items-center justify-between">
                                                        <p className="font-mono text-sm font-semibold text-white/95">
                                                            {payment.transaction_reference}
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(payment.transaction_reference, "order_ref")}
                                                            className="p-1 text-white/40 hover:text-[#D4AF37]"
                                                            title="Copy Reference Number"
                                                        >
                                                            {copiedField === "order_ref" ? (
                                                                <FiCheck size={12} className="text-emerald-400" />
                                                            ) : (
                                                                <FiCopy size={12} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="mt-2 text-[10px] text-white/35">
                                                    Reference number has not been submitted yet by the customer.
                                                </p>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleConfirmOnlinePayment}
                                                disabled={actionLoading || !payment?.id}
                                                className="mt-4 flex h-10 w-full items-center justify-center bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
                                            >
                                                Verify & Confirm Payment
                                            </button>
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
                                                        Courier
                                                    </label>

                                                    <div className="mb-2 flex flex-wrap gap-2">
                                                        {["SPX Express", "J&T Express", "Flash Express"].map((c) => (
                                                            <button
                                                                key={c}
                                                                type="button"
                                                                onClick={() => setCourierName(c)}
                                                                className={`rounded px-2.5 py-1 text-[9px] font-medium transition ${
                                                                    courierName === c
                                                                        ? "border border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]"
                                                                        : "border border-white/10 bg-[#050505] text-white/40 hover:text-white/70"
                                                                }`}
                                                            >
                                                                {c}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <input
                                                        id="courier"
                                                        type="text"
                                                        value={courierName}
                                                        onChange={(event) =>
                                                            setCourierName(event.target.value)
                                                        }
                                                        placeholder="Courier name"
                                                        className="h-10 w-full min-w-0 border border-white/10 bg-[#050505] px-3 text-xs text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/40"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="trackingNumber"
                                                        className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/25"
                                                    >
                                                        Tracking Number <span className="text-[#D4AF37]">*</span>
                                                    </label>

                                                    <input
                                                        id="trackingNumber"
                                                        type="text"
                                                        value={trackingNumber}
                                                        onChange={(event) =>
                                                            setTrackingNumber(event.target.value)
                                                        }
                                                        placeholder="e.g. SPXPH123456789"
                                                        className="h-11 w-full min-w-0 border border-white/10 bg-[#050505] px-3 font-mono text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/40"
                                                    />

                                                    {trackingNumber.trim() && (
                                                        <p className="mt-2 break-all text-[9px] text-[#D4AF37]/80">
                                                            Tracking Link:{" "}
                                                            <span className="text-white/40">
                                                                {courierName.toLowerCase().includes("spx")
                                                                    ? `https://spx.ph/?tracking_number=${trackingNumber.trim()}`
                                                                    : trackingUrl || "Will be auto-generated"}
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="trackingUrl"
                                                        className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/25"
                                                    >
                                                        Tracking URL (Optional - Auto-generated for SPX)
                                                    </label>

                                                    <input
                                                        id="trackingUrl"
                                                        type="url"
                                                        value={trackingUrl}
                                                        onChange={(event) =>
                                                            setTrackingUrl(event.target.value)
                                                        }
                                                        placeholder="Leave blank to auto-generate"
                                                        className="h-10 w-full min-w-0 border border-white/10 bg-[#050505] px-3 text-xs text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/40"
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
                                                        className="inline-flex h-10 w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 text-[8px] uppercase tracking-[0.18em] text-white/50 backdrop-blur-md transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37] active:scale-95 disabled:opacity-40 sm:w-fit"
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
                                            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#FFE28A]/40 bg-[#D4AF37]/90 px-6 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] shadow-[0_4px_15px_rgba(212,175,55,0.25)] backdrop-blur-md transition-all hover:scale-105 hover:bg-[#E1C35B] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
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
                                                        className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#FFE28A]/40 bg-[#D4AF37]/90 px-6 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] shadow-[0_4px_15px_rgba(212,175,55,0.25)] backdrop-blur-md transition hover:scale-105 hover:bg-[#E1C35B] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
                            <section className="rounded-2xl border border-white/10 bg-[#080808]/80 p-4 sm:p-5 backdrop-blur-md transition hover:border-[#D4AF37]/30">
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
                            <section className="rounded-2xl border border-white/10 bg-[#080808]/80 p-4 sm:p-5 backdrop-blur-md transition hover:border-[#D4AF37]/30">
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
