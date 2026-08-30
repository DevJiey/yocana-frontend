import { API_URL } from "../../config/api";
import { useEffect, useState } from "react"
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom"
import { motion } from "motion/react"

import {
  FiArrowLeft,
  FiPackage,
  FiCreditCard,
  FiMapPin,
  FiTruck,
  FiCheck,
  FiClock,
  FiExternalLink,
  FiX,
  FiAlertCircle,
} from "react-icons/fi"

import BrandLoader from "../../components/BrandLoader"
import CustomerAccountLayout from "../../layouts/CustomerAccountLayout"

function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [tracking, setTracking] = useState(null)
  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Cancellation
  const [showCancelModal, setShowCancelModal] =
    useState(false)
  const [cancelReason, setCancelReason] =
    useState("")
  const [cancelLoading, setCancelLoading] =
    useState(false)
  const [cancelError, setCancelError] =
    useState("")
  const [cancelSuccess, setCancelSuccess] =
    useState("")

  // Return
  const [showReturnModal, setShowReturnModal] =
    useState(false)
  const [returnReason, setReturnReason] =
    useState("")
  const [returnLoading, setReturnLoading] =
    useState(false)
  const [returnError, setReturnError] =
    useState("")
  const [returnSuccess, setReturnSuccess] =
    useState("")

  // General account loader
  const [logoutLoading, setLogoutLoading] =
    useState(false)
  const [pageLoaderOpen, setPageLoaderOpen] =
    useState(false)
  const [pageLoaderStatus, setPageLoaderStatus] =
    useState("loading")
  const [pageLoaderMessage, setPageLoaderMessage] =
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

    return new Date(value).toLocaleString(
      "en-PH",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    )
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
    localStorage.removeItem("yocana_token")
    localStorage.removeItem("yocana_user")

    navigate("/login", {
      state: {
        from: `/orders/${id}`,
      },
    })
  }

  const handleLogout = () => {
    setLogoutLoading(true)

    setPageLoaderStatus("loading")
    setPageLoaderMessage("Signing Out")
    setPageLoaderOpen(true)

    setTimeout(() => {
      localStorage.removeItem("yocana_token")
      localStorage.removeItem("yocana_user")

      setPageLoaderStatus("success")
      setPageLoaderMessage(
        "Logged Out Successfully"
      )

      setTimeout(() => {
        setPageLoaderOpen(false)

        navigate("/login", {
          replace: true,
        })
      }, 1300)

      setLogoutLoading(false)
    }, 600)
  }

  const handleCancelRequest = async () => {
    if (!cancelReason.trim()) {
      setCancelError(
        "Please enter a reason for cancellation."
      )
      return
    }

    try {
      setShowCancelModal(false)
      setCancelLoading(true)
      setCancelError("")
      setCancelSuccess("")

      const response = await fetch(
        `${API_URL}/api/orders/my-orders/${id}/cancel-request`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: cancelReason.trim(),
          }),
        }
      )

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorized()
        return
      }

      const data = await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to submit cancellation request"
        )
      }

      setCancelSuccess(
        data.message ||
          "Cancellation request submitted successfully"
      )

      setCancelReason("")

      setTimeout(() => {
        setShowCancelModal(false)
        setCancelSuccess("")
      }, 1400)
    } catch (err) {
      setCancelError(err.message)
      setShowCancelModal(true)
    } finally {
      setCancelLoading(false)
    }
  }

  const handleReturnRequest = async () => {
    if (!returnReason.trim()) {
      setReturnError(
        "Please enter a reason for return."
      )
      return
    }

    try {
      setShowReturnModal(false)
      setReturnLoading(true)
      setReturnError("")
      setReturnSuccess("")

      const response = await fetch(
        `${API_URL}/api/orders/my-orders/${id}/return-request`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: returnReason.trim(),
          }),
        }
      )

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorized()
        return
      }

      const data = await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to submit return request"
        )
      }

      setReturnSuccess(
        data.message ||
          "Return request submitted successfully"
      )

      setReturnReason("")

      setTimeout(() => {
        setReturnSuccess("")
      }, 1400)
    } catch (err) {
      setReturnError(err.message)
      setShowReturnModal(true)
    } finally {
      setReturnLoading(false)
    }
  }

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) {
        navigate("/login", {
          state: {
            from: `/orders/${id}`,
          },
        })

        return
      }

      try {
        setLoading(true)
        setError("")

        setPageLoaderStatus("loading")
        setPageLoaderMessage(
          "Loading Order Details"
        )
        setPageLoaderOpen(true)

        const [
          orderResponse,
          trackingResponse,
          profileResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/api/orders/my-orders/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),

          fetch(
            `${API_URL}/api/orders/my-orders/${id}/tracking`,
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
          orderResponse.status === 401 ||
          orderResponse.status === 403 ||
          trackingResponse.status === 401 ||
          trackingResponse.status === 403 ||
          profileResponse.status === 401 ||
          profileResponse.status === 403
        ) {
          setPageLoaderOpen(false)
          handleUnauthorized()
          return
        }

        const [
          orderData,
          trackingData,
          profileData,
        ] = await Promise.all([
          orderResponse.json(),
          trackingResponse.json(),
          profileResponse.json(),
        ])

        if (
          !orderResponse.ok ||
          !orderData.success
        ) {
          throw new Error(
            orderData.message ||
              "Unable to load order"
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

        setOrder(orderData.order)
        setUser(profileData.user)

        if (
          trackingResponse.ok &&
          trackingData.success
        ) {
          setTracking(
            trackingData.tracking
          )
        }

        setPageLoaderOpen(false)
      } catch (err) {
        setPageLoaderOpen(false)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <BrandLoader
          show={pageLoaderOpen}
          status={pageLoaderStatus}
          message={pageLoaderMessage}
        />
      </div>
    )
  }

  if (error || !order) {
    return (
      <>
        <BrandLoader
          show={pageLoaderOpen}
          status={pageLoaderStatus}
          message={pageLoaderMessage}
        />

        <div className="flex min-h-screen items-center justify-center bg-[#050505] px-5">
          <div className="text-center">
            <FiPackage
              size={28}
              className="mx-auto text-white/20"
            />

            <h1 className="mt-5 text-2xl text-white">
              Order unavailable
            </h1>

            <p className="mt-2 text-sm text-white/30">
              {error ||
                "Unable to find this order."}
            </p>

            <Link
              to="/orders"
              className="mt-7 inline-flex h-11 items-center justify-center border border-white/15 px-6 text-[9px] uppercase tracking-[0.2em] text-white/60 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <BrandLoader
        show={
          pageLoaderOpen ||
          cancelLoading ||
          Boolean(cancelSuccess) ||
          returnLoading ||
          Boolean(returnSuccess)
        }
        status={
          cancelSuccess || returnSuccess
            ? "success"
            : pageLoaderStatus
        }
        message={
          cancelSuccess
            ? "Cancellation Request Submitted"
            : returnSuccess
              ? "Return Request Submitted"
              : returnLoading
                ? "Submitting Return"
                : cancelLoading
                  ? "Submitting Request"
                  : pageLoaderMessage
        }
      />

      <CustomerAccountLayout
        user={user}
        activeItem="orders"
        onLogout={handleLogout}
        actionLoading={
          logoutLoading ||
          cancelLoading ||
          returnLoading
        }
      >
        {/* BACK */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-white/35 transition hover:text-[#D4AF37]"
        >
          <FiArrowLeft size={13} />
          Back to My Orders
        </Link>

        {/* HEADER */}
        <div className="mt-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
              Order Details
            </p>

            <h1 className="mt-3 break-all text-xl font-medium tracking-[-0.02em] text-white sm:text-2xl md:text-3xl">
              {order.order_number}
            </h1>

            <p className="mt-2 text-[10px] text-white/30 sm:text-xs">
              Placed on{" "}
              {formatDate(
                order.created_at
              )}
            </p>
          </div>

          <div className="w-fit border border-[#D4AF37]/25 bg-[#D4AF37]/[0.04] px-3 py-2 sm:px-4">
            <p className="text-[8px] uppercase tracking-[0.18em] text-[#D4AF37]">
              {order.order_status}
            </p>
          </div>
        </div>

        <div className="mt-6 grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">

          {/* LEFT */}
          <div className="min-w-0 space-y-5">

            {/* ITEMS */}
            <section className="min-w-0 border border-white/10 bg-[#080808] p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-3">
                <FiPackage
                  size={16}
                  className="shrink-0 text-[#D4AF37]"
                />

                <div>
                  <p className="text-[7px] uppercase tracking-[0.25em] text-[#D4AF37] sm:text-[8px]">
                    Your Selection
                  </p>

                  <h2 className="mt-1 text-base text-white sm:text-lg">
                    Order Items
                  </h2>
                </div>
              </div>

              <div className="mt-5 divide-y divide-white/10">
                {order.items?.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="flex min-w-0 items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 sm:items-center sm:gap-5"
                    >
                      <div className="min-w-0">
                        <h3 className="break-words text-xs font-medium leading-5 text-white/80 sm:text-sm">
                          {
                            item.product_name
                          }
                        </h3>

                        <p className="mt-2 text-[9px] text-white/30 sm:text-[10px]">
                          ₱
                          {formatPrice(
                            item.price
                          )}{" "}
                          × {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-xs font-medium text-white/70 sm:text-sm">
                        ₱
                        {formatPrice(
                          item.subtotal
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* TRACKING */}
            <section className="min-w-0 border border-white/10 bg-[#080808] p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-3">
                <FiTruck
                  size={17}
                  className="shrink-0 text-[#D4AF37]"
                />

                <div>
                  <p className="text-[7px] uppercase tracking-[0.25em] text-[#D4AF37] sm:text-[8px]">
                    Delivery Journey
                  </p>

                  <h2 className="mt-1 text-base text-white sm:text-lg">
                    Order Tracking
                  </h2>
                </div>
              </div>

              {tracking?.shipment
                ?.courier_name && (
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="min-w-0 border border-white/10 p-4">
                    <p className="text-[7px] uppercase tracking-[0.2em] text-white/25 sm:text-[8px]">
                      Courier
                    </p>

                    <p className="mt-2 break-words text-xs text-white/65 sm:text-sm">
                      {
                        tracking
                          .shipment
                          .courier_name
                      }
                    </p>
                  </div>

                  <div className="min-w-0 border border-white/10 p-4">
                    <p className="text-[7px] uppercase tracking-[0.2em] text-white/25 sm:text-[8px]">
                      Tracking Number
                    </p>

                    <p className="mt-2 break-all text-xs text-white/65 sm:text-sm">
                      {tracking
                        .shipment
                        .tracking_number ||
                        "Not available"}
                    </p>
                  </div>
                </div>
              )}

              {tracking?.shipment
                ?.tracking_url && (
                <a
                  href={
                    tracking.shipment
                      .tracking_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-[#D4AF37]"
                >
                  Track Shipment
                  <FiExternalLink
                    size={12}
                  />
                </a>
              )}

              <div className="mt-6">
                {tracking?.timeline
                  ?.length > 0 ? (
                  <div>
                    {tracking.timeline.map(
                      (
                        history,
                        index
                      ) => {
                        const isLast =
                          index ===
                          tracking
                            .timeline
                            .length -
                            1

                        return (
                          <motion.div
                            key={`${history.status}-${index}`}
                            initial={{
                              opacity: 0,
                              y: 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              delay:
                                index *
                                0.08,
                            }}
                            className="relative flex gap-3 sm:gap-4"
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                                  isLast
                                    ? "border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37]"
                                    : "border-white/15 text-white/35"
                                }`}
                              >
                                {isLast ? (
                                  <FiCheck
                                    size={
                                      13
                                    }
                                  />
                                ) : (
                                  <FiClock
                                    size={
                                      12
                                    }
                                  />
                                )}
                              </div>

                              {index !==
                                tracking
                                  .timeline
                                  .length -
                                  1 && (
                                <div className="min-h-[55px] w-px bg-white/10" />
                              )}
                            </div>

                            <div className="min-w-0 pb-7">
                              <p
                                className={`break-words text-xs capitalize sm:text-sm ${
                                  isLast
                                    ? "text-[#D4AF37]"
                                    : "text-white/60"
                                }`}
                              >
                                {
                                  history.status
                                }
                              </p>

                              {history.note && (
                                <p className="mt-1 break-words text-[10px] leading-5 text-white/30 sm:text-xs">
                                  {
                                    history.note
                                  }
                                </p>
                              )}

                              <p className="mt-2 text-[8px] text-white/20 sm:text-[9px]">
                                {formatDate(
                                  history.created_at
                                )}
                              </p>
                            </div>
                          </motion.div>
                        )
                      }
                    )}
                  </div>
                ) : (
                  <div className="border border-white/10 px-4 py-5">
                    <p className="text-xs leading-5 text-white/40 sm:text-sm">
                      Order received and
                      waiting to be
                      processed.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="min-w-0 space-y-5">

            {/* PAYMENT */}
            <section className="border border-white/10 bg-[#080808] p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <FiCreditCard
                  size={15}
                  className="shrink-0 text-[#D4AF37]"
                />

                <p className="text-[8px] uppercase tracking-[0.22em] text-white/25">
                  Payment
                </p>
              </div>

              <p className="mt-4 break-words text-xs text-white/70 sm:text-sm">
                {getPaymentLabel(
                  order.payment_method
                )}
              </p>

              <div className="mt-3">
                <div className="inline-flex border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] px-3 py-1.5">
                  <span className="text-[7px] uppercase tracking-[0.18em] text-[#D4AF37] sm:text-[8px]">
                    {order.payment_status ===
                    "paid"
                      ? "Payment Successful"
                      : "Payment Pending"}
                  </span>
                </div>
              </div>

              {order.payment_method !==
                "COD" && (
                <p className="mt-3 text-[10px] leading-5 text-white/30 sm:text-xs">
                  {order.payment_status ===
                  "paid"
                    ? "Your online payment has been successfully confirmed."
                    : "Your online payment is still waiting for confirmation."}
                </p>
              )}
            </section>

            {/* SHIPPING */}
            <section className="min-w-0 border border-white/10 bg-[#080808] p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <FiMapPin
                  size={15}
                  className="shrink-0 text-[#D4AF37]"
                />

                <p className="text-[8px] uppercase tracking-[0.22em] text-white/25">
                  Shipping Address
                </p>
              </div>

              <p className="mt-4 break-words text-xs leading-6 text-white/60 sm:text-sm">
                {
                  order.shipping_address
                }
              </p>

              <p className="mt-2 break-words text-[9px] text-white/25 sm:text-[10px]">
                {
                  order.shipping_region
                }
              </p>
            </section>

            {/* SUMMARY */}
            <section className="border border-white/10 bg-[#080808] p-4 sm:p-5">
              <p className="text-[8px] uppercase tracking-[0.22em] text-[#D4AF37]">
                Order Summary
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between gap-4 text-xs sm:text-sm">
                  <span className="text-white/30">
                    Subtotal
                  </span>

                  <span className="shrink-0 text-white/60">
                    ₱
                    {formatPrice(
                      order.subtotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-xs sm:text-sm">
                  <span className="text-white/30">
                    Shipping
                  </span>

                  <span className="shrink-0 text-white/60">
                    ₱
                    {formatPrice(
                      order.shipping_fee
                    )}
                  </span>
                </div>

                {Number(
                  order.discount_amount
                ) > 0 && (
                  <div className="flex justify-between gap-4 text-xs sm:text-sm">
                    <span className="text-white/30">
                      Discount
                    </span>

                    <span className="shrink-0 text-white/60">
                      -₱
                      {formatPrice(
                        order.discount_amount
                      )}
                    </span>
                  </div>
                )}

                <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 sm:text-[9px]">
                    Total
                  </span>

                  <span className="text-lg font-medium text-[#D4AF37] sm:text-xl">
                    ₱
                    {formatPrice(
                      order.total_amount
                    )}
                  </span>
                </div>
              </div>
            </section>

            {/* CANCELLATION */}
            {order.order_status !==
              "shipped" &&
              order.order_status !==
                "delivered" &&
              order.order_status !==
                "cancelled" && (
                <section className="border border-white/10 bg-[#080808] p-4 sm:p-5">
                  <p className="text-[8px] uppercase tracking-[0.22em] text-white/25">
                    Need to cancel?
                  </p>

                  <p className="mt-3 text-[10px] leading-5 text-white/30 sm:text-xs">
                    You can submit a
                    cancellation request
                    while your order has
                    not yet been shipped.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setCancelError("")
                      setCancelSuccess("")
                      setShowCancelModal(
                        true
                      )
                    }}
                    className="mt-5 flex h-10 w-fit items-center justify-center border border-red-500/20 px-4 text-[8px] uppercase tracking-[0.16em] text-red-400 transition hover:border-red-500/40 hover:bg-red-500/[0.04]"
                  >
                    Request Cancellation
                  </button>
                </section>
              )}

            {/* RETURN */}
            {order.order_status ===
              "delivered" &&
              order.payment_status ===
                "paid" && (
                <section className="border border-white/10 bg-[#080808] p-4 sm:p-5">
                  <p className="text-[8px] uppercase tracking-[0.22em] text-white/25">
                    Need to return?
                  </p>

                  <p className="mt-3 text-[10px] leading-5 text-white/30 sm:text-xs">
                    You can submit a
                    return request for
                    this delivered order.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setReturnError("")
                      setReturnSuccess("")
                      setShowReturnModal(
                        true
                      )
                    }}
                    className="mt-5 flex h-10 w-fit items-center justify-center border border-[#D4AF37]/20 px-4 text-[8px] uppercase tracking-[0.16em] text-[#D4AF37] transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.04]"
                  >
                    Request Return
                  </button>
                </section>
              )}
          </aside>
        </div>
      </CustomerAccountLayout>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="w-full max-w-md border border-white/10 bg-[#080808] p-5 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FiAlertCircle
                    size={16}
                    className="text-red-400"
                  />

                  <p className="text-[8px] uppercase tracking-[0.22em] text-red-400">
                    Cancellation Request
                  </p>
                </div>

                <h2 className="mt-3 text-lg text-white sm:text-xl">
                  Cancel this order?
                </h2>

                <p className="mt-2 text-[10px] leading-5 text-white/30 sm:text-xs">
                  Your request will be
                  reviewed before the
                  order is officially
                  cancelled.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false)
                  setCancelReason("")
                  setCancelError("")
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-white/30 transition hover:text-white"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="mt-6">
              <label className="text-[8px] uppercase tracking-[0.2em] text-white/30">
                Reason for cancellation
              </label>

              <textarea
                value={cancelReason}
                onChange={(e) =>
                  setCancelReason(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Please tell us why you want to cancel this order..."
                className="mt-3 w-full resize-none border border-white/10 bg-[#050505] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/40"
              />
            </div>

            {cancelError && (
              <p className="mt-3 text-xs text-red-400">
                {cancelError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false)
                  setCancelReason("")
                  setCancelError("")
                }}
                className="h-10 w-full border border-white/10 px-4 text-[8px] uppercase tracking-[0.16em] text-white/40 transition hover:border-white/20 hover:text-white sm:w-fit"
              >
                Keep Order
              </button>

              <button
                type="button"
                onClick={
                  handleCancelRequest
                }
                disabled={cancelLoading}
                className="h-10 w-full bg-red-500/90 px-4 text-[8px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
              >
                {cancelLoading
                  ? "Submitting..."
                  : "Submit Request"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* RETURN MODAL */}
      {showReturnModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="w-full max-w-md border border-white/10 bg-[#080808] p-5 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FiPackage
                    size={16}
                    className="text-[#D4AF37]"
                  />

                  <p className="text-[8px] uppercase tracking-[0.22em] text-[#D4AF37]">
                    Return Request
                  </p>
                </div>

                <h2 className="mt-3 text-lg text-white sm:text-xl">
                  Return this order?
                </h2>

                <p className="mt-2 text-[10px] leading-5 text-white/30 sm:text-xs">
                  Your return request
                  will be reviewed before
                  further instructions
                  are provided.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowReturnModal(false)
                  setReturnReason("")
                  setReturnError("")
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-white/30 transition hover:text-white"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="mt-6">
              <label className="text-[8px] uppercase tracking-[0.2em] text-white/30">
                Reason for return
              </label>

              <textarea
                value={returnReason}
                onChange={(e) =>
                  setReturnReason(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Please tell us why you want to return this order..."
                className="mt-3 w-full resize-none border border-white/10 bg-[#050505] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/40"
              />
            </div>

            {returnError && (
              <p className="mt-3 text-xs text-red-400">
                {returnError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowReturnModal(false)
                  setReturnReason("")
                  setReturnError("")
                }}
                className="h-10 w-full border border-white/10 px-4 text-[8px] uppercase tracking-[0.16em] text-white/40 transition hover:border-white/20 hover:text-white sm:w-fit"
              >
                Keep Order
              </button>

              <button
                type="button"
                onClick={
                  handleReturnRequest
                }
                disabled={returnLoading}
                className="h-10 w-full bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.16em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
              >
                {returnLoading
                  ? "Submitting..."
                  : "Submit Return"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default OrderDetails
