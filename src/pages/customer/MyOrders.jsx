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

        navigate("/login", {
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
                className="mt-6 inline-flex h-10 items-center justify-center gap-2 bg-[#D4AF37] px-5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] sm:h-11 sm:px-6 sm:text-[9px]"
              >
                Explore Collection
                <FiArrowRight size={13} />
              </Link>
            </div>
          )}

        {!error &&
          orders.length > 0 && (
            <div className="mt-6 space-y-4">
              {orders.map(
                (order, index) => (
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
                      delay:
                        index * 0.04,
                      duration: 0.3,
                    }}
                    className="min-w-0 border border-white/10 bg-[#080808] p-4 transition hover:border-white/20 sm:p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0">
                        <p className="text-[7px] uppercase tracking-[0.24em] text-white/20 sm:text-[8px]">
                          Order Number
                        </p>

                        <h2 className="mt-2 break-all text-base font-medium tracking-[0.03em] text-[#D4AF37] sm:text-lg">
                          {
                            order.order_number
                          }
                        </h2>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <div className="flex items-center gap-2 text-[10px] text-white/30 sm:text-xs">
                            <FiClock
                              size={12}
                              className="shrink-0"
                            />

                            {formatDate(
                              order.created_at
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-white/30 sm:text-xs">
                            <FiCreditCard
                              size={12}
                              className="shrink-0"
                            />

                            <span className="break-words">
                              {getPaymentLabel(
                                order.payment_method
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 sm:grid-cols-3 xl:min-w-[360px] xl:border-0 xl:pt-0">
                        <div className="min-w-0">
                          <p className="text-[7px] uppercase tracking-[0.2em] text-white/20 sm:text-[8px]">
                            Payment
                          </p>

                          <p className="mt-1 break-words text-[10px] capitalize text-white/55 sm:text-xs">
                            {
                              order.payment_status
                            }
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[7px] uppercase tracking-[0.2em] text-white/20 sm:text-[8px]">
                            Status
                          </p>

                          <p className="mt-1 break-words text-[10px] capitalize text-white/55 sm:text-xs">
                            {
                              order.order_status
                            }
                          </p>
                        </div>

                        <div className="col-span-2 min-w-0 sm:col-span-1 sm:text-right">
                          <p className="text-[7px] uppercase tracking-[0.2em] text-white/20 sm:text-[8px]">
                            Total
                          </p>

                          <p className="mt-1 text-sm font-medium text-white sm:text-base">
                            ₱
                            {formatPrice(
                              order.total_amount
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="break-words text-[10px] leading-5 text-white/25 sm:text-xs">
                        {
                          order.shipping_region
                        }
                      </p>

                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex h-9 w-fit items-center justify-center gap-2 border border-white/10 px-3 text-[8px] uppercase tracking-[0.16em] text-white/45 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] sm:h-10 sm:px-4 sm:tracking-[0.2em]"
                      >
                        View Order
                        <FiArrowRight
                          size={11}
                        />
                      </Link>
                    </div>
                  </motion.article>
                )
              )}
            </div>
          )}
      </CustomerAccountLayout>
    </>
  )
}

export default MyOrders
