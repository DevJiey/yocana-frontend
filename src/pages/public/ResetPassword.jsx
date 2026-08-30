import { useState } from "react"
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom"
import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiLock,
} from "react-icons/fi"

import { API_URL } from "../../config/api"
import yocanaLogo from "../../assets/yocana-logo-gold.png"

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] =
    useState("")

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.")
      return
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      )
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to reset password."
        )
      }

      setSuccess(
        "Password reset successfully. Redirecting to sign in..."
      )

      setPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        })
      }, 1800)
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-4 py-6 text-white sm:px-5 sm:py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-140px] h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.04] blur-[110px]" />

        <div className="absolute bottom-[-170px] right-[-100px] h-[320px] w-[320px] rounded-full bg-[#D4AF37]/[0.025] blur-[110px]" />
      </div>

      <div className="relative z-10 w-full max-w-[390px]">
        <section className="border border-white/10 bg-[#080808] p-5 sm:p-7">
          <div className="mb-6 flex justify-center">
            <img
              src={yocanaLogo}
              alt="YOCANA"
              className="h-auto w-[70px] object-contain"
            />
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.28em] text-[#D4AF37]">
              Account Recovery
            </p>

            <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white sm:text-3xl">
              Reset password
            </h1>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Create a new password for your
              YOCANA account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/30"
              >
                New Password
              </label>

              <div className="flex h-11 items-center border border-white/10 bg-[#050505] transition focus-within:border-[#D4AF37]/50">
                <div className="flex h-full w-11 shrink-0 items-center justify-center text-white/25">
                  <FiLock size={14} />
                </div>

                <input
                  id="new-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/15"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
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

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-white/30"
              >
                Confirm New Password
              </label>

              <div className="flex h-11 items-center border border-white/10 bg-[#050505] transition focus-within:border-[#D4AF37]/50">
                <div className="flex h-full w-11 shrink-0 items-center justify-center text-white/25">
                  <FiLock size={14} />
                </div>

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/15"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  className="flex h-full w-11 shrink-0 items-center justify-center text-white/25 transition hover:text-[#D4AF37]"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
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

            {error && (
              <div className="border border-red-500/20 bg-red-500/[0.05] px-3 py-3">
                <p className="text-[10px] leading-5 text-red-400">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="border border-[#D4AF37]/20 bg-[#D4AF37]/[0.05] px-3 py-3">
                <p className="text-[10px] leading-5 text-[#D4AF37]">
                  {success}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="flex h-11 w-full items-center justify-center bg-[#D4AF37] px-5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#050505] transition hover:bg-[#E1C35B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-[8px] uppercase tracking-[0.18em] text-white/25 transition hover:text-[#D4AF37]"
            >
              <FiArrowLeft size={11} />
              Back to Sign In
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ResetPassword