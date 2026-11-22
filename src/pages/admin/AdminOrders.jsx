import { API_URL } from "../../config/api";
import { useEffect, useState } from "react";
import {
    FiPackage,
    FiRefreshCw,
    FiSearch,
    FiUser,
    FiCreditCard,
    FiDownload,
    FiPrinter,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";

function AdminOrders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const token = localStorage.getItem("yocana_token");

    const formatPrice = (value) =>
        Number(value || 0).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const formatDate = (value) => {
        if (!value) return "—";

        return new Date(value).toLocaleString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const formatPaymentMethod = (method) => {
        const labels = {
            COD: "Cash on Delivery",
            GCASH: "GCash",
            MAYA: "Maya",
            CARD: "Card",
            BANK: "Online Banking",
        };

        return labels[method] || method;
    };

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/api/orders/admin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to load orders");
            }

            setOrders(data.orders || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        const searchValue = search.trim().toLowerCase();

        const fullName =
            `${order.first_name || ""} ${order.last_name || ""}`.toLowerCase();
        const recipient = (order.recipient_name || "").toLowerCase();

        const matchesSearch =
            !searchValue ||
            order.order_number?.toLowerCase().includes(searchValue) ||
            fullName.includes(searchValue) ||
            recipient.includes(searchValue) ||
            order.email?.toLowerCase().includes(searchValue);

        const matchesStatus =
            status === "all" || order.order_status === status;

        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (orderStatus) => {
        switch (orderStatus) {
            case "delivered":
                return "border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] text-[#D4AF37]";

            case "shipped":
                return "border-blue-400/20 bg-blue-400/[0.04] text-blue-300";

            case "preparing":
                return "border-orange-400/20 bg-orange-400/[0.04] text-orange-300";

            case "cancelled":
                return "border-red-400/20 bg-red-400/[0.04] text-red-400";

            default:
                return "border-white/10 bg-white/[0.02] text-white/40";
        }
    };

    // ==========================================
    // EXPORT ORDERS TO CSV (PRODUCTION READY)
    // ==========================================
    const handleExportCSV = () => {
        if (!filteredOrders.length) {
            alert("No orders available to export.");
            return;
        }

        const escapeCSV = (value) => {
            const stringValue = String(value ?? "");
            return `"${stringValue.replace(/"/g, '""')}"`;
        };

        const headers = [
            "Order Number",
            "Order Date",
            "Customer Name",
            "Customer Email",
            "Phone Number",
            "Items Purchased (Ano ang Binili)",
            "Total Qty",
            "Subtotal (PHP)",
            "Shipping Fee (PHP)",
            "Total Amount (PHP)",
            "Payment Method",
            "Payment Status",
            "Order Status",
            "Recipient Name",
            "Shipping Address",
            "City",
            "Province",
            "Region",
            "Courier",
            "Tracking Number",
        ];

        const rows = filteredOrders.map((order) => {
            const customerName =
                `${order.first_name || ""} ${order.last_name || ""}`.trim() ||
                order.recipient_name ||
                "—";

            let itemsSummary = "—";
            let totalQty = 0;

            if (Array.isArray(order.items) && order.items.length > 0) {
                itemsSummary = order.items
                    .map((item) => {
                        const qty = Number(item.quantity || 1);
                        totalQty += qty;
                        const price = Number(item.price || 0);
                        return `${item.product_name || "Yocana Fragrance"} (Qty: ${qty}${
                            price ? `, ₱${price.toLocaleString("en-PH")}` : ""
                        })`;
                    })
                    .join(" | ");
            }

            const fullAddress =
                [
                    order.shipping_address_line,
                    order.shipping_barangay,
                    order.shipping_city,
                    order.shipping_province,
                    order.shipping_postal_code,
                ]
                    .filter(Boolean)
                    .join(", ") ||
                order.shipping_address ||
                "—";

            return [
                order.order_number || "—",
                formatDate(order.created_at),
                customerName,
                order.email || "—",
                order.recipient_phone || order.user_phone || order.phone || "—",
                itemsSummary,
                totalQty || (order.items?.length ?? 1),
                Number(order.subtotal || 0).toFixed(2),
                Number(order.shipping_fee || 0).toFixed(2),
                Number(order.total_amount || 0).toFixed(2),
                formatPaymentMethod(order.payment_method),
                (order.payment_status || "").toUpperCase(),
                (order.order_status || "").toUpperCase(),
                order.recipient_name || customerName,
                fullAddress,
                order.shipping_city || "—",
                order.shipping_province || "—",
                order.shipping_region || "—",
                order.courier_name || "SPX Express",
                order.tracking_number || "—",
            ];
        });

        // Add UTF-8 BOM so Excel opens Filipino names & special characters properly
        const csvContent =
            "\uFEFF" +
            [headers, ...rows]
                .map((row) => row.map(escapeCSV).join(","))
                .join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const dateStr = new Date().toISOString().slice(0, 10);
        const filename = `yocana-orders-export-${dateStr}.csv`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // ==========================================
    // PRINT ORDERS SUMMARY (INK-FRIENDLY & CLEAN)
    // ==========================================
    const handlePrintOrders = () => {
        if (!filteredOrders.length) {
            alert("No orders to print.");
            return;
        }

        const printWindow = window.open("", "_blank", "width=1150,height=850");
        if (!printWindow) {
            alert("Please allow pop-ups to print orders summary.");
            return;
        }

        const escapeHTML = (val) =>
            String(val ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");

        const totalRevenue = filteredOrders.reduce(
            (sum, o) => sum + Number(o.total_amount || 0),
            0
        );

        const orderRows = filteredOrders
            .map((order, idx) => {
                const customerName =
                    `${order.first_name || ""} ${order.last_name || ""}`.trim() ||
                    order.recipient_name ||
                    "—";

                const itemsPurchased =
                    Array.isArray(order.items) && order.items.length > 0
                        ? order.items
                              .map(
                                  (i) =>
                                      `<strong>${escapeHTML(
                                          i.product_name
                                      )}</strong> (${i.quantity}x)`
                              )
                              .join("<br/>")
                        : "—";

                return `
                <tr>
                    <td class="number text-muted">${idx + 1}</td>
                    <td><strong>${escapeHTML(
                        order.order_number
                    )}</strong><br/><span class="date">${escapeHTML(
                    formatDate(order.created_at)
                )}</span></td>
                    <td><strong>${escapeHTML(
                        customerName
                    )}</strong><br/><span class="email">${escapeHTML(
                    order.email || "—"
                )}</span></td>
                    <td>${itemsPurchased}</td>
                    <td>${escapeHTML(
                        formatPaymentMethod(order.payment_method)
                    )}<br/><span class="status-tag ${escapeHTML(
                    order.payment_status
                )}">${escapeHTML(order.payment_status?.toUpperCase())}</span></td>
                    <td><span class="status-badge ${escapeHTML(
                        order.order_status
                    )}">${escapeHTML(order.order_status?.toUpperCase())}</span></td>
                    <td class="number price">₱${Number(
                        order.total_amount || 0
                    ).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}</td>
                </tr>
            `;
            })
            .join("");

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8"/>
                <title>YOCANA - Orders Summary Report</title>
                <style>
                    * { box-sizing: border-box; }
                    body {
                        margin: 0;
                        padding: 24px;
                        background: #ffffff;
                        color: #171717;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                        font-size: 11px;
                        line-height: 1.45;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        border-bottom: 2px solid #111;
                        padding-bottom: 14px;
                        margin-bottom: 16px;
                    }
                    .brand h1 {
                        margin: 0;
                        font-size: 22px;
                        letter-spacing: 3px;
                        font-weight: 700;
                        color: #111;
                    }
                    .brand p {
                        margin: 3px 0 0;
                        font-size: 9px;
                        text-transform: uppercase;
                        letter-spacing: 1.5px;
                        color: #666;
                    }
                    .meta {
                        text-align: right;
                        font-size: 10px;
                        color: #555;
                    }
                    .metrics {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 12px;
                        margin-bottom: 18px;
                    }
                    .card {
                        padding: 10px 14px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        background: #fafafa;
                    }
                    .card span {
                        display: block;
                        font-size: 8.5px;
                        text-transform: uppercase;
                        letter-spacing: 0.8px;
                        color: #666;
                    }
                    .card strong {
                        display: block;
                        margin-top: 4px;
                        font-size: 16px;
                        color: #111;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 10.5px;
                    }
                    th {
                        background: #f1f1f1;
                        border: 1px solid #ccc;
                        padding: 8px 10px;
                        text-align: left;
                        font-size: 8.5px;
                        text-transform: uppercase;
                        letter-spacing: 0.6px;
                        color: #333;
                    }
                    td {
                        border: 1px solid #ddd;
                        padding: 8px 10px;
                        vertical-align: top;
                    }
                    .number { text-align: right; }
                    .text-muted { color: #888; font-size: 9px; }
                    .date { font-size: 9px; color: #666; }
                    .email { font-size: 9.5px; color: #0284c7; }
                    .price { font-weight: 600; color: #111; }
                    .status-badge {
                        display: inline-block;
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-size: 8px;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        background: #eee;
                        color: #333;
                    }
                    .status-badge.delivered { background: #dcfce7; color: #166534; }
                    .status-badge.shipped { background: #e0f2fe; color: #0369a1; }
                    .status-badge.preparing { background: #fef3c7; color: #92400e; }
                    .status-badge.cancelled { background: #fee2e2; color: #991b1b; }
                    .status-tag { font-size: 8px; color: #666; }
                    .status-tag.paid { color: #16a34a; font-weight: 600; }
                    .footer {
                        margin-top: 24px;
                        border-top: 1px solid #ddd;
                        padding-top: 10px;
                        text-align: center;
                        font-size: 8.5px;
                        color: #777;
                    }
                    @page { size: landscape; margin: 10mm; }
                    @media print {
                        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="brand">
                        <h1>YOCANA</h1>
                        <p>Luxury Fragrance · Official Orders Summary</p>
                    </div>
                    <div class="meta">
                        <div><strong>Filter:</strong> ${
                            status === "all"
                                ? "All Statuses"
                                : status.toUpperCase()
                        }</div>
                        ${
                            search
                                ? `<div><strong>Search:</strong> "${escapeHTML(
                                      search
                                  )}"</div>`
                                : ""
                        }
                        <div><strong>Generated:</strong> ${escapeHTML(
                            new Date().toLocaleString("en-PH")
                        )}</div>
                    </div>
                </div>

                <div class="metrics">
                    <div class="card">
                        <span>Total Orders Listed</span>
                        <strong>${filteredOrders.length}</strong>
                    </div>
                    <div class="card">
                        <span>Total Revenue</span>
                        <strong>₱${totalRevenue.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}</strong>
                    </div>
                    <div class="card">
                        <span>Average Order Value</span>
                        <strong>₱${(filteredOrders.length
                            ? totalRevenue / filteredOrders.length
                            : 0
                        ).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}</strong>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 30px;">#</th>
                            <th style="width: 140px;">Order Number & Date</th>
                            <th style="width: 170px;">Customer Name & Email</th>
                            <th>Items Purchased (Ano ang Binili)</th>
                            <th style="width: 120px;">Payment</th>
                            <th style="width: 100px;">Status</th>
                            <th class="number" style="width: 110px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderRows}
                    </tbody>
                </table>

                <div class="footer">
                    YOCANA Luxury Fragrance · Confidential Operations Report · Printed by Administrator
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 150);
        };
    };

    return (
        <AdminLayout>
            <div className="px-5 py-8 md:px-8">
                <div className="mx-auto max-w-6xl">
                    {/* HEADER */}
                    <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37]">
                                Administration
                            </p>

                            <h1 className="mt-3 text-3xl font-medium text-white">
                                Orders
                            </h1>

                            <p className="mt-2 text-sm text-white/30">
                                Review, manage, export, and print customer orders.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                            {/* EXPORT CSV BUTTON */}
                            <button
                                onClick={handleExportCSV}
                                disabled={loading || filteredOrders.length === 0}
                                title="Export current filtered orders to CSV (Excel compatible)"
                                className="inline-flex h-9 sm:h-10 items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 text-[8px] uppercase tracking-[0.18em] text-[#D4AF37] backdrop-blur-md transition-all hover:scale-105 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] disabled:opacity-40"
                            >
                                <FiDownload size={13} />
                                <span>Export CSV ({filteredOrders.length})</span>
                            </button>

                            {/* PRINT BUTTON */}
                            <button
                                onClick={handlePrintOrders}
                                disabled={loading || filteredOrders.length === 0}
                                title="Print orders report"
                                className="inline-flex h-9 sm:h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[8px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-md transition-all hover:scale-105 hover:border-white/30 hover:text-white disabled:opacity-40"
                            >
                                <FiPrinter size={13} />
                                <span>Print</span>
                            </button>

                            {/* REFRESH BUTTON */}
                            <button
                                onClick={loadOrders}
                                disabled={loading}
                                className="inline-flex h-9 sm:h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[8px] uppercase tracking-[0.18em] text-white/50 backdrop-blur-md transition-all hover:scale-105 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:opacity-40"
                            >
                                <FiRefreshCw
                                    size={13}
                                    className={loading ? "animate-spin" : ""}
                                />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* SEARCH + FILTER */}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <div className="flex h-10 min-w-0 flex-1 items-center rounded-full border border-white/10 bg-[#080808]/80 backdrop-blur-md focus-within:border-[#D4AF37]/50">
                            <div className="flex h-10 w-11 items-center justify-center text-white/25">
                                <FiSearch size={14} />
                            </div>

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search order, customer or email..."
                                className="h-full min-w-0 flex-1 bg-transparent pr-4 text-sm text-white outline-none placeholder:text-white/20"
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
                            }
                            className="h-10 rounded-full border border-white/10 bg-[#080808] px-4 text-xs text-white/60 outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="returned">Returned</option>
                        </select>
                    </div>

                    {/* CONTENT */}
                    {loading ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="text-center">
                                <FiRefreshCw
                                    size={22}
                                    className="mx-auto animate-spin text-[#D4AF37]"
                                />

                                <p className="mt-4 text-[9px] uppercase tracking-[0.25em] text-white/30">
                                    Loading orders
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="mt-8 border border-red-500/20 bg-red-500/[0.04] p-4">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="mt-8 border border-white/10 bg-[#080808] p-10 text-center">
                            <FiPackage
                                size={28}
                                className="mx-auto text-white/20"
                            />

                            <h2 className="mt-4 text-lg text-white/70">
                                No orders found
                            </h2>

                            <p className="mt-2 text-sm text-white/30">
                                No orders match your current search.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {filteredOrders.map((order) => (
                                <button
                                    key={order.id}
                                    onClick={() =>
                                        navigate(`/admin/orders/${order.id}`)
                                    }
                                    className="block w-full rounded-2xl border border-white/10 bg-[#080808]/80 p-3.5 sm:p-5 text-left backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37]/45 hover:bg-[#0c0c0c] hover:shadow-[0_4px_25px_rgba(212,175,55,0.12)] md:p-6"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <FiPackage
                                                    size={15}
                                                    className="text-[#D4AF37]"
                                                />

                                                <p className="text-sm font-medium text-white">
                                                    {order.order_number}
                                                </p>
                                            </div>

                                            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-white/40">
                                                <FiUser
                                                    size={12}
                                                    className="text-[#D4AF37]/70"
                                                />

                                                <span className="font-medium text-white/80">
                                                    {order.first_name || ""}{" "}
                                                    {order.last_name || ""}
                                                </span>

                                                <span>•</span>

                                                <span className="text-white/60">
                                                    {order.email}
                                                </span>

                                                {(order.recipient_phone ||
                                                    order.user_phone ||
                                                    order.phone) && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-white/35">
                                                            {order.recipient_phone ||
                                                                order.user_phone ||
                                                                order.phone}
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* ITEMS PURCHASED PREVIEW */}
                                            {Array.isArray(order.items) &&
                                                order.items.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                                        <span className="text-[9px] uppercase tracking-wider text-[#D4AF37]/60">
                                                            Items:
                                                        </span>
                                                        {order.items.map(
                                                            (item, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/80"
                                                                >
                                                                    <span className="mr-1.5 font-semibold text-[#D4AF37]">
                                                                        {item.quantity}x
                                                                    </span>
                                                                    {item.product_name ||
                                                                        "Fragrance"}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                        </div>

                                        <div
                                            className={`inline-flex w-fit rounded-full border px-3 py-1 text-[8px] uppercase tracking-[0.2em] backdrop-blur-sm ${getStatusStyle(
                                                order.order_status
                                            )}`}
                                        >
                                            {order.order_status}
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-5 border-t border-white/10 pt-5 md:grid-cols-4">
                                        <div>
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Total
                                            </p>

                                            <p className="mt-2 text-sm text-[#D4AF37]">
                                                ₱{formatPrice(order.total_amount)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Payment
                                            </p>

                                            <div className="mt-2 flex items-center gap-2">
                                                <FiCreditCard
                                                    size={12}
                                                    className="text-white/25"
                                                />

                                                <p className="text-xs text-white/50">
                                                    {formatPaymentMethod(
                                                        order.payment_method
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Payment Status
                                            </p>

                                            <p className="mt-2 text-xs uppercase text-white/50">
                                                {order.payment_status}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                                                Ordered
                                            </p>

                                            <p className="mt-2 text-xs text-white/40">
                                                {formatDate(order.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminOrders;
