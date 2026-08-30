import { API_URL } from "../../config/api";
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

    const shippingFee =
        shippingRegion === "Metro Manila"
            ? 100
            : 180

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
                    navigate("/cart")
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

                const addresses = data.addresses || []

                setSavedAddresses(addresses)

                const defaultAddress =
                    addresses.find(
                        (address) => address.is_default
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

            // ========================================
            // CREATE ORDER
            // ========================================
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

            // ========================================
            // COD
            // ========================================
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

            // ========================================
            // ONLINE PAYMENT
            // ========================================
            setLoaderMessage("Preparing payment")

            const paymentResponse = await apiFetch(
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

                navigate(`/payment/${createdOrder.id}`)
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

            <main className="min-h-screen bg-[#050505] px-5 pb-20 pt-24 md:px-8 md:pb-28 md:pt-28">
                <div className="mx-auto max-w-7xl">

                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/35 transition hover:text-[#D4AF37]"
                    >
                        <FiArrowLeft size={14} />
                        Back to Cart
                    </Link>

                    <div className="mt-8 border-b border-white/10 pb-7">
                        <p className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37]">
                            Complete Your Order
                        </p>

                        <h1 className="mt-3 text-4xl font-medium tracking-[-0.04em] text-[#F5F5F5] sm:text-5xl">
                            Checkout
                        </h1>
                    </div>

                    {error && (
                        <div className="mt-6 border border-red-500/20 bg-red-500/[0.04] px-4 py-3">
                            <p className="text-xs text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={handlePlaceOrder}
                        className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_370px] lg:gap-12"
                    >
                        <div className="space-y-6">

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
                                className="border border-white/10 bg-[#080808] p-5 sm:p-7"
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

                                            <p className="mt-1 text-[10px] text-white/20">
                                                Select where you want your order delivered.
                                            </p>
                                        </div>

                                        <Link
                                            to="/account"
                                            state={{ from: "/checkout" }}
                                            className="text-[8px] uppercase tracking-[0.18em] text-[#D4AF37] transition hover:text-[#E1C35B]"
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
                                    ) : savedAddresses.length === 0 ? (
                                        <div className="mt-4 border border-dashed border-white/10 bg-[#050505] p-5">
                                            <FiMapPin
                                                size={16}
                                                className="text-[#D4AF37]"
                                            />

                                            <p className="mt-3 text-sm text-white/60">
                                                No saved address yet.
                                            </p>

                                            <p className="mt-1 text-[10px] leading-5 text-white/25">
                                                Add a shipping address from your account
                                                before placing an order.
                                            </p>

                                            <Link
                                                to="/account"
                                                state={{ from: "/checkout" }}
                                                className="mt-4 inline-flex h-9 items-center border border-[#D4AF37]/25 px-3 text-[8px] uppercase tracking-[0.16em] text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.05]"
                                            >
                                                Add Address
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            {savedAddresses.map((address) => {
                                                const selected =
                                                    selectedAddressId === address.id

                                                return (
                                                    <button
                                                        key={address.id}
                                                        type="button"
                                                        onClick={() =>
                                                            selectSavedAddress(address)
                                                        }
                                                        className={`relative min-w-0 border p-4 text-left transition ${selected
                                                            ? "border-[#D4AF37]/60 bg-[#D4AF37]/[0.05]"
                                                            : "border-white/10 bg-[#050505] hover:border-white/20"
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
                                                                        {address.label || "Address"}
                                                                    </p>

                                                                    {address.is_default && (
                                                                        <span className="border border-[#D4AF37]/20 px-2 py-1 text-[7px] uppercase tracking-[0.14em] text-[#D4AF37]">
                                                                            Default
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <p className="mt-3 break-words text-sm font-medium text-white/70">
                                                                    {address.recipient_name}
                                                                </p>

                                                                <p className="mt-1 break-words text-[10px] text-white/30">
                                                                    {address.phone}
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

                                                        <div className="mt-4 border-t border-white/10 pt-3">
                                                            <p className="break-words text-[10px] leading-5 text-white/35">
                                                                {address.address_line}
                                                                {address.barangay
                                                                    ? `, ${address.barangay}`
                                                                    : ""}
                                                            </p>

                                                            <p className="break-words text-[10px] leading-5 text-white/35">
                                                                {address.city},{" "}
                                                                {address.province}
                                                                {address.postal_code
                                                                    ? ` ${address.postal_code}`
                                                                    : ""}
                                                            </p>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5">
                                    <p className="text-[9px] uppercase tracking-[0.22em] text-white/35">
                                        Delivery Region
                                    </p>

                                    <div className="mt-3 flex flex-col gap-3 border border-[#D4AF37]/20 bg-[#D4AF37]/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-white/75">
                                                {shippingRegion}
                                            </p>

                                            <p className="mt-1 text-[9px] leading-4 text-white/25">
                                                Automatically determined from your selected shipping address.
                                            </p>
                                        </div>

                                        <div className="shrink-0 sm:text-right">
                                            <p className="text-[8px] uppercase tracking-[0.16em] text-white/25">
                                                Shipping Fee
                                            </p>

                                            <p className="mt-1 text-sm text-[#D4AF37]">
                                                ₱{formatPrice(shippingFee)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* PAYMENT */}
                            <section className="border border-white/10 bg-[#080808] p-5 sm:p-7">
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

                                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {[
                                        {
                                            value: "COD",
                                            label:
                                                "Cash on Delivery",
                                        },
                                        {
                                            value: "GCASH",
                                            label: "GCash",
                                        },
                                        {
                                            value: "MAYA",
                                            label: "Maya",
                                        },
                                        {
                                            value: "CARD",
                                            label:
                                                "Credit / Debit Card",
                                        },
                                        {
                                            value: "BANK",
                                            label:
                                                "Online Banking",
                                        },
                                    ].map((method) => (
                                        <button
                                            key={method.value}
                                            type="button"
                                            onClick={() =>
                                                setPaymentMethod(
                                                    method.value
                                                )
                                            }
                                            className={`border px-4 py-4 text-left transition ${paymentMethod ===
                                                method.value
                                                ? "border-[#D4AF37]/60 bg-[#D4AF37]/[0.05]"
                                                : "border-white/10 hover:border-white/20"
                                                }`}
                                        >
                                            <p className="text-sm text-white">
                                                {method.label}
                                            </p>

                                            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/25">
                                                {method.value}
                                            </p>
                                        </button>
                                    ))}
                                </div>

                                {paymentMethod !== "COD" && (
                                    <div className="mt-5 border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] px-4 py-3">
                                        <p className="text-xs leading-5 text-white/35">
                                            Online payment will
                                            continue after the order
                                            has been created.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* SUMMARY */}
                        <aside>
                            <div className="sticky top-[96px] border border-white/10 bg-[#080808] p-6 sm:p-7">
                                <div className="flex items-center gap-3">
                                    <FiPackage
                                        size={16}
                                        className="text-[#D4AF37]"
                                    />

                                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]">
                                        Order Summary
                                    </p>
                                </div>

                                <div className="mt-6 space-y-4 border-b border-white/10 pb-6">
                                    {cart.items.map((item) => (
                                        <div
                                            key={item.cart_item_id}
                                            className="flex items-start justify-between gap-4"
                                        >
                                            <div>
                                                <p className="text-sm text-white/70">
                                                    {item.name}
                                                </p>

                                                <p className="mt-1 text-[10px] text-white/25">
                                                    Qty {item.quantity}
                                                </p>
                                            </div>

                                            <p className="text-xs text-white/55">
                                                ₱
                                                {formatPrice(
                                                    item.item_subtotal
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 border-b border-white/10 py-6">
                                    <div className="flex justify-between text-sm">
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

                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/35">
                                            Shipping
                                        </span>

                                        <span className="text-white/65">
                                            ₱
                                            {formatPrice(
                                                shippingFee
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between py-6">
                                    <div>
                                        <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                            Total
                                        </p>

                                        <p className="mt-1 text-[10px] text-white/25">
                                            Shipping included
                                        </p>
                                    </div>

                                    <p className="text-2xl font-medium text-[#D4AF37]">
                                        ₱
                                        {formatPrice(
                                            estimatedTotal
                                        )}
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={placingOrder}
                                    className="flex h-12 w-full items-center justify-center gap-2 bg-[#D4AF37] text-[9px] font-semibold uppercase tracking-[0.2em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Place Order
                                    <FiArrowRight size={14} />
                                </button>

                                <p className="mt-4 text-center text-[9px] leading-5 text-white/20">
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
