
import { GoogleLogin } from "@react-oauth/google"
import { API_URL } from "../../config/api"

function GoogleSignIn({
  onSignIn,
  onError,
  onBusyChange,
  onExistingAccount,
}) {
  const hasClientId = Boolean(
    import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()
  )

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      onError?.("Google did not return a sign-in credential.")
      return
    }

    onError?.("")
    onBusyChange?.(true)

    try {
      const response = await fetch(
        `${API_URL}/api/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential: credentialResponse.credential,
          }),
        }
      )

      const data = await response.json()

      // Existing email/password accounts require secure linking.
      if (
        response.status === 409 &&
        typeof onExistingAccount === "function"
      ) {
        onExistingAccount(credentialResponse.credential)
        return
      }

      if (
        !response.ok ||
        !data.success ||
        !data.token ||
        !data.user
      ) {
        throw new Error(
          data.message || "Unable to sign in with Google"
        )
      }

      if (data.user.role !== "customer") {
        throw new Error(
          "Google sign-in is only available for customer accounts"
        )
      }

      localStorage.setItem("yocana_token", data.token)
      localStorage.setItem(
        "yocana_user",
        JSON.stringify(data.user)
      )

      onSignIn?.(data.user)
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error.message
          : "Google sign-in failed"
      )
    } finally {
      onBusyChange?.(false)
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      {hasClientId ? (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() =>
            onError?.("Google sign-in failed. Please try again.")
          }
          theme="filled_black"
          size="large"
          shape="rectangular"
          text="continue_with"
          width="280"
        />
      ) : (
        <p className="text-center text-xs text-white/50">
          Google Sign-In is not configured.
        </p>
      )}
    </div>
  )
}

export default GoogleSignIn
