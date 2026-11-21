import { API_URL } from "../../config/api";
import { useEffect, useRef, useState } from "react"
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"
import { motion } from "motion/react"
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiZap,
} from "react-icons/fi"

import PublicLayout from "../../layouts/PublicLayout"
import BrandLoader from "../../components/BrandLoader"
import hommeImage from "../../assets/yocana-homme.png"
import femmeImage from "../../assets/yocana-femme.png"

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [cartOverlay, setCartOverlay] = useState(false)
  const [cartStatus, setCartStatus] = useState("loading")
  const [cartError, setCartError] = useState("")
  const productImageRef = useRef(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `${API_URL}/api/products/${id}`
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load product"
          )
        }

        setProduct(data.product)
        setQuantity(1)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const stock = Number(product?.current_stock || 0)

  const isInStock =
    product?.in_stock === true && stock > 0

  const increaseQuantity = () => {
    if (!isInStock) return

    setQuantity((current) =>
      current < stock ? current + 1 : current
    )
  }

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    )
  }

  const animateProductToCart = () => {
    const productElement = productImageRef.current

    const cartElement = document.getElementById(
      "yocana-cart-target"
    )

    if (!productElement || !cartElement) return

    const productRect =
      productElement.getBoundingClientRect()

    const cartRect =
      cartElement.getBoundingClientRect()

    const flyingImage =
      productElement.cloneNode(true)

    const startWidth = Math.min(
      productRect.width,
      120
    )

    flyingImage.removeAttribute("style")

    Object.assign(flyingImage.style, {
      position: "fixed",
      zIndex: "9999",

      left: `${productRect.left +
        productRect.width / 2 -
        startWidth / 2
        }px`,

      top: `${productRect.top +
        productRect.height / 2 -
        startWidth / 2
        }px`,

      width: `${startWidth}px`,
      height: `${startWidth}px`,

      objectFit: "contain",
      pointerEvents: "none",

      filter:
        "drop-shadow(0 18px 25px rgba(0,0,0,0.7))",

      transition:
        "left 850ms cubic-bezier(0.4,0,0.2,1), top 850ms cubic-bezier(0.4,0,0.2,1), width 850ms ease, height 850ms ease, opacity 850ms ease, transform 850ms ease",

      opacity: "1",
      transform: "rotate(0deg) scale(1)",
    })

    document.body.appendChild(flyingImage)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flyingImage.style.left = `${cartRect.left +
          cartRect.width / 2 -
          12
          }px`

        flyingImage.style.top = `${cartRect.top +
          cartRect.height / 2 -
          12
          }px`

        flyingImage.style.width = "24px"
        flyingImage.style.height = "24px"
        flyingImage.style.opacity = "0.25"

        flyingImage.style.transform =
          "rotate(12deg) scale(0.35)"
      })
    })

    setTimeout(() => {
      flyingImage.remove()
    }, 900)
  }

  const addProductToCart = async () => {
    const token = localStorage.getItem("yocana_token")

    if (!token) {
      navigate("/login", {
        state: {
          from: location.pathname,
        },
      })

      return false
    }

    const response = await fetch(
      `${API_URL}/api/cart/items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: Number(product.id),
          quantity,
        }),
      }
    )

    const data = await response.json()

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      localStorage.removeItem("yocana_token")
      localStorage.removeItem("yocana_user")

      navigate("/login", {
        state: {
          from: location.pathname,
        },
      })

      return false
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to add product to cart"
      )
    }

    return true
  }

  const handleAddToCart = async () => {
    const token = localStorage.getItem("yocana_token")

    if (!token) {
      navigate("/login", {
        state: {
          from: location.pathname,
        },
      })
      return
    }

    try {
      setCartError("")
      setCartStatus("loading")
      setCartOverlay(true)

      const response = await fetch(
        `${API_URL}/api/cart/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: Number(product.id),
            quantity,
          }),
        }
      )

      const data = await response.json()

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        setCartOverlay(false)

        localStorage.removeItem("yocana_token")
        localStorage.removeItem("yocana_user")

        navigate("/login", {
          state: {
            from: location.pathname,
          },
        })

        return
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "Unable to add product to cart"
        )
      }

      // Keep the loading state visible briefly
      // so the transition feels intentional.
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      )

      setCartStatus("success")

      setTimeout(() => {
        setCartOverlay(false)

        animateProductToCart()

        setTimeout(() => {
          window.dispatchEvent(
            new Event("yocana-cart-updated")
          )
        }, 650)
      }, 700)
    } catch (err) {
      setCartOverlay(false)
      setCartError(err.message)
    }
  }

  const handleBuyNow = async () => {
    try {
      setCartError("")
      setCartStatus("loading")
      setCartOverlay(true)

      const added = await addProductToCart()

      if (!added) {
        setCartOverlay(false)
        return
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      )

      setCartStatus("success")

      window.dispatchEvent(
        new Event("yocana-cart-updated")
      )

      setTimeout(() => {
        setCartOverlay(false)
        navigate("/checkout")
      }, 900)
    } catch (err) {
      setCartOverlay(false)
      setCartError(err.message)
    }
  }

  const getProductImage = () => {
    if (!product) return hommeImage

    const category =
      product.category?.toLowerCase()

    const name =
      product.name?.toLowerCase()

    if (
      category === "women" ||
      name?.includes("femme")
    ) {
      return femmeImage
    }

    return hommeImage
  }

  const getGlow = () => {
    if (!product) {
      return "rgba(0, 119, 255, 0.22)"
    }

    const category =
      product.category?.toLowerCase()

    const name =
      product.name?.toLowerCase()

    if (
      category === "women" ||
      name?.includes("femme")
    ) {
      return "rgba(220, 20, 35, 0.24)"
    }

    return "rgba(0, 119, 255, 0.24)"
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex min-h-screen items-center justify-center bg-[#050505] px-5 pt-[72px]">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-[#D4AF37]" />

            <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-white/30">
              Loading fragrance
            </p>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (error || !product) {
    return (
      <PublicLayout>
        <div className="flex min-h-screen items-center justify-center bg-[#050505] px-5 pt-[72px]">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">
              Product unavailable
            </p>

            <h1 className="mt-4 text-3xl text-[#F5F5F5]">
              We couldn't find this fragrance.
            </h1>

            <p className="mt-3 text-sm text-white/35">
              {error}
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37]"
            >
              <FiArrowLeft size={14} />
              Back to Collection
            </Link>
          </div>
        </div>
      </PublicLayout>
    )
  }

  const productImage = getProductImage()
  const glow = getGlow()

  return (
    <PublicLayout>

      {/* CART LOADING / SUCCESS */}
      <BrandLoader
        show={cartOverlay}
        status={cartStatus}
        message={
          cartStatus === "loading"
            ? "Adding to your cart"
            : "Added to your cart"
        }
      />

      <main className="min-h-screen bg-[#050505] px-4 pb-14 pt-20 sm:px-6 sm:pb-20 sm:pt-24 md:px-8 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-7xl">

          <Link
            to="/shop"
            className="mb-4 sm:mb-7 inline-flex items-center gap-1.5 text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-white/40 transition hover:text-[#D4AF37]"
          >
            <FiArrowLeft size={14} />
            Back to Collection
          </Link>

          <div className="grid grid-cols-1 gap-5 sm:gap-8 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16">

            {/* PRODUCT IMAGE */}
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
              }}
              className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border border-white/[0.12] bg-[#0c0c0c]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl sm:min-h-[400px] md:min-h-[540px]"
            >
              <div
                className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[45px] sm:blur-[70px] sm:h-[260px] sm:w-[260px] md:h-[390px] md:w-[390px]"
                style={{
                  background: glow,
                }}
              />

              <div className="absolute h-[150px] w-[150px] rounded-full border border-[#D4AF37]/10 sm:h-[280px] sm:w-[280px] md:h-[440px] md:w-[440px]" />

              <div className="absolute h-[115px] w-[115px] rounded-full border border-white/[0.04] sm:h-[220px] sm:w-[220px] md:h-[350px] md:w-[350px]" />

              <motion.img
                ref={productImageRef}
                src={productImage}
                alt={product.name}
                animate={{
                  y: [0, -9, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 h-auto w-[125px] select-none object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] sm:w-[240px] md:w-[380px]"
                draggable="false"
              />

              <div
                className="absolute bottom-[35px] sm:bottom-[70px] left-1/2 h-[4px] sm:h-[5px] w-[95px] sm:w-[190px] -translate-x-1/2 rounded-full blur-[6px] sm:blur-[9px]"
                style={{
                  background: glow,
                }}
              />

              <div className="absolute bottom-[28px] sm:bottom-[58px] left-1/2 h-[12px] sm:h-[20px] w-[120px] sm:w-[190px] -translate-x-1/2 rounded-full bg-black/90 blur-lg sm:blur-xl" />
            </motion.div>

            {/* PRODUCT INFO */}
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                delay: 0.08,
              }}
              className="md:py-8"
            >
              <p className="text-[7.5px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#D4AF37]">
                {product.category} · Eau De Parfum
              </p>

              <h1 className="mt-1.5 sm:mt-4 text-2xl font-medium tracking-tight text-[#F5F5F5] sm:text-4xl md:text-5xl lg:text-6xl">
                {product.name}
              </h1>

              <div className="mt-2.5 sm:mt-5 flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="text-xs sm:text-lg md:text-xl font-medium text-white/40 line-through">
                  ₱
                  {Number(product.original_price || 2199).toLocaleString(
                    "en-PH",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>

                <span className="text-lg sm:text-2xl md:text-3xl font-semibold text-[#D4AF37]">
                  ₱
                  {Number(product.price).toLocaleString(
                    "en-PH",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>

                <span className="rounded-full bg-[#D4AF37]/15 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-semibold tracking-wider text-[#D4AF37]">
                  SAVE ₱700 (32% OFF)
                </span>
              </div>

              {/* PRODUCT DETAILS */}
              <div className="mt-3.5 sm:mt-7 flex items-center gap-3 sm:gap-5 border-y border-white/10 py-2.5 sm:py-4">

                <div>
                  <p className="text-[8px] uppercase tracking-[0.28em] text-white/25">
                    Size
                  </p>

                  <p className="mt-1 text-sm text-white/70">
                    {product.size_ml || 50} ML
                  </p>
                </div>

                <div className="h-8 w-px bg-white/10" />

                <div>
                  <p className="text-[8px] uppercase tracking-[0.28em] text-white/25">
                    Availability
                  </p>

                  <p
                    className={`mt-0.5 text-xs sm:text-sm font-medium ${isInStock
                      ? "text-emerald-400"
                      : "text-red-400"
                      }`}
                  >
                    {isInStock
                      ? "In Stock"
                      : "Out of Stock"}
                  </p>
                </div>

                <div className="h-8 w-px bg-white/10" />

                <div>
                  <p className="text-[8px] uppercase tracking-[0.28em] text-white/25">
                    Stock
                  </p>

                  <p className="mt-1 text-sm text-white/70">
                    {stock}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="mt-3 sm:mt-6 max-w-xl text-xs sm:text-sm leading-5 sm:leading-6 text-white/50">
                {product.description ||
                  "A distinctive YOCANA fragrance crafted to become part of your presence and signature."}
              </p>

              {/* PURCHASE CONTROLS */}
              <div className="mt-4 sm:mt-7">
                <p className="mb-1.5 sm:mb-2 text-[7.5px] sm:text-[8px] uppercase tracking-[0.25em] text-white/30">
                  Quantity
                </p>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* QUANTITY */}
                    <div
                      className={`flex h-9 sm:h-10 w-24 sm:w-[105px] items-center rounded-full border backdrop-blur-xl transition ${isInStock
                        ? "border-white/[0.18] bg-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                        : "border-white/[0.05] opacity-40"
                        }`}
                    >
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={
                          !isInStock ||
                          quantity <= 1
                        }
                        className="flex h-full w-8 items-center justify-center rounded-l-full text-white/50 transition hover:bg-white/[0.08] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <FiMinus size={11} />
                      </button>

                      <div className="flex flex-1 items-center justify-center text-xs sm:text-sm font-medium text-white">
                        {isInStock
                          ? quantity
                          : 0}
                      </div>

                      <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={
                          !isInStock ||
                          quantity >= stock
                        }
                        className="flex h-full w-8 items-center justify-center rounded-r-full text-white/50 transition hover:bg-white/[0.08] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <FiPlus size={11} />
                      </button>
                    </div>

                    {/* ADD TO CART */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={
                        !isInStock ||
                        cartOverlay
                      }
                      className={`inline-flex h-9 sm:h-10 flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-6 text-[8.5px] sm:text-[9px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${isInStock &&
                        !cartOverlay
                        ? "border border-[#FFE28A]/40 bg-[#D4AF37]/90 text-[#050505] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(212,175,55,0.3)] backdrop-blur-xl hover:scale-105 hover:bg-[#E1C35B] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] active:scale-95"
                        : "cursor-not-allowed bg-white/10 text-white/25"
                        }`}
                    >
                      <FiShoppingBag size={12} />

                      {isInStock
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </button>
                  </div>

                  {/* BUY NOW */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!isInStock}
                    className={`inline-flex h-9 sm:h-10 w-full sm:w-auto items-center justify-center gap-1.5 sm:gap-2 rounded-full border px-4 sm:px-6 text-[8.5px] sm:text-[9px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${isInStock
                      ? "border-white/20 bg-white/[0.06] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl hover:scale-105 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] active:scale-95"
                      : "cursor-not-allowed border-white/[0.05] text-white/20"
                      }`}
                  >
                    <FiZap size={12} />
                    Buy Now
                  </button>
                </div>

                {/* ERROR ONLY */}
                {cartError && (
                  <p className="mt-4 text-xs text-red-400">
                    {cartError}
                  </p>
                )}

                {/* LUXURY SHIPPING & PROMO PERKS */}
                <div className="mt-5 sm:mt-8 border-t border-white/10 pt-4 sm:pt-6">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                    <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5 sm:p-3">
                      <span className="text-base">✨</span>
                      <div>
                        <p className="text-[8.5px] sm:text-[10px] font-medium tracking-wide text-white/80">
                          FREE Shipping on 2+ Bottles
                        </p>
                        <p className="text-[7.5px] sm:text-[9px] text-white/35">
                          Flat ₱50 nationwide for single bottle
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded border border-white/[0.07] bg-white/[0.02] p-3">
                      <span className="text-base">🚚</span>
                      <div>
                        <p className="text-[10px] font-medium tracking-wide text-white/80">
                          SPX Express Courier
                        </p>
                        <p className="text-[9px] text-white/35">
                          Door-to-door delivery with live tracking
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </PublicLayout>
  )
}

export default ProductDetails
