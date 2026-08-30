import { API_URL } from "../../config/api";
import { useEffect, useState } from "react"
import {
    FiMapPin,
    FiPlus,
    FiEdit3,
    FiTrash2,
    FiCheck,
    FiX,
    FiHome,
    FiStar,
} from "react-icons/fi"

import BrandLoader from "../BrandLoader"

function AddressManager() {
    const token = localStorage.getItem("yocana_token")

    const [addresses, setAddresses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [formOpen, setFormOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)

    const [actionLoading, setActionLoading] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)

    const [loaderOpen, setLoaderOpen] = useState(false)
    const [loaderStatus, setLoaderStatus] = useState("loading")
    const [loaderMessage, setLoaderMessage] = useState("")

    const [form, setForm] = useState({
        label: "Home",
        recipient_name: "",
        phone: "",
        address_line: "",
        barangay: "",
        city: "",
        province: "",
        postal_code: "",
    })

    const showSuccess = (message) => {
        setLoaderStatus("success")
        setLoaderMessage(message)

        setTimeout(() => {
            setLoaderOpen(false)
        }, 1300)
    }

    const resetForm = () => {
        setForm({
            label: "Home",
            recipient_name: "",
            phone: "",
            address_line: "",
            barangay: "",
            city: "",
            province: "",
            postal_code: "",
        })

        setEditingAddress(null)
        setFormOpen(false)
        setError("")
    }

    const loadAddresses = async (showLoader = false) => {
        try {
            setLoading(true)
            setError("")

            if (showLoader) {
                setLoaderStatus("loading")
                setLoaderMessage("Loading Your Addresses")
                setLoaderOpen(true)
            }

            const response = await fetch(
                `${API_URL}/api/addresses`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load addresses"
                )
            }

            setAddresses(data.addresses || [])

            if (showLoader) {
                setLoaderOpen(false)
            }
        } catch (error) {
            setLoaderOpen(false)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAddresses()
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }))
    }

    const handleAddAddress = () => {
        setEditingAddress(null)

        setForm({
            label: "Home",
            recipient_name: "",
            phone: "",
            address_line: "",
            barangay: "",
            city: "",
            province: "",
            postal_code: "",
        })

        setError("")
        setFormOpen(true)
    }

    const handleEditAddress = (address) => {
        setEditingAddress(address)

        setForm({
            label: address.label || "Home",
            recipient_name: address.recipient_name || "",
            phone: address.phone || "",
            address_line: address.address_line || "",
            barangay: address.barangay || "",
            city: address.city || "",
            province: address.province || "",
            postal_code: address.postal_code || "",
        })

        setError("")
        setFormOpen(true)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (
            !form.recipient_name.trim() ||
            !form.phone.trim() ||
            !form.address_line.trim() ||
            !form.city.trim() ||
            !form.province.trim()
        ) {
            setError(
                "Recipient name, phone, address, city, and province are required."
            )
            return
        }

        try {
            setActionLoading(true)
            setError("")

            setLoaderStatus("loading")
            setLoaderMessage(
                editingAddress
                    ? "Updating Your Address"
                    : "Adding Your Address"
            )
            setLoaderOpen(true)

            const url = editingAddress
                ? `${API_URL}/api/addresses/${editingAddress.id}`
                : `${API_URL}/api/addresses`

            const response = await fetch(url, {
                method: editingAddress ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    label: form.label.trim() || "Home",
                    recipient_name: form.recipient_name.trim(),
                    phone: form.phone.trim(),
                    address_line: form.address_line.trim(),
                    barangay: form.barangay.trim(),
                    city: form.city.trim(),
                    province: form.province.trim(),
                    postal_code: form.postal_code.trim(),
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    (editingAddress
                        ? "Failed to update address"
                        : "Failed to add address")
                )
            }

            await loadAddresses()

            resetForm()

            showSuccess(
                editingAddress
                    ? "Address Updated"
                    : "Address Added"
            )
        } catch (error) {
            setLoaderOpen(false)
            setError(error.message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleSetDefault = async (addressId) => {
        try {
            setActionLoading(true)
            setError("")

            setLoaderStatus("loading")
            setLoaderMessage("Updating Default Address")
            setLoaderOpen(true)

            const response = await fetch(
                `${API_URL}/api/addresses/${addressId}/default`,
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
                    data.message || "Failed to update default address"
                )
            }

            await loadAddresses()

            showSuccess("Default Address Updated")
        } catch (error) {
            setLoaderOpen(false)
            setError(error.message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) {
            return
        }

        try {
            setActionLoading(true)
            setError("")

            const addressId = deleteTarget.id

            setDeleteTarget(null)

            setLoaderStatus("loading")
            setLoaderMessage("Deleting Your Address")
            setLoaderOpen(true)

            const response = await fetch(
                `${API_URL}/api/addresses/${addressId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to delete address"
                )
            }

            await loadAddresses()

            showSuccess("Address Deleted")
        } catch (error) {
            setLoaderOpen(false)
            setError(error.message)
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <>
            <BrandLoader
                show={loaderOpen}
                status={loaderStatus}
                message={loaderMessage}
            />

            <section className="border border-white/10 bg-[#080808] p-4 sm:p-6">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04]">
                            <FiMapPin
                                size={16}
                                className="text-[#D4AF37]"
                            />
                        </div>

                        <div>
                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                                Shipping Information
                            </p>

                            <h2 className="mt-1 text-base font-medium text-white/80 sm:text-lg">
                                Shipping Addresses
                            </h2>

                            <p className="mt-1 text-[10px] leading-5 text-white/25">
                                Save and manage your delivery addresses.
                            </p>
                        </div>
                    </div>

                    {!formOpen && (
                        <button
                            type="button"
                            onClick={handleAddAddress}
                            disabled={actionLoading}
                            className="flex h-10 w-fit items-center gap-2 border border-[#D4AF37]/25 px-4 text-[8px] uppercase tracking-[0.18em] text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <FiPlus size={13} />
                            Add Address
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mt-5 border border-red-500/20 bg-red-500/[0.04] p-4">
                        <p className="text-xs leading-5 text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                {formOpen && (
                    <form
                        onSubmit={handleSubmit}
                        className="mt-5 border border-[#D4AF37]/15 bg-[#D4AF37]/[0.02] p-4 sm:p-5"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.2em] text-[#D4AF37]">
                                    {editingAddress
                                        ? "Edit Address"
                                        : "New Address"}
                                </p>

                                <h3 className="mt-1 text-sm font-medium text-white/70">
                                    {editingAddress
                                        ? "Update shipping details"
                                        : "Add shipping details"}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={actionLoading}
                                className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-white/35 transition hover:border-white/20 hover:text-white"
                            >
                                <FiX size={14} />
                            </button>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-[8px] uppercase tracking-[0.18em] text-white/25">
                                    Address Label
                                </label>

                                <input
                                    type="text"
                                    name="label"
                                    value={form.label}
                                    onChange={handleChange}
                                    placeholder="Home, Work, Condo"
                                    className="h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/40"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-[8px] uppercase tracking-[0.18em] text-white/25">
                                    Recipient Name
                                </label>

                                <input
                                    type="text"
                                    name="recipient_name"
                                    value={form.recipient_name}
                                    onChange={handleChange}
                                    className="h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/40"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-[8px] uppercase tracking-[0.18em] text-white/25">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="09XXXXXXXXX"
                                    className="h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/40"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-[8px] uppercase tracking-[0.18em] text-white/25">
                                    Postal Code
                                </label>

                                <input
                                    type="text"
                                    name="postal_code"
                                    value={form.postal_code}
                                    onChange={handleChange}
                                    className="h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/40"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-[8px] uppercase tracking-[0.18em] text-white/25">
                                    Complete Address
                                </label>

                                <input
                                    type="text"
                                    name="address_line"
                                    value={form.address_line}
                                    onChange={handleChange}
                                    placeholder="House / Unit / Building / Street"
                                    className="h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/40"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-[8px] uppercase tracking-[0.18em] text-white/25">
                                    Barangay
                                </label>

                                <input
                                    type="text"
                                    name="barangay"
                                    value={form.barangay}
                                    onChange={handleChange}
                                    className="h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/40"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-[8px] uppercase tracking-[0.18em] text-white/25">
                                    City / Municipality
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    className="h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/40"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-[8px] uppercase tracking-[0.18em] text-white/25">
                                    Province / Region
                                </label>

                                <input
                                    type="text"
                                    name="province"
                                    value={form.province}
                                    onChange={handleChange}
                                    className="h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/40"
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="flex h-10 w-fit items-center gap-2 bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <FiCheck size={13} />

                                {editingAddress
                                    ? "Save Address"
                                    : "Add Address"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={actionLoading}
                                className="flex h-10 w-fit items-center gap-2 border border-white/10 px-4 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-white/20 hover:text-white"
                            >
                                <FiX size={13} />
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-5">
                    {loading ? (
                        <div className="border border-white/10 p-5">
                            <p className="text-xs text-white/30">
                                Loading addresses...
                            </p>
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className="flex flex-col items-start border border-dashed border-white/10 p-5 sm:p-6">
                            <FiHome
                                size={18}
                                className="text-[#D4AF37]"
                            />

                            <p className="mt-3 text-sm text-white/60">
                                No shipping address yet.
                            </p>

                            <p className="mt-1 text-[10px] leading-5 text-white/25">
                                Add an address so checkout can be faster.
                            </p>

                            {!formOpen && (
                                <button
                                    type="button"
                                    onClick={handleAddAddress}
                                    className="mt-4 flex h-9 w-fit items-center gap-2 border border-[#D4AF37]/25 px-3 text-[8px] uppercase tracking-[0.15em] text-[#D4AF37]"
                                >
                                    <FiPlus size={12} />
                                    Add Address
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {addresses.map((address) => (
                                <article
                                    key={address.id}
                                    className={`relative min-w-0 border p-4 sm:p-5 ${address.is_default
                                        ? "border-[#D4AF37]/30 bg-[#D4AF37]/[0.025]"
                                        : "border-white/10 bg-[#050505]"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/65">
                                                    {address.label || "Address"}
                                                </p>

                                                {address.is_default && (
                                                    <span className="flex items-center gap-1 border border-[#D4AF37]/25 bg-[#D4AF37]/[0.05] px-2 py-1 text-[7px] uppercase tracking-[0.15em] text-[#D4AF37]">
                                                        <FiStar size={9} />
                                                        Default
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-3 break-words text-sm font-medium text-white/70">
                                                {address.recipient_name}
                                            </p>

                                            <p className="mt-1 break-words text-xs text-white/35">
                                                {address.phone}
                                            </p>
                                        </div>

                                        <FiMapPin
                                            size={15}
                                            className="shrink-0 text-[#D4AF37]"
                                        />
                                    </div>

                                    <div className="mt-4 border-t border-white/10 pt-4">
                                        <p className="break-words text-xs leading-5 text-white/40">
                                            {address.address_line}
                                            {address.barangay
                                                ? `, ${address.barangay}`
                                                : ""}
                                        </p>

                                        <p className="mt-1 break-words text-xs leading-5 text-white/40">
                                            {address.city}, {address.province}
                                            {address.postal_code
                                                ? ` ${address.postal_code}`
                                                : ""}
                                        </p>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditAddress(address)
                                            }
                                            disabled={actionLoading}
                                            className="flex h-9 w-fit items-center gap-2 border border-white/10 px-3 text-[8px] uppercase tracking-[0.14em] text-white/45 transition hover:border-[#D4AF37]/25 hover:text-[#D4AF37] disabled:opacity-50"
                                        >
                                            <FiEdit3 size={11} />
                                            Edit
                                        </button>

                                        {!address.is_default && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSetDefault(address.id)
                                                }
                                                disabled={actionLoading}
                                                className="flex h-9 w-fit items-center gap-2 border border-[#D4AF37]/20 px-3 text-[8px] uppercase tracking-[0.14em] text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.05] disabled:opacity-50"
                                            >
                                                <FiCheck size={11} />
                                                Set Default
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(address)}
                                            disabled={actionLoading}
                                            className="flex h-9 w-fit items-center gap-2 border border-red-500/20 px-3 text-[8px] uppercase tracking-[0.14em] text-red-400 transition hover:border-red-500/40 hover:bg-red-500/[0.04] disabled:opacity-50"
                                        >
                                            <FiTrash2 size={11} />
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            {deleteTarget && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm border border-white/10 bg-[#080808] p-5 shadow-2xl sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-red-500/20 bg-red-500/[0.04]">
                                <FiTrash2
                                    size={15}
                                    className="text-red-400"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                disabled={actionLoading}
                                className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-white/35 transition hover:border-white/20 hover:text-white"
                            >
                                <FiX size={14} />
                            </button>
                        </div>

                        <p className="mt-5 text-[8px] uppercase tracking-[0.25em] text-red-400">
                            Delete Address
                        </p>

                        <h3 className="mt-2 text-lg font-medium text-white/85">
                            Remove this shipping address?
                        </h3>

                        <p className="mt-3 text-xs leading-5 text-white/35">
                            You're about to remove your{" "}
                            <span className="text-white/60">
                                {deleteTarget.label || "shipping"}
                            </span>{" "}
                            address. This action cannot be undone.
                        </p>

                        <div className="mt-5 border border-white/10 bg-[#050505] p-3">
                            <p className="break-words text-xs font-medium text-white/60">
                                {deleteTarget.recipient_name}
                            </p>

                            <p className="mt-1 break-words text-[10px] leading-5 text-white/30">
                                {deleteTarget.address_line}
                                {deleteTarget.barangay
                                    ? `, ${deleteTarget.barangay}`
                                    : ""}
                                , {deleteTarget.city}, {deleteTarget.province}
                            </p>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                disabled={actionLoading}
                                className="flex h-10 w-fit items-center justify-center border border-white/10 px-4 text-[8px] uppercase tracking-[0.16em] text-white/45 transition hover:border-white/20 hover:text-white disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={actionLoading}
                                className="flex h-10 w-fit items-center justify-center gap-2 border border-red-500/30 bg-red-500/[0.08] px-4 text-[8px] uppercase tracking-[0.16em] text-red-400 transition hover:bg-red-500/[0.14] disabled:opacity-50"
                            >
                                <FiTrash2 size={11} />
                                Delete Address
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddressManager
