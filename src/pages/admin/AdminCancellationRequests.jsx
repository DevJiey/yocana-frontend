import { API_URL } from "../../config/api";
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
    FiAlertCircle,
    FiCheck,
    FiClock,
    FiExternalLink,
    FiRefreshCw,
    FiSearch,
    FiX,
} from "react-icons/fi"

import AdminLayout from "../../layouts/AdminLayout"
import BrandLoader from "../../components/BrandLoader"

function AdminCancellationRequests() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] =
        useState("all")

    const [adminNotes, setAdminNotes] = useState({})

    const [actionLoading, setActionLoading] =
        useState(false)

    const [activeRequestId, setActiveRequestId] =
        useState(null)

    const [actionError, setActionError] = useState("")

    const [loaderOpen, setLoaderOpen] = useState(false)
    const [loaderStatus, setLoaderStatus] =
        useState("loading")
    const [loaderMessage, setLoaderMessage] =
        useState("")

    const token =
        localStorage.getItem("yocana_token")

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

    const loadRequests = async (silent = false) => {
        try {
            if (!silent) {
                setLoading(true)
            }

            setError("")

            const response = await fetch(
                `${API_URL}/api/orders/admin/cancellation-requests`,
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
                    "Failed to load cancellation requests"
                )
            }

            setRequests(
                data.cancellation_requests || []
            )
        } catch (err) {
            setError(err.message)
        } finally {
            if (!silent) {
                setLoading(false)
            }
        }
    }

    const showSuccess = (message) => {
        setLoaderStatus("success")
        setLoaderMessage(message)

        setTimeout(() => {
            setLoaderOpen(false)
        }, 1400)
    }

    const handleReview = async (
        requestId,
        action
    ) => {
        try {
            setActionLoading(true)
            setActiveRequestId(requestId)
            setActionError("")

            setLoaderStatus("loading")
            setLoaderMessage(
                action === "approve"
                    ? "Approving cancellation"
                    : "Rejecting cancellation"
            )
            setLoaderOpen(true)

            const response = await fetch(
                `${API_URL}/api/orders/admin/cancellation-requests/${requestId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        action,
                        admin_note:
                            adminNotes[requestId]?.trim() ||
                            null,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to review cancellation request"
                )
            }

            await loadRequests(true)

            showSuccess(
                action === "approve"
                    ? "Cancellation Approved"
                    : "Cancellation Rejected"
            )
        } catch (err) {
            setLoaderOpen(false)
            setActionError(err.message)
        } finally {
            setActionLoading(false)
            setActiveRequestId(null)
        }
    }

    useEffect(() => {
        loadRequests()
    }, [])

    const filteredRequests = useMemo(() => {
        const keyword = search
            .trim()
            .toLowerCase()

        return requests.filter((request) => {
            const fullName =
                `${request.first_name || ""} ${request.last_name || ""}`.toLowerCase()

            const matchesSearch =
                !keyword ||
                request.order_number
                    ?.toLowerCase()
                    .includes(keyword) ||
                request.email
                    ?.toLowerCase()
                    .includes(keyword) ||
                fullName.includes(keyword)

            const matchesStatus =
                statusFilter === "all" ||
                request.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [requests, search, statusFilter])

    const pendingCount = requests.filter(
        (request) => request.status === "pending"
    ).length

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
                            Loading Requests
                        </p>
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

                    {/* HEADER */}
                    <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
                                Order Management
                            </p>

                            <h1 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
                                Cancellation Requests
                            </h1>

                            <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                                Review customer requests before
                                orders are officially cancelled.
                            </p>
                        </div>

                        <div className="flex w-fit items-center gap-2 border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] px-3 py-2">
                            <FiClock
                                size={12}
                                className="text-[#D4AF37]"
                            />

                            <span className="text-[8px] uppercase tracking-[0.18em] text-[#D4AF37]">
                                {pendingCount} Pending
                            </span>
                        </div>
                    </div>

                    {/* FILTERS */}
                    <div className="mt-6 flex flex-col gap-3 md:flex-row">
                        <div className="flex h-11 min-w-0 flex-1 items-center border border-white/10 bg-[#080808] focus-within:border-[#D4AF37]/30">
                            <FiSearch
                                size={14}
                                className="ml-4 shrink-0 text-white/20"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search order, customer or email..."
                                className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/20"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="h-11 w-full border border-white/10 bg-[#080808] px-4 text-xs text-white/60 outline-none focus:border-[#D4AF37]/30 md:w-[170px]"
                        >
                            <option value="all">
                                All Requests
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="approved">
                                Approved
                            </option>

                            <option value="rejected">
                                Rejected
                            </option>
                        </select>

                        <button
                            type="button"
                            onClick={() => loadRequests()}
                            className="flex h-11 w-fit items-center justify-center gap-2 border border-white/10 px-4 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                        >
                            <FiRefreshCw size={12} />
                            Refresh
                        </button>
                    </div>

                    {error && (
                        <div className="mt-5 border border-red-500/20 bg-red-500/[0.04] p-4">
                            <p className="text-xs text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    {actionError && (
                        <div className="mt-5 border border-red-500/20 bg-red-500/[0.04] p-4">
                            <p className="text-xs text-red-400">
                                {actionError}
                            </p>
                        </div>
                    )}

                    {/* EMPTY */}
                    {filteredRequests.length === 0 ? (
                        <div className="mt-6 border border-white/10 bg-[#080808] px-5 py-14 text-center">
                            <FiAlertCircle
                                size={22}
                                className="mx-auto text-white/15"
                            />

                            <p className="mt-4 text-xs text-white/35">
                                No cancellation requests found.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-4">
                            {filteredRequests.map(
                                (request) => {
                                    const isProcessing =
                                        actionLoading &&
                                        activeRequestId ===
                                        request.id

                                    return (
                                        <article
                                            key={request.id}
                                            className="border border-white/10 bg-[#080808] p-4 sm:p-5"
                                        >
                                            {/* TOP */}
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <p className="text-[8px] uppercase tracking-[0.22em] text-[#D4AF37]">
                                                        Cancellation Request
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap items-center gap-3">
                                                        <h2 className="break-all text-base font-medium text-white">
                                                            {
                                                                request.order_number
                                                            }
                                                        </h2>

                                                        <span
                                                            className={`border px-2.5 py-1 text-[7px] uppercase tracking-[0.18em] ${request.status ===
                                                                    "pending"
                                                                    ? "border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] text-[#D4AF37]"
                                                                    : request.status ===
                                                                        "approved"
                                                                        ? "border-green-500/20 bg-green-500/[0.04] text-green-400"
                                                                        : "border-red-500/20 bg-red-500/[0.04] text-red-400"
                                                                }`}
                                                        >
                                                            {
                                                                request.status
                                                            }
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-[9px] text-white/25">
                                                        Requested{" "}
                                                        {formatDate(
                                                            request.requested_at
                                                        )}
                                                    </p>
                                                </div>

                                                <Link
                                                    to={`/admin/orders/${request.order_id}`}
                                                    className="flex h-9 w-fit shrink-0 items-center justify-center gap-2 border border-white/10 px-3 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                                                >
                                                    View Order
                                                    <FiExternalLink
                                                        size={11}
                                                    />
                                                </Link>
                                            </div>

                                            {/* INFO */}
                                            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                                                <div>
                                                    <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                                        Customer
                                                    </p>

                                                    <p className="mt-2 break-words text-xs text-white/60">
                                                        {
                                                            request.first_name
                                                        }{" "}
                                                        {
                                                            request.last_name
                                                        }
                                                    </p>

                                                    <p className="mt-1 break-all text-[10px] text-white/25">
                                                        {request.email}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                                        Order Status
                                                    </p>

                                                    <p className="mt-2 text-xs uppercase text-white/50">
                                                        {
                                                            request.order_status
                                                        }
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                                        Payment
                                                    </p>

                                                    <p className="mt-2 text-xs text-white/50">
                                                        {formatPaymentMethod(
                                                            request.payment_method
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-[9px] uppercase text-[#D4AF37]">
                                                        {
                                                            request.payment_status
                                                        }
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                                        Request ID
                                                    </p>

                                                    <p className="mt-2 text-xs text-white/50">
                                                        #{request.id}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* REASON */}
                                            <div className="mt-5 border border-white/10 bg-[#050505] p-4">
                                                <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                                    Customer Reason
                                                </p>

                                                <p className="mt-3 break-words text-xs leading-6 text-white/50">
                                                    {request.reason}
                                                </p>
                                            </div>

                                            {/* PENDING ACTIONS */}
                                            {request.status ===
                                                "pending" && (
                                                    <div className="mt-5">
                                                        <label
                                                            htmlFor={`admin-note-${request.id}`}
                                                            className="text-[7px] uppercase tracking-[0.2em] text-white/20"
                                                        >
                                                            Admin Note
                                                        </label>

                                                        <textarea
                                                            id={`admin-note-${request.id}`}
                                                            value={
                                                                adminNotes[
                                                                request.id
                                                                ] || ""
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                setAdminNotes(
                                                                    (previous) => ({
                                                                        ...previous,
                                                                        [request.id]:
                                                                            event
                                                                                .target
                                                                                .value,
                                                                    })
                                                                )
                                                            }
                                                            rows={3}
                                                            placeholder="Optional note for the customer..."
                                                            disabled={
                                                                isProcessing
                                                            }
                                                            className="mt-3 w-full resize-none border border-white/10 bg-[#050505] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/30 disabled:opacity-40"
                                                        />

                                                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                                onClick={() =>
                                                                    handleReview(
                                                                        request.id,
                                                                        "approve"
                                                                    )
                                                                }
                                                                className="flex h-10 w-full items-center justify-center gap-2 bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit"
                                                            >
                                                                <FiCheck
                                                                    size={12}
                                                                />
                                                                Approve
                                                            </button>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                                onClick={() =>
                                                                    handleReview(
                                                                        request.id,
                                                                        "reject"
                                                                    )
                                                                }
                                                                className="flex h-10 w-full items-center justify-center gap-2 border border-red-500/20 px-4 text-[8px] uppercase tracking-[0.18em] text-red-400 transition hover:border-red-500/40 hover:bg-red-500/[0.04] disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit"
                                                            >
                                                                <FiX size={12} />
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                            {/* REVIEWED */}
                                            {request.status !==
                                                "pending" && (
                                                    <div className="mt-5 border-t border-white/10 pt-5">
                                                        <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                                            Review Result
                                                        </p>

                                                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                            <p
                                                                className={`text-xs ${request.status ===
                                                                        "approved"
                                                                        ? "text-green-400"
                                                                        : "text-red-400"
                                                                    }`}
                                                            >
                                                                {request.status ===
                                                                    "approved"
                                                                    ? "Cancellation approved"
                                                                    : "Cancellation rejected"}
                                                            </p>

                                                            <p className="text-[9px] text-white/20">
                                                                {formatDate(
                                                                    request.reviewed_at
                                                                )}
                                                            </p>
                                                        </div>

                                                        {request.admin_note && (
                                                            <div className="mt-4 border border-white/10 bg-[#050505] p-4">
                                                                <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                                                    Admin Note
                                                                </p>

                                                                <p className="mt-2 break-words text-xs leading-5 text-white/45">
                                                                    {
                                                                        request.admin_note
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                        </article>
                                    )
                                }
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminCancellationRequests
