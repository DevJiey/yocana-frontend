import { API_URL } from "../../config/api";
import { useState } from "react"
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom"

import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi"

import BrandLoader from "../../components/BrandLoader"
import yocanaLogo from "../../assets/yocana-logo-gold.png"

function Register() {
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  })

  const [showPassword, setShowPassword] =
    useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [loaderOpen, setLoaderOpen] =
    useState(false)

  const [loaderStatus, setLoaderStatus] =
    useState("loading")

  const [loaderMessage, setLoaderMessage] =
    useState("")

  const handleChange = (event) => {
    const { name, value } =
      event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirm_password
    ) {
      setError(
        "Please complete all required fields."
      )

      return
    }

    if (
      form.password !==
      form.confirm_password
    ) {
      setError(
        "Passwords do not match."
      )

      return
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      )

      return
    }

    try {
      setLoading(true)
      setError("")

      setLoaderStatus("loading")
      setLoaderMessage(
        "Creating Your Account"
      )
      setLoaderOpen(true)

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            first_name:
              form.first_name.trim(),
            last_name:
              form.last_name.trim(),
            email:
              form.email.trim(),
            phone:
              form.phone.trim(),
            password:
              form.password,
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
            "Unable to create account"
        )
      }

      setLoaderStatus("success")
      setLoaderMessage(
        "Account Created"
      )

      setTimeout(() => {
        setLoaderOpen(false)

        navigate("/login", {
          replace: true,
          state: {
            from:
              location.state?.from,
          },
        })
      }, 1400)
    } catch (err) {
      setLoaderOpen(false)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = () => {
    setError(
      "Google account registration is not connected yet."
    )
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-4 py-6 text-white sm:px-5 sm:py-8">
      <BrandLoader
        show={loaderOpen}
        status={loaderStatus}
        message={loaderMessage}
      />

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-160px] h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.04] blur-[110px]" />

        <div className="absolute bottom-[-170px] right-[-100px] h-[320px] w-[320px] rounded-full bg-[#D4AF37]/[0.025] blur-[110px]" />
      </div>

      <div className="relative z-10 w-full max-w-[430px]">
        {/* CARD */}
        <section className="border border-white/10 bg-[#080808] p-5 sm:p-7">
          {/* LOGO */}
          <div className="mb-6 flex justify-center">
            <img
              src={yocanaLogo}
              alt="YOCANA"
              className="h-auto w-[70px] object-contain"
            />
          </div>

          {/* HEADING */}
          <div>
            <p className="text-[8px] uppercase tracking-[0.28em] text-[#D4AF37]">
              Join YOCANA
            </p>

            <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white sm:text-3xl">
              Create your account
            </h1>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Create an account to manage
              your orders, cart, and
              shipping information.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            {/* NAME */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first_name"
                  className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/30"
                >
                  First Name
                </label>

                <div className="flex h-11 items-center border border-white/10 bg-[#050505] transition focus-within:border-[#D4AF37]/50">
                  <div className="flex h-full w-11 shrink-0 items-center justify-center text-white/25">
                    <FiUser size={14} />
                  </div>

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
                    placeholder="First name"
                    autoComplete="given-name"
                    className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm text-white outline-none placeholder:text-white/15"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/30"
                >
                  Last Name
                </label>

                <div className="flex h-11 items-center border border-white/10 bg-[#050505] transition focus-within:border-[#D4AF37]/50">
                  <div className="flex h-full w-11 shrink-0 items-center justify-center text-white/25">
                    <FiUser size={14} />
                  </div>

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
                    placeholder="Last name"
                    autoComplete="family-name"
                    className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm text-white outline-none placeholder:text-white/15"
                  />
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/30"
              >
                Email Address
              </label>

              <div className="flex h-11 items-center border border-white/10 bg-[#050505] transition focus-within:border-[#D4AF37]/50">
                <div className="flex h-full w-11 shrink-0 items-center justify-center text-white/25">
                  <FiMail size={14} />
                </div>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm text-white outline-none placeholder:text-white/15"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/30"
              >
                Phone Number
                <span className="ml-2 text-white/15">
                  Optional
                </span>
              </label>

              <div className="flex h-11 items-center border border-white/10 bg-[#050505] transition focus-within:border-[#D4AF37]/50">
                <div className="flex h-full w-11 shrink-0 items-center justify-center text-white/25">
                  <FiPhone size={14} />
                </div>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="09XXXXXXXXX"
                  autoComplete="tel"
                  className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm text-white outline-none placeholder:text-white/15"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/30"
              >
                Password
              </label>

              <div className="flex h-11 items-center border border-white/10 bg-[#050505] transition focus-within:border-[#D4AF37]/50">
                <div className="flex h-full w-11 shrink-0 items-center justify-center text-white/25">
                  <FiLock size={14} />
                </div>

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    form.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/15"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="flex h-full w-11 shrink-0 items-center justify-center text-white/25 transition hover:text-[#D4AF37]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff size={14} />
                  ) : (
                    <FiEye size={14} />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="confirm_password"
                className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/30"
              >
                Confirm Password
              </label>

              <div className="flex h-11 items-center border border-white/10 bg-[#050505] transition focus-within:border-[#D4AF37]/50">
                <div className="flex h-full w-11 shrink-0 items-center justify-center text-white/25">
                  <FiLock size={14} />
                </div>

                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    form.confirm_password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/15"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="flex h-full w-11 shrink-0 items-center justify-center text-white/25 transition hover:text-[#D4AF37]"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={14} />
                  ) : (
                    <FiEye size={14} />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="border border-red-500/20 bg-red-500/[0.05] px-3 py-3">
                <p className="text-[10px] leading-5 text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* CREATE */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center bg-[#D4AF37] px-5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          {/* OR */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />

            <span className="text-[7px] uppercase tracking-[0.2em] text-white/20">
              Or
            </span>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            onClick={
              handleGoogleRegister
            }
            className="flex h-11 w-full items-center justify-center gap-3 border border-white/10 bg-[#050505] px-4 text-[8px] uppercase tracking-[0.16em] text-white/60 transition hover:border-[#D4AF37]/30 hover:text-white"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#4285F4]">
              G
            </span>

            Continue with Google
          </button>

          {/* LOGIN */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-white/30">
              Already have an account?{" "}
              <Link
                to="/login"
                state={{
                  from:
                    location.state?.from,
                }}
                className="text-[#D4AF37] transition hover:text-[#E1C35B]"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* BACK HOME */}
          <div className="mt-5 border-t border-white/10 pt-5 text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 text-[8px] uppercase tracking-[0.18em] text-white/25 transition hover:text-[#D4AF37]"
            >
              <FiArrowLeft size={11} />
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Register
