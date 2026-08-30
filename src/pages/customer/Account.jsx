import { API_URL } from "../../config/api";
import { useEffect, useState } from "react"
import {
  useLocation,
  useNavigate,
} from "react-router-dom"

import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit3,
  FiX,
  FiCheck,
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

  const [user, setUser] = useState(null)
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
          : "profile")
    )

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

  const loadProfile = async () => {
    try {
      setPageLoading(true)
      setPageError("")

      setLoaderStatus("loading")
      setLoaderMessage(
        "Loading Your Account"
      )
      setLoaderOpen(true)

      const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load account"
        )
      }

      setUser(data.user)

      setForm({
        first_name:
          data.user.first_name || "",
        last_name:
          data.user.last_name || "",
        phone:
          data.user.phone || "",
      })

      setLoaderOpen(false)
    } catch (error) {
      setLoaderOpen(false)
      setPageError(error.message)
    } finally {
      setPageLoading(false)
    }
  }

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
      phone:
        user?.phone || "",
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
      phone:
        user?.phone || "",
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
            phone:
              form.phone.trim(),
          }),
        }
      )

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
          // Ignore invalid localStorage data
        }
      }

      setEditing(false)

      showSuccess("Profile Updated")
    } catch (error) {
      setLoaderOpen(false)
      setPageError(error.message)
    } finally {
      setActionLoading(false)
    }
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

      showSuccess(
        "Logged Out Successfully",
        () => {
          navigate("/login", {
            replace: true,
          })
        }
      )

      setActionLoading(false)
    }, 600)
  }

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    if (requestedSection) {
      setActiveSection(
        requestedSection
      )
    } else if (
      cameFromCheckout
    ) {
      setActiveSection(
        "addresses"
      )
    }
  }, [
    requestedSection,
    cameFromCheckout,
  ])

  const fullName =
    [
      user?.first_name,
      user?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    "YOCANA Customer"

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
          <div className="mb-5 border border-red-500/20 bg-red-500/[0.04] p-4">
            <p className="text-xs leading-5 text-red-400">
              {pageError}
            </p>
          </div>
        )}

        {activeSection ===
          "profile" && (
          <>
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]">
                  Customer Account
                </p>

                <h1 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
                  Profile
                </h1>

                <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                  Manage your personal
                  information and contact
                  details.
                </p>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={
                    handleEdit
                  }
                  className="flex h-10 w-fit items-center gap-2 border border-[#D4AF37]/25 px-4 text-[8px] uppercase tracking-[0.18em] text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.05]"
                >
                  <FiEdit3
                    size={13}
                  />
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
                        value={
                          form.phone
                        }
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
                      className="flex h-10 w-fit items-center gap-2 bg-[#D4AF37] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiCheck
                        size={13}
                      />
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
                      className="flex h-10 w-fit items-center gap-2 border border-white/10 px-4 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-white/20 hover:text-white"
                    >
                      <FiX
                        size={13}
                      />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>
          </>
        )}

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
