import { API_URL } from "../../config/api";
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
    FiAlertCircle,
    FiCheck,
    FiClock,
    FiExternalLink,
    FiPackage,
    FiRefreshCw,
    FiSearch,
    FiX,
} from "react-icons/fi"

import AdminLayout from "../../layouts/AdminLayout"
import BrandLoader from "../../components/BrandLoader"

function AdminReturnRequests() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] =
        useState("all")

    const [adminNotes, setAdminNotes] =
        useState({})

    const [inspectionNotes, setInspectionNotes] =
        useState({})

    const [resellableValues, setResellableValues] =
        useState({})

    const [actionLoading, setActionLoading] =
        useState(false)

    const [activeRequestId, setActiveRequestId] =
        useState(null)

    const [actionError, setActionError] =
        useState("")

    const [loaderOpen, setLoaderOpen] =
        useState(false)

    const [loaderStatus, setLoaderStatus] =
        useState("loading")

    const [loaderMessage, setLoaderMessage] =
        useState("")

    const token =
        localStorage.getItem("yocana_token")

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
            COD: "Cash on Delivery",
            GCASH: "GCash",
            MAYA: "Maya",
            CARD: "Card",
            BANK: "Online Banking",
        }

        return labels[method] || method
    }

    const loadRequests = async (
        silent = false
    ) => {
        try {
            if (!silent) {
                setLoading(true)
            }

            setError("")

            const response = await fetch(
                `${API_URL}/api/orders/admin/return-requests`,
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
                    "Failed to load return requests"
                )
            }

            setRequests(
                data.return_requests || []
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
                    ? "Approving return"
                    : "Rejecting return"
            )

            setLoaderOpen(true)

            const response = await fetch(
                `${API_URL}/api/orders/admin/return-requests/${requestId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        action,
                        admin_note:
                            adminNotes[
                                requestId
                            ]?.trim() || null,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to review return request"
                )
            }

            await loadRequests(true)

            showSuccess(
                action === "approve"
                    ? "Return Approved"
                    : "Return Rejected"
            )
        } catch (err) {
            setLoaderOpen(false)
            setActionError(err.message)
        } finally {
            setActionLoading(false)
            setActiveRequestId(null)
        }
    }

    const handleMarkReturned = async (
        requestId
    ) => {
        const resellable =
            resellableValues[requestId]

        if (typeof resellable !== "boolean") {
            setActionError(
                "Please select whether the returned item is resellable."
            )
            return
        }

        try {
            setActionLoading(true)
            setActiveRequestId(requestId)
            setActionError("")

            setLoaderStatus("loading")
            setLoaderMessage(
                "Processing returned item"
            )
            setLoaderOpen(true)

            const response = await fetch(
                `${API_URL}/api/orders/admin/return-requests/${requestId}/returned`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        is_resellable: resellable,
                        inspection_note:
                            inspectionNotes[
                                requestId
                            ]?.trim() || null,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to process returned item"
                )
            }

            await loadRequests(true)

            showSuccess("Return Completed")
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

    const filteredRequests =
        useMemo(() => {
            const keyword = search
                .trim()
                .toLowerCase()

            return requests.filter(
                (request) => {
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
                        request.status ===
                        statusFilter

                    return (
                        matchesSearch &&
                        matchesStatus
                    )
                }
            )
        }, [requests, search, statusFilter])

    const pendingCount = requests.filter(
        (request) =>
            request.status === "pending"
    ).length

    const approvedCount = requests.filter(
        (request) =>
            request.status === "approved"
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
                            Loading Returns
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
                    <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
                                Order Management
                            </p>

                            <h1 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
                                Return Requests
                            </h1>

                            <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                                Review return requests and
                                inspect approved returned
                                products.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <div className="flex w-fit items-center gap-2 border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] px-3 py-2">
                                <FiClock
                                    size={12}
                                    className="text-[#D4AF37]"
                                />

                                <span className="text-[8px] uppercase tracking-[0.18em] text-[#D4AF37]">
                                    {pendingCount} Pending
                                </span>
                            </div>

                            <div className="flex w-fit items-center gap-2 border border-green-500/15 bg-green-500/[0.03] px-3 py-2">
                                <FiPackage
                                    size={12}
                                    className="text-green-400"
                                />

                                <span className="text-[8px] uppercase tracking-[0.18em] text-green-400">
                                    {approvedCount} Awaiting
                                    Return
                                </span>
                            </div>
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
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search order, customer or email..."
                                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/20"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="h-11 w-full border border-white/10 bg-[#080808] px-4 text-xs text-white/60 outline-none focus:border-[#D4AF37]/30 md:w-[180px]"
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

                            <option value="returned">
                                Returned
                            </option>
                        </select>

                        <button
                            type="button"
                            onClick={() =>
                                loadRequests()
                            }
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

                    {filteredRequests.length === 0 ? (
                        <div className="mt-6 border border-white/10 bg-[#080808] px-5 py-14 text-center">
                            <FiAlertCircle
                                size={22}
                                className="mx-auto text-white/15"
                            />

                            <p className="mt-4 text-xs text-white/35">
                                No return requests found.
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
                                                        Return Request
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
                                                                        : request.status ===
                                                                            "returned"
                                                                            ? "border-blue-400/20 bg-blue-400/[0.04] text-blue-300"
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

                                            {/* INFORMATION */}
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

                                            {/* CUSTOMER REASON */}
                                            <div className="mt-5 border border-white/10 bg-[#050505] p-4">
                                                <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                                    Return Reason
                                                </p>

                                                <p className="mt-3 break-words text-xs leading-6 text-white/50">
                                                    {request.reason}
                                                </p>
                                            </div>

                                            {/* PENDING */}
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
                                                                    (
                                                                        previous
                                                                    ) => ({
                                                                        ...previous,
                                                                        [request.id]:
                                                                            event
                                                                                .target
                                                                                .value,
                                                                    })
                                                                )
                                                            }
                                                            disabled={
                                                                isProcessing
                                                            }
                                                            rows={3}
                                                            placeholder="Optional instructions or note for customer..."
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

                                            {/* APPROVED - INSPECTION */}
                                            {request.status ===
                                                "approved" && (
                                                    <div className="mt-5 border-t border-white/10 pt-5">
                                                        <div className="flex items-start gap-3">
                                                            <FiPackage
                                                                size={15}
                                                                className="mt-0.5 shrink-0 text-[#D4AF37]"
                                                            />

                                                            <div>
                                                                <p className="text-xs text-[#D4AF37]">
                                                                    Awaiting returned
                                                                    item
                                                                </p>

                                                                <p className="mt-2 text-[10px] leading-5 text-white/30">
                                                                    Once the product
                                                                    arrives, inspect
                                                                    its condition
                                                                    before completing
                                                                    the return.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {request.admin_note && (
                                                            <div className="mt-4 border border-white/10 bg-[#050505] p-4">
                                                                <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                                                    Approval Note
                                                                </p>

                                                                <p className="mt-2 break-words text-xs leading-5 text-white/45">
                                                                    {
                                                                        request.admin_note
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* RESELLABLE */}
                                                        <div className="mt-5">
                                                            <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                                                Item Condition
                                                            </p>

                                                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        actionLoading
                                                                    }
                                                                    onClick={() =>
                                                                        setResellableValues(
                                                                            (
                                                                                previous
                                                                            ) => ({
                                                                                ...previous,
                                                                                [request.id]:
                                                                                    true,
                                                                            })
                                                                        )
                                                                    }
                                                                    className={`flex h-11 items-center justify-center gap-2 border px-3 text-[8px] uppercase tracking-[0.16em] transition ${resellableValues[
                                                                            request.id
                                                                        ] === true
                                                                            ? "border-green-500/40 bg-green-500/[0.08] text-green-400"
                                                                            : "border-white/10 text-white/35 hover:border-green-500/20 hover:text-green-400"
                                                                        }`}
                                                                >
                                                                    <FiCheck
                                                                        size={12}
                                                                    />
                                                                    Resellable
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        actionLoading
                                                                    }
                                                                    onClick={() =>
                                                                        setResellableValues(
                                                                            (
                                                                                previous
                                                                            ) => ({
                                                                                ...previous,
                                                                                [request.id]:
                                                                                    false,
                                                                            })
                                                                        )
                                                                    }
                                                                    className={`flex h-11 items-center justify-center gap-2 border px-3 text-[8px] uppercase tracking-[0.16em] transition ${resellableValues[
                                                                            request.id
                                                                        ] === false
                                                                            ? "border-red-500/40 bg-red-500/[0.08] text-red-400"
                                                                            : "border-white/10 text-white/35 hover:border-red-500/20 hover:text-red-400"
                                                                        }`}
                                                                >
                                                                    <FiX
                                                                        size={12}
                                                                    />
                                                                    Not Resellable
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* INSPECTION NOTE */}
                                                        <div className="mt-4">
                                                            <label
                                                                htmlFor={`inspection-${request.id}`}
                                                                className="text-[7px] uppercase tracking-[0.2em] text-white/20"
                                                            >
                                                                Inspection Note
                                                            </label>

                                                            <textarea
                                                                id={`inspection-${request.id}`}
                                                                value={
                                                                    inspectionNotes[
                                                                    request.id
                                                                    ] || ""
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    setInspectionNotes(
                                                                        (
                                                                            previous
                                                                        ) => ({
                                                                            ...previous,
                                                                            [request.id]:
                                                                                event
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                disabled={
                                                                    isProcessing
                                                                }
                                                                rows={3}
                                                                placeholder="Optional condition or inspection details..."
                                                                className="mt-3 w-full resize-none border border-white/10 bg-[#050505] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/30 disabled:opacity-40"
                                                            />
                                                        </div>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                actionLoading
                                                            }
                                                            onClick={() =>
                                                                handleMarkReturned(
                                                                    request.id
                                                                )
                                                            }
                                                            className="mt-4 flex h-10 w-full items-center justify-center gap-2 bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit"
                                                        >
                                                            <FiPackage
                                                                size={12}
                                                            />
                                                            Mark Returned
                                                        </button>
                                                    </div>
                                                )}

                                            {/* REJECTED */}
                                            {request.status ===
                                                "rejected" && (
                                                    <div className="mt-5 border-t border-white/10 pt-5">
                                                        <p className="text-xs text-red-400">
                                                            Return request
                                                            rejected
                                                        </p>

                                                        <p className="mt-2 text-[9px] text-white/20">
                                                            Reviewed{" "}
                                                            {formatDate(
                                                                request.reviewed_at
                                                            )}
                                                        </p>

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

                                            {/* RETURNED */}
                                            {request.status ===
                                                "returned" && (
                                                    <div className="mt-5 border border-green-500/15 bg-green-500/[0.035] p-4">
                                                        <div className="flex items-start gap-3">
                                                            <FiCheck
                                                                size={15}
                                                                className="mt-0.5 shrink-0 text-green-400"
                                                            />

                                                            <div>
                                                                <p className="text-xs text-green-400">
                                                                    Return completed
                                                                </p>

                                                                <p className="mt-2 text-[9px] text-white/25">
                                                                    Returned{" "}
                                                                    {formatDate(
                                                                        request.returned_at
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
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

export default AdminReturnRequests
