
import { API_URL } from "../../config/api"
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

import GoogleSignIn from "../../components/auth/GoogleSignIn"
import yocanaLogo from "../../assets/yocana-logo-gold.png"

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [googleCredential, setGoogleCredential] = useState(null)

  const handleGoogleExistingAccount = (credential) => {
    setGoogleCredential(credential)
    setEmail("")
    setPassword("")
    setError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim() || !password) {
      setError("Please enter your email and password.")
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to sign in")
      }

      if (googleCredential) {
        if (data.user?.role !== "customer" || !data.token) {
          throw new Error(
            "Only customer accounts can be connected to Google."
          )
        }

        const linkResponse = await fetch(
          `${API_URL}/api/auth/google/link`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
            body: JSON.stringify({
              password,
              credential: googleCredential,
            }),
          }
        )

        const linkData = await linkResponse.json()

        if (!linkResponse.ok || !linkData.success) {
          throw new Error(
            linkData.message ||
              "Unable to connect Google. Please try again."
          )
        }

        setGoogleCredential(null)
        setPassword("")
      }

      // Save session only after successful login/linking.
      localStorage.setItem("yocana_token", data.token)
      localStorage.setItem(
        "yocana_user",
        JSON.stringify(data.user)
      )

      if (data.user.role === "admin") {
        navigate("/admin")
        return
      }

      const requested = location.state?.from
      const redirectTo =
        typeof requested === "string" &&
        requested.startsWith("/") &&
        !requested.startsWith("//")
          ? requested
          : "/account"

      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLoginSuccess = () => {
    const requested = location.state?.from
    const destination =
      typeof requested === "string" &&
      requested.startsWith("/") &&
      !requested.startsWith("//")
        ? requested
        : "/account"

    navigate(destination, { replace: true })
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

          {/* GOOGLE ACCOUNT LINKING */}
          {googleCredential && (
            <div className="mt-5 border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-[#D4AF37]">
                Connect your Google account
              </p>

              <p className="mt-2 text-xs leading-5 text-white/60">
                This Google email is already registered with YOCANA.
                Enter the email and password for your existing YOCANA
                account to securely connect both sign-in methods.
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setGoogleCredential(null)
                  setPassword("")
                  setError("")
                }}
                className="mt-3 text-[10px] text-white/50 underline transition hover:text-white disabled:opacity-50"
              >
                Cancel Google linking
              </button>
            </div>
          )}

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
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/15"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="flex h-full w-11 shrink-0 items-center justify-center text-white/25 transition hover:text-[#D4AF37]"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff size={14} />
                  ) : (
                    <FiEye size={14} />
                  )}
                </button>
              </div>

              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-[7px] uppercase tracking-[0.14em] text-white/25 transition hover:text-[#D4AF37]"
                >
                  Forgot Password?
                </Link>
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
                ? "Please wait..."
                : googleCredential
                  ? "Verify & Connect Google"
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
          <GoogleSignIn
            onSignIn={handleGoogleLoginSuccess}
            onError={setError}
            onBusyChange={setLoading}
            onExistingAccount={handleGoogleExistingAccount}
          />

          {/* CREATE ACCOUNT */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-white/30">
              New to YOCANA?{" "}
              <Link
                to="/register"
                state={{ from: location.state?.from }}
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
