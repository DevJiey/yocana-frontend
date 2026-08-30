import { API_URL } from "../../config/api";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  FiAlertTriangle,
  FiBox,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiRefreshCw,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi"

import AdminLayout from "../../layouts/AdminLayout"
import BrandLoader from "../../components/BrandLoader"

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const token = localStorage.getItem("yocana_token")

  const fetchDashboard = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      }

      setError("")

      const response = await fetch(
        `${API_URL}/api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load dashboard"
        )
      }

      setDashboard(data.dashboard)
    } catch (err) {
      setError(err.message)
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(Number(value || 0))
  }

  const formatDate = (date) => {
    if (!date) return "—"

    return new Intl.DateTimeFormat("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date))
  }

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "border-green-500/20 text-green-400"

      case "preparing":
        return "border-blue-500/20 text-blue-400"

      case "shipped":
        return "border-purple-500/20 text-purple-400"

      case "pending":
        return "border-yellow-500/20 text-yellow-400"

      case "cancelled":
      case "returned":
        return "border-red-500/20 text-red-400"

      default:
        return "border-white/10 text-white/40"
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <BrandLoader
          show={true}
          status="loading"
          message="Loading Dashboard"
        />
      </AdminLayout>
    )
  }

  const stats = [
    {
      label: "Total Sales",
      value: formatCurrency(dashboard?.total_sales),
      icon: FiDollarSign,
      description: "Paid orders",
      highlight: true,
    },
    {
      label: "Total Orders",
      value: dashboard?.total_orders ?? 0,
      icon: FiShoppingBag,
      description: "All customer orders",
    },
    {
      label: "Pending Orders",
      value: dashboard?.pending_orders ?? 0,
      icon: FiClock,
      description: "Awaiting processing",
      warning: (dashboard?.pending_orders ?? 0) > 0,
    },
    {
      label: "Products Sold",
      value: dashboard?.products_sold ?? 0,
      icon: FiPackage,
      description: "Units ordered",
    },
    {
      label: "Current Inventory",
      value: dashboard?.current_inventory ?? 0,
      icon: FiBox,
      description: "Available units",
    },
    {
      label: "Low Stock",
      value: dashboard?.low_stock_products ?? 0,
      icon: FiAlertTriangle,
      description: "Products needing attention",
      warning:
        (dashboard?.low_stock_products ?? 0) > 0,
    },
    {
      label: "Customers",
      value: dashboard?.total_customers ?? 0,
      icon: FiUsers,
      description: "Registered customers",
    },
  ]

  return (
    <AdminLayout>
      <div className="px-4 py-7 sm:px-5 md:px-8">
        <div className="mx-auto max-w-6xl">

          {/* HEADER */}
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
                Overview
              </p>

              <h1 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                Monitor orders, sales, customers and
                inventory activity.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              className="flex h-10 w-fit items-center justify-center gap-2 border border-white/10 px-4 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
            >
              <FiRefreshCw size={12} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mt-5 border border-red-500/20 bg-red-500/[0.04] p-4">
              <p className="text-xs text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* STAT CARDS */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.label}
                  className={`relative overflow-hidden border p-4 sm:p-5 ${
                    stat.warning
                      ? "border-yellow-500/20 bg-yellow-500/[0.025]"
                      : stat.highlight
                        ? "border-[#D4AF37]/20 bg-[#D4AF37]/[0.025]"
                        : "border-white/10 bg-[#080808]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={`text-[7px] uppercase tracking-[0.18em] ${
                          stat.warning
                            ? "text-yellow-400/60"
                            : stat.highlight
                              ? "text-[#D4AF37]/70"
                              : "text-white/25"
                        }`}
                      >
                        {stat.label}
                      </p>

                      <p
                        className={`mt-3 break-words text-xl font-medium sm:text-2xl ${
                          stat.warning
                            ? "text-yellow-400"
                            : stat.highlight
                              ? "text-[#D4AF37]"
                              : "text-white"
                        }`}
                      >
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center border ${
                        stat.warning
                          ? "border-yellow-500/20 text-yellow-400"
                          : stat.highlight
                            ? "border-[#D4AF37]/20 text-[#D4AF37]"
                            : "border-white/10 text-white/25"
                      }`}
                    >
                      <Icon size={15} />
                    </div>
                  </div>

                  <p className="mt-4 text-[8px] leading-4 text-white/20">
                    {stat.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* QUICK LINKS */}
          <div className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[8px] uppercase tracking-[0.22em] text-[#D4AF37]">
                  Management
                </p>

                <h2 className="mt-2 text-lg text-white">
                  Quick Access
                </h2>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Link
                to="/admin/orders"
                className="group border border-white/10 bg-[#080808] p-4 transition hover:border-[#D4AF37]/30"
              >
                <FiShoppingBag
                  size={16}
                  className="text-white/25 transition group-hover:text-[#D4AF37]"
                />

                <p className="mt-4 text-xs text-white/65">
                  Orders
                </p>

                <p className="mt-1 text-[8px] text-white/20">
                  Manage customer orders
                </p>
              </Link>

              <Link
                to="/admin/products"
                className="group border border-white/10 bg-[#080808] p-4 transition hover:border-[#D4AF37]/30"
              >
                <FiPackage
                  size={16}
                  className="text-white/25 transition group-hover:text-[#D4AF37]"
                />

                <p className="mt-4 text-xs text-white/65">
                  Products
                </p>

                <p className="mt-1 text-[8px] text-white/20">
                  Manage catalog
                </p>
              </Link>

              <Link
                to="/admin/inventory"
                className="group border border-white/10 bg-[#080808] p-4 transition hover:border-[#D4AF37]/30"
              >
                <FiBox
                  size={16}
                  className="text-white/25 transition group-hover:text-[#D4AF37]"
                />

                <p className="mt-4 text-xs text-white/65">
                  Inventory
                </p>

                <p className="mt-1 text-[8px] text-white/20">
                  Monitor stock
                </p>
              </Link>

              <Link
                to="/admin/payments"
                className="group border border-white/10 bg-[#080808] p-4 transition hover:border-[#D4AF37]/30"
              >
                <FiDollarSign
                  size={16}
                  className="text-white/25 transition group-hover:text-[#D4AF37]"
                />

                <p className="mt-4 text-xs text-white/65">
                  Payments
                </p>

                <p className="mt-1 text-[8px] text-white/20">
                  Review transactions
                </p>
              </Link>
            </div>
          </div>

          {/* RECENT ORDERS */}
          <div className="mt-8">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[8px] uppercase tracking-[0.22em] text-[#D4AF37]">
                  Activity
                </p>

                <h2 className="mt-2 text-lg text-white">
                  Recent Orders
                </h2>
              </div>

              <Link
                to="/admin/orders"
                className="shrink-0 text-[8px] uppercase tracking-[0.16em] text-white/30 transition hover:text-[#D4AF37]"
              >
                View All
              </Link>
            </div>

            {!dashboard?.recent_orders?.length ? (
              <div className="border-x border-b border-white/10 bg-[#080808] px-5 py-12 text-center">
                <FiShoppingBag
                  size={20}
                  className="mx-auto text-white/15"
                />

                <p className="mt-4 text-xs text-white/30">
                  No recent orders.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10 border-x border-b border-white/10 bg-[#080808]">
                {dashboard.recent_orders.map(
                  (order) => (
                    <Link
                      key={order.id}
                      to={`/admin/orders/${order.id}`}
                      className="block p-4 transition hover:bg-white/[0.02] sm:p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-medium text-white/75">
                              {order.order_number}
                            </p>

                            <span
                              className={`w-fit border px-2 py-1 text-[7px] uppercase tracking-[0.14em] ${getStatusStyle(
                                order.order_status
                              )}`}
                            >
                              {order.order_status}
                            </span>
                          </div>

                          <p className="mt-2 break-words text-xs text-white/40">
                            {`${order.first_name || ""} ${order.last_name || ""}`.trim() ||
                              "Customer"}
                          </p>

                          <p className="mt-1 break-all text-[9px] text-white/20">
                            {order.email}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-end justify-between gap-5 md:justify-end md:text-right">
                          <div>
                            <p className="text-[7px] uppercase tracking-[0.15em] text-white/20">
                              Payment
                            </p>

                            <p className="mt-1 text-[9px] uppercase text-white/45">
                              {order.payment_method} ·{" "}
                              {order.payment_status}
                            </p>
                          </div>

                          <div>
                            <p className="text-[7px] uppercase tracking-[0.15em] text-white/20">
                              Total
                            </p>

                            <p className="mt-1 text-sm text-[#D4AF37]">
                              {formatCurrency(
                                order.total_amount
                              )}
                            </p>
                          </div>

                          <div className="basis-full md:basis-auto">
                            <p className="text-[8px] text-white/20">
                              {formatDate(
                                order.created_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
