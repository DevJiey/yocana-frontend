import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function PublicLayout({ children, showFooter = true }) {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <main>
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  )
}

export default PublicLayout
