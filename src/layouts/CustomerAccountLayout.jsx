import { useState } from "react"
import {
    useLocation,
    useNavigate,
} from "react-router-dom"
import {
    FiUser,
    FiMapPin,
    FiPackage,
    FiLogOut,
    FiMenu,
    FiX,
    FiArrowLeft,
    FiChevronRight,
} from "react-icons/fi"
import yocanaLogo from "../assets/yocana-logo-gold.png"

function CustomerAccountLayout({
    children,
    activeItem = "profile",
    user,
    onLogout,
    actionLoading = false,
}) {
    const navigate = useNavigate()
    const location = useLocation()

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false)

    const cameFromCheckout =
        location.state?.from === "/checkout"

    const fullName =
        [
            user?.first_name,
            user?.last_name,
        ]
            .filter(Boolean)
            .join(" ") || "YOCANA Customer"

    const preserveCheckoutState = (
        extra = {}
    ) => {
        return {
            ...extra,
            ...(cameFromCheckout
                ? { from: "/checkout" }
                : {}),
        }
    }

    const goToProfile = () => {
        setMobileMenuOpen(false)

        navigate("/account", {
            state: preserveCheckoutState({
                section: "profile",
            }),
        })
    }

    const goToAddresses = () => {
        setMobileMenuOpen(false)

        navigate("/account", {
            state: preserveCheckoutState({
                section: "addresses",
            }),
        })
    }

    const goToOrders = () => {
        setMobileMenuOpen(false)

        navigate("/orders", {
            state: preserveCheckoutState(),
        })
    }

    const menuItems = [
        {
            id: "profile",
            label: "Profile",
            description:
                "Personal information",
            icon: FiUser,
            onClick: goToProfile,
        },
        {
            id: "addresses",
            label: "Shipping Addresses",
            description:
                "Delivery information",
            icon: FiMapPin,
            onClick: goToAddresses,
        },
        {
            id: "orders",
            label: "My Orders",
            description:
                "Purchases and tracking",
            icon: FiPackage,
            onClick: goToOrders,
        },
    ]

    const SidebarContent = () => (
        <>
            {/* ACCOUNT IDENTITY */}
            <div className="border-b border-white/10 px-5 py-6">

                {/* LOGO - DESKTOP ONLY */}
                <div className="hidden justify-center lg:flex">
                    <img
                        src={yocanaLogo}
                        alt="YOCANA"
                        className="h-auto w-[70px] object-contain"
                    />
                </div>

                <div className="text-left lg:mt-4 lg:text-center">
                    <h2 className="text-lg font-medium text-white/85">
                        My Account
                    </h2>

                    <p className="mt-1 truncate text-[10px] text-white/30">
                        {fullName}
                    </p>
                </div>
            </div>

            {/* NAVIGATION */}
            <nav className="px-4 py-5">
                <p className="px-3 pb-3 text-[7px] uppercase tracking-[0.25em] text-white/20">
                    Account
                </p>

                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon

                        const active =
                            activeItem === item.id

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={item.onClick}
                                className={`flex min-h-14 w-full items-center gap-3 px-3 text-left transition ${active
                                    ? "bg-[#D4AF37]/[0.07] text-[#D4AF37]"
                                    : "text-white/45 hover:bg-white/[0.025] hover:text-white/75"
                                    }`}
                            >
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center border ${active
                                        ? "border-[#D4AF37]/30 bg-[#D4AF37]/[0.03]"
                                        : "border-white/10"
                                        }`}
                                >
                                    <Icon size={14} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] uppercase tracking-[0.15em]">
                                        {item.label}
                                    </p>

                                    <p className="mt-1 truncate text-[8px] text-white/20">
                                        {item.description}
                                    </p>
                                </div>

                                <FiChevronRight
                                    size={12}
                                    className="shrink-0 opacity-40"
                                />
                            </button>
                        )
                    })}
                </div>

                {/* ONLY WHEN FROM CHECKOUT */}
                {cameFromCheckout && (
                    <div className="mt-4 border-t border-white/10 p-4">
                        <p className="px-3 pb-3 text-[7px] uppercase tracking-[0.25em] text-white/20">
                            Checkout
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false)
                                navigate("/checkout")
                            }}
                            className="flex min-h-12 w-full items-center gap-3 border border-[#D4AF37]/15 px-3 text-left text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.05]"
                        >
                            <FiArrowLeft
                                size={14}
                                className="shrink-0"
                            />

                            <div className="min-w-0">
                                <p className="text-[8px] uppercase tracking-[0.16em]">
                                    Return to Checkout
                                </p>

                                <p className="mt-1 text-[8px] text-white/20">
                                    Continue your order
                                </p>
                            </div>
                        </button>
                    </div>
                )}
            </nav>

            {/* BACK TO SHOP */}
            <div className="border-t border-white/10 p-3">
                <button
                    type="button"
                    onClick={() => {
                        setMobileMenuOpen(false)
                        navigate("/shop")
                    }}
                    className="flex min-h-12 w-full items-center gap-3 px-3 text-left text-white/45 transition hover:bg-[#D4AF37]/[0.04] hover:text-[#D4AF37]"
                >
                    <FiArrowLeft
                        size={14}
                        className="shrink-0"
                    />

                    <div className="min-w-0">
                        <p className="text-[8px] uppercase tracking-[0.16em]">
                            Back to Shop
                        </p>

                        <p className="mt-1 text-[8px] text-white/20">
                            Continue shopping
                        </p>
                    </div>
                </button>
            </div>

            {/* SIGN OUT */}
            <div className="border-t border-white/10 p-3">
                <button
                    type="button"
                    onClick={onLogout}
                    disabled={actionLoading}
                    className="flex min-h-12 w-full items-center gap-3 px-3 text-left text-red-400/70 transition hover:bg-red-500/[0.04] hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <FiLogOut
                        size={14}
                        className="shrink-0"
                    />

                    <div>
                        <p className="text-[8px] uppercase tracking-[0.16em]">
                            Sign Out
                        </p>

                        <p className="mt-1 text-[8px] text-white/20">
                            End your session
                        </p>
                    </div>
                </button>
            </div>
        </>
    )

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* MOBILE HEADER */}
            <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-white/10 bg-[#050505]/95 px-4 backdrop-blur-md lg:hidden">
                <button
                    type="button"
                    onClick={() =>
                        setMobileMenuOpen(true)
                    }
                    className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/65 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                    aria-label="Open account menu"
                >
                    <FiMenu size={17} />
                </button>

                <div className="flex flex-col items-center justify-center">
                    <img
                        src={yocanaLogo}
                        alt="YOCANA"
                        className="h-auto w-[42px] object-contain"
                    />

                    <p className="mt-0.5 text-[8px] uppercase tracking-[0.16em] text-white/50">
                        My Account
                    </p>
                </div>

                <div className="h-10 w-10" />
            </header>

            {/* MOBILE OVERLAY */}
            {mobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close account menu"
                    className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm lg:hidden"
                    onClick={() =>
                        setMobileMenuOpen(false)
                    }
                />
            )}

            {/* MOBILE DRAWER */}
            <aside
                className={`fixed inset-y-0 left-0 z-[60] flex w-[280px] max-w-[85vw] flex-col border-r border-white/10 bg-[#080808] transition-transform duration-300 lg:hidden ${mobileMenuOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                    }`}
            >
                <button
                    type="button"
                    onClick={() =>
                        setMobileMenuOpen(false)
                    }
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:border-white/20 hover:text-white"
                    aria-label="Close account menu"
                >
                    <FiX size={14} />
                </button>

                <SidebarContent />
            </aside>

            {/* DESKTOP + CONTENT */}
            <div className="flex min-h-screen w-full">
                {/* DESKTOP SIDEBAR */}
                <aside className="sticky top-0 hidden min-h-screen w-[270px] shrink-0 flex-col border-r border-white/10 bg-[#080808] lg:flex">
                    <SidebarContent />
                </aside>

                {/* PAGE CONTENT */}
                <main className="min-w-0 flex-1 px-4 py-6 sm:px-5 md:px-8 md:py-10 lg:px-12 lg:py-12">
                    <div className="mx-auto w-full max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default CustomerAccountLayout
