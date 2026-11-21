import { useEffect, useRef } from "react"

function GoldDustGalaxy({ className = "" }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    // Device Pixel Ratio for retina display crispness
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const particleCount = width < 768 ? 45 : 85
    const particles = []

    // Palette of luxury gold tones
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
        vy: -Math.random() * 0.35 - 0.08, // Gently drifting upward
        twinkleSpeed: Math.random() * 0.025 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        color: goldTones[Math.floor(Math.random() * goldTones.length)],
        hasHalo: Math.random() > 0.72, // Luminous star halos
      })
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener("resize", handleResize)

    let time = 0
    const render = () => {
      time += 1
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Update position (drift)
        p.x += p.vx
        p.y += p.vy

        // Wrap around boundaries smoothly
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        // Twinkle oscillation
        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase)
        p.alpha = Math.max(0.08, Math.min(1, p.baseAlpha + twinkle * 0.32))

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`
        ctx.fill()

        // Soft celestial aura halo
        if (p.hasHalo && p.alpha > 0.3) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha * 0.18})`
          ctx.fill()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Dynamic Golden Galactic Nebulas (Slowly breathing celestial clouds) */}
      <div className="absolute left-[15%] top-[25%] h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.09)_0%,rgba(212,175,55,0.02)_40%,transparent_70%)] blur-[120px] animate-pulse [animation-duration:8s]" />
      <div className="absolute right-[10%] bottom-[20%] h-[600px] w-[600px] translate-x-1/3 rounded-full bg-[radial-gradient(circle,rgba(243,198,79,0.08)_0%,rgba(212,175,55,0.02)_45%,transparent_70%)] blur-[140px] animate-pulse [animation-duration:11s]" />
      <div className="absolute left-1/2 top-1/2 h-[750px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.05)_0%,transparent_65%)] blur-[160px]" />

      {/* Gold Dust Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />

      {/* Deep Celestial Vignettes */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#050505] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#050505] to-transparent" />
    </div>
  )
}

export default GoldDustGalaxy
