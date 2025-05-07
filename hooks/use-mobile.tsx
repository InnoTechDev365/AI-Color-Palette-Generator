"use client"

import { useState, useEffect } from "react"

/**
 * Hook to detect if the current device is mobile
 * @returns boolean indicating if the device is mobile
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if the device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

      // Check if device is mobile based on screen width
      const isMobileByWidth = window.innerWidth < 768

      // Check if device is mobile based on user agent
      const isMobileByUA =
        /android/i.test(userAgent) ||
        /iPad|iPhone|iPod/.test(userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

      setIsMobile(isMobileByWidth || isMobileByUA)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return isMobile
}
