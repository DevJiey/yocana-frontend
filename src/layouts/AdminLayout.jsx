import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"

import {
  FiHome,
  FiCreditCard,
  FiPackage,
  FiShoppingBag,
  FiLogOut,
  FiMenu,
  FiX,
  FiBox,
  FiXCircle,
  FiRotateCcw,
  FiBarChart2,
} from "react-icons/fi"

import yocanaLogo from "../assets/yocana-logo-gold.png"

function AdminLayout({ children }) {
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("yocana_token")
    localStorage.removeItem("yocana_user")

    navigate("/login", {
      replace: true,
    })
  }

  const links = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <FiHome size={16} />,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: <FiPackage size={16} />,
    },
    {
      label: "Payments",
      path: "/admin/payments",
      icon: <FiCreditCard size={16} />,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: <FiShoppingBag size={16} />,
    },
    {
      label: "Inventory",
      path: "/admin/inventory",
      icon: <FiBox size={16} />,
    },
    {
      label: "Cancellations",
      path: "/admin/cancellations",
      icon: <FiXCircle size={16} />,
    },
    {
      label: "Returns",
      path: "/admin/returns",
      icon: <FiRotateCcw size={16} />,
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: <FiBarChart2 />,
    },
  ]

  const SidebarContent = ({ showBrand = true }) => (
    <>
      {/* BRAND */}
      {showBrand && (
        <div className="border-b border-white/10 px-5 py-6">
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className="flex flex-col items-center"
          >
            <img
              src={yocanaLogo}
              alt="YOCANA"
              className="h-auto w-[72px] object-contain"
            />

            <p className="mt-3 text-[7px] uppercase tracking-[0.25em] text-white/20">
              Administration
            </p>
          </Link>
        </div>
      )}

      {/* LINKS */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin"}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-xs transition ${isActive
                ? "bg-[#D4AF37]/[0.08] text-[#D4AF37]"
                : "text-white/35 hover:bg-white/[0.03] hover:text-white/70"
              }`
            }
          >
            {link.icon}

            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-xs text-white/30 transition hover:bg-red-500/[0.05] hover:text-red-400"
        >
          <FiLogOut size={16} />

          <span>Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ========================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================= */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] flex-col border-r border-white/10 bg-[#080808] md:flex">
        <SidebarContent />
      </aside>

      {/* ========================= */}
      {/* MOBILE OVERLAY */}
      {/* ========================= */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* ========================= */}
      {/* MOBILE SIDEBAR */}
      {/* ========================= */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-white/10 bg-[#080808] transition-transform duration-300 md:hidden ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }`}
      >
        {/* MOBILE DRAWER HEADER */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div>
            <p className="text-[7px] uppercase tracking-[0.25em] text-white/20">
              Admin
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
              Navigation
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:border-white/20 hover:text-white"
            aria-label="Close admin menu"
          >
            <FiX size={17} />
          </button>
        </div>

        {/*
          No duplicate YOCANA logo here.
          The logo is already visible in the mobile top header.
        */}
        <SidebarContent showBrand={false} />
      </aside>

      {/* ========================= */}
      {/* CONTENT AREA */}
      {/* ========================= */}

      <div className="min-h-screen md:pl-[240px]">
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#050505]/95 px-4 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-white/50 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37] md:hidden"
              aria-label="Open admin menu"
            >
              <FiMenu size={17} />
            </button>

            {/* MOBILE BRAND */}
            <div className="flex min-w-0 items-center gap-3 md:hidden">
              <img
                src={yocanaLogo}
                alt="YOCANA"
                className="h-auto w-[44px] shrink-0 object-contain"
              />

              <div className="min-w-0">
                <p className="text-[7px] uppercase tracking-[0.25em] text-white/20">
                  Admin Panel
                </p>

                <p className="mt-0.5 truncate text-[9px] uppercase tracking-[0.18em] text-white/45">
                  Administration
                </p>
              </div>
            </div>

            {/* DESKTOP HEADER LABEL */}
            <div className="hidden md:block">
              <p className="text-[7px] uppercase tracking-[0.25em] text-white/20">
                Admin Panel
              </p>
            </div>
          </div>

          {/* MOBILE LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="hidden shrink-0 items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-white/30 transition hover:text-red-400 sm:flex md:hidden"
          >
            <FiLogOut size={14} />

            <span>Logout</span>
          </button>
        </header>

        {/* ========================= */}
        {/* PAGE */}
        {/* ========================= */}

        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
