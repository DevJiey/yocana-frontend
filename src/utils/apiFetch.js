import {
    clearAuth,
    isUnauthorizedResponse,
} from "./auth"

export const apiFetch = async (url, options = {}) => {
    const token = localStorage.getItem("yocana_token")

    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.body && {
                "Content-Type": "application/json",
            }),
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
            ...options.headers,
        },
    })

    if (isUnauthorizedResponse(response)) {
        clearAuth()

        window.location.replace("/login")

        throw new Error("Unauthorized")
    }

    return response
}
