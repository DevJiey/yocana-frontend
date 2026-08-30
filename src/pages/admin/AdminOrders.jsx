import { API_URL } from "../../config/api";
import { useEffect, useState } from "react"
import {
    FiPackage,
    FiRefreshCw,
    FiSearch,
    FiUser,
    FiCreditCard,
} from "react-icons/fi"
import { useNavigate } from "react-router-dom"

import AdminLayout from "../../layouts/AdminLayout"

function AdminOrders() {
    const navigate = useNavigate()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")

    const token =
        localStorage.getItem("yocana_token")

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

    const loadOrders = async () => {
        try {
            setLoading(true)
            setError("")

            const response = await fetch(
                `${API_URL}/api/orders/admin`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load orders"
                )
            }

            setOrders(data.orders || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadOrders()
    }, [])

    const filteredOrders = orders.filter((order) => {
        const searchValue =
            search.trim().toLowerCase()

        const fullName =
            `${order.first_name || ""} ${order.last_name || ""}`.toLowerCase()

        const matchesSearch =
            !searchValue ||
            order.order_number
                ?.toLowerCase()
                .includes(searchValue) ||
            fullName.includes(searchValue) ||
            order.email
                ?.toLowerCase()
                .includes(searchValue)

        const matchesStatus =
            status === "all" ||
            order.order_status === status

        return matchesSearch && matchesStatus
    })

    const getStatusStyle = (orderStatus) => {
        switch (orderStatus) {
            case "delivered":
                return "border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] text-[#D4AF37]"

            case "shipped":
                return "border-blue-400/20 bg-blue-400/[0.04] text-blue-300"

            case "preparing":
                return "border-orange-400/20 bg-orange-400/[0.04] text-orange-300"

            case "cancelled":
                return "border-red-400/20 bg-red-400/[0.04] text-red-400"

            default:
                return "border-white/10 bg-white/[0.02] text-white/40"
        }
    }

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
                                Orders
                            </h1>

                            <p className="mt-2 text-sm text-white/30">
                                Review and manage customer orders.
                            </p>
                        </div>

                        <button
                            onClick={loadOrders}
                            disabled={loading}
                            className="flex h-9 w-fit items-center justify-center gap-2 self-start border border-white/10 px-4 text-[8px] uppercase tracking-[0.2em] text-white/50 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] disabled:opacity-40 sm:self-auto"
                        >
                            <FiRefreshCw
                                size={13}
                                className={
                                    loading ? "animate-spin" : ""
                                }
                            />

                            Refresh
                        </button>
                    </div>

                    {/* SEARCH + FILTER */}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <div className="flex h-12 flex-1 items-center border border-white/10 bg-[#080808] transition focus-within:border-[#D4AF37]/30">
                            <div className="flex h-10 w-11 items-center justify-center text-white/25">
                                <FiSearch size={14} />
                            </div>

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search order, customer or email..."
                                className="h-full min-w-0 flex-1 bg-transparent pr-4 text-sm text-white outline-none placeholder:text-white/20"
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
                            }
                            className="h-9 border border-white/10 bg-[#080808] px-4 text-xs text-white/60 outline-none"
                        >
                            <option value="all">
                                All Status
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="preparing">
                                Preparing
                            </option>

                            <option value="shipped">
                                Shipped
                            </option>

                            <option value="delivered">
                                Delivered
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>

                            <option value="returned">
                                Returned
                            </option>
                        </select>
                    </div>

                    {/* CONTENT */}
                    {loading ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="text-center">
                                <FiRefreshCw
                                    size={22}
                                    className="mx-auto animate-spin text-[#D4AF37]"
                                />

                                <p className="mt-4 text-[9px] uppercase tracking-[0.25em] text-white/30">
                                    Loading orders
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="mt-8 border border-red-500/20 bg-red-500/[0.04] p-4">
                            <p className="text-sm text-red-400">
                                {error}
                            </p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="mt-8 border border-white/10 bg-[#080808] p-10 text-center">
                            <FiPackage
                                size={28}
                                className="mx-auto text-white/20"
                            />

                            <h2 className="mt-4 text-lg text-white/70">
                                No orders found
                            </h2>

                            <p className="mt-2 text-sm text-white/30">
                                No orders match your current search.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {filteredOrders.map((order) => (
                                <button
                                    key={order.id}
                                    onClick={() =>
                                        navigate(
                                            `/admin/orders/${order.id}`
                                        )
                                    }
                                    className="block w-full border border-white/10 bg-[#080808] p-5 text-left transition hover:border-[#D4AF37]/25 md:p-6"
                                >
                                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <FiPackage
                                                    size={15}
                                                    className="text-[#D4AF37]"
                                                />

                                                <p className="text-sm font-medium text-white">
                                                    {order.order_number}
                                                </p>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/30">
                                                <FiUser size={12} />

                                                <span>
                                                    {order.first_name}{" "}
                                                    {order.last_name}
                                                </span>

                                                <span>•</span>

                                                <span>
                                                    {order.email}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className={`inline-flex w-fit border px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] ${getStatusStyle(
                                                order.order_status
                                            )}`}
                                        >
                                            {order.order_status}
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-5 border-t border-white/10 pt-5 md:grid-cols-4">
                                        <div>
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Total
                                            </p>

                                            <p className="mt-2 text-sm text-[#D4AF37]">
                                                ₱
                                                {formatPrice(
                                                    order.total_amount
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Payment
                                            </p>

                                            <div className="mt-2 flex items-center gap-2">
                                                <FiCreditCard
                                                    size={12}
                                                    className="text-white/25"
                                                />

                                                <p className="text-xs text-white/50">
                                                    {formatPaymentMethod(
                                                        order.payment_method
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Payment Status
                                            </p>

                                            <p className="mt-2 text-xs uppercase text-white/50">
                                                {order.payment_status}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Ordered
                                            </p>

                                            <p className="mt-2 text-xs text-white/40">
                                                {formatDate(
                                                    order.created_at
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminOrders
