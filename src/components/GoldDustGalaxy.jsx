import { useEffect, useRef } from "react"

function GoldDustGalaxy({ className = "" }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId = null
    let isVisible = true
    let width = canvas.offsetWidth || window.innerWidth
    let height = canvas.offsetHeight || 500

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const setupSize = () => {
      if (!canvas) return
      width = canvas.offsetWidth || window.innerWidth
      height = canvas.offsetHeight || 500
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    setupSize()

    const particleCount = width < 768 ? 38 : 80
    const particles = []

    const goldTones = [
      { r: 212, g: 175, b: 55 },  // Royal Gold (#D4AF37)
      { r: 255, g: 226, b: 138 }, // Champagne Sparkle (#FFE28A)
      { r: 243, g: 198, b: 79 },  // Warm Amber Gold
      { r: 255, g: 242, b: 195 }, // Brilliant Starlight Gold
    ]

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        baseAlpha: Math.random() * 0.55 + 0.25,
        alpha: 0.5,
        vx: (Math.random() - 0.45) * 0.25,
        vy: -Math.random() * 0.35 - 0.08,
        twinkleSpeed: Math.random() * 0.025 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        color: goldTones[Math.floor(Math.random() * goldTones.length)],
        hasHalo: Math.random() > 0.72,
      })
    }

    let time = 0
    const render = () => {
      if (!isVisible) {
        animationFrameId = null
        return
      }

      time += 1
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy

        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase)
        p.alpha = Math.max(0.08, Math.min(1, p.baseAlpha + twinkle * 0.32))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`
        ctx.fill()

        if (p.hasHalo && p.alpha > 0.3) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha * 0.18})`
          ctx.fill()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && animationFrameId === null) {
          render()
        }
      },
      { rootMargin: "150px" }
    )

    observer.observe(container)

    const handleResize = () => {
      setupSize()
    }

    window.addEventListener("resize", handleResize)
    render()

    return () => {
      isVisible = false
      observer.disconnect()
      window.removeEventListener("resize", handleResize)
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Pure Radial Gradient Nebulas (No heavy CSS blur filters — smooth 60fps on mobile) */}
      <div className="absolute left-[15%] top-[25%] h-[360px] w-[360px] sm:h-[550px] sm:w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.09)_0%,rgba(212,175,55,0.025)_40%,transparent_72%)]" />
      <div className="absolute right-[10%] bottom-[20%] h-[380px] w-[380px] sm:h-[600px] sm:w-[600px] translate-x-1/3 rounded-full bg-[radial-gradient(circle,rgba(243,198,79,0.08)_0%,rgba(212,175,55,0.02)_45%,transparent_72%)]" />
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] sm:h-[750px] sm:w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.05)_0%,transparent_68%)]" />

      {/* Gold Dust Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  )
}

export default GoldDustGalaxy
