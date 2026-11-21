import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    // Instantly scroll to top on route change
    window.scrollTo(0, 0)
    // Fallback for document body/documentElement
    if (document.documentElement) {
      document.documentElement.scrollTop = 0
    }
    if (document.body) {
      document.body.scrollTop = 0
    }
  }, [pathname, search])

  return null
}
