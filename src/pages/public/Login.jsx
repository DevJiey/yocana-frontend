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
} from "react-icons/fi"

import yocanaLogo from "../../assets/yocana-logo-gold.png"

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password."
      )
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      )

      const data = await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to sign in"
        )
      }

      localStorage.setItem(
        "yocana_token",
        data.token
      )

      localStorage.setItem(
        "yocana_user",
        JSON.stringify(data.user)
      )

      if (data.user.role === "admin") {
        navigate("/admin")
        return
      }

      const redirectTo =
        location.state?.from ||
        "/account"

      navigate(redirectTo, {
        replace: true,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setError(
      "Google sign-in is not connected yet."
    )
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-4 py-6 text-white sm:px-5 sm:py-8">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-140px] h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.04] blur-[110px]" />

        <div className="absolute bottom-[-170px] right-[-100px] h-[320px] w-[320px] rounded-full bg-[#D4AF37]/[0.025] blur-[110px]" />
      </div>

      <div className="relative z-10 w-full max-w-[390px]">
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
              Welcome Back
            </p>

            <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white sm:text-3xl">
              Sign in
            </h1>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Access your orders, cart,
              and YOCANA account.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
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
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm text-white outline-none placeholder:text-white/15"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-[8px] uppercase tracking-[0.2em] text-white/30"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-[7px] uppercase tracking-[0.14em] text-white/25 transition hover:text-[#D4AF37]"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="flex h-11 items-center border border-white/10 bg-[#050505] transition focus-within:border-[#D4AF37]/50">
                <div className="flex h-full w-11 shrink-0 items-center justify-center text-white/25">
                  <FiLock size={14} />
                </div>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

            {/* ERROR */}
            {error && (
              <div className="border border-red-500/20 bg-red-500/[0.05] px-3 py-3">
                <p className="text-[10px] leading-5 text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* SIGN IN */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center bg-[#D4AF37] px-5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
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
            onClick={handleGoogleLogin}
            className="flex h-11 w-full items-center justify-center gap-3 border border-white/10 bg-[#050505] px-4 text-[8px] uppercase tracking-[0.16em] text-white/60 transition hover:border-[#D4AF37]/30 hover:text-white"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#4285F4]">
              G
            </span>

            Continue with Google
          </button>

          {/* CREATE ACCOUNT */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-white/30">
              New to YOCANA?{" "}
              <Link
                to="/register"
                state={{
                  from:
                    location.state?.from,
                }}
                className="text-[#D4AF37] transition hover:text-[#E1C35B]"
              >
                Create an account
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

export default Login
