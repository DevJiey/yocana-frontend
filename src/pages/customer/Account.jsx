import { API_URL } from "../../config/api"
import { useEffect, useMemo, useState } from "react"
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom"

import { motion } from "motion/react"

import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit3,
  FiX,
  FiCheck,
  FiPackage,
  FiClock,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi"

import BrandLoader from "../../components/BrandLoader"
import AddressManager from "../../components/account/AddressManager"
import CustomerAccountLayout from "../../layouts/CustomerAccountLayout"

function Account() {
  const navigate = useNavigate()
  const location = useLocation()

  const token =
    localStorage.getItem("yocana_token")

  const cameFromCheckout =
    location.state?.from === "/checkout"

  const requestedSection =
    location.state?.section

  /* ========================= */
  /* ACCOUNT STATE */
  /* ========================= */

  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])

  const [pageLoading, setPageLoading] =
    useState(true)

  const [pageError, setPageError] =
    useState("")

  const [editing, setEditing] =
    useState(false)

  const [activeSection, setActiveSection] =
    useState(
      requestedSection ||
      (cameFromCheckout
        ? "addresses"
        : "overview")
    )

  const [orderFilter, setOrderFilter] =
    useState("all")

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  })

  const [actionLoading, setActionLoading] =
    useState(false)

  const [loaderOpen, setLoaderOpen] =
    useState(false)

  const [loaderStatus, setLoaderStatus] =
    useState("loading")

  const [loaderMessage, setLoaderMessage] =
    useState("")

  /* ========================= */
  /* HELPERS */
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

  const formatDate = (value) => {
    if (!value) return "N/A"

    return new Date(value).toLocaleDateString(
      "en-PH",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    )
  }

  const normalizeStatus = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/_/g, " ")
  }

  const displayStatus = (value) => {
    const normalized =
      normalizeStatus(value)

    if (!normalized) {
      return "Pending"
    }

    return normalized.replace(
      /\b\w/g,
      (letter) => letter.toUpperCase()
    )
  }

  const getStatusClasses = (status) => {
    const value = normalizeStatus(status)

    if (
      value.includes("delivered") ||
      value.includes("completed")
    ) {
      return "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-400"
    }

    if (
      value.includes("ship") ||
      value.includes("out for delivery")
    ) {
      return "border-blue-500/20 bg-blue-500/[0.05] text-blue-400"
    }

    if (
      value.includes("cancel") ||
      value.includes("reject")
    ) {
      return "border-red-500/20 bg-red-500/[0.05] text-red-400"
    }

    if (
      value.includes("return") ||
      value.includes("refund")
    ) {
      return "border-orange-500/20 bg-orange-500/[0.05] text-orange-300"
    }

    return "border-[#D4AF37]/20 bg-[#D4AF37]/[0.05] text-[#D4AF37]"
  }

  const showSuccess = (
    message,
    callback = null
  ) => {
    setLoaderStatus("success")
    setLoaderMessage(message)

    setTimeout(() => {
      setLoaderOpen(false)

      if (callback) {
        callback()
      }
    }, 1300)
  }

  const handleUnauthorized = () => {
    localStorage.removeItem(
      "yocana_token"
    )

    localStorage.removeItem(
      "yocana_user"
    )

    navigate("/login", {
      replace: true,
      state: {
        from: "/account",
      },
    })
  }

  /* ========================= */
  /* LOAD ACCOUNT + ORDERS */
  /* ========================= */

  const loadAccount = async () => {
    if (!token) {
      handleUnauthorized()
      return
    }

    try {
      setPageLoading(true)
      setPageError("")

      setLoaderStatus("loading")
      setLoaderMessage(
        "Loading Your Account"
      )
      setLoaderOpen(true)

      const [
        profileResponse,
        ordersResponse,
      ] = await Promise.all([
        fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        ),

        fetch(
          `${API_URL}/api/orders/my-orders`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        ),
      ])

      if (
        profileResponse.status === 401 ||
        profileResponse.status === 403 ||
        ordersResponse.status === 401 ||
        ordersResponse.status === 403
      ) {
        setLoaderOpen(false)
        handleUnauthorized()
        return
      }

      const [
        profileData,
        ordersData,
      ] = await Promise.all([
        profileResponse.json(),
        ordersResponse.json(),
      ])

      if (
        !profileResponse.ok ||
        !profileData.success
      ) {
        throw new Error(
          profileData.message ||
          "Failed to load account"
        )
      }

      if (
        !ordersResponse.ok ||
        !ordersData.success
      ) {
        throw new Error(
          ordersData.message ||
          "Failed to load orders"
        )
      }

      setUser(profileData.user)

      setOrders(
        Array.isArray(ordersData.orders)
          ? ordersData.orders
          : []
      )

      setForm({
        first_name:
          profileData.user.first_name ||
          "",
        last_name:
          profileData.user.last_name ||
          "",
        phone:
          profileData.user.phone || "",
      })

      setLoaderOpen(false)
    } catch (error) {
      setLoaderOpen(false)
      setPageError(error.message)
    } finally {
      setPageLoading(false)
    }
  }

  /* ========================= */
  /* PROFILE */
  /* ========================= */

  const handleChange = (event) => {
    const { name, value } =
      event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleEdit = () => {
    setForm({
      first_name:
        user?.first_name || "",
      last_name:
        user?.last_name || "",
      phone: user?.phone || "",
    })

    setPageError("")
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setForm({
      first_name:
        user?.first_name || "",
      last_name:
        user?.last_name || "",
      phone: user?.phone || "",
    })

    setPageError("")
    setEditing(false)
  }

  const handleSaveProfile = async (
    event
  ) => {
    event.preventDefault()

    if (
      !form.first_name.trim() ||
      !form.last_name.trim()
    ) {
      setPageError(
        "First name and last name are required."
      )
      return
    }

    try {
      setActionLoading(true)
      setPageError("")

      setLoaderStatus("loading")
      setLoaderMessage(
        "Saving Your Profile"
      )
      setLoaderOpen(true)

      const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name:
              form.first_name.trim(),
            last_name:
              form.last_name.trim(),
            phone: form.phone.trim(),
          }),
        }
      )

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        setLoaderOpen(false)
        handleUnauthorized()
        return
      }

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
          "Failed to update profile"
        )
      }

      setUser(data.user)

      const storedUser =
        localStorage.getItem(
          "yocana_user"
        )

      if (storedUser) {
        try {
          const currentUser =
            JSON.parse(storedUser)

          localStorage.setItem(
            "yocana_user",
            JSON.stringify({
              ...currentUser,
              first_name:
                data.user.first_name,
              last_name:
                data.user.last_name,
              phone:
                data.user.phone,
              email:
                data.user.email,
            })
          )
        } catch {
          // Ignore invalid stored user
        }
      }

      setEditing(false)

      showSuccess(
        "Profile Updated"
      )
    } catch (error) {
      setLoaderOpen(false)
      setPageError(error.message)
    } finally {
      setActionLoading(false)
    }
  }

  /* ========================= */
  /* LOGOUT */
  /* ========================= */

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

      showSuccess(
        "Logged Out Successfully",
        () => {
          navigate("/", {
            replace: true,
          })
        }
      )

      setActionLoading(false)
    }, 600)
  }

  /* ========================= */
  /* EFFECTS */
  /* ========================= */

  useEffect(() => {
    loadAccount()
  }, [])

  useEffect(() => {
    if (requestedSection) {
      setActiveSection(
        requestedSection
      )

      setEditing(false)
    } else if (cameFromCheckout) {
      setActiveSection(
        "addresses"
      )
    } else {
      setActiveSection(
        "overview"
      )
    }
  }, [
    requestedSection,
    cameFromCheckout,
    location.key,
  ])

  /* ========================= */
  /* ORDER FILTERS */
  /* ========================= */

  const filters = [
    {
      id: "all",
      label: "All",
    },
    {
      id: "processing",
      label: "Processing",
    },
    {
      id: "shipped",
      label: "Shipped",
    },
    {
      id: "delivered",
      label: "Delivered",
    },
    {
      id: "returns",
      label: "Returns / Refunds",
    },
  ]

  const filteredOrders = useMemo(
    () => {
      const sorted = [...orders].sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
      )

      if (orderFilter === "all") {
        return sorted
      }

      return sorted.filter((order) => {
        const status =
          normalizeStatus(
            order.order_status
          )

        if (
          orderFilter ===
          "processing"
        ) {
          return (
            status.includes(
              "processing"
            ) ||
            status.includes("pending") ||
            status.includes(
              "confirmed"
            ) ||
            status.includes(
              "preparing"
            )
          )
        }

        if (
          orderFilter === "shipped"
        ) {
          return (
            status.includes("ship") ||
            status.includes(
              "out for delivery"
            )
          )
        }

        if (
          orderFilter ===
          "delivered"
        ) {
          return (
            status.includes(
              "delivered"
            ) ||
            status.includes(
              "completed"
            )
          )
        }

        if (
          orderFilter === "returns"
        ) {
          return (
            status.includes("return") ||
            status.includes("refund")
          )
        }

        return true
      })
    },
    [orders, orderFilter]
  )

  const fullName =
    [
      user?.first_name,
      user?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    "YOCANA Customer"

  const firstName =
    user?.first_name ||
    "Customer"

  /* ========================= */
  /* LOADING */
  /* ========================= */

  if (pageLoading) {
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
        activeItem={activeSection}
        onLogout={handleLogout}
        actionLoading={
          actionLoading
        }
      >
        {pageError && (
          <div className="mb-6 border border-red-500/20 bg-red-500/[0.04] px-4 py-3">
            <p className="text-xs leading-5 text-red-400">
              {pageError}
            </p>
          </div>
        )}

        {/* ========================= */}
        {/* ACCOUNT OVERVIEW */}
        {/* ========================= */}

        {activeSection ===
          "overview" && (
            <>
              <section className="border-b border-white/10 pb-6 sm:pb-8">
                <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
                  My Account
                </p>

                <h1 className="mt-3 text-2xl font-medium text-white sm:text-3xl lg:text-4xl">
                  Welcome, {firstName}
                </h1>

                <p className="mt-2 max-w-xl text-xs leading-5 text-white/30 sm:text-sm sm:leading-6">
                  View your recent purchases
                  and keep track of your
                  YOCANA orders.
                </p>
              </section>

              {/* RECENT ORDERS */}

              <section className="mt-7 sm:mt-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.28em] text-white/25">
                      Purchase History
                    </p>

                    <h2 className="mt-2 text-lg font-medium text-white/85 sm:text-xl">
                      Recent Orders
                    </h2>
                  </div>

                  <p className="text-[9px] text-white/20 sm:text-[10px]">
                    {orders.length}{" "}
                    {orders.length === 1
                      ? "order"
                      : "orders"}
                  </p>
                </div>

                {/* FILTERS */}

                <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
                  <div className="flex min-w-max gap-2">
                    {filters.map(
                      (filter) => (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() =>
                            setOrderFilter(
                              filter.id
                            )
                          }
                          className={`h-9 shrink-0 border px-4 text-[8px] uppercase tracking-[0.15em] transition sm:h-10 sm:text-[9px] ${orderFilter ===
                            filter.id
                            ? "border-[#D4AF37] bg-[#D4AF37] font-semibold text-[#050505]"
                            : "border-white/10 text-white/35 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                            }`}
                        >
                          {filter.label}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* EMPTY ORDERS */}

                {orders.length === 0 && (
                  <div className="mt-5 border border-white/10 bg-[#080808] px-5 py-12 text-center sm:px-8 sm:py-16">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center border border-white/10">
                      <FiShoppingBag
                        size={19}
                        className="text-white/25"
                      />
                    </div>

                    <h3 className="mt-5 text-lg text-white/80">
                      No orders yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-white/30">
                      Your YOCANA purchases
                      will appear here once
                      you place an order.
                    </p>

                    <Link
                      to="/shop"
                      className="mt-6 inline-flex h-10 items-center justify-center gap-2 bg-[#D4AF37] px-5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B]"
                    >
                      Explore Collection
                      <FiArrowRight
                        size={12}
                      />
                    </Link>
                  </div>
                )}

                {/* NO FILTER RESULTS */}

                {orders.length > 0 &&
                  filteredOrders.length ===
                  0 && (
                    <div className="mt-5 border border-white/10 bg-[#080808] px-5 py-10 text-center">
                      <FiPackage
                        size={20}
                        className="mx-auto text-white/20"
                      />

                      <p className="mt-4 text-sm text-white/50">
                        No orders found in
                        this category.
                      </p>
                    </div>
                  )}

                {/* ORDER LIST */}

                {filteredOrders.length >
                  0 && (
                    <div className="mt-5 space-y-3 sm:space-y-4">
                      {filteredOrders.map(
                        (
                          order,
                          index
                        ) => (
                          <motion.article
                            key={order.id}
                            initial={{
                              opacity: 0,
                              y: 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              duration: 0.25,
                              delay:
                                index *
                                0.025,
                            }}
                            className="group min-w-0 border border-white/10 bg-[#080808] p-4 transition hover:border-white/20 sm:p-5 md:p-6"
                          >
                            <div className="flex min-w-0 flex-col gap-5 md:flex-row md:items-center md:justify-between">

                              {/* LEFT */}

                              <div className="flex min-w-0 items-start gap-4">
                                {/* TEMPORARY PRODUCT PLACEHOLDER */}

                                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center border border-white/10 bg-[#050505] sm:h-[82px] sm:w-[82px]">
                                  <FiPackage
                                    size={20}
                                    className="text-[#D4AF37]/50"
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-[7px] uppercase tracking-[0.2em] text-white/20 sm:text-[8px]">
                                    Order Number
                                  </p>

                                  <h3 className="mt-1.5 break-all text-sm font-medium text-[#D4AF37] sm:text-base">
                                    {order.order_number}
                                  </h3>

                                  <div className="mt-2 flex items-center gap-2 text-[9px] text-white/25 sm:text-[10px]">
                                    <FiClock
                                      size={11}
                                      className="shrink-0"
                                    />

                                    {formatDate(
                                      order.created_at
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* RIGHT */}

                              <div className="grid min-w-0 grid-cols-2 gap-4 border-t border-white/10 pt-4 md:min-w-[340px] md:grid-cols-[1fr_1fr_auto] md:items-center md:border-0 md:pt-0">
                                <div className="min-w-0">
                                  <p className="text-[7px] uppercase tracking-[0.18em] text-white/20">
                                    Status
                                  </p>

                                  <div
                                    className={`mt-2 inline-flex max-w-full border px-2.5 py-1.5 text-[8px] uppercase tracking-[0.12em] ${getStatusClasses(
                                      order.order_status
                                    )}`}
                                  >
                                    <span className="truncate">
                                      {displayStatus(
                                        order.order_status
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <div className="min-w-0 text-right md:text-left">
                                  <p className="text-[7px] uppercase tracking-[0.18em] text-white/20">
                                    Total
                                  </p>

                                  <p className="mt-2 text-sm font-medium text-white/80 sm:text-base">
                                    ₱
                                    {formatPrice(
                                      order.total_amount
                                    )}
                                  </p>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                  <Link
                                    to={`/orders/${order.id}`}
                                    className="inline-flex h-9 w-full items-center justify-center gap-2 border border-white/10 px-3 text-[8px] uppercase tracking-[0.14em] text-white/45 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] md:w-auto"
                                  >
                                    View Order

                                    <FiArrowRight
                                      size={11}
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.article>
                        )
                      )}
                    </div>
                  )}
              </section>
            </>
          )}

        {/* ========================= */}
        {/* PROFILE */}
        {/* ========================= */}

        {activeSection ===
          "profile" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditing(false)

                  navigate("/account", {
                    state: {
                      section: "overview",
                    },
                  })
                }}
                className="mb-5 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/35 transition hover:text-[#D4AF37]"
              >
                <span className="text-base leading-none">
                  ←
                </span>

                Back to My Account
              </button>
              <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
                    Customer Account
                  </p>

                  <h1 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
                    My Profile
                  </h1>

                  <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                    Manage your personal
                    information and delivery
                    addresses.
                  </p>
                </div>

                {!editing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex h-10 w-fit items-center gap-2 border border-[#D4AF37]/25 px-4 text-[8px] uppercase tracking-[0.18em] text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.05]"
                  >
                    <FiEdit3 size={13} />
                    Edit Profile
                  </button>
                )}
              </div>

              <section className="mt-6 min-w-0 border border-white/10 bg-[#080808] p-4 sm:p-6 md:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04]">
                    <FiUser
                      size={18}
                      className="text-[#D4AF37]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                      Profile Information
                    </p>

                    <h2 className="mt-2 break-words text-lg font-medium text-white/85 sm:text-xl">
                      {fullName}
                    </h2>

                    <p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-[#D4AF37]">
                      Customer
                    </p>
                  </div>
                </div>

                {!editing ? (
                  <div className="mt-7 grid gap-x-8 gap-y-6 border-t border-white/10 pt-7 sm:grid-cols-2">
                    <div className="min-w-0">
                      <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                        Email Address
                      </p>

                      <div className="mt-2 flex min-w-0 items-start gap-2">
                        <FiMail
                          size={13}
                          className="mt-0.5 shrink-0 text-[#D4AF37]"
                        />

                        <p className="min-w-0 break-all text-sm text-white/55">
                          {user?.email ||
                            "No email available"}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                        Phone Number
                      </p>

                      <div className="mt-2 flex min-w-0 items-start gap-2">
                        <FiPhone
                          size={13}
                          className="mt-0.5 shrink-0 text-[#D4AF37]"
                        />

                        <p className="break-words text-sm text-white/55">
                          {user?.phone ||
                            "No phone number"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                        Account Provider
                      </p>

                      <p className="mt-2 text-sm capitalize text-white/55">
                        {user?.auth_provider ||
                          "Local"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                        Member Since
                      </p>

                      <p className="mt-2 text-sm text-white/55">
                        {user?.created_at
                          ? new Date(
                            user.created_at
                          ).toLocaleDateString(
                            "en-PH",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                          : "—"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={
                      handleSaveProfile
                    }
                    className="mt-7 border-t border-white/10 pt-7"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="first_name"
                          className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/25"
                        >
                          First Name
                        </label>

                        <input
                          id="first_name"
                          name="first_name"
                          type="text"
                          value={
                            form.first_name
                          }
                          onChange={
                            handleChange
                          }
                          className="h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/40"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="last_name"
                          className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/25"
                        >
                          Last Name
                        </label>

                        <input
                          id="last_name"
                          name="last_name"
                          type="text"
                          value={
                            form.last_name
                          }
                          onChange={
                            handleChange
                          }
                          className="h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/40"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/25"
                        >
                          Phone Number
                        </label>

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={
                            handleChange
                          }
                          placeholder="09XXXXXXXXX"
                          className="h-11 w-full border border-white/10 bg-[#050505] px-3 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/40"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/25">
                          Email Address
                        </label>

                        <div className="flex min-h-11 items-center border border-white/5 bg-white/[0.02] px-3">
                          <p className="break-all text-sm text-white/30">
                            {user?.email}
                          </p>
                        </div>

                        <p className="mt-2 text-[9px] leading-4 text-white/20">
                          Email address cannot
                          be changed from this
                          section.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <button
                        type="submit"
                        disabled={
                          actionLoading
                        }
                        className="flex h-10 items-center gap-2 bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FiCheck size={13} />
                        Save Changes
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleCancelEdit
                        }
                        disabled={
                          actionLoading
                        }
                        className="flex h-10 items-center gap-2 border border-white/10 px-4 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-white/20 hover:text-white"
                      >
                        <FiX size={13} />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </section>

              {/* SHIPPING ADDRESS INSIDE PROFILE */}

              <section className="mt-8 border-t border-white/10 pt-8">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
                    Delivery Information
                  </p>

                  <h2 className="mt-3 text-xl font-medium text-white sm:text-2xl">
                    Shipping Addresses
                  </h2>

                  <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                    Manage the addresses you
                    use for YOCANA deliveries.
                  </p>
                </div>

                <div className="mt-6">
                  <AddressManager />
                </div>
              </section>
            </>
          )}

        {/* ========================= */}
        {/* ADDRESS DIRECT SECTION */}
        {/* ========================= */}

        {activeSection ===
          "addresses" && (
            <>
              <div className="border-b border-white/10 pb-6">
                <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
                  Customer Account
                </p>

                <h1 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
                  Shipping Addresses
                </h1>

                <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                  Manage the addresses you
                  use for YOCANA deliveries.
                </p>
              </div>

              <div className="mt-6">
                <AddressManager />
              </div>
            </>
          )}
      </CustomerAccountLayout>
    </>
  )
}

export default Account