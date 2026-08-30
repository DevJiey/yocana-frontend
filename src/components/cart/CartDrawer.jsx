import { API_URL } from "../../config/api"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AnimatePresence,
  motion,
} from "motion/react"

import {
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiX,
  FiArrowRight,
} from "react-icons/fi"

import hommeImage from "../../assets/yocana-homme.png"
import femmeImage from "../../assets/yocana-femme.png"

function CartDrawer({
  open,
  onClose,
}) {
  const navigate = useNavigate()

  const [cart, setCart] = useState({
    items: [],
    total_items: 0,
    subtotal: "0.00",
  })

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [updatingItem, setUpdatingItem] =
    useState(null)

  const [removingItem, setRemovingItem] =
    useState(null)

  const token =
    localStorage.getItem("yocana_token")

  /* ========================= */
  /* FORMAT PRICE */
  /* ========================= */

  const formatPrice = (value) => {
    return Number(value || 0).toLocaleString(
      "en-PH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )
  }

  /* ========================= */
  /* PRODUCT IMAGE */
  /* ========================= */

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

  /* ========================= */
  /* UNAUTHORIZED */
  /* ========================= */

  const handleUnauthorized = () => {
    localStorage.removeItem("yocana_token")
    localStorage.removeItem("yocana_user")

    onClose()

    navigate("/login", {
      state: {
        from:
          window.location.pathname +
          window.location.search,
      },
    })
  }

  /* ========================= */
  /* FETCH CART */
  /* ========================= */

  const fetchCart = async () => {
    if (!token) {
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      const data =
        await response.json()

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorized()
        return
      }

      if (
        !response.ok ||
        !data.success
      ) {
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

  /* ========================= */
  /* OPEN DRAWER */
  /* ========================= */

  useEffect(() => {
    if (!open) {
      return
    }

    if (!token) {
      onClose()

      navigate("/login", {
        state: {
          from:
            window.location.pathname +
            window.location.search,
        },
      })

      return
    }

    fetchCart()
  }, [open])

  /* ========================= */
  /* CART UPDATE EVENT */
  /* ========================= */

  useEffect(() => {
    const handleCartUpdated = () => {
      if (open && token) {
        fetchCart()
      }
    }

    window.addEventListener(
      "yocana-cart-updated",
      handleCartUpdated
    )

    return () => {
      window.removeEventListener(
        "yocana-cart-updated",
        handleCartUpdated
      )
    }
  }, [open])

  /* ========================= */
  /* BODY SCROLL */
  /* ========================= */

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      "hidden"

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [open])

  /* ========================= */
  /* ESCAPE KEY */
  /* ========================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        open
      ) {
        onClose()
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    )

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      )
    }
  }, [open, onClose])

  /* ========================= */
  /* UPDATE QUANTITY */
  /* ========================= */

  const updateQuantity = async (
    item,
    newQuantity
  ) => {
    const maxStock =
      Number(item.current_stock || 0)

    if (
      newQuantity < 1 ||
      newQuantity > maxStock
    ) {
      return
    }

    try {
      setUpdatingItem(
        item.cart_item_id
      )

      setError("")

      const response = await fetch(
        `${API_URL}/api/cart/items/${item.cart_item_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      )

      const data =
        await response.json()

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorized()
        return
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to update quantity"
        )
      }

      await fetchCart()

      window.dispatchEvent(
        new Event(
          "yocana-cart-updated"
        )
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingItem(null)
    }
  }

  /* ========================= */
  /* REMOVE ITEM */
  /* ========================= */

  const removeItem = async (item) => {
    try {
      setRemovingItem(
        item.cart_item_id
      )

      setError("")

      const response = await fetch(
        `${API_URL}/api/cart/items/${item.cart_item_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      const data =
        await response.json()

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorized()
        return
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to remove product"
        )
      }

      await fetchCart()

      window.dispatchEvent(
        new Event(
          "yocana-cart-updated"
        )
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setRemovingItem(null)
    }
  }

  /* ========================= */
  /* CHECKOUT */
  /* ========================= */

  const handleCheckout = () => {
    onClose()
    navigate("/checkout")
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* OVERLAY */}
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={onClose}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="fixed inset-0 z-[80] cursor-default bg-black/65 backdrop-blur-[2px]"
          />

          {/* DRAWER */}
          <motion.aside
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              type: "tween",
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed right-0 top-0 z-[90] flex h-[100dvh] max-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden border-l border-white/10 bg-[#080808] shadow-[-25px_0_80px_rgba(0,0,0,0.45)]">
            {/* HEADER */}
            <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/10 px-5 sm:px-6">
              <div className="flex items-center gap-3">
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/75">
                  Your Cart
                </p>

                {cart.total_items > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D4AF37] px-1.5 text-[8px] font-semibold text-[#050505]">
                    {cart.total_items}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center text-white/35 transition hover:text-[#D4AF37]"
                aria-label="Close cart"
              >
                <FiX size={19} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="min-h-0 flex-1 overflow-y-auto">

              {/* LOADING */}
              {loading && (
                <div className="flex min-h-[360px] flex-col items-center justify-center px-5">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#D4AF37]" />

                  <p className="mt-4 text-[8px] uppercase tracking-[0.25em] text-white/25">
                    Loading your cart
                  </p>
                </div>
              )}

              {/* ERROR */}
              {!loading && error && (
                <div className="m-5 border border-red-500/20 bg-red-500/[0.04] px-4 py-3">
                  <p className="text-[10px] leading-5 text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* EMPTY CART */}
              {!loading &&
                cart.items.length === 0 && (
                  <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.03]">
                      <FiShoppingBag
                        size={21}
                        className="text-[#D4AF37]"
                      />
                    </div>

                    <h2 className="mt-5 text-lg font-medium text-white">
                      Your cart is empty.
                    </h2>

                    <p className="mt-2 max-w-[260px] text-xs leading-5 text-white/30">
                      Discover your signature
                      scent and add it to your
                      collection.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        navigate("/shop")
                      }}
                      className="mt-6 border border-[#D4AF37]/30 px-5 py-3 text-[8px] uppercase tracking-[0.2em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-[#050505]"
                    >
                      Explore Collection
                    </button>
                  </div>
                )}

              {/* ITEMS */}
              {!loading &&
                cart.items.length > 0 && (
                  <div className="divide-y divide-white/[0.07] px-5 sm:px-6">
                    {cart.items.map(
                      (item) => {
                        const productImage =
                          getProductImage(
                            item
                          )

                        const maxStock =
                          Number(
                            item.current_stock ||
                              0
                          )

                        const isUpdating =
                          updatingItem ===
                          item.cart_item_id

                        const isRemoving =
                          removingItem ===
                          item.cart_item_id

                        return (
                          <div
                            key={
                              item.cart_item_id
                            }
                            className="py-5"
                          >
                            <div className="flex gap-4">

                              {/* IMAGE */}
                              <button
                                type="button"
                                onClick={() => {
                                  onClose()

                                  navigate(
                                    `/product/${item.product_id}`
                                  )
                                }}
                                className="relative flex h-[100px] w-[82px] shrink-0 items-center justify-center overflow-hidden bg-[#0D0D0D]"
                              >
                                <div className="absolute h-16 w-16 rounded-full bg-[#D4AF37]/5 blur-2xl" />

                                <img
                                  src={
                                    productImage
                                  }
                                  alt={
                                    item.name
                                  }
                                  className="relative z-10 max-h-[82px] max-w-[68px] object-contain"
                                  draggable="false"
                                />
                              </button>

                              {/* DETAILS */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-[7px] uppercase tracking-[0.22em] text-[#D4AF37]">
                                      {item.category} ·
                                      Eau De Parfum
                                    </p>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        onClose()

                                        navigate(
                                          `/product/${item.product_id}`
                                        )
                                      }}
                                      className="mt-1.5 block max-w-full truncate text-left text-sm font-medium text-white transition hover:text-[#D4AF37]"
                                    >
                                      {
                                        item.name
                                      }
                                    </button>

                                    <p className="mt-1 text-[9px] text-white/25">
                                      {item.size_ml ||
                                        50}{" "}
                                      ML
                                    </p>
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
                                    className="flex h-8 w-8 shrink-0 items-center justify-center text-white/20 transition hover:text-red-400 disabled:opacity-30"
                                    aria-label={`Remove ${item.name}`}
                                  >
                                    <FiTrash2
                                      size={14}
                                    />
                                  </button>
                                </div>

                                <div className="mt-4 flex items-end justify-between gap-3">

                                  {/* QUANTITY */}
                                  <div className="flex h-9 items-center border border-white/10">
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
                                      className="flex h-full w-8 items-center justify-center text-white/40 transition hover:text-[#D4AF37] disabled:opacity-20"
                                    >
                                      <FiMinus
                                        size={11}
                                      />
                                    </button>

                                    <div className="flex h-full min-w-[34px] items-center justify-center text-[10px] text-white/70">
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
                                      className="flex h-full w-8 items-center justify-center text-white/40 transition hover:text-[#D4AF37] disabled:opacity-20"
                                    >
                                      <FiPlus
                                        size={11}
                                      />
                                    </button>
                                  </div>

                                  {/* PRICE */}
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-[#D4AF37]">
                                      ₱
                                      {formatPrice(
                                        item.item_subtotal
                                      )}
                                    </p>

                                    <p className="mt-1 text-[8px] text-white/20">
                                      ₱
                                      {formatPrice(
                                        item.price
                                      )}{" "}
                                      each
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    )}
                  </div>
                )}
            </div>

            {/* FOOTER */}
            {!loading &&
              cart.items.length > 0 && (
                <div className="shrink-0 border-t border-white/10 bg-[#080808] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-6">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <p className="text-[7px] uppercase tracking-[0.2em] text-white/25">
                        Estimated Total
                      </p>

                      <p className="mt-1 text-[9px] text-white/20">
                        Shipping calculated at
                        checkout
                      </p>
                    </div>

                    <p className="text-xl font-medium text-[#D4AF37]">
                      ₱
                      {formatPrice(
                        cart.subtotal
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-[#D4AF37] text-[8px] font-semibold uppercase tracking-[0.2em] text-[#050505] transition hover:bg-[#E1C35B]"
                  >
                    Checkout
                    <FiArrowRight
                      size={13}
                    />
                  </button>
                </div>
              )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer