export const clearAuth = () => {
  localStorage.removeItem("yocana_token")
  localStorage.removeItem("yocana_user")
}

export const isUnauthorizedResponse = (response) => {
  return response.status === 401 || response.status === 403
}
