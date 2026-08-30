import { Navigate, useLocation } from "react-router-dom"

function ProtectedRoute({
    children,
    allowedRoles = [],
}) {
    const location = useLocation()

    const token =
        localStorage.getItem("yocana_token")

    const storedUser =
        localStorage.getItem("yocana_user")

    let user = null

    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null
    } catch {
        user = null
    }

    // WALANG LOGIN
    if (!token || !user) {
        return (
            <Navigate
                to="/login"
                state={{
                    from:
                        location.pathname +
                        location.search,
                }}
                replace
            />
        )
    }

    // MAY LOGIN PERO MALI ANG ROLE
    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)
    ) {
        if (user.role === "admin") {
            return (
                <Navigate
                    to="/admin"
                    replace
                />
            )
        }

        return (
            <Navigate
                to="/"
                replace
            />
        )
    }

    return children
}

export default ProtectedRoute
