import Navbar from "../../components/Navbar"
import Hero from "../../components/Hero"
import SignatureCollection from "../../components/SignatureCollection"
import OurStory from "../../components/OurStory"
import WhyYocana from "../../components/WhyYocana"
import Testimonials from "../../components/Testimonials"
import FAQ from "../../components/FAQ"
import Contact from "../../components/Contact"
import Footer from "../../components/Footer"

function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="pt-[72px]">
        {/* HOME */}
        <section id="home">
          <Hero />
          <SignatureCollection />
        </section>

        {/* OUR STORY */}
        <section id="story">
          <OurStory />
          <WhyYocana />
          <Testimonials />
          <FAQ />
        </section>

        {/* CONTACT */}
        <section id="contact">
          <Contact />
        </section>

        <Footer />
      </main>
    </div>
  )
}

export default Home
