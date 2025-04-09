"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * A container component that provides responsive behavior
 * and handles browser compatibility issues
 */
export function ResponsiveContainer({ children, className = "" }: ResponsiveContainerProps) {
  const isMobile = useMobile()
  const [browserInfo, setBrowserInfo] = useState<{
    name: string
    isIOS: boolean
    isSafari: boolean
    isFirefox: boolean
    isIE: boolean
  }>({
    name: "unknown",
    isIOS: false,
    isSafari: false,
    isFirefox: false,
    isIE: false,
  })

  // Detect browser on client side
  useEffect(() => {
    const ua = window.navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua)
    const isFirefox = ua.toLowerCase().indexOf("firefox") > -1
    const isIE = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1

    let browserName = "unknown"
    if (isIE) browserName = "ie"
    else if (isFirefox) browserName = "firefox"
    else if (isSafari) browserName = "safari"
    else if (ua.indexOf("Chrome") > -1) browserName = "chrome"
    else if (ua.indexOf("Edge") > -1) browserName = "edge"

    setBrowserInfo({
      name: browserName,
      isIOS,
      isSafari,
      isFirefox,
      isIE,
    })
  }, [])

  return (
    <div
      className={`responsive-container ${isMobile ? "is-mobile" : "is-desktop"} browser-${
        browserInfo.name
      } ${className}`}
      data-browser={browserInfo.name}
      data-is-mobile={isMobile ? "true" : "false"}
      data-is-ios={browserInfo.isIOS ? "true" : "false"}
    >
      {children}
    </div>
  )
}
