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
              className="mt-7 inline-flex items-center gap-2 border border-white/15 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white/60 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
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

      <main className="min-h-screen bg-[#050505] px-5 pb-20 pt-24 md:px-8 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-7xl">

          <Link
            to="/shop"
            className="mb-7 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/35 transition hover:text-[#D4AF37]"
          >
            <FiArrowLeft size={14} />
            Back to Collection
          </Link>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16">

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
              className="relative flex min-h-[410px] items-center justify-center overflow-hidden border border-white/10 bg-[#070707] sm:min-h-[500px] md:min-h-[600px]"
            >
              <div
                className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[95px] sm:h-[330px] sm:w-[330px] md:h-[390px] md:w-[390px]"
                style={{
                  background: glow,
                }}
              />

              <div className="absolute h-[290px] w-[290px] rounded-full border border-[#D4AF37]/10 sm:h-[370px] sm:w-[370px] md:h-[440px] md:w-[440px]" />

              <div className="absolute h-[225px] w-[225px] rounded-full border border-white/[0.04] sm:h-[290px] sm:w-[290px] md:h-[350px] md:w-[350px]" />

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
                className="relative z-10 h-auto w-[260px] select-none object-contain drop-shadow-[0_35px_40px_rgba(0,0,0,0.8)] sm:w-[330px] md:w-[410px]"
                draggable="false"
              />

              <div
                className="absolute bottom-[70px] left-1/2 h-[5px] w-[150px] -translate-x-1/2 rounded-full blur-[9px] sm:w-[190px]"
                style={{
                  background: glow,
                }}
              />

              <div className="absolute bottom-[58px] left-1/2 h-[20px] w-[190px] -translate-x-1/2 rounded-full bg-black/90 blur-xl" />
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
              <p className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37]">
                {product.category} · Eau De Parfum
              </p>

              <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] text-[#F5F5F5] sm:text-5xl md:text-6xl">
                {product.name}
              </h1>

              <p className="mt-5 text-2xl font-medium text-[#D4AF37]">
                ₱
                {Number(product.price).toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>

              {/* PRODUCT DETAILS */}
              <div className="mt-7 flex items-center gap-5 border-y border-white/10 py-5">

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
                    className={`mt-1 text-sm ${isInStock
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
              <p className="mt-7 max-w-xl text-sm leading-7 text-white/45 sm:text-[15px]">
                {product.description ||
                  "A distinctive YOCANA fragrance crafted to become part of your presence and signature."}
              </p>

              {/* PURCHASE CONTROLS */}
              <div className="mt-8">
                <p className="mb-3 text-[8px] uppercase tracking-[0.28em] text-white/30">
                  Quantity
                </p>

                <div className="flex flex-wrap items-center gap-3 md:gap-6">

                  {/* QUANTITY */}
                  <div
                    className={`flex h-12 w-[112px] items-center border ${isInStock
                      ? "border-white/10"
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
                      className="flex h-full w-9 items-center justify-center text-white/45 transition hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <FiMinus size={13} />
                    </button>

                    <div className="flex flex-1 items-center justify-center text-sm text-white">
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
                      className="flex h-full w-9 items-center justify-center text-white/45 transition hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <FiPlus size={13} />
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
                    className={`inline-flex h-12 items-center justify-center gap-2 px-5 text-[9px] font-semibold uppercase tracking-[0.18em] transition sm:px-5 md:ml-5 ${isInStock &&
                      !cartOverlay
                      ? "bg-[#D4AF37] text-[#050505] hover:bg-[#E1C35B]"
                      : "cursor-not-allowed bg-white/10 text-white/25"
                      }`}
                  >
                    <FiShoppingBag size={15} />

                    {isInStock
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>

                  {/* BUY NOW */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!isInStock}
                    className={`inline-flex h-12 items-center justify-center gap-2 border px-5 text-[9px] font-semibold uppercase tracking-[0.18em] transition sm:px-6 ${isInStock
                      ? "border-white/15 text-white/65 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                      : "cursor-not-allowed border-white/[0.05] text-white/20"
                      }`}
                  >
                    <FiZap size={14} />
                    Buy Now
                  </button>
                </div>

                {/* ERROR ONLY */}
                {cartError && (
                  <p className="mt-4 text-xs text-red-400">
                    {cartError}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </PublicLayout>
  )
}

export default ProductDetails
