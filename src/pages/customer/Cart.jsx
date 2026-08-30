import { API_URL } from "../../config/api";
import { useEffect, useState } from "react"
import {
    Link,
    useNavigate,
} from "react-router-dom"
import { motion } from "motion/react"
import {
    FiArrowLeft,
    FiMinus,
    FiPlus,
    FiTrash2,
    FiShoppingBag,
    FiArrowRight,
} from "react-icons/fi"

import PublicLayout from "../../layouts/PublicLayout"
import BrandLoader from "../../components/BrandLoader"

import hommeImage from "../../assets/yocana-homme.png"
import femmeImage from "../../assets/yocana-femme.png"

function Cart() {
    const navigate = useNavigate()

    const [cart, setCart] = useState({
        items: [],
        total_items: 0,
        subtotal: "0.00",
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [updatingItem, setUpdatingItem] =
        useState(null)

    const [removingItem, setRemovingItem] =
        useState(null)

    const [loaderOpen, setLoaderOpen] =
        useState(false)

    const [loaderStatus, setLoaderStatus] =
        useState("loading")

    const [loaderMessage, setLoaderMessage] =
        useState("")

    const token =
        localStorage.getItem("yocana_token")

    const handleUnauthorized = () => {
        localStorage.removeItem("yocana_token")
        localStorage.removeItem("yocana_user")

        navigate("/login", {
            state: {
                from: "/cart",
            },
        })
    }

    const fetchCart = async () => {
        if (!token) {
            navigate("/login", {
                state: {
                    from: "/cart",
                },
            })

            return
        }

        try {
            setLoading(true)
            setError("")

            const response = await fetch(
                `${API_URL}/api/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                handleUnauthorized()
                return
            }

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Unable to load your cart"
                )
            }

            setCart(data.cart)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const getProductImage = (item) => {
        const category =
            item.category?.toLowerCase()

        const name =
            item.name?.toLowerCase()

        if (
            category === "women" ||
            name?.includes("femme")
        ) {
            return femmeImage
        }

        return hommeImage
    }

    const updateQuantity = async (
        item,
        newQuantity
    ) => {
        if (
            newQuantity < 1 ||
            newQuantity > Number(item.current_stock)
        ) {
            return
        }

        try {
            setUpdatingItem(item.cart_item_id)
            setError("")

            const response = await fetch(
                `${API_URL}/api/cart/items/${item.cart_item_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        quantity: newQuantity,
                    }),
                }
            )

            const data = await response.json()

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                handleUnauthorized()
                return
            }

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Unable to update quantity"
                )
            }

            await fetchCart()

            window.dispatchEvent(
                new Event("yocana-cart-updated")
            )
        } catch (err) {
            setError(err.message)
        } finally {
            setUpdatingItem(null)
        }
    }

    const removeItem = async (item) => {
        try {
            setRemovingItem(item.cart_item_id)
            setError("")

            setLoaderStatus("loading")
            setLoaderMessage("Removing from cart")
            setLoaderOpen(true)

            const response = await fetch(
                `${API_URL}/api/cart/items/${item.cart_item_id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                setLoaderOpen(false)
                handleUnauthorized()
                return
            }

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Unable to remove product"
                )
            }

            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            )

            setLoaderStatus("success")
            setLoaderMessage("Removed from cart")

            await fetchCart()

            window.dispatchEvent(
                new Event("yocana-cart-updated")
            )

            setTimeout(() => {
                setLoaderOpen(false)
            }, 1100)
        } catch (err) {
            setLoaderOpen(false)
            setError(err.message)
        } finally {
            setRemovingItem(null)
        }
    }

    const formatPrice = (value) => {
        return Number(value || 0).toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )
    }

    if (loading) {
        return (
            <PublicLayout>
                <div className="flex min-h-screen items-center justify-center bg-[#050505] px-5 pt-[72px]">
                    <div className="text-center">
                        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-[#D4AF37]" />

                        <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-white/30">
                            Loading your cart
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

                    {/* BACK */}
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/35 transition hover:text-[#D4AF37]"
                    >
                        <FiArrowLeft size={14} />
                        Continue Shopping
                    </Link>

                    {/* TITLE */}
                    <div className="mt-8 border-b border-white/10 pb-7">
                        <p className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37]">
                            Your Selection
                        </p>

                        <div className="mt-3 flex items-end justify-between gap-4">
                            <h1 className="text-4xl font-medium tracking-[-0.04em] text-[#F5F5F5] sm:text-5xl">
                                Shopping Cart
                            </h1>

                            <p className="hidden text-xs text-white/35 sm:block">
                                {cart.total_items}{" "}
                                {Number(cart.total_items) === 1
                                    ? "item"
                                    : "items"}
                            </p>
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mt-6 border border-red-500/20 bg-red-500/[0.04] px-4 py-3">
                            <p className="text-xs text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* EMPTY CART */}
                    {cart.items.length === 0 ? (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 12,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="flex min-h-[500px] flex-col items-center justify-center text-center"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.03]">
                                <FiShoppingBag
                                    size={24}
                                    className="text-[#D4AF37]"
                                />
                            </div>

                            <h2 className="mt-6 text-2xl font-medium text-[#F5F5F5]">
                                Your cart is empty.
                            </h2>

                            <p className="mt-3 max-w-sm text-sm leading-6 text-white/35">
                                Discover your signature scent and
                                add it to your collection.
                            </p>

                            <Link
                                to="/shop"
                                className="mt-7 inline-flex h-12 items-center justify-center gap-2 bg-[#D4AF37] px-6 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#050505] transition hover:bg-[#E1C35B]"
                            >
                                Explore Collection
                                <FiArrowRight size={14} />
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">

                            {/* CART ITEMS */}
                            <div className="space-y-4">
                                {cart.items.map(
                                    (item, index) => {
                                        const productImage =
                                            getProductImage(item)

                                        const maxStock =
                                            Number(
                                                item.current_stock || 0
                                            )

                                        const isUpdating =
                                            updatingItem ===
                                            item.cart_item_id

                                        const isRemoving =
                                            removingItem ===
                                            item.cart_item_id

                                        return (
                                            <motion.div
                                                key={
                                                    item.cart_item_id
                                                }
                                                initial={{
                                                    opacity: 0,
                                                    y: 12,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: index * 0.05,
                                                }}
                                                className="group border border-white/10 bg-[#070707]"
                                            >
                                                <div className="grid grid-cols-[100px_1fr] gap-4 p-4 sm:grid-cols-[135px_1fr] sm:p-5">

                                                    {/* IMAGE */}
                                                    <Link
                                                        to={`/product/${item.product_id}`}
                                                        className="relative flex min-h-[130px] items-center justify-center overflow-hidden bg-[#0A0A0A] sm:min-h-[160px]"
                                                    >
                                                        <div className="absolute h-24 w-24 rounded-full bg-[#D4AF37]/5 blur-[45px]" />

                                                        <img
                                                            src={
                                                                productImage
                                                            }
                                                            alt={item.name}
                                                            className="relative z-10 w-[90px] object-contain transition duration-500 group-hover:scale-[1.04] sm:w-[120px]"
                                                            draggable="false"
                                                        />
                                                    </Link>

                                                    {/* INFO */}
                                                    <div className="flex min-w-0 flex-col justify-between py-1">
                                                        <div>
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div>
                                                                    <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
                                                                        {
                                                                            item.category
                                                                        }{" "}
                                                                        · Eau De
                                                                        Parfum
                                                                    </p>

                                                                    <Link
                                                                        to={`/product/${item.product_id}`}
                                                                        className="mt-2 block text-lg font-medium text-[#F5F5F5] transition hover:text-[#D4AF37] sm:text-xl"
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Link>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeItem(
                                                                            item
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isRemoving
                                                                    }
                                                                    className="flex h-8 w-8 shrink-0 items-center justify-center text-white/25 transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                                                                    aria-label={`Remove ${item.name}`}
                                                                >
                                                                    <FiTrash2
                                                                        size={15}
                                                                    />
                                                                </button>
                                                            </div>

                                                            <p className="mt-2 text-[10px] text-white/30">
                                                                {item.size_ml ||
                                                                    50}{" "}
                                                                ML
                                                            </p>
                                                        </div>

                                                        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">

                                                            {/* QUANTITY */}
                                                            <div>
                                                                <p className="mb-2 text-[8px] uppercase tracking-[0.25em] text-white/25">
                                                                    Quantity
                                                                </p>

                                                                <div className="flex h-10 w-[105px] items-center border border-white/10">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            updateQuantity(
                                                                                item,
                                                                                Number(
                                                                                    item.quantity
                                                                                ) - 1
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            Number(
                                                                                item.quantity
                                                                            ) <= 1 ||
                                                                            isUpdating
                                                                        }
                                                                        className="flex h-full w-8 items-center justify-center text-white/45 transition hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-25"
                                                                    >
                                                                        <FiMinus
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    </button>

                                                                    <div className="flex flex-1 items-center justify-center text-xs text-white">
                                                                        {isUpdating
                                                                            ? "..."
                                                                            : item.quantity}
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            updateQuantity(
                                                                                item,
                                                                                Number(
                                                                                    item.quantity
                                                                                ) + 1
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            Number(
                                                                                item.quantity
                                                                            ) >=
                                                                            maxStock ||
                                                                            isUpdating
                                                                        }
                                                                        className="flex h-full w-8 items-center justify-center text-white/45 transition hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-25"
                                                                    >
                                                                        <FiPlus
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>

                                                                <p className="mt-2 text-[8px] text-white/20">
                                                                    {
                                                                        maxStock
                                                                    }{" "}
                                                                    available
                                                                </p>
                                                            </div>

                                                            {/* PRICE */}
                                                            <div className="text-right">
                                                                <p className="text-[9px] text-white/25">
                                                                    ₱
                                                                    {formatPrice(
                                                                        item.price
                                                                    )}{" "}
                                                                    each
                                                                </p>

                                                                <p className="mt-1 text-lg font-medium text-[#D4AF37]">
                                                                    ₱
                                                                    {formatPrice(
                                                                        item.item_subtotal
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    }
                                )}
                            </div>

                            {/* ORDER SUMMARY */}
                            <div>
                                <div className="sticky top-[96px] border border-white/10 bg-[#080808] p-6 sm:p-7">
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]">
                                        Order Summary
                                    </p>

                                    <div className="mt-6 space-y-4 border-b border-white/10 pb-6">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-white/35">
                                                Items
                                            </span>

                                            <span className="text-white/65">
                                                {
                                                    cart.total_items
                                                }
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
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

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-white/35">
                                                Shipping
                                            </span>

                                            <span className="text-[10px] uppercase tracking-[0.12em] text-white/25">
                                                Calculated at
                                                checkout
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between py-6">
                                        <div>
                                            <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                                                Estimated Total
                                            </p>

                                            <p className="mt-1 text-xs text-white/25">
                                                Before shipping
                                            </p>
                                        </div>

                                        <p className="text-2xl font-medium text-[#D4AF37]">
                                            ₱
                                            {formatPrice(
                                                cart.subtotal
                                            )}
                                        </p>
                                    </div>

                                    <Link
                                        to="/checkout"
                                        className="flex h-12 w-full items-center justify-center gap-2 bg-[#D4AF37] text-[9px] font-semibold uppercase tracking-[0.2em] text-[#050505] transition hover:bg-[#E1C35B]"
                                    >
                                        Proceed to Checkout
                                        <FiArrowRight size={14} />
                                    </Link>

                                    <p className="mt-4 text-center text-[9px] leading-5 text-white/20">
                                        Shipping fee and payment
                                        method will be confirmed
                                        during checkout.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </PublicLayout>
    )
}

export default Cart
