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
                        <div className="border border-white/10 bg-[#080808] p-4">
                            <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                Total Products
                            </p>

                            <p className="mt-2 text-xl text-white">
                                {products.length}
                            </p>
                        </div>

                        <div className="border border-white/10 bg-[#080808] p-4">
                            <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                                Active
                            </p>

                            <p className="mt-2 text-xl text-[#D4AF37]">
                                {activeCount}
                            </p>
                        </div>

                        <div className="col-span-2 border border-white/10 bg-[#080808] p-4 sm:col-span-1">
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
                                className="h-11 min-w-0 border border-white/10 bg-[#080808] px-3 text-xs text-white/60 outline-none focus:border-[#D4AF37]/30 sm:w-[150px]"
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
                                className="h-11 min-w-0 border border-white/10 bg-[#080808] px-3 text-xs text-white/60 outline-none focus:border-[#D4AF37]/30 sm:w-[140px]"
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
                            className="flex h-10 w-fit items-center justify-center gap-2 border border-white/10 px-4 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
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
                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            {filteredProducts.map(
                                (product) => (
                                    <article
                                        key={product.id}
                                        className="min-w-0 border border-white/10 bg-[#080808] p-4 sm:p-5"
                                    >
                                        <div className="flex gap-4">
                                            {/* IMAGE */}
                                            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-[#050505]">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-full w-full object-contain p-2"
                                                    />
                                                ) : (
                                                    <FiPackage
                                                        size={20}
                                                        className="text-white/15"
                                                    />
                                                )}
                                            </div>

                                            {/* DETAILS */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className="text-[7px] uppercase tracking-[0.2em] text-[#D4AF37]">
                                                            {product.category}
                                                        </p>

                                                        <h2 className="mt-2 break-words text-sm font-medium text-white/80">
                                                            {product.name}
                                                        </h2>
                                                    </div>

                                                    <span
                                                        className={`shrink-0 border px-2 py-1 text-[7px] uppercase tracking-[0.16em] ${product.is_active
                                                                ? "border-green-500/20 bg-green-500/[0.04] text-green-400"
                                                                : "border-white/10 bg-white/[0.02] text-white/30"
                                                            }`}
                                                    >
                                                        {product.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </div>

                                                <p className="mt-2 break-all text-[9px] text-white/20">
                                                    /{product.slug}
                                                </p>

                                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                                                    <p className="text-sm text-[#D4AF37]">
                                                        ₱
                                                        {formatPrice(
                                                            product.price
                                                        )}
                                                    </p>

                                                    <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                                                        {product.size_ml || 50}
                                                        ml
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {product.description && (
                                            <p className="mt-4 line-clamp-2 break-words text-xs leading-5 text-white/30">
                                                {product.description}
                                            </p>
                                        )}

                                        {/* ACTIONS */}
                                        <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditForm(product)
                                                }
                                                disabled={actionLoading}
                                                className="flex h-9 w-fit items-center justify-center gap-2 border border-white/10 px-3 text-[8px] uppercase tracking-[0.16em] text-white/45 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37] disabled:opacity-40"
                                            >
                                                <FiEdit2 size={11} />
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStatus(product)
                                                }
                                                disabled={actionLoading}
                                                className={`flex h-9 w-fit items-center justify-center gap-2 border px-3 text-[8px] uppercase tracking-[0.16em] transition disabled:opacity-40 ${product.is_active
                                                        ? "border-red-500/20 text-red-400 hover:border-red-500/40"
                                                        : "border-green-500/20 text-green-400 hover:border-green-500/40"
                                                    }`}
                                            >
                                                {product.is_active ? (
                                                    <FiEyeOff size={11} />
                                                ) : (
                                                    <FiEye size={11} />
                                                )}

                                                {product.is_active
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>
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
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/10 bg-[#080808]">
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
                                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/35 transition hover:border-white/20 hover:text-white"
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
                                        className="mt-2 h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none placeholder:text-white/15 focus:border-[#D4AF37]/40"
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
                                        className="mt-2 h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none placeholder:text-white/15 focus:border-[#D4AF37]/40"
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

                                    <div className="mt-2 flex h-11 items-center border border-white/10 bg-[#050505] focus-within:border-[#D4AF37]/40">
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
                                        className="mt-2 h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none placeholder:text-white/15 focus:border-[#D4AF37]/40"
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
                                        className="mt-2 w-full resize-none border border-white/10 bg-[#050505] px-3 py-3 text-sm text-white outline-none placeholder:text-white/15 focus:border-[#D4AF37]/40"
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
                                    className="flex h-10 w-full items-center justify-center bg-[#D4AF37] px-5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] disabled:opacity-40 sm:w-fit"
                                >
                                    {editingProduct
                                        ? "Save Changes"
                                        : "Create Product"}
                                </button>

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={actionLoading}
                                    className="flex h-10 w-full items-center justify-center border border-white/10 px-5 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-white/20 hover:text-white disabled:opacity-40 sm:w-fit"
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
