"use client"

import { useEffect, useRef } from "react"
import { hexToRgb } from "@/lib/color-utils"

interface AnimatedBackgroundProps {
  colors: string[]
}

export function AnimatedBackground({ colors }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initialize canvas size
    updateCanvasSize()

    // Update canvas size on window resize
    window.addEventListener("resize", updateCanvasSize)

    // Create particles based on the current palette
    const particles: Particle[] = []
    const particleCount = 50

    // Convert colors to usable format
    const usableColors = colors.length > 0 ? colors : ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6"]

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const color = usableColors[Math.floor(Math.random() * usableColors.length)]
      const rgb = hexToRgb(color)

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 5 + 2,
        color: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.random() * 0.5 + 0.1})`,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5,
        sinOffset: Math.random() * Math.PI * 2,
      })
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      usableColors.forEach((color, index) => {
        gradient.addColorStop(index / (usableColors.length - 1), color + "20") // 20 is hex for 12% opacity
      })

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position with a slight sine wave motion
        particle.x += particle.vx
        particle.y += particle.vy + Math.sin(Date.now() * 0.001 + particle.sinOffset) * 0.5

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [colors])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}

// Particle interface
interface Particle {
  x: number
  y: number
  radius: number
  color: string
  vx: number
  vy: number
  sinOffset: number
}
