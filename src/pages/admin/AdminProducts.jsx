import { API_URL } from "../../config/api";
import { useEffect, useMemo, useState } from "react"
import {
    FiEdit2,
    FiEye,
    FiEyeOff,
    FiPackage,
    FiPlus,
    FiRefreshCw,
    FiSearch,
    FiX,
} from "react-icons/fi"

import AdminLayout from "../../layouts/AdminLayout"
import hommeImage from "../../assets/yocana-homme.png"
import femmeImage from "../../assets/yocana-femme.png"
import BrandLoader from "../../components/BrandLoader"

const emptyForm = {
    name: "",
    slug: "",
    description: "",
    category: "Men",
    size_ml: "50",
    price: "",
    image_url: "",
}

function AdminProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [formError, setFormError] = useState("")

    const [actionLoading, setActionLoading] = useState(false)

    const [loaderOpen, setLoaderOpen] = useState(false)
    const [loaderStatus, setLoaderStatus] = useState("loading")
    const [loaderMessage, setLoaderMessage] = useState("")

    const token = localStorage.getItem("yocana_token")

    const getProductImage = (product) => {
        if (product?.image_url && typeof product.image_url === "string" && product.image_url.startsWith("http")) {
            return product.image_url;
        }
        const name = (product?.name || "").toLowerCase();
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

    const generateSlug = (value) =>
        value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")

    const loadProducts = async (silent = false) => {
        try {
            if (!silent) setLoading(true)

            setError("")

            const response = await fetch(
                `${API_URL}/api/products`
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load products"
                )
            }

            setProducts(data.products || [])
        } catch (err) {
            setError(err.message)
        } finally {
            if (!silent) setLoading(false)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [])

    const showSuccess = (message) => {
        setLoaderStatus("success")
        setLoaderMessage(message)

        setTimeout(() => {
            setLoaderOpen(false)
        }, 1400)
    }

    const openAddForm = () => {
        setEditingProduct(null)
        setForm(emptyForm)
        setFormError("")
        setShowForm(true)
    }

    const openEditForm = (product) => {
        setEditingProduct(product)

        setForm({
            name: product.name || "",
            slug: product.slug || "",
            description: product.description || "",
            category: product.category || "Men",
            size_ml: String(product.size_ml || 50),
            price: String(product.price || ""),
            image_url: product.image_url || "",
        })

        setFormError("")
        setShowForm(true)
    }

    const closeForm = () => {
        if (actionLoading) return

        setShowForm(false)
        setEditingProduct(null)
        setForm(emptyForm)
        setFormError("")
    }

    const handleNameChange = (event) => {
        const value = event.target.value

        setForm((previous) => ({
            ...previous,
            name: value,
            slug: editingProduct
                ? previous.slug
                : generateSlug(value),
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (
            !form.name.trim() ||
            !form.slug.trim() ||
            !form.category ||
            !form.price
        ) {
            setFormError(
                "Name, slug, category, and price are required."
            )
            return
        }

        if (Number(form.price) <= 0) {
            setFormError("Price must be greater than 0.")
            return
        }

        try {
            setActionLoading(true)
            setFormError("")

            setLoaderStatus("loading")
            setLoaderMessage(
                editingProduct
                    ? "Updating product"
                    : "Creating product"
            )
            setLoaderOpen(true)

            const url = editingProduct
                ? `${API_URL}/api/products/${editingProduct.id}`
                : `${API_URL}/api/products`

            const response = await fetch(url, {
                method: editingProduct ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    slug: form.slug.trim(),
                    description:
                        form.description.trim() || null,
                    category: form.category,
                    size_ml: Number(form.size_ml) || 50,
                    price: Number(form.price),
                    image_url:
                        form.image_url.trim() || null,
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to save product"
                )
            }

            await loadProducts(true)

            setShowForm(false)
            setEditingProduct(null)
            setForm(emptyForm)

            showSuccess(
                editingProduct
                    ? "Product Updated"
                    : "Product Created"
            )
        } catch (err) {
            setLoaderOpen(false)
            setFormError(err.message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleStatus = async (product) => {
        const nextStatus = !product.is_active

        try {
            setActionLoading(true)
            setError("")

            setLoaderStatus("loading")
            setLoaderMessage(
                nextStatus
                    ? "Activating product"
                    : "Deactivating product"
            )
            setLoaderOpen(true)

            const response = await fetch(
                `${API_URL}/api/products/${product.id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        is_active: nextStatus,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to update product status"
                )
            }

            await loadProducts(true)

            showSuccess(
                nextStatus
                    ? "Product Activated"
                    : "Product Deactivated"
            )
        } catch (err) {
            setLoaderOpen(false)
            setError(err.message)
        } finally {
            setActionLoading(false)
        }
    }

    const filteredProducts = useMemo(() => {
        const keyword = search.trim().toLowerCase()

        return products.filter((product) => {
            const matchesSearch =
                !keyword ||
                product.name
                    ?.toLowerCase()
                    .includes(keyword) ||
                product.slug
                    ?.toLowerCase()
                    .includes(keyword)

            const matchesCategory =
                categoryFilter === "all" ||
                product.category === categoryFilter

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" &&
                    product.is_active) ||
                (statusFilter === "inactive" &&
                    !product.is_active)

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            )
        })
    }, [
        products,
        search,
        categoryFilter,
        statusFilter,
    ])

    const activeCount = products.filter(
        (product) => product.is_active
    ).length

    const inactiveCount =
        products.length - activeCount

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
                            Loading Products
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
                                Catalog Management
                            </p>

                            <h1 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
                                Products
                            </h1>

                            <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                                Manage YOCANA fragrances,
                                product information, pricing,
                                images and availability.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={openAddForm}
                            className="flex h-10 w-fit items-center justify-center gap-2 bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B]"
                        >
                            <FiPlus size={13} />
                            Add Product
                        </button>
                    </div>

                    {/* SUMMARY */}
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-[#080808]/80 p-3 sm:p-4 backdrop-blur-md transition-all hover:border-[#D4AF37]/35">
                            <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                Total Products
                            </p>

                            <p className="mt-2 text-xl text-white">
                                {products.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#080808]/80 p-3 sm:p-4 backdrop-blur-md transition-all hover:border-[#D4AF37]/35">
                            <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                Active
                            </p>

                            <p className="mt-2 text-xl text-[#D4AF37]">
                                {activeCount}
                            </p>
                        </div>

                        <div className="col-span-2 rounded-2xl border border-white/10 bg-[#080808]/80 p-3 sm:p-4 backdrop-blur-md transition-all hover:border-[#D4AF37]/35 sm:col-span-1">
                            <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                Inactive
                            </p>

                            <p className="mt-2 text-xl text-white/45">
                                {inactiveCount}
                            </p>
                        </div>
                    </div>

                    {/* FILTERS */}
                    <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                        <div className="flex h-10 min-w-0 flex-1 items-center rounded-full border border-white/10 bg-[#080808]/80 backdrop-blur-md focus-within:border-[#D4AF37]/50">
                            <FiSearch
                                size={14}
                                className="ml-4 shrink-0 text-white/20"
                            />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search product..."
                                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:flex">
                            <select
                                value={categoryFilter}
                                onChange={(event) =>
                                    setCategoryFilter(
                                        event.target.value
                                    )
                                }
                                className="h-10 min-w-0 rounded-full border border-white/10 bg-[#080808]/80 px-4 text-xs text-white/60 outline-none backdrop-blur-md focus:border-[#D4AF37]/50 sm:w-[150px]"
                            >
                                <option value="all">
                                    All Categories
                                </option>
                                <option value="Men">Men</option>
                                <option value="Women">
                                    Women
                                </option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                className="h-10 min-w-0 rounded-full border border-white/10 bg-[#080808]/80 px-4 text-xs text-white/60 outline-none backdrop-blur-md focus:border-[#D4AF37]/50 sm:w-[140px]"
                            >
                                <option value="all">
                                    All Status
                                </option>
                                <option value="active">
                                    Active
                                </option>
                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={() => loadProducts()}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 text-[8px] uppercase tracking-[0.18em] text-white/50 backdrop-blur-md transition-all hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
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

                    {/* PRODUCTS */}
                    {filteredProducts.length === 0 ? (
                        <div className="mt-6 border border-white/10 bg-[#080808] px-5 py-14 text-center">
                            <FiPackage
                                size={22}
                                className="mx-auto text-white/15"
                            />

                            <p className="mt-4 text-xs text-white/35">
                                No products found.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-2">
                            {filteredProducts.map(
                                (product) => (
                                    <article
                                        key={product.id}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#080808]/80 p-2.5 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37]/45 hover:bg-[#0c0c0c] hover:shadow-[0_4px_25px_rgba(212,175,55,0.12)]"
                                    >
                                        {/* MOBILE VIEW (< sm) */}
                                        <div className="flex flex-1 flex-col justify-between sm:hidden">
                                            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] via-[#080808] to-black/60 p-2">
                                                <div className="pointer-events-none absolute inset-0 bg-[#D4AF37]/5 blur-md" />
                                                <img
                                                    src={getProductImage(product)}
                                                    alt={product.name}
                                                    className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <span
                                                    className={`absolute right-1.5 top-1.5 z-20 rounded-full border px-1.5 py-0.5 text-[7px] uppercase tracking-wider backdrop-blur-sm ${product.is_active
                                                            ? "border-green-500/30 bg-black/70 text-green-400"
                                                            : "border-white/20 bg-black/70 text-white/40"
                                                        }`}
                                                >
                                                    {product.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </div>

                                            <div className="mt-2.5 min-w-0">
                                                <p className="text-[7px] uppercase tracking-[0.18em] text-[#D4AF37]">
                                                    {product.category}
                                                </p>
                                                <h3 className="mt-0.5 truncate text-xs font-medium text-white/90">
                                                    {product.name}
                                                </h3>
                                                <div className="mt-1 flex items-baseline gap-1.5">
                                                    <p className="text-xs font-semibold text-[#D4AF37]">
                                                        ₱{formatPrice(product.price)}
                                                    </p>
                                                    {product.original_price && (
                                                        <span className="text-[9px] text-white/30 line-through">
                                                            ₱{formatPrice(product.original_price)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-2.5 flex flex-col gap-1.5 border-t border-white/10 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditForm(product)}
                                                    disabled={actionLoading}
                                                    className="inline-flex h-7 w-full items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] text-[8px] font-medium uppercase tracking-[0.14em] text-white/60 backdrop-blur-md transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37] active:scale-95 disabled:opacity-40"
                                                >
                                                    <FiEdit2 size={10} /> Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatus(product)}
                                                    disabled={actionLoading}
                                                    className={`inline-flex h-7 w-full items-center justify-center gap-1.5 rounded-full border text-[8px] font-medium uppercase tracking-[0.14em] backdrop-blur-md transition active:scale-95 disabled:opacity-40 ${product.is_active
                                                            ? "border-red-500/20 bg-red-500/[0.05] text-red-400 hover:border-red-500/40"
                                                            : "border-green-500/20 bg-green-500/[0.05] text-green-400 hover:border-green-500/40"
                                                        }`}
                                                >
                                                    {product.is_active ? <FiEyeOff size={10} /> : <FiEye size={10} />}
                                                    {product.is_active ? "Deactivate" : "Activate"}
                                                </button>
                                            </div>
                                        </div>

                                        {/* DESKTOP VIEW (>= sm) */}
                                        <div className="hidden sm:block">
                                            <div className="flex gap-4">
                                                {/* IMAGE */}
                                                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] via-[#080808] to-black/60 p-2">
                                                    <div className="pointer-events-none absolute inset-0 bg-[#D4AF37]/5 blur-md" />
                                                    <img
                                                        src={getProductImage(product)}
                                                        alt={product.name}
                                                        className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>

                                                {/* DETAILS */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <p className="text-[7px] uppercase tracking-[0.2em] text-[#D4AF37]">
                                                                {product.category}
                                                            </p>
                                                            <h2 className="mt-1 break-words text-sm font-medium text-white/90">
                                                                {product.name}
                                                            </h2>
                                                        </div>

                                                        <span
                                                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[7px] uppercase tracking-[0.16em] backdrop-blur-sm ${product.is_active
                                                                    ? "border-green-500/30 bg-green-500/[0.06] text-green-400"
                                                                    : "border-white/10 bg-white/[0.02] text-white/30"
                                                                }`}
                                                        >
                                                            {product.is_active ? "Active" : "Inactive"}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 break-all text-[9px] text-white/25">
                                                        /{product.slug}
                                                    </p>

                                                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                                                        {product.original_price && (
                                                            <span className="text-xs text-white/35 line-through">
                                                                ₱{formatPrice(product.original_price)}
                                                            </span>
                                                        )}
                                                        <p className="text-sm font-semibold text-[#D4AF37]">
                                                            ₱{formatPrice(product.price)}
                                                        </p>
                                                        <span className="rounded bg-[#D4AF37]/15 px-1.5 py-0.5 text-[8px] font-semibold text-[#D4AF37]">
                                                            PROMO
                                                        </span>

                                                        <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                                                            {product.size_ml || 50} ml
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {product.description && (
                                                <p className="mt-3 line-clamp-2 break-words text-xs leading-5 text-white/35">
                                                    {product.description}
                                                </p>
                                            )}

                                            {/* ACTIONS */}
                                            <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3.5">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditForm(product)}
                                                    disabled={actionLoading}
                                                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[8px] uppercase tracking-[0.16em] text-white/50 backdrop-blur-md transition hover:scale-105 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:opacity-40"
                                                >
                                                    <FiEdit2 size={11} />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleStatus(product)}
                                                    disabled={actionLoading}
                                                    className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-full border px-4 text-[8px] uppercase tracking-[0.16em] backdrop-blur-md transition hover:scale-105 disabled:opacity-40 ${product.is_active
                                                            ? "border-red-500/20 bg-red-500/[0.05] text-red-400 hover:border-red-500/40"
                                                            : "border-green-500/20 bg-green-500/[0.05] text-green-400 hover:border-green-500/40"
                                                        }`}
                                                >
                                                    {product.is_active ? <FiEyeOff size={11} /> : <FiEye size={11} />}
                                                    {product.is_active ? "Deactivate" : "Activate"}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ADD / EDIT MODAL */}
            {showForm && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#080808]/95 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#080808] px-4 py-4 sm:px-5">
                            <div>
                                <p className="text-[7px] uppercase tracking-[0.25em] text-[#D4AF37]">
                                    Catalog
                                </p>

                                <h2 className="mt-2 text-lg text-white">
                                    {editingProduct
                                        ? "Edit Product"
                                        : "Add Product"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={actionLoading}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/40 backdrop-blur-md transition hover:border-[#D4AF37]/50 hover:text-white"
                            >
                                <FiX size={15} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-4 sm:p-5"
                        >
                            {formError && (
                                <div className="border border-red-500/20 bg-red-500/[0.04] p-3">
                                    <p className="text-xs leading-5 text-red-400">
                                        {formError}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* NAME */}
                                <div className="sm:col-span-2">
                                    <label className="text-[7px] uppercase tracking-[0.2em] text-white/25">
                                        Product Name *
                                    </label>

                                    <input
                                        value={form.name}
                                        onChange={handleNameChange}
                                        placeholder="YOCANA Homme"
                                        className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#050505]/80 px-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#D4AF37]/50"
                                    />
                                </div>

                                {/* SLUG */}
                                <div className="sm:col-span-2">
                                    <label className="text-[7px] uppercase tracking-[0.2em] text-white/25">
                                        Slug *
                                    </label>

                                    <input
                                        value={form.slug}
                                        onChange={(event) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                slug: generateSlug(
                                                    event.target.value
                                                ),
                                            }))
                                        }
                                        placeholder="yocana-homme"
                                        className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#050505]/80 px-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#D4AF37]/50"
                                    />
                                </div>

                                {/* CATEGORY */}
                                <div>
                                    <label className="text-[7px] uppercase tracking-[0.2em] text-white/25">
                                        Category *
                                    </label>

                                    <select
                                        value={form.category}
                                        onChange={(event) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                category:
                                                    event.target.value,
                                            }))
                                        }
                                        className="mt-2 h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none focus:border-[#D4AF37]/40"
                                    >
                                        <option value="Men">
                                            Men
                                        </option>
                                        <option value="Women">
                                            Women
                                        </option>
                                    </select>
                                </div>

                                {/* SIZE */}
                                <div>
                                    <label className="text-[7px] uppercase tracking-[0.2em] text-white/25">
                                        Size (ml)
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={form.size_ml}
                                        onChange={(event) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                size_ml:
                                                    event.target.value,
                                            }))
                                        }
                                        className="mt-2 h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none focus:border-[#D4AF37]/40"
                                    />
                                </div>

                                {/* PRICE */}
                                <div className="sm:col-span-2">
                                    <label className="text-[7px] uppercase tracking-[0.2em] text-white/25">
                                        Price *
                                    </label>

                                    <div className="mt-2 flex h-11 items-center rounded-xl border border-white/10 bg-[#050505]/80 focus-within:border-[#D4AF37]/50">
                                        <span className="pl-3 text-sm text-[#D4AF37]">
                                            ₱
                                        </span>

                                        <input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={form.price}
                                            onChange={(event) =>
                                                setForm((previous) => ({
                                                    ...previous,
                                                    price:
                                                        event.target.value,
                                                }))
                                            }
                                            placeholder="0.00"
                                            className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/15"
                                        />
                                    </div>
                                </div>

                                {/* IMAGE URL */}
                                <div className="sm:col-span-2">
                                    <label className="text-[7px] uppercase tracking-[0.2em] text-white/25">
                                        Image URL
                                    </label>

                                    <input
                                        type="text"
                                        value={form.image_url}
                                        onChange={(event) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                image_url:
                                                    event.target.value,
                                            }))
                                        }
                                        placeholder="Optional image URL"
                                        className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#050505]/80 px-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#D4AF37]/50"
                                    />
                                </div>

                                {/* DESCRIPTION */}
                                <div className="sm:col-span-2">
                                    <label className="text-[7px] uppercase tracking-[0.2em] text-white/25">
                                        Description
                                    </label>

                                    <textarea
                                        rows={4}
                                        value={form.description}
                                        onChange={(event) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                description:
                                                    event.target.value,
                                            }))
                                        }
                                        placeholder="Product description..."
                                        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#050505]/80 px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#D4AF37]/50"
                                    />
                                </div>
                            </div>

                            {/* PREVIEW */}
                            {form.image_url.trim() && (
                                <div className="border border-white/10 bg-[#050505] p-4">
                                    <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                        Image Preview
                                    </p>

                                    <div className="mt-3 flex h-40 items-center justify-center overflow-hidden">
                                        <img
                                            src={form.image_url}
                                            alt="Product preview"
                                            className="h-full max-w-full object-contain"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-2 border-t border-white/10 pt-5 sm:flex-row">
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="inline-flex h-10 w-full items-center justify-center rounded-full border border-[#FFE28A]/40 bg-[#D4AF37]/90 px-6 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] shadow-[0_4px_15px_rgba(212,175,55,0.25)] backdrop-blur-md transition-all hover:scale-105 hover:bg-[#E1C35B] active:scale-95 disabled:opacity-40 sm:w-fit"
                                >
                                    {editingProduct
                                        ? "Save Changes"
                                        : "Create Product"}
                                </button>

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={actionLoading}
                                    className="inline-flex h-10 w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 text-[8px] uppercase tracking-[0.18em] text-white/50 backdrop-blur-md transition-all hover:border-[#D4AF37]/50 hover:text-[#D4AF37] active:scale-95 disabled:opacity-40 sm:w-fit"
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

export default AdminProducts
