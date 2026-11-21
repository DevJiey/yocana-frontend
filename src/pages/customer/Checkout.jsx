import { API_URL } from "../../config/api"
import { useEffect, useState } from "react"
import {
    Link,
    useNavigate,
} from "react-router-dom"
import { motion } from "motion/react"
import {
    FiArrowLeft,
    FiMapPin,
    FiCreditCard,
    FiPackage,
    FiArrowRight,
} from "react-icons/fi"

import PublicLayout from "../../layouts/PublicLayout"
import BrandLoader from "../../components/BrandLoader"
import { apiFetch } from "../../utils/apiFetch"

function Checkout() {
    const navigate = useNavigate()

    const [cart, setCart] = useState({
        items: [],
        total_items: 0,
        subtotal: "0.00",
    })

    const [shippingAddress, setShippingAddress] =
        useState("")

    const [savedAddresses, setSavedAddresses] =
        useState([])

    const [selectedAddressId, setSelectedAddressId] =
        useState(null)

    const [addressesLoading, setAddressesLoading] =
        useState(true)

    const [shippingRegion, setShippingRegion] =
        useState("Metro Manila")

    const [paymentMethod, setPaymentMethod] =
        useState("COD")

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [placingOrder, setPlacingOrder] =
        useState(false)

    const [loaderOpen, setLoaderOpen] =
        useState(false)

    const [loaderStatus, setLoaderStatus] =
        useState("loading")

    const [loaderMessage, setLoaderMessage] =
        useState("")

    const token =
        localStorage.getItem("yocana_token")

    const totalQuantity = (cart.items || []).reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0
    )

    // Free Shipping on 2+ bottles nationwide, flat ₱50 for single bottle
    const isFreeShipping =
        totalQuantity >= 2 || Number(cart.subtotal || 0) >= 2998

    const shippingFee = isFreeShipping ? 0 : 50

    const estimatedTotal =
        Number(cart.subtotal || 0) + shippingFee

    const formatPrice = (value) =>
        Number(value || 0).toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )

    const buildShippingAddress = (address) => {
        return [
            address.recipient_name,
            address.phone,
            address.address_line,
            address.barangay,
            address.city,
            address.province,
            address.postal_code,
        ]
            .filter(Boolean)
            .join(", ")
    }

    const selectSavedAddress = (address) => {
        setSelectedAddressId(address.id)

        setShippingAddress(
            buildShippingAddress(address)
        )

        const province = (
            address.province || ""
        ).toLowerCase()

        if (
            province.includes("metro manila") ||
            province.includes("ncr")
        ) {
            setShippingRegion("Metro Manila")
        } else {
            setShippingRegion("Provincial")
        }
    }

    useEffect(() => {
        const fetchCart = async () => {
            if (!token) {
                navigate("/login", {
                    state: {
                        from: "/checkout",
                    },
                })

                return
            }

            try {
                setLoading(true)
                setError("")

                const response = await apiFetch(
                    `${API_URL}/api/cart`
                )

                const data = await response.json()

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message ||
                        "Unable to load checkout"
                    )
                }

                if (
                    !data.cart?.items ||
                    data.cart.items.length === 0
                ) {
                    navigate("/")
                    return
                }

                setCart(data.cart)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        const fetchAddresses = async () => {
            try {
                setAddressesLoading(true)

                const response = await apiFetch(
                    `${API_URL}/api/addresses`
                )

                const data = await response.json()

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message ||
                        "Unable to load shipping addresses"
                    )
                }

                const addresses =
                    data.addresses || []

                setSavedAddresses(addresses)

                const defaultAddress =
                    addresses.find(
                        (address) =>
                            address.is_default
                    ) || addresses[0]

                if (defaultAddress) {
                    selectSavedAddress(defaultAddress)
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setAddressesLoading(false)
            }
        }

        fetchAddresses()
        fetchCart()
    }, [])

    const handlePlaceOrder = async (event) => {
        event.preventDefault()

        if (!selectedAddressId) {
            setError(
                "Please select a shipping address."
            )

            return
        }

        try {
            setPlacingOrder(true)
            setError("")

            setLoaderStatus("loading")
            setLoaderMessage("Placing your order")
            setLoaderOpen(true)

            const response = await apiFetch(
                `${API_URL}/api/orders/checkout`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        address_id: selectedAddressId,
                        payment_method: paymentMethod,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Unable to place your order"
                )
            }

            const createdOrder = data.order

            window.dispatchEvent(
                new Event("yocana-cart-updated")
            )

            if (paymentMethod === "COD") {
                setLoaderStatus("success")
                setLoaderMessage("Order placed")

                setTimeout(() => {
                    setLoaderOpen(false)

                    navigate("/order-confirmation", {
                        state: {
                            order: createdOrder,
                        },
                    })
                }, 1400)

                return
            }

            setLoaderMessage("Preparing payment")

            const paymentResponse =
                await apiFetch(
                    `${API_URL}/api/payments/online/initialize`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            order_id: createdOrder.id,
                        }),
                    }
                )

            const paymentData =
                await paymentResponse.json()

            if (
                !paymentResponse.ok ||
                !paymentData.success
            ) {
                throw new Error(
                    paymentData.message ||
                    "Unable to initialize payment"
                )
            }

            setLoaderStatus("success")
            setLoaderMessage("Payment initialized")

            setTimeout(() => {
                setLoaderOpen(false)

                navigate(
                    `/payment/${createdOrder.id}`
                )
            }, 1400)
        } catch (err) {
            setLoaderOpen(false)
            setError(err.message)
        } finally {
            setPlacingOrder(false)
        }
    }

    if (loading) {
        return (
            <PublicLayout>
                <div className="flex min-h-screen items-center justify-center bg-[#050505] px-5 pt-[72px]">
                    <div className="text-center">
                        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-[#D4AF37]" />

                        <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-white/30">
                            Preparing checkout
                        </p>
                    </div>
                </div>
            </PublicLayout>
        )
    }

    return (
        <PublicLayout>
            <BrandLoader
                show={loaderOpen}
                status={loaderStatus}
                message={loaderMessage}
            />

            <main className="min-h-screen bg-[#050505] px-3.5 pb-14 pt-20 sm:px-6 sm:pb-20 sm:pt-24 md:px-8 md:pb-28 md:pt-28">
                <div className="mx-auto max-w-7xl">

                    {/* BACK */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-white/50 backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                    >
                        <FiArrowLeft size={14} />
                        Back to Home
                    </Link>

                    {/* TITLE */}
                    <div className="mt-8 border-b border-white/10 pb-7">
                        <p className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37]">
                            Complete Your Order
                        </p>

                        <h1 className="mt-3 text-4xl font-medium tracking-[-0.04em] text-[#F5F5F5] sm:text-5xl">
                            Checkout
                        </h1>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mt-6 border border-red-500/20 bg-red-500/[0.04] px-4 py-3">
                            <p className="text-xs text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={handlePlaceOrder}
                        className="mt-5 sm:mt-8 grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-[1fr_370px] lg:gap-12"
                    >
                        <div className="space-y-4 sm:space-y-6">

                            {/* SHIPPING */}
                            <motion.section
                                initial={{
                                    opacity: 0,
                                    y: 12,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                className="rounded-xl sm:rounded-2xl border border-white/[0.12] bg-[#0c0c0c]/85 p-3.5 sm:p-6 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
                            >
                                <div className="flex items-center gap-3">
                                    <FiMapPin
                                        className="text-[#D4AF37]"
                                        size={17}
                                    />

                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]">
                                            Shipping
                                        </p>

                                        <h2 className="mt-1 text-lg text-white">
                                            Delivery Information
                                        </h2>
                                    </div>
                                </div>

                                <div className="mt-7">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.22em] text-white/35">
                                                Saved Addresses
                                            </p>

                                            <p className="mt-0.5 text-[8.5px] sm:text-[10px] text-white/25">
                                                Select where you want
                                                your order delivered.
                                            </p>
                                        </div>

                                        <Link
                                            to="/account"
                                            state={{
                                                from: "/checkout",
                                            }}
                                            className="text-[7.5px] sm:text-[8px] uppercase tracking-[0.16em] text-[#D4AF37] transition hover:text-[#E1C35B]"
                                        >
                                            Manage Addresses
                                        </Link>
                                    </div>

                                    {addressesLoading ? (
                                        <div className="mt-4 border border-white/10 bg-[#050505] p-4">
                                            <p className="text-xs text-white/30">
                                                Loading saved addresses...
                                            </p>
                                        </div>
                                    ) : savedAddresses.length ===
                                        0 ? (
                                        <div className="mt-4 border border-dashed border-white/10 bg-[#050505] p-5">
                                            <FiMapPin
                                                size={16}
                                                className="text-[#D4AF37]"
                                            />

                                            <p className="mt-3 text-sm text-white/60">
                                                No saved address yet.
                                            </p>

                                            <p className="mt-1 text-[10px] leading-5 text-white/25">
                                                Add a shipping address
                                                from your account before
                                                placing an order.
                                            </p>

                                            <Link
                                                to="/account"
                                                state={{
                                                    from: "/checkout",
                                                }}
                                                className="mt-4 inline-flex h-9 items-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 text-[8px] uppercase tracking-[0.16em] text-[#D4AF37] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[#D4AF37]/20"
                                            >
                                                Add Address
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="mt-3 sm:mt-4 grid gap-2.5 sm:gap-3 sm:grid-cols-2">
                                            {savedAddresses.map(
                                                (address) => {
                                                    const selected =
                                                        selectedAddressId ===
                                                        address.id

                                                    return (
                                                        <button
                                                            key={address.id}
                                                            type="button"
                                                            onClick={() =>
                                                                selectSavedAddress(
                                                                    address
                                                                )
                                                            }
                                                            className={`relative min-w-0 rounded-xl sm:rounded-2xl border p-3 sm:p-4 text-left backdrop-blur-md transition-all duration-300 ${selected
                                                                    ? "border-[#D4AF37]/70 bg-[#D4AF37]/[0.08] shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                                                                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                                                                }`}
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <p
                                                                            className={`text-[8px] uppercase tracking-[0.18em] ${selected
                                                                                    ? "text-[#D4AF37]"
                                                                                    : "text-white/40"
                                                                                }`}
                                                                        >
                                                                            {address.label ||
                                                                                "Address"}
                                                                        </p>

                                                                        {address.is_default && (
                                                                            <span className="border border-[#D4AF37]/20 px-2 py-1 text-[7px] uppercase tracking-[0.14em] text-[#D4AF37]">
                                                                                Default
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <p className="mt-1.5 sm:mt-2 break-words text-xs sm:text-sm font-medium text-white/80">
                                                                        {
                                                                            address.recipient_name
                                                                        }
                                                                    </p>

                                                                    <p className="mt-0.5 break-words text-[8.5px] sm:text-[10px] text-white/30">
                                                                        {
                                                                            address.phone
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <div
                                                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected
                                                                            ? "border-[#D4AF37] bg-[#D4AF37]"
                                                                            : "border-white/20"
                                                                        }`}
                                                                >
                                                                    {selected && (
                                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#050505]" />
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="mt-2.5 sm:mt-3 border-t border-white/10 pt-2 sm:pt-2.5">
                                                                <p className="break-words text-[8.5px] sm:text-[10px] leading-4 sm:leading-5 text-white/35">
                                                                    {
                                                                        address.address_line
                                                                    }
                                                                    {address.barangay
                                                                        ? `, ${address.barangay}`
                                                                        : ""}
                                                                </p>

                                                                <p className="break-words text-[10px] leading-5 text-white/35">
                                                                    {address.city},{" "}
                                                                    {
                                                                        address.province
                                                                    }
                                                                    {address.postal_code
                                                                        ? ` ${address.postal_code}`
                                                                        : ""}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    )
                                                }
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5">
                                    <p className="text-[9px] uppercase tracking-[0.22em] text-white/35">
                                        Delivery Region
                                    </p>

                                    <div className="mt-2 sm:mt-3 flex flex-col gap-2.5 sm:gap-3 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.025] p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-white/75">
                                                Standard Courier (SPX Express) · {shippingRegion}
                                            </p>

                                            <p className="mt-0.5 text-[8px] sm:text-[9px] leading-4 text-white/40">
                                                {isFreeShipping
                                                    ? "2+ Bottles Promo applied! Enjoy Free Shipping nationwide."
                                                    : "Flat ₱50 nationwide rate. Add 1 more bottle for Free Shipping!"}
                                            </p>
                                        </div>

                                        <div className="shrink-0 sm:text-right">
                                            <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.16em] text-white/25">
                                                Shipping Fee
                                            </p>

                                            {isFreeShipping ? (
                                                <div className="mt-1 flex items-center gap-2 sm:justify-end">
                                                    <span className="text-xs text-white/40 line-through">
                                                        ₱50.00
                                                    </span>
                                                    <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                                                        FREE
                                                    </span>
                                                </div>
                                            ) : (
                                                <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#D4AF37]">
                                                    ₱{formatPrice(shippingFee)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* PAYMENT */}
                            <section className="rounded-xl sm:rounded-2xl border border-white/[0.12] bg-[#0c0c0c]/85 p-3.5 sm:p-6 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
                                <div className="flex items-center gap-3">
                                    <FiCreditCard
                                        className="text-[#D4AF37]"
                                        size={17}
                                    />

                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]">
                                            Payment
                                        </p>

                                        <h2 className="mt-1 text-lg text-white">
                                            Payment Method
                                        </h2>
                                    </div>
                                </div>

                                <div className="mt-7">
                                    <label
                                        htmlFor="payment-method"
                                        className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-white/35"
                                    >
                                        Select Payment Method
                                    </label>

                                    <div className="relative">
                                        <select
                                            id="payment-method"
                                            value={paymentMethod}
                                            onChange={(event) =>
                                                setPaymentMethod(event.target.value)
                                            }
                                            className="h-9 sm:h-11 w-full appearance-none rounded-full sm:rounded-xl border border-white/10 bg-[#050505] px-4 pr-10 text-xs sm:text-sm text-white/75 outline-none transition focus:border-[#D4AF37]/60"
                                        >
                                            <option value="COD">
                                                Cash on Delivery
                                            </option>

                                            <option value="GCASH">
                                                GCash
                                            </option>

                                            <option value="MAYA">
                                                Maya
                                            </option>

                                            <option value="CARD">
                                                Credit / Debit Card
                                            </option>

                                            <option value="BANK">
                                                Online Banking
                                            </option>
                                        </select>

                                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#D4AF37]">
                                            ▼
                                        </div>
                                    </div>

                                    <div className="mt-2.5 sm:mt-3 rounded-xl border border-white/[0.07] bg-[#050505] px-3.5 py-2.5 sm:px-4 sm:py-3">
                                        <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.16em] text-white/25">
                                            Selected Method
                                        </p>

                                        <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#D4AF37]">
                                            {paymentMethod === "COD" &&
                                                "Cash on Delivery"}

                                            {paymentMethod === "GCASH" &&
                                                "GCash"}

                                            {paymentMethod === "MAYA" &&
                                                "Maya"}

                                            {paymentMethod === "CARD" &&
                                                "Credit / Debit Card"}

                                            {paymentMethod === "BANK" &&
                                                "Online Banking"}
                                        </p>
                                    </div>
                                </div>

                                {paymentMethod !== "COD" && (
                                    <div className="mt-3.5 sm:mt-5 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] px-3.5 py-2.5 sm:px-4 sm:py-3">
                                        <p className="text-[8.5px] sm:text-xs leading-4 sm:leading-5 text-white/35">
                                            Online payment will continue
                                            after the order has been
                                            created.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* SUMMARY */}
                        <aside>
                            <div className="sticky top-[96px] rounded-xl sm:rounded-2xl border border-white/[0.12] bg-[#0c0c0c]/85 p-3.5 sm:p-6 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
                                <div className="flex items-center gap-3">
                                    <FiPackage
                                        size={16}
                                        className="text-[#D4AF37]"
                                    />

                                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]">
                                        Order Summary
                                    </p>
                                </div>

                                <div className="mt-3.5 sm:mt-5 space-y-2.5 sm:space-y-4 border-b border-white/10 pb-3.5 sm:pb-5">
                                    {cart.items.map((item) => (
                                        <div
                                            key={
                                                item.cart_item_id
                                            }
                                            className="flex items-start justify-between gap-4"
                                        >
                                            <div>
                                                <p className="text-xs sm:text-sm font-medium text-white/80">
                                                    {item.name}
                                                </p>

                                                <p className="mt-0.5 text-[8px] sm:text-[10px] text-white/30">
                                                    Qty {item.quantity}
                                                </p>
                                            </div>

                                            <p className="text-[11px] sm:text-xs text-white/60 font-medium">
                                                ₱
                                                {formatPrice(
                                                    item.item_subtotal
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2.5 sm:space-y-3.5 border-b border-white/10 py-3 sm:py-5">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-white/35">
                                            Subtotal
                                        </span>

                                        <span className="text-white/65">
                                            ₱
                                            {formatPrice(
                                                cart.subtotal
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-white/35">
                                            Shipping
                                        </span>

                                        <span className="text-white/65">
                                            {isFreeShipping ? (
                                                <span className="font-medium text-emerald-400">
                                                    FREE
                                                </span>
                                            ) : (
                                                `₱${formatPrice(shippingFee)}`
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between py-3.5 sm:py-5">
                                    <div>
                                        <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                            Total
                                        </p>

                                        <p className="mt-1 text-[10px] text-white/25">
                                            Shipping included
                                        </p>
                                    </div>

                                    <p className="text-lg sm:text-2xl font-semibold text-[#D4AF37]">
                                        ₱
                                        {formatPrice(
                                            estimatedTotal
                                        )}
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={placingOrder}
                                    className="flex h-9 sm:h-11 w-full items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-[#FFE28A]/40 bg-[#D4AF37]/95 text-[8.5px] sm:text-[9px] font-semibold uppercase tracking-[0.2em] text-[#050505] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(212,175,55,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-[#E1C35B] hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Place Order
                                    <FiArrowRight size={14} />
                                </button>

                                <p className="mt-2.5 sm:mt-4 text-center text-[7.5px] sm:text-[9px] leading-4 sm:leading-5 text-white/25">
                                    By placing your order, you
                                    confirm your shipping and
                                    payment information.
                                </p>
                            </div>
                        </aside>
                    </form>
                </div>
            </main>
        </PublicLayout>
    )
}

export default Checkout