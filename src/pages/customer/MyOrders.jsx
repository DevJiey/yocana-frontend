import { API_URL } from "../../config/api";
import { useEffect, useState } from "react"
import {
  Link,
  useNavigate,
} from "react-router-dom"
import { motion } from "motion/react"

import {
  FiPackage,
  FiClock,
  FiCreditCard,
  FiArrowRight,
} from "react-icons/fi"

import BrandLoader from "../../components/BrandLoader"
import CustomerAccountLayout from "../../layouts/CustomerAccountLayout"
import hommeImage from "../../assets/yocana-homme.png"
import femmeImage from "../../assets/yocana-femme.png"

function MyOrders() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [actionLoading, setActionLoading] =
    useState(false)

  const [loaderOpen, setLoaderOpen] =
    useState(false)

  const [loaderStatus, setLoaderStatus] =
    useState("loading")

  const [loaderMessage, setLoaderMessage] =
    useState("")

  const token =
    localStorage.getItem("yocana_token")

  const formatPrice = (value) => {
    return Number(value || 0).toLocaleString(
      "en-PH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )
  }

  const formatDate = (value) => {
    if (!value) return "N/A"

    return new Date(
      value
    ).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getPaymentLabel = (method) => {
    const labels = {
      COD: "Cash on Delivery",
      GCASH: "GCash",
      MAYA: "Maya",
      CARD: "Credit / Debit Card",
      BANK: "Online Banking",
    }

    return labels[method] || method
  }

  const normalizeStatus = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/_/g, " ")
  }

  const displayStatus = (value) => {
    const normalized = normalizeStatus(value)
    if (!normalized) return "Pending"
    return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  const getStatusClasses = (status) => {
    const value = normalizeStatus(status)
    if (value.includes("delivered") || value.includes("completed")) {
      return "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-400"
    }
    if (value.includes("ship") || value.includes("out for delivery")) {
      return "border-blue-500/20 bg-blue-500/[0.05] text-blue-400"
    }
    if (value.includes("cancel") || value.includes("reject")) {
      return "border-red-500/20 bg-red-500/[0.05] text-red-400"
    }
    if (value.includes("return") || value.includes("refund")) {
      return "border-orange-500/20 bg-orange-500/[0.05] text-orange-300"
    }
    return "border-[#D4AF37]/20 bg-[#D4AF37]/[0.05] text-[#D4AF37]"
  }

  const getOrderThumbnail = (order) => {
    const firstItem = order?.items?.[0]
    if (firstItem?.image_url && typeof firstItem.image_url === "string" && firstItem.image_url.startsWith("http")) {
      return firstItem.image_url
    }
    const name = (firstItem?.product_name || firstItem?.name || "").toLowerCase()
    if (name.includes("femme") || name.includes("women") || name.includes("red")) {
      return femmeImage
    }
    return hommeImage
  }

  const getOrderItemsSummary = (order) => {
    if (!order?.items || order.items.length === 0) {
      return { title: "YOCANA Fragrance", count: 1, extraItems: 0 }
    }
    const first = order.items[0]
    const title = first.product_name || "YOCANA Fragrance"
    const extraItems = Math.max(0, order.items.length - 1)
    return { title, count: order.items.length, extraItems }
  }

  const handleUnauthorized = () => {
    localStorage.removeItem(
      "yocana_token"
    )

    localStorage.removeItem(
      "yocana_user"
    )

    navigate("/login", {
      state: {
        from: "/orders",
      },
    })
  }

  const handleLogout = () => {
    setActionLoading(true)

    setLoaderStatus("loading")
    setLoaderMessage("Signing Out")
    setLoaderOpen(true)

    setTimeout(() => {
      localStorage.removeItem(
        "yocana_token"
      )

      localStorage.removeItem(
        "yocana_user"
      )

      setLoaderStatus("success")
      setLoaderMessage(
        "Logged Out Successfully"
      )

      setTimeout(() => {
        setLoaderOpen(false)

        navigate("/", {
          replace: true,
        })
      }, 1300)

      setActionLoading(false)
    }, 600)
  }

  useEffect(() => {
    const fetchPageData = async () => {
      if (!token) {
        navigate("/login", {
          state: {
            from: "/orders",
          },
        })

        return
      }

      try {
        setLoading(true)
        setError("")

        setLoaderStatus("loading")
        setLoaderMessage(
          "Loading Your Orders"
        )
        setLoaderOpen(true)

        const [
          ordersResponse,
          profileResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/api/orders/my-orders`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),
          fetch(
            `${API_URL}/api/auth/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),
        ])

        if (
          ordersResponse.status === 401 ||
          ordersResponse.status === 403 ||
          profileResponse.status === 401 ||
          profileResponse.status === 403
        ) {
          setLoaderOpen(false)
          handleUnauthorized()
          return
        }

        const [
          ordersData,
          profileData,
        ] = await Promise.all([
          ordersResponse.json(),
          profileResponse.json(),
        ])

        if (
          !ordersResponse.ok ||
          !ordersData.success
        ) {
          throw new Error(
            ordersData.message ||
            "Unable to load your orders"
          )
        }

        if (
          !profileResponse.ok ||
          !profileData.success
        ) {
          throw new Error(
            profileData.message ||
            "Unable to load account"
          )
        }

        setOrders(
          ordersData.orders || []
        )

        setUser(profileData.user)

        setLoaderOpen(false)
      } catch (err) {
        setLoaderOpen(false)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPageData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <BrandLoader
          show={loaderOpen}
          status={loaderStatus}
          message={loaderMessage}
        />
      </div>
    )
  }

  return (
    <>
      <BrandLoader
        show={loaderOpen}
        status={loaderStatus}
        message={loaderMessage}
      />

      <CustomerAccountLayout
        user={user}
        activeItem="orders"
        onLogout={handleLogout}
        actionLoading={
          actionLoading
        }
      >
        <div className="border-b border-white/10 pb-6">
          <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
            Purchase History
          </p>

          <h1 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
            My Orders
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
            View your recent purchases,
            payment information, and current
            order status.
          </p>
        </div>

        {error && (
          <div className="mt-6 border border-red-500/20 bg-red-500/[0.04] px-4 py-3">
            <p className="text-xs text-red-400">
              {error}
            </p>
          </div>
        )}

        {!error &&
          orders.length === 0 && (
            <div className="mt-6 border border-white/10 bg-[#080808] px-5 py-12 text-center sm:px-6 sm:py-16">
              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-white/10 sm:h-14 sm:w-14">
                <FiPackage
                  size={20}
                  className="text-white/25"
                />
              </div>

              <h2 className="mt-5 text-lg text-white sm:text-xl">
                No orders yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-white/30 sm:text-sm">
                Your YOCANA purchases will
                appear here once you place
                an order.
              </p>

              <Link
                to="/shop"
                className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#FFE28A]/40 bg-[#D4AF37]/90 px-6 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_20px_rgba(212,175,55,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-[#E1C35B] active:scale-95 sm:h-11 sm:px-7 sm:text-[9px]"
              >
                Explore Collection
                <FiArrowRight size={13} />
              </Link>
            </div>
          )}

        {!error &&
          orders.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-1 sm:gap-4">
              {orders.map((order, index) => {
                const itemsSummary = getOrderItemsSummary(order)
                const thumbnail = getOrderThumbnail(order)

                return (
                  <motion.article
                    key={order.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.04,
                      duration: 0.3,
                    }}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#080808]/85 p-2.5 backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37]/45 hover:bg-[#0c0c0c] hover:shadow-[0_4px_25px_rgba(212,175,55,0.12)] sm:rounded-none sm:p-5 md:p-6"
                  >
                    {/* ===================== */}
                    {/* MOBILE LAYOUT (< sm)  */}
                    {/* ===================== */}
                    <div className="flex flex-1 flex-col justify-between sm:hidden">
                      {/* Product Picture Container */}
                      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] via-[#080808] to-black/60 p-2">
                        <div className="pointer-events-none absolute inset-0 bg-[#D4AF37]/5 blur-md" />

                        <img
                          src={thumbnail}
                          alt={itemsSummary.title}
                          className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105"
                        />

                        {itemsSummary.extraItems > 0 && (
                          <span className="absolute right-1.5 top-1.5 z-20 rounded-full border border-[#D4AF37]/30 bg-black/80 px-1.5 py-0.5 text-[7px] font-semibold text-[#D4AF37] backdrop-blur-sm">
                            +{itemsSummary.extraItems}
                          </span>
                        )}
                      </div>

                      {/* Order Info */}
                      <div className="mt-2.5 min-w-0">
                        <p className="truncate text-[7px] font-medium uppercase tracking-[0.16em] text-[#D4AF37]">
                          {order.order_number}
                        </p>

                        <h4 className="mt-1 line-clamp-1 text-[11px] font-medium leading-tight text-white/90">
                          {itemsSummary.title}
                        </h4>

                        <div className="mt-1 flex items-center gap-1 text-[8px] text-white/30">
                          <FiClock size={9} className="shrink-0" />
                          <span className="truncate">{formatDate(order.created_at)}</span>
                        </div>
                      </div>

                      {/* Status, Price, and Action */}
                      <div className="mt-2.5 border-t border-white/10 pt-2">
                        <div className="flex items-center justify-between gap-1">
                          <div
                            className={`inline-flex max-w-[55%] truncate border px-1.5 py-0.5 text-[7px] uppercase tracking-[0.1em] ${getStatusClasses(
                              order.order_status
                            )}`}
                          >
                            <span className="truncate">
                              {displayStatus(order.order_status)}
                            </span>
                          </div>

                          <p className="text-[11px] font-semibold text-white">
                            ₱{formatPrice(order.total_amount)}
                          </p>
                        </div>

                        <div className="mt-2.5 flex flex-col gap-1.5">
                          {order.payment_method !== "COD" &&
                            order.payment_status !== "paid" && (
                              <Link
                                to={`/payment/${order.id}`}
                                className="inline-flex h-7 w-full items-center justify-center gap-1 rounded-full border border-[#FFE28A]/40 bg-[#D4AF37]/95 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#050505] shadow-[0_2px_10px_rgba(212,175,55,0.2)] transition-all hover:bg-[#E1C35B] active:scale-95"
                              >
                                <FiCreditCard size={10} />
                                Pay Now
                              </Link>
                            )}

                          <Link
                            to={`/orders/${order.id}`}
                            className="inline-flex h-7 w-full items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.04] text-[8px] font-medium uppercase tracking-[0.12em] text-white/60 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] active:scale-95"
                          >
                            View Order
                            <FiArrowRight size={9} />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* ===================== */}
                    {/* DESKTOP LAYOUT (>= sm)*/}
                    {/* ===================== */}
                    <div className="hidden sm:block">
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="relative flex h-[82px] w-[82px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] via-[#080808] to-black/60 p-2">
                            <div className="pointer-events-none absolute inset-0 bg-[#D4AF37]/5 blur-md" />

                            <img
                              src={thumbnail}
                              alt={itemsSummary.title}
                              className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                            />

                            {itemsSummary.extraItems > 0 && (
                              <span className="absolute right-1 top-1 z-20 rounded-full border border-[#D4AF37]/30 bg-black/80 px-1.5 py-0.5 text-[8px] font-semibold text-[#D4AF37] backdrop-blur-sm">
                                +{itemsSummary.extraItems}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-[7px] uppercase tracking-[0.24em] text-white/20 sm:text-[8px]">
                              Order Number
                            </p>

                            <h2 className="mt-1.5 break-all text-base font-medium tracking-[0.03em] text-[#D4AF37] sm:text-lg">
                              {order.order_number}
                            </h2>

                            <p className="mt-1 line-clamp-1 text-xs text-white/80">
                              {itemsSummary.title}
                              {itemsSummary.extraItems > 0 && (
                                <span className="ml-1.5 text-[11px] text-white/40">
                                  (+{itemsSummary.extraItems} more)
                                </span>
                              )}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                              <div className="flex items-center gap-2 text-[10px] text-white/30 sm:text-xs">
                                <FiClock size={12} className="shrink-0" />
                                {formatDate(order.created_at)}
                              </div>

                              <div className="flex items-center gap-2 text-[10px] text-white/30 sm:text-xs">
                                <FiCreditCard size={12} className="shrink-0" />
                                <span className="break-words">
                                  {getPaymentLabel(order.payment_method)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 sm:grid-cols-3 xl:min-w-[360px] xl:border-0 xl:pt-0">
                          <div className="min-w-0">
                            <p className="text-[7px] uppercase tracking-[0.2em] text-white/20 sm:text-[8px]">
                              Payment
                            </p>

                            <p className="mt-1 break-words text-[10px] capitalize text-white/55 sm:text-xs">
                              {order.payment_status}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-[7px] uppercase tracking-[0.2em] text-white/20 sm:text-[8px]">
                              Status
                            </p>

                            <div
                              className={`mt-1 inline-flex max-w-full border px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] ${getStatusClasses(
                                order.order_status
                              )}`}
                            >
                              <span className="truncate">
                                {displayStatus(order.order_status)}
                              </span>
                            </div>
                          </div>

                          <div className="col-span-2 min-w-0 sm:col-span-1 sm:text-right">
                            <p className="text-[7px] uppercase tracking-[0.2em] text-white/20 sm:text-[8px]">
                              Total
                            </p>

                            <p className="mt-1 text-sm font-medium text-white sm:text-base">
                              ₱{formatPrice(order.total_amount)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="break-words text-[10px] leading-5 text-white/25 sm:text-xs">
                          {order.shipping_region}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                          {order.payment_method !== "COD" &&
                            order.payment_status !== "paid" && (
                              <Link
                                to={`/payment/${order.id}`}
                                className="inline-flex h-9 w-fit items-center justify-center gap-1.5 rounded-full border border-[#FFE28A]/40 bg-[#D4AF37]/95 px-4 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#050505] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_15px_rgba(212,175,55,0.25)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[#E1C35B] active:scale-95 sm:h-10 sm:px-5 sm:tracking-[0.2em]"
                              >
                                <FiCreditCard size={12} />
                                Pay Now / Submit Proof
                              </Link>
                            )}

                          <Link
                            to={`/orders/${order.id}`}
                            className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[8px] uppercase tracking-[0.16em] text-white/50 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] sm:h-10 sm:px-5 sm:tracking-[0.2em]"
                          >
                            View Order
                            <FiArrowRight size={11} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          )}
      </CustomerAccountLayout>
    </>
  )
}

export default MyOrders
