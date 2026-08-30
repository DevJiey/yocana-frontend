import { API_URL } from "../../config/api";
import { useEffect, useState } from "react"
import {
    FiAlertTriangle,
    FiBarChart2,
    FiBox,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiDollarSign,
    FiPackage,
    FiRefreshCw,
    FiRotateCcw,
    FiShoppingBag,
    FiTrendingUp,
    FiXCircle,
    FiDownload,
    FiPrinter,
} from "react-icons/fi"

import AdminLayout from "../../layouts/AdminLayout"
import BrandLoader from "../../components/BrandLoader"
import yocanaLogo from "../../assets/yocana-logo-gold.png"

function AdminReports() {
    const [activeTab, setActiveTab] = useState("overview")

    const [overview, setOverview] = useState(null)
    const [sales, setSales] = useState(null)
    const [orders, setOrders] = useState(null)
    const [inventory, setInventory] = useState(null)

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState("")

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const token = localStorage.getItem("yocana_token")

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
        }).format(new Date(date))
    }

    const fetchReport = async (url) => {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Failed to load report"
            )
        }

        return data
    }

    const loadReports = async (silent = false) => {
        try {
            if (silent) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError("")

            const params = new URLSearchParams()

            if (startDate) {
                params.append("start_date", startDate)
            }

            if (endDate) {
                params.append("end_date", endDate)
            }

            const queryString = params.toString()
            const suffix = queryString ? `?${queryString}` : ""

            const [
                overviewData,
                salesData,
                ordersData,
                inventoryData,
            ] = await Promise.all([
                fetchReport(
                    `${API_URL}/api/reports/overview`
                ),
                fetchReport(
                    `${API_URL}/api/reports/sales${suffix}`
                ),
                fetchReport(
                    `${API_URL}/api/reports/orders${suffix}`
                ),
                fetchReport(
                    `${API_URL}/api/reports/inventory`
                ),
            ])

            setOverview(overviewData.report)
            setSales(salesData.sales)
            setOrders(ordersData.orders)
            setInventory(inventoryData.inventory)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        loadReports()
    }, [])

    const handleApplyFilter = () => {
        if (
            startDate &&
            endDate &&
            new Date(startDate) > new Date(endDate)
        ) {
            setError(
                "Start date cannot be later than end date."
            )
            return
        }

        loadReports(true)
    }

    const handleClearFilter = () => {
        setStartDate("")
        setEndDate("")
    }

    const handleExportCSV = () => {
        let rows = []
        let filename = "yocana-report.csv"

        if (activeTab === "sales") {
            filename = "yocana-sales-report.csv"

            rows = [
                ["Date", "Paid Orders", "Total Sales"],
                ...(sales?.by_date || []).map((item) => [
                    formatDate(item.sale_date),
                    item.total_orders,
                    Number(item.total_sales || 0).toFixed(2),
                ]),
            ]
        } else if (activeTab === "orders") {
            filename = "yocana-orders-report.csv"

            rows = [
                ["Date", "Total Orders"],
                ...(orders?.by_date || []).map((item) => [
                    formatDate(item.order_date),
                    item.total_orders,
                ]),
            ]
        } else if (activeTab === "inventory") {
            filename = "yocana-inventory-report.csv"

            rows = [
                [
                    "Product",
                    "Category",
                    "Current Stock",
                    "Low Stock Threshold",
                ],
                ...(inventory?.products || []).map((product) => [
                    product.product_name,
                    product.category,
                    product.current_stock,
                    product.low_stock_threshold,
                ]),
            ]
        } else {
            filename = "yocana-overview-report.csv"

            rows = [
                ["Metric", "Value"],
                [
                    "Total Sales",
                    Number(
                        overview?.sales?.total_sales || 0
                    ).toFixed(2),
                ],
                [
                    "Total Orders",
                    overview?.orders?.total_orders || 0,
                ],
                [
                    "Products Sold",
                    overview?.products?.products_sold || 0,
                ],
                [
                    "Current Stock",
                    overview?.inventory?.current_stock || 0,
                ],
                [
                    "Low Stock Products",
                    overview?.inventory?.low_stock_products || 0,
                ],
                [
                    "Out of Stock Products",
                    overview?.inventory?.out_of_stock_products || 0,
                ],
            ]
        }

        const escapeCSV = (value) => {
            const stringValue = String(value ?? "")

            return `"${stringValue.replace(/"/g, '""')}"`
        }

        const csvContent = rows
            .map((row) =>
                row.map(escapeCSV).join(",")
            )
            .join("\n")

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        })

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")

        link.href = url
        link.download = filename

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        URL.revokeObjectURL(url)
    }

    const handlePrintReport = () => {
        const printWindow = window.open(
            "",
            "_blank",
            "width=1000,height=800"
        )

        if (!printWindow) {
            setError(
                "Unable to open print window. Please allow pop-ups and try again."
            )
            return
        }

        const reportTitle = {
            overview: "Overview Report",
            sales: "Sales Report",
            orders: "Orders Report",
            inventory: "Inventory Report",
        }[activeTab]

        const dateRange =
            startDate || endDate
                ? `${startDate || "Beginning"} to ${endDate || "Present"}`
                : "All Time"

        const escapeHTML = (value) => {
            return String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
        }

        const metricCard = (label, value) => `
    <div class="metric">
      <span>${escapeHTML(label)}</span>
      <strong>${escapeHTML(value)}</strong>
    </div>
  `

        let reportBody = ""

        // =========================
        // OVERVIEW REPORT
        // =========================
        if (activeTab === "overview") {
            reportBody = `
      <section>
        <h3>Business Overview</h3>

        <div class="metrics">
          ${metricCard(
                "Total Sales",
                formatCurrency(
                    overview?.sales?.total_sales
                )
            )}

          ${metricCard(
                "Total Orders",
                overview?.orders?.total_orders ?? 0
            )}

          ${metricCard(
                "Products Sold",
                overview?.products?.products_sold ?? 0
            )}

          ${metricCard(
                "Current Stock",
                overview?.inventory?.current_stock ?? 0
            )}
        </div>
      </section>

      <section>
        <h3>Order Status</h3>

        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th class="number">Orders</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Pending</td>
              <td class="number">
                ${overview?.orders?.pending_orders ?? 0}
              </td>
            </tr>

            <tr>
              <td>Completed</td>
              <td class="number">
                ${overview?.orders?.completed_orders ?? 0}
              </td>
            </tr>

            <tr>
              <td>Cancelled</td>
              <td class="number">
                ${overview?.orders?.cancelled_orders ?? 0}
              </td>
            </tr>

            <tr>
              <td>Returned</td>
              <td class="number">
                ${overview?.orders?.returned_orders ?? 0}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h3>Inventory Status</h3>

        <table>
          <thead>
            <tr>
              <th>Inventory Metric</th>
              <th class="number">Value</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Total Products</td>
              <td class="number">
                ${overview?.inventory?.total_products ?? 0}
              </td>
            </tr>

            <tr>
              <td>Available Units</td>
              <td class="number">
                ${overview?.inventory?.current_stock ?? 0}
              </td>
            </tr>

            <tr>
              <td>Low Stock Products</td>
              <td class="number">
                ${overview?.inventory?.low_stock_products ?? 0}
              </td>
            </tr>

            <tr>
              <td>Out of Stock Products</td>
              <td class="number">
                ${overview?.inventory?.out_of_stock_products ?? 0}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    `
        }

        // =========================
        // SALES REPORT
        // =========================
        if (activeTab === "sales") {
            const salesRows =
                sales?.by_date?.length
                    ? sales.by_date
                        .map(
                            (item) => `
                <tr>
                  <td>
                    ${escapeHTML(
                                formatDate(item.sale_date)
                            )}
                  </td>

                  <td class="number">
                    ${Number(item.total_orders || 0)}
                  </td>

                  <td class="number">
                    ${escapeHTML(
                                formatCurrency(
                                    item.total_sales
                                )
                            )}
                  </td>
                </tr>
              `
                        )
                        .join("")
                    : `
            <tr>
              <td colspan="3" class="empty">
                No sales records found.
              </td>
            </tr>
          `

            const productRows =
                sales?.products?.length
                    ? sales.products
                        .map(
                            (product) => `
                <tr>
                  <td>
                    ${escapeHTML(
                                product.product_name
                            )}
                  </td>

                  <td>
                    ${escapeHTML(
                                product.category
                            )}
                  </td>

                  <td class="number">
                    ${Number(
                                product.quantity_sold || 0
                            )}
                  </td>

                  <td class="number">
                    ${escapeHTML(
                                formatCurrency(
                                    product.product_sales
                                )
                            )}
                  </td>
                </tr>
              `
                        )
                        .join("")
                    : `
            <tr>
              <td colspan="4" class="empty">
                No product sales found.
              </td>
            </tr>
          `

            reportBody = `
      <section>
        <h3>Sales Summary</h3>

        <div class="metrics three">
          ${metricCard(
                "Total Sales",
                formatCurrency(sales?.total_sales)
            )}

          ${metricCard(
                "Paid Orders",
                sales?.total_paid_orders ?? 0
            )}

          ${metricCard(
                "Average Order Value",
                formatCurrency(
                    sales?.average_order_value
                )
            )}
        </div>
      </section>

      <section>
        <h3>Sales by Date</h3>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th class="number">Paid Orders</th>
              <th class="number">Total Sales</th>
            </tr>
          </thead>

          <tbody>
            ${salesRows}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Product Sales</h3>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th class="number">Qty Sold</th>
              <th class="number">Sales</th>
            </tr>
          </thead>

          <tbody>
            ${productRows}
          </tbody>
        </table>
      </section>
    `
        }

        // =========================
        // ORDERS REPORT
        // =========================
        if (activeTab === "orders") {
            const orderRows =
                orders?.by_date?.length
                    ? orders.by_date
                        .map(
                            (item) => `
                <tr>
                  <td>
                    ${escapeHTML(
                                formatDate(item.order_date)
                            )}
                  </td>

                  <td class="number">
                    ${Number(item.total_orders || 0)}
                  </td>
                </tr>
              `
                        )
                        .join("")
                    : `
            <tr>
              <td colspan="2" class="empty">
                No order records found.
              </td>
            </tr>
          `

            reportBody = `
      <section>
        <h3>Order Summary</h3>

        <div class="metrics">
          ${metricCard(
                "Total Orders",
                orders?.total_orders ?? 0
            )}

          ${metricCard(
                "Pending",
                orders?.pending_orders ?? 0
            )}

          ${metricCard(
                "Preparing",
                orders?.preparing_orders ?? 0
            )}

          ${metricCard(
                "Shipped",
                orders?.shipped_orders ?? 0
            )}

          ${metricCard(
                "Completed",
                orders?.completed_orders ?? 0
            )}

          ${metricCard(
                "Cancelled",
                orders?.cancelled_orders ?? 0
            )}

          ${metricCard(
                "Returned",
                orders?.returned_orders ?? 0
            )}
        </div>
      </section>

      <section>
        <h3>Orders by Date</h3>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th class="number">Total Orders</th>
            </tr>
          </thead>

          <tbody>
            ${orderRows}
          </tbody>
        </table>
      </section>
    `
        }

        // =========================
        // INVENTORY REPORT
        // =========================
        if (activeTab === "inventory") {
            const inventoryRows =
                inventory?.products?.length
                    ? inventory.products
                        .map((product) => {
                            const stock = Number(
                                product.current_stock || 0
                            )

                            const threshold = Number(
                                product.low_stock_threshold || 0
                            )

                            let status = "In Stock"

                            if (stock === 0) {
                                status = "Out of Stock"
                            } else if (stock <= threshold) {
                                status = "Low Stock"
                            }

                            return `
                <tr>
                  <td>
                    ${escapeHTML(
                                product.product_name
                            )}
                  </td>

                  <td>
                    ${escapeHTML(
                                product.category
                            )}
                  </td>

                  <td class="number">
                    ${stock}
                  </td>

                  <td class="number">
                    ${threshold}
                  </td>

                  <td>
                    ${status}
                  </td>
                </tr>
              `
                        })
                        .join("")
                    : `
            <tr>
              <td colspan="5" class="empty">
                No inventory records found.
              </td>
            </tr>
          `

            reportBody = `
      <section>
        <h3>Inventory Summary</h3>

        <div class="metrics">
          ${metricCard(
                "Total Products",
                inventory?.summary?.total_products ?? 0
            )}

          ${metricCard(
                "Current Stock",
                inventory?.summary?.current_stock ?? 0
            )}

          ${metricCard(
                "Low Stock",
                inventory?.summary?.low_stock_products ?? 0
            )}

          ${metricCard(
                "Out of Stock",
                inventory?.summary?.out_of_stock_products ?? 0
            )}
        </div>
      </section>

      <section>
        <h3>Current Inventory</h3>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th class="number">Stock</th>
              <th class="number">Threshold</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            ${inventoryRows}
          </tbody>
        </table>
      </section>
    `
        }

        printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />

        <title>
          YOCANA - ${reportTitle}
        </title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #ffffff;
            color: #171717;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
            font-size: 11px;
            line-height: 1.5;
          }

          .page {
            width: 100%;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 30px;
            padding-bottom: 18px;
            border-bottom: 2px solid #171717;
          }

          .brand-wrap {
            display: flex;
            align-items: center;
          }

          .brand-logo {
            display: block;
            width: 105px;
            height: auto;
            object-fit: contain;
          }

          .title {
            margin: 7px 0 0;
            font-size: 16px;
            font-weight: 500;
          }

          .meta {
            text-align: right;
            color: #666666;
            font-size: 9px;
            line-height: 1.7;
          }

          section {
            margin-top: 26px;
            break-inside: avoid;
          }

          h3 {
            margin: 0 0 10px;
            padding-bottom: 7px;
            border-bottom: 1px solid #d7d7d7;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.4px;
          }

          .metrics {
            display: grid;
            grid-template-columns:
              repeat(4, 1fr);
            gap: 8px;
          }

          .metrics.three {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .metric {
            min-height: 65px;
            padding: 12px;
            border: 1px solid #dcdcdc;
          }

          .metric span {
            display: block;
            color: #777777;
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }

          .metric strong {
            display: block;
            margin-top: 8px;
            font-size: 15px;
            font-weight: 600;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          thead {
            display: table-header-group;
          }

          tr {
            break-inside: avoid;
          }

          th {
            padding: 9px 10px;
            border: 1px solid #cccccc;
            background: #f1f1f1;
            text-align: left;
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.6px;
          }

          td {
            padding: 9px 10px;
            border: 1px solid #dddddd;
            vertical-align: middle;
          }

          .number {
            text-align: right;
          }

          .empty {
            padding: 25px;
            text-align: center;
            color: #777777;
          }

          .footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #dddddd;
            color: #888888;
            font-size: 8px;
            text-align: center;
            letter-spacing: 0.5px;
          }

          @page {
            size: A4;
            margin: 14mm;
          }

          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>

      <body>
        <div class="page">

          <header class="header">
            <div>
              <div class="brand-wrap">
                <img
                    src="${yocanaLogo}"
                    alt="YOCANA"
                    class="brand-logo"
                />
                </div>

              <h2 class="title">
                ${reportTitle}
              </h2>
            </div>

            <div class="meta">
              <strong>Period:</strong>
              ${escapeHTML(dateRange)}
              <br />

              <strong>Generated:</strong>
              ${escapeHTML(
            new Date().toLocaleString("en-PH")
        )}
            </div>
          </header>

          ${reportBody}

          <footer class="footer">
            YOCANA · ${reportTitle} · Generated from
            YOCANA Administration System
          </footer>

        </div>
      </body>
    </html>
  `)

        printWindow.document.close()

        printWindow.onload = () => {
            printWindow.focus()

            setTimeout(() => {
                printWindow.print()
            }, 150)
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <BrandLoader
                    show={true}
                    status="loading"
                    message="Loading Reports"
                />
            </AdminLayout>
        )
    }

    const overviewStats = [
        {
            label: "Total Sales",
            value: formatCurrency(
                overview?.sales?.total_sales
            ),
            icon: FiDollarSign,
            gold: true,
        },
        {
            label: "Total Orders",
            value: overview?.orders?.total_orders ?? 0,
            icon: FiShoppingBag,
        },
        {
            label: "Products Sold",
            value: overview?.products?.products_sold ?? 0,
            icon: FiPackage,
        },
        {
            label: "Current Stock",
            value:
                overview?.inventory?.current_stock ?? 0,
            icon: FiBox,
        },
    ]

    const tabs = [
        {
            id: "overview",
            label: "Overview",
            icon: FiBarChart2,
        },
        {
            id: "sales",
            label: "Sales",
            icon: FiTrendingUp,
        },
        {
            id: "orders",
            label: "Orders",
            icon: FiShoppingBag,
        },
        {
            id: "inventory",
            label: "Inventory",
            icon: FiBox,
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
                                Analytics
                            </p>

                            <h1 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
                                Reports & Analytics
                            </h1>

                            <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                                Review sales, orders and inventory
                                performance across YOCANA.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                className="flex h-10 w-fit items-center justify-center gap-2 border border-[#D4AF37]/25 px-4 text-[8px] uppercase tracking-[0.18em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
                            >
                                <FiDownload size={12} />
                                Export CSV
                            </button>

                            <button
                                type="button"
                                onClick={() => loadReports(true)}
                                disabled={refreshing}
                                className="flex h-10 w-fit items-center justify-center gap-2 border border-white/10 px-4 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FiRefreshCw
                                    size={12}
                                    className={refreshing ? "animate-spin" : ""}
                                />

                                {refreshing ? "Refreshing" : "Refresh"}
                            </button>
                            <button
                                type="button"
                                onClick={handlePrintReport}
                                className="flex h-10 w-fit items-center justify-center gap-2 border border-white/10 px-4 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                            >
                                <FiPrinter size={12} />
                                Print
                            </button>
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mt-5 border border-red-500/20 bg-red-500/[0.04] p-4">
                            <p className="text-xs text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* TABS */}
                    <div className="mt-6 overflow-x-auto border-b border-white/10">
                        <div className="flex min-w-max gap-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon

                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() =>
                                            setActiveTab(tab.id)
                                        }
                                        className={`flex h-11 items-center gap-2 border-b px-1 text-[8px] uppercase tracking-[0.18em] transition ${activeTab === tab.id
                                            ? "border-[#D4AF37] text-[#D4AF37]"
                                            : "border-transparent text-white/30 hover:text-white/60"
                                            }`}
                                    >
                                        <Icon size={12} />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* OVERVIEW */}
                    <div id="printable-report">
                        {activeTab === "overview" && (
                            <div>
                                <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                    {overviewStats.map((stat) => {
                                        const Icon = stat.icon

                                        return (
                                            <div
                                                key={stat.label}
                                                className={`border p-4 sm:p-5 ${stat.gold
                                                    ? "border-[#D4AF37]/20 bg-[#D4AF37]/[0.025]"
                                                    : "border-white/10 bg-[#080808]"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p
                                                            className={`text-[7px] uppercase tracking-[0.18em] ${stat.gold
                                                                ? "text-[#D4AF37]/70"
                                                                : "text-white/25"
                                                                }`}
                                                        >
                                                            {stat.label}
                                                        </p>

                                                        <p
                                                            className={`mt-3 break-words text-xl font-medium sm:text-2xl ${stat.gold
                                                                ? "text-[#D4AF37]"
                                                                : "text-white"
                                                                }`}
                                                        >
                                                            {stat.value}
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={`flex h-9 w-9 shrink-0 items-center justify-center border ${stat.gold
                                                            ? "border-[#D4AF37]/20 text-[#D4AF37]"
                                                            : "border-white/10 text-white/25"
                                                            }`}
                                                    >
                                                        <Icon size={15} />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="mt-6 grid gap-3 md:grid-cols-2">
                                    <ReportSummary
                                        title="Order Status"
                                        subtitle="Current order distribution"
                                        items={[
                                            {
                                                label: "Pending",
                                                value:
                                                    overview?.orders
                                                        ?.pending_orders ?? 0,
                                                icon: FiClock,
                                            },
                                            {
                                                label: "Completed",
                                                value:
                                                    overview?.orders
                                                        ?.completed_orders ?? 0,
                                                icon: FiCheckCircle,
                                            },
                                            {
                                                label: "Cancelled",
                                                value:
                                                    overview?.orders
                                                        ?.cancelled_orders ?? 0,
                                                icon: FiXCircle,
                                            },
                                            {
                                                label: "Returned",
                                                value:
                                                    overview?.orders
                                                        ?.returned_orders ?? 0,
                                                icon: FiRotateCcw,
                                            },
                                        ]}
                                    />

                                    <ReportSummary
                                        title="Inventory Status"
                                        subtitle="Current stock condition"
                                        items={[
                                            {
                                                label: "Products",
                                                value:
                                                    overview?.inventory
                                                        ?.total_products ?? 0,
                                                icon: FiPackage,
                                            },
                                            {
                                                label: "Available Units",
                                                value:
                                                    overview?.inventory
                                                        ?.current_stock ?? 0,
                                                icon: FiBox,
                                            },
                                            {
                                                label: "Low Stock",
                                                value:
                                                    overview?.inventory
                                                        ?.low_stock_products ?? 0,
                                                icon: FiAlertTriangle,
                                            },
                                            {
                                                label: "Out of Stock",
                                                value:
                                                    overview?.inventory
                                                        ?.out_of_stock_products ?? 0,
                                                icon: FiXCircle,
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        )}

                        {/* SALES */}
                        {activeTab === "sales" && (
                            <div>
                                <DateFilter
                                    startDate={startDate}
                                    endDate={endDate}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    onApply={handleApplyFilter}
                                    onClear={handleClearFilter}
                                    refreshing={refreshing}
                                />

                                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
                                    <StatCard
                                        label="Total Sales"
                                        value={formatCurrency(
                                            sales?.total_sales
                                        )}
                                        icon={FiDollarSign}
                                        gold
                                    />

                                    <StatCard
                                        label="Paid Orders"
                                        value={
                                            sales?.total_paid_orders ?? 0
                                        }
                                        icon={FiShoppingBag}
                                    />

                                    <StatCard
                                        label="Average Order"
                                        value={formatCurrency(
                                            sales?.average_order_value
                                        )}
                                        icon={FiTrendingUp}
                                    />
                                </div>

                                <SectionHeader
                                    eyebrow="Performance"
                                    title="Sales by Date"
                                />

                                <div className="overflow-hidden border border-white/10 bg-[#080808]">
                                    {!sales?.by_date?.length ? (
                                        <EmptyState message="No sales found for this period." />
                                    ) : (
                                        <div className="divide-y divide-white/10">
                                            {sales.by_date.map((item) => (
                                                <div
                                                    key={item.sale_date}
                                                    className="flex items-center justify-between gap-4 p-4 sm:p-5"
                                                >
                                                    <div>
                                                        <p className="text-xs text-white/65">
                                                            {formatDate(
                                                                item.sale_date
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-[8px] text-white/20">
                                                            {item.total_orders} paid{" "}
                                                            {item.total_orders === 1
                                                                ? "order"
                                                                : "orders"}
                                                        </p>
                                                    </div>

                                                    <p className="shrink-0 text-sm text-[#D4AF37]">
                                                        {formatCurrency(
                                                            item.total_sales
                                                        )}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <SectionHeader
                                    eyebrow="Products"
                                    title="Product Sales"
                                />

                                <div className="overflow-hidden border border-white/10 bg-[#080808]">
                                    {!sales?.products?.length ? (
                                        <EmptyState message="No product sales found." />
                                    ) : (
                                        <div className="divide-y divide-white/10">
                                            {sales.products.map(
                                                (product, index) => (
                                                    <div
                                                        key={product.product_id}
                                                        className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                                                    >
                                                        <div className="flex min-w-0 items-center gap-4">
                                                            <span className="text-[9px] text-[#D4AF37]/50">
                                                                {String(
                                                                    index + 1
                                                                ).padStart(2, "0")}
                                                            </span>

                                                            <div className="min-w-0">
                                                                <p className="truncate text-xs text-white/65">
                                                                    {
                                                                        product.product_name
                                                                    }
                                                                </p>

                                                                <p className="mt-1 text-[8px] uppercase tracking-[0.15em] text-white/20">
                                                                    {product.category} ·{" "}
                                                                    {
                                                                        product.quantity_sold
                                                                    }{" "}
                                                                    sold
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-[#D4AF37]">
                                                            {formatCurrency(
                                                                product.product_sales
                                                            )}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ORDERS */}
                        {activeTab === "orders" && (
                            <div>
                                <DateFilter
                                    startDate={startDate}
                                    endDate={endDate}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    onApply={handleApplyFilter}
                                    onClear={handleClearFilter}
                                    refreshing={refreshing}
                                />

                                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                    <StatCard
                                        label="Total Orders"
                                        value={orders?.total_orders ?? 0}
                                        icon={FiShoppingBag}
                                        gold
                                    />

                                    <StatCard
                                        label="Pending"
                                        value={
                                            orders?.pending_orders ?? 0
                                        }
                                        icon={FiClock}
                                    />

                                    <StatCard
                                        label="Preparing"
                                        value={
                                            orders?.preparing_orders ?? 0
                                        }
                                        icon={FiPackage}
                                    />

                                    <StatCard
                                        label="Shipped"
                                        value={
                                            orders?.shipped_orders ?? 0
                                        }
                                        icon={FiBox}
                                    />

                                    <StatCard
                                        label="Completed"
                                        value={
                                            orders?.completed_orders ?? 0
                                        }
                                        icon={FiCheckCircle}
                                    />

                                    <StatCard
                                        label="Cancelled"
                                        value={
                                            orders?.cancelled_orders ?? 0
                                        }
                                        icon={FiXCircle}
                                    />

                                    <StatCard
                                        label="Returned"
                                        value={
                                            orders?.returned_orders ?? 0
                                        }
                                        icon={FiRotateCcw}
                                    />
                                </div>

                                <SectionHeader
                                    eyebrow="Activity"
                                    title="Orders by Date"
                                />

                                <div className="overflow-hidden border border-white/10 bg-[#080808]">
                                    {!orders?.by_date?.length ? (
                                        <EmptyState message="No orders found for this period." />
                                    ) : (
                                        <div className="divide-y divide-white/10">
                                            {orders.by_date.map((item) => (
                                                <div
                                                    key={item.order_date}
                                                    className="flex items-center justify-between gap-4 p-4 sm:p-5"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FiCalendar
                                                            size={13}
                                                            className="text-white/20"
                                                        />

                                                        <p className="text-xs text-white/60">
                                                            {formatDate(
                                                                item.order_date
                                                            )}
                                                        </p>
                                                    </div>

                                                    <p className="text-xs text-[#D4AF37]">
                                                        {item.total_orders}{" "}
                                                        {item.total_orders === 1
                                                            ? "order"
                                                            : "orders"}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* INVENTORY */}
                        {activeTab === "inventory" && (
                            <div>
                                <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                    <StatCard
                                        label="Products"
                                        value={
                                            inventory?.summary
                                                ?.total_products ?? 0
                                        }
                                        icon={FiPackage}
                                    />

                                    <StatCard
                                        label="Current Stock"
                                        value={
                                            inventory?.summary
                                                ?.current_stock ?? 0
                                        }
                                        icon={FiBox}
                                        gold
                                    />

                                    <StatCard
                                        label="Low Stock"
                                        value={
                                            inventory?.summary
                                                ?.low_stock_products ?? 0
                                        }
                                        icon={FiAlertTriangle}
                                    />

                                    <StatCard
                                        label="Out of Stock"
                                        value={
                                            inventory?.summary
                                                ?.out_of_stock_products ?? 0
                                        }
                                        icon={FiXCircle}
                                    />
                                </div>

                                <SectionHeader
                                    eyebrow="Stock"
                                    title="Current Inventory"
                                />

                                <div className="overflow-hidden border border-white/10 bg-[#080808]">
                                    {!inventory?.products?.length ? (
                                        <EmptyState message="No inventory records found." />
                                    ) : (
                                        <div className="divide-y divide-white/10">
                                            {inventory.products.map(
                                                (product) => {
                                                    const lowStock =
                                                        product.current_stock <=
                                                        product.low_stock_threshold

                                                    return (
                                                        <div
                                                            key={
                                                                product.inventory_id
                                                            }
                                                            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                                                        >
                                                            <div className="min-w-0">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <p className="text-xs text-white/65">
                                                                        {
                                                                            product.product_name
                                                                        }
                                                                    </p>

                                                                    {lowStock && (
                                                                        <span className="border border-yellow-500/20 px-2 py-1 text-[7px] uppercase tracking-[0.12em] text-yellow-400">
                                                                            Low Stock
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <p className="mt-1 text-[8px] uppercase tracking-[0.15em] text-white/20">
                                                                    {product.category}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-end gap-8 sm:text-right">
                                                                <div>
                                                                    <p className="text-[7px] uppercase tracking-[0.15em] text-white/20">
                                                                        Threshold
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-white/45">
                                                                        {
                                                                            product.low_stock_threshold
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-[7px] uppercase tracking-[0.15em] text-white/20">
                                                                        Stock
                                                                    </p>

                                                                    <p
                                                                        className={`mt-1 text-sm ${lowStock
                                                                            ? "text-yellow-400"
                                                                            : "text-[#D4AF37]"
                                                                            }`}
                                                                    >
                                                                        {
                                                                            product.current_stock
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AdminLayout>
    )
}

function StatCard({
    label,
    value,
    icon: Icon,
    gold = false,
}) {
    return (
        <div
            className={`border p-4 sm:p-5 ${gold
                ? "border-[#D4AF37]/20 bg-[#D4AF37]/[0.025]"
                : "border-white/10 bg-[#080808]"
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p
                        className={`text-[7px] uppercase tracking-[0.16em] ${gold
                            ? "text-[#D4AF37]/70"
                            : "text-white/25"
                            }`}
                    >
                        {label}
                    </p>

                    <p
                        className={`mt-3 break-words text-xl font-medium sm:text-2xl ${gold
                            ? "text-[#D4AF37]"
                            : "text-white"
                            }`}
                    >
                        {value}
                    </p>
                </div>

                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center border ${gold
                        ? "border-[#D4AF37]/20 text-[#D4AF37]"
                        : "border-white/10 text-white/25"
                        }`}
                >
                    <Icon size={15} />
                </div>
            </div>
        </div>
    )
}

function ReportSummary({
    title,
    subtitle,
    items,
}) {
    return (
        <div className="border border-white/10 bg-[#080808] p-4 sm:p-5">
            <p className="text-sm text-white/70">
                {title}
            </p>

            <p className="mt-1 text-[8px] text-white/20">
                {subtitle}
            </p>

            <div className="mt-5 divide-y divide-white/10">
                {items.map((item) => {
                    const Icon = item.icon

                    return (
                        <div
                            key={item.label}
                            className="flex items-center justify-between gap-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                <Icon
                                    size={12}
                                    className="text-white/25"
                                />

                                <span className="text-[9px] text-white/40">
                                    {item.label}
                                </span>
                            </div>

                            <span className="text-xs text-white/70">
                                {item.value}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function DateFilter({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    onApply,
    onClear,
    refreshing,
}) {
    return (
        <div className="mt-6 border border-white/10 bg-[#080808] p-4 sm:p-5">
            <div className="flex items-center gap-2">
                <FiCalendar
                    size={13}
                    className="text-[#D4AF37]"
                />

                <p className="text-[8px] uppercase tracking-[0.18em] text-white/40">
                    Date Range
                </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end">
                <label className="block">
                    <span className="text-[8px] uppercase tracking-[0.15em] text-white/25">
                        Start Date
                    </span>

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) =>
                            setStartDate(e.target.value)
                        }
                        className="mt-2 h-11 w-full border border-white/10 bg-black px-3 text-xs text-white/70 outline-none transition focus:border-[#D4AF37]/40"
                    />
                </label>

                <label className="block">
                    <span className="text-[8px] uppercase tracking-[0.15em] text-white/25">
                        End Date
                    </span>

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) =>
                            setEndDate(e.target.value)
                        }
                        className="mt-2 h-11 w-full border border-white/10 bg-black px-3 text-xs text-white/70 outline-none transition focus:border-[#D4AF37]/40"
                    />
                </label>

                <button
                    type="button"
                    onClick={onApply}
                    disabled={refreshing}
                    className="h-11 w-fit border border-[#D4AF37]/30 px-5 text-[8px] uppercase tracking-[0.16em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black disabled:opacity-40"
                >
                    Apply
                </button>

                <button
                    type="button"
                    onClick={onClear}
                    disabled={refreshing}
                    className="h-11 w-fit border border-white/10 px-5 text-[8px] uppercase tracking-[0.16em] text-white/35 transition hover:border-white/25 hover:text-white/60 disabled:opacity-40"
                >
                    Clear
                </button>
            </div>
        </div>
    )
}

function SectionHeader({
    eyebrow,
    title,
}) {
    return (
        <div className="mt-8 border-b border-white/10 pb-4">
            <p className="text-[8px] uppercase tracking-[0.22em] text-[#D4AF37]">
                {eyebrow}
            </p>

            <h2 className="mt-2 text-lg text-white">
                {title}
            </h2>
        </div>
    )
}

function EmptyState({ message }) {
    return (
        <div className="px-5 py-12 text-center">
            <FiBarChart2
                size={20}
                className="mx-auto text-white/15"
            />

            <p className="mt-4 text-xs text-white/30">
                {message}
            </p>
        </div>
    )
}

export default AdminReports
