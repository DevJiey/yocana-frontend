import { API_URL } from "../../config/api";
import { useEffect, useMemo, useState } from "react"
import {
    FiAlertTriangle,
    FiArrowDown,
    FiArrowUp,
    FiClock,
    FiPackage,
    FiRefreshCw,
    FiSearch,
    FiX,
} from "react-icons/fi"

import AdminLayout from "../../layouts/AdminLayout"
import BrandLoader from "../../components/BrandLoader"

function AdminInventory() {
    const [inventory, setInventory] = useState([])
    const [history, setHistory] = useState([])

    const [loading, setLoading] = useState(true)
    const [historyLoading, setHistoryLoading] = useState(true)
    const [error, setError] = useState("")

    const [search, setSearch] = useState("")
    const [stockFilter, setStockFilter] = useState("all")
    const [activeTab, setActiveTab] = useState("inventory")

    const [stockModal, setStockModal] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [quantity, setQuantity] = useState("")
    const [reason, setReason] = useState("")
    const [formError, setFormError] = useState("")
    const [actionLoading, setActionLoading] = useState(false)

    const [loaderOpen, setLoaderOpen] = useState(false)
    const [loaderStatus, setLoaderStatus] = useState("loading")
    const [loaderMessage, setLoaderMessage] = useState("")

    const token = localStorage.getItem("yocana_token")

    const fetchInventory = async (silent = false) => {
        try {
            if (!silent) {
                setLoading(true)
            }

            setError("")

            const response = await fetch(
                `${API_URL}/api/inventory`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load inventory"
                )
            }

            setInventory(data.inventory || [])
        } catch (err) {
            setError(err.message)
        } finally {
            if (!silent) {
                setLoading(false)
            }
        }
    }

    const fetchHistory = async (silent = false) => {
        try {
            if (!silent) {
                setHistoryLoading(true)
            }

            const response = await fetch(
                `${API_URL}/api/inventory/history`,
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
                    "Failed to load inventory history"
                )
            }

            setHistory(data.history || [])
        } catch (err) {
            setError(err.message)
        } finally {
            if (!silent) {
                setHistoryLoading(false)
            }
        }
    }

    useEffect(() => {
        fetchInventory()
        fetchHistory()
    }, [])

    const refreshData = async () => {
        await Promise.all([
            fetchInventory(true),
            fetchHistory(true),
        ])
    }

    const openStockModal = (product, type) => {
        setSelectedProduct(product)
        setStockModal(type)
        setQuantity("")
        setReason("")
        setFormError("")
    }

    const closeStockModal = () => {
        if (actionLoading) return

        setStockModal(null)
        setSelectedProduct(null)
        setQuantity("")
        setReason("")
        setFormError("")
    }

    const showSuccess = (message) => {
        setLoaderStatus("success")
        setLoaderMessage(message)

        setTimeout(() => {
            setLoaderOpen(false)
        }, 1400)
    }

    const handleStockSubmit = async (event) => {
        event.preventDefault()

        const numericQuantity = Number(quantity)

        if (
            !Number.isInteger(numericQuantity) ||
            numericQuantity <= 0
        ) {
            setFormError(
                "Quantity must be a whole number greater than 0."
            )
            return
        }

        if (
            stockModal === "out" &&
            numericQuantity >
            Number(selectedProduct.current_stock)
        ) {
            setFormError(
                `Only ${selectedProduct.current_stock} item(s) are currently available.`
            )
            return
        }

        try {
            setActionLoading(true)
            setFormError("")

            setLoaderStatus("loading")
            setLoaderMessage(
                stockModal === "in"
                    ? "Adding stock"
                    : "Removing stock"
            )
            setLoaderOpen(true)

            const endpoint =
                stockModal === "in"
                    ? "stock-in"
                    : "stock-out"

            const response = await fetch(
                `${API_URL}/api/inventory/${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        product_id: selectedProduct.product_id,
                        quantity: numericQuantity,
                        reason:
                            reason.trim() ||
                            (stockModal === "in"
                                ? "Manual stock in"
                                : "Manual stock out"),
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to update inventory"
                )
            }

            await refreshData()

            setStockModal(null)
            setSelectedProduct(null)
            setQuantity("")
            setReason("")

            showSuccess(
                stockModal === "in"
                    ? "Stock Added Successfully"
                    : "Stock Removed Successfully"
            )
        } catch (err) {
            setLoaderOpen(false)
            setFormError(err.message)
        } finally {
            setActionLoading(false)
        }
    }

    const filteredInventory = useMemo(() => {
        const keyword = search.trim().toLowerCase()

        return inventory.filter((item) => {
            const matchesSearch =
                !keyword ||
                item.name?.toLowerCase().includes(keyword) ||
                item.category?.toLowerCase().includes(keyword)

            const currentStock = Number(item.current_stock)

            const matchesFilter =
                stockFilter === "all" ||
                (stockFilter === "low" && item.is_low_stock) ||
                (stockFilter === "out" && currentStock === 0) ||
                (stockFilter === "available" &&
                    currentStock > 0 &&
                    !item.is_low_stock)

            return matchesSearch && matchesFilter
        })
    }, [inventory, search, stockFilter])

    const totalStock = inventory.reduce(
        (total, item) =>
            total + Number(item.current_stock || 0),
        0
    )

    const lowStockCount = inventory.filter(
        (item) => item.is_low_stock
    ).length

    const outOfStockCount = inventory.filter(
        (item) => Number(item.current_stock) === 0
    ).length

    const formatDate = (date) => {
        if (!date) return "—"

        return new Intl.DateTimeFormat("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(date))
    }

    const getTransactionLabel = (type) => {
        switch (type) {
            case "STOCK_IN":
                return "Stock In"
            case "STOCK_OUT":
                return "Stock Out"
            case "ORDER":
                return "Order"
            case "RESTORE":
                return "Restore"
            default:
                return type
        }
    }

    const getTransactionStyle = (type) => {
        switch (type) {
            case "STOCK_IN":
            case "RESTORE":
                return "border-green-500/20 text-green-400"
            case "STOCK_OUT":
            case "ORDER":
                return "border-red-500/20 text-red-400"
            default:
                return "border-white/10 text-white/40"
        }
    }

    const getTransactionIcon = (type) => {
        if (type === "STOCK_IN" || type === "RESTORE") {
            return <FiArrowUp size={11} />
        }

        return <FiArrowDown size={11} />
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
                                Stock Management
                            </p>

                            <h1 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
                                Inventory
                            </h1>

                            <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                                Monitor current stock, manage stock
                                movements and review inventory
                                transactions.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={refreshData}
                            className="flex h-10 w-fit items-center justify-center gap-2 border border-white/10 px-4 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                        >
                            <FiRefreshCw size={12} />
                            Refresh
                        </button>
                    </div>

                    {/* SUMMARY */}
                    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <div className="border border-white/10 bg-[#080808] p-4">
                            <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                Products
                            </p>

                            <p className="mt-2 text-xl text-white">
                                {inventory.length}
                            </p>
                        </div>

                        <div className="border border-white/10 bg-[#080808] p-4">
                            <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                Total Units
                            </p>

                            <p className="mt-2 text-xl text-[#D4AF37]">
                                {totalStock}
                            </p>
                        </div>

                        <div className="border border-yellow-500/15 bg-yellow-500/[0.025] p-4">
                            <p className="text-[7px] uppercase tracking-[0.2em] text-yellow-400/50">
                                Low Stock
                            </p>

                            <p className="mt-2 text-xl text-yellow-400">
                                {lowStockCount}
                            </p>
                        </div>

                        <div className="border border-red-500/15 bg-red-500/[0.025] p-4">
                            <p className="text-[7px] uppercase tracking-[0.2em] text-red-400/50">
                                Out of Stock
                            </p>

                            <p className="mt-2 text-xl text-red-400">
                                {outOfStockCount}
                            </p>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="mt-6 flex gap-1 overflow-x-auto border-b border-white/10">
                        <button
                            type="button"
                            onClick={() =>
                                setActiveTab("inventory")
                            }
                            className={`shrink-0 border-b px-4 py-3 text-[8px] uppercase tracking-[0.18em] transition ${activeTab === "inventory"
                                    ? "border-[#D4AF37] text-[#D4AF37]"
                                    : "border-transparent text-white/30 hover:text-white/60"
                                }`}
                        >
                            Current Inventory
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("history")}
                            className={`shrink-0 border-b px-4 py-3 text-[8px] uppercase tracking-[0.18em] transition ${activeTab === "history"
                                    ? "border-[#D4AF37] text-[#D4AF37]"
                                    : "border-transparent text-white/30 hover:text-white/60"
                                }`}
                        >
                            Transaction History
                        </button>
                    </div>

                    {error && (
                        <div className="mt-5 border border-red-500/20 bg-red-500/[0.04] p-4">
                            <p className="text-xs text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* CURRENT INVENTORY */}
                    {activeTab === "inventory" && (
                        <>
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                <div className="flex h-11 min-w-0 flex-1 items-center border border-white/10 bg-[#080808] focus-within:border-[#D4AF37]/30">
                                    <FiSearch
                                        size={14}
                                        className="ml-4 shrink-0 text-white/20"
                                    />

                                    <input
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search inventory..."
                                        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/20"
                                    />
                                </div>

                                <select
                                    value={stockFilter}
                                    onChange={(event) =>
                                        setStockFilter(
                                            event.target.value
                                        )
                                    }
                                    className="h-11 border border-white/10 bg-[#080808] px-3 text-xs text-white/60 outline-none focus:border-[#D4AF37]/30 sm:w-[170px]"
                                >
                                    <option value="all">
                                        All Stock
                                    </option>
                                    <option value="available">
                                        Available
                                    </option>
                                    <option value="low">
                                        Low Stock
                                    </option>
                                    <option value="out">
                                        Out of Stock
                                    </option>
                                </select>
                            </div>

                            {loading ? (
                                <div className="flex min-h-[300px] items-center justify-center">
                                    <div className="text-center">
                                        <FiRefreshCw
                                            size={20}
                                            className="mx-auto animate-spin text-[#D4AF37]"
                                        />

                                        <p className="mt-4 text-[8px] uppercase tracking-[0.2em] text-white/25">
                                            Loading Inventory
                                        </p>
                                    </div>
                                </div>
                            ) : filteredInventory.length === 0 ? (
                                <div className="mt-5 border border-white/10 bg-[#080808] px-5 py-14 text-center">
                                    <FiPackage
                                        size={22}
                                        className="mx-auto text-white/15"
                                    />

                                    <p className="mt-4 text-xs text-white/30">
                                        No inventory records found.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {filteredInventory.map((item) => {
                                        const currentStock =
                                            Number(item.current_stock)

                                        const isOutOfStock =
                                            currentStock === 0

                                        return (
                                            <article
                                                key={item.id}
                                                className={`border bg-[#080808] p-4 sm:p-5 ${isOutOfStock
                                                        ? "border-red-500/20"
                                                        : item.is_low_stock
                                                            ? "border-yellow-500/20"
                                                            : "border-white/10"
                                                    }`}
                                            >
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0">
                                                        <p className="text-[7px] uppercase tracking-[0.2em] text-[#D4AF37]">
                                                            {item.category}
                                                        </p>

                                                        <h2 className="mt-2 break-words text-sm font-medium text-white/80">
                                                            {item.name}
                                                        </h2>

                                                        <p className="mt-2 text-[8px] uppercase tracking-[0.15em] text-white/20">
                                                            Product #{item.product_id}
                                                        </p>
                                                    </div>

                                                    {isOutOfStock ? (
                                                        <div className="flex w-fit items-center gap-2 border border-red-500/20 px-2.5 py-1.5 text-[7px] uppercase tracking-[0.15em] text-red-400">
                                                            <FiAlertTriangle
                                                                size={10}
                                                            />
                                                            Out of Stock
                                                        </div>
                                                    ) : item.is_low_stock ? (
                                                        <div className="flex w-fit items-center gap-2 border border-yellow-500/20 px-2.5 py-1.5 text-[7px] uppercase tracking-[0.15em] text-yellow-400">
                                                            <FiAlertTriangle
                                                                size={10}
                                                            />
                                                            Low Stock
                                                        </div>
                                                    ) : (
                                                        <div className="w-fit border border-green-500/20 px-2.5 py-1.5 text-[7px] uppercase tracking-[0.15em] text-green-400">
                                                            In Stock
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-5 grid grid-cols-2 gap-3 border-y border-white/10 py-4">
                                                    <div>
                                                        <p className="text-[7px] uppercase tracking-[0.18em] text-white/20">
                                                            Current Stock
                                                        </p>

                                                        <p
                                                            className={`mt-2 text-2xl ${isOutOfStock
                                                                    ? "text-red-400"
                                                                    : item.is_low_stock
                                                                        ? "text-yellow-400"
                                                                        : "text-white"
                                                                }`}
                                                        >
                                                            {currentStock}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[7px] uppercase tracking-[0.18em] text-white/20">
                                                            Low Stock At
                                                        </p>

                                                        <p className="mt-2 text-2xl text-white/40">
                                                            {item.low_stock_threshold}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openStockModal(
                                                                item,
                                                                "in"
                                                            )
                                                        }
                                                        className="flex h-9 w-fit items-center justify-center gap-2 bg-[#D4AF37] px-3 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#050505] transition hover:bg-[#E1C35B]"
                                                    >
                                                        <FiArrowUp size={11} />
                                                        Stock In
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openStockModal(
                                                                item,
                                                                "out"
                                                            )
                                                        }
                                                        disabled={
                                                            currentStock === 0
                                                        }
                                                        className="flex h-9 w-fit items-center justify-center gap-2 border border-white/10 px-3 text-[8px] uppercase tracking-[0.16em] text-white/45 transition hover:border-red-500/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <FiArrowDown
                                                            size={11}
                                                        />
                                                        Stock Out
                                                    </button>
                                                </div>
                                            </article>
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    )}

                    {/* HISTORY */}
                    {activeTab === "history" && (
                        <div className="mt-5">
                            {historyLoading ? (
                                <div className="flex min-h-[300px] items-center justify-center">
                                    <FiRefreshCw
                                        size={20}
                                        className="animate-spin text-[#D4AF37]"
                                    />
                                </div>
                            ) : history.length === 0 ? (
                                <div className="border border-white/10 bg-[#080808] px-5 py-14 text-center">
                                    <FiClock
                                        size={22}
                                        className="mx-auto text-white/15"
                                    />

                                    <p className="mt-4 text-xs text-white/30">
                                        No inventory transactions yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {history.map((transaction) => (
                                        <article
                                            key={transaction.id}
                                            className="border border-white/10 bg-[#080808] p-4 sm:p-5"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span
                                                            className={`flex w-fit items-center gap-1.5 border px-2 py-1 text-[7px] uppercase tracking-[0.15em] ${getTransactionStyle(
                                                                transaction.transaction_type
                                                            )}`}
                                                        >
                                                            {getTransactionIcon(
                                                                transaction.transaction_type
                                                            )}

                                                            {getTransactionLabel(
                                                                transaction.transaction_type
                                                            )}
                                                        </span>

                                                        <span className="text-[8px] text-white/20">
                                                            #{transaction.id}
                                                        </span>
                                                    </div>

                                                    <h3 className="mt-3 break-words text-sm text-white/75">
                                                        {transaction.product_name}
                                                    </h3>

                                                    <p className="mt-2 break-words text-xs leading-5 text-white/30">
                                                        {transaction.reason ||
                                                            "No reason provided"}
                                                    </p>
                                                </div>

                                                <div className="shrink-0 sm:text-right">
                                                    <p className="text-[8px] uppercase tracking-[0.15em] text-white/20">
                                                        Quantity
                                                    </p>

                                                    <p className="mt-1 text-lg text-[#D4AF37]">
                                                        {transaction.quantity}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
                                                <div>
                                                    <p className="text-[7px] uppercase tracking-[0.15em] text-white/20">
                                                        Stock Change
                                                    </p>

                                                    <p className="mt-1 text-xs text-white/55">
                                                        {transaction.previous_stock}
                                                        {" → "}
                                                        {transaction.new_stock}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[7px] uppercase tracking-[0.15em] text-white/20">
                                                        Admin
                                                    </p>

                                                    <p className="mt-1 break-words text-xs text-white/45">
                                                        {transaction.first_name ||
                                                            transaction.last_name
                                                            ? `${transaction.first_name || ""} ${transaction.last_name || ""}`.trim()
                                                            : "System"}
                                                    </p>
                                                </div>

                                                <div className="col-span-2 sm:col-span-1 sm:text-right">
                                                    <p className="text-[7px] uppercase tracking-[0.15em] text-white/20">
                                                        Date
                                                    </p>

                                                    <p className="mt-1 text-xs text-white/35">
                                                        {formatDate(
                                                            transaction.created_at
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* STOCK MODAL */}
            {stockModal && selectedProduct && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
                    <div className="w-full max-w-md border border-white/10 bg-[#080808]">
                        <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-5">
                            <div>
                                <p className="text-[7px] uppercase tracking-[0.22em] text-[#D4AF37]">
                                    Inventory
                                </p>

                                <h2 className="mt-2 text-lg text-white">
                                    {stockModal === "in"
                                        ? "Stock In"
                                        : "Stock Out"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeStockModal}
                                disabled={actionLoading}
                                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/35 transition hover:text-white"
                            >
                                <FiX size={15} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleStockSubmit}
                            className="p-4 sm:p-5"
                        >
                            <div className="border border-white/10 bg-[#050505] p-4">
                                <p className="text-sm text-white/75">
                                    {selectedProduct.name}
                                </p>

                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[8px] uppercase tracking-[0.15em] text-white/25">
                                        Current Stock
                                    </span>

                                    <span className="text-lg text-[#D4AF37]">
                                        {selectedProduct.current_stock}
                                    </span>
                                </div>
                            </div>

                            {formError && (
                                <div className="mt-4 border border-red-500/20 bg-red-500/[0.04] p-3">
                                    <p className="text-xs leading-5 text-red-400">
                                        {formError}
                                    </p>
                                </div>
                            )}

                            <div className="mt-5">
                                <label className="text-[7px] uppercase tracking-[0.18em] text-white/25">
                                    Quantity *
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    max={
                                        stockModal === "out"
                                            ? selectedProduct.current_stock
                                            : undefined
                                    }
                                    value={quantity}
                                    onChange={(event) =>
                                        setQuantity(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter quantity"
                                    className="mt-2 h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none placeholder:text-white/15 focus:border-[#D4AF37]/40"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="text-[7px] uppercase tracking-[0.18em] text-white/25">
                                    Reason
                                </label>

                                <textarea
                                    rows={3}
                                    value={reason}
                                    onChange={(event) =>
                                        setReason(event.target.value)
                                    }
                                    placeholder={
                                        stockModal === "in"
                                            ? "Example: New supplier delivery"
                                            : "Example: Damaged item"
                                    }
                                    className="mt-2 w-full resize-none border border-white/10 bg-[#050505] px-3 py-3 text-sm text-white outline-none placeholder:text-white/15 focus:border-[#D4AF37]/40"
                                />
                            </div>

                            <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-5 sm:flex-row">
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className={`flex h-10 w-full items-center justify-center gap-2 px-4 text-[8px] font-semibold uppercase tracking-[0.16em] transition disabled:opacity-40 sm:w-fit ${stockModal === "in"
                                            ? "bg-[#D4AF37] text-[#050505] hover:bg-[#E1C35B]"
                                            : "bg-red-500/90 text-white hover:bg-red-500"
                                        }`}
                                >
                                    {stockModal === "in" ? (
                                        <FiArrowUp size={11} />
                                    ) : (
                                        <FiArrowDown size={11} />
                                    )}

                                    {stockModal === "in"
                                        ? "Add Stock"
                                        : "Remove Stock"}
                                </button>

                                <button
                                    type="button"
                                    onClick={closeStockModal}
                                    disabled={actionLoading}
                                    className="flex h-10 w-full items-center justify-center border border-white/10 px-4 text-[8px] uppercase tracking-[0.16em] text-white/40 transition hover:text-white disabled:opacity-40 sm:w-fit"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default AdminInventory
