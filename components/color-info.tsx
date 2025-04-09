"use client"

import { X, Copy, Check } from "lucide-react"
import { useState } from "react"
import { hexToRgb, getColorName, getColorHarmony, getColorAccessibility } from "@/lib/color-utils"
import { ModalWrapper } from "./modal-wrapper"
import { useMobile } from "@/hooks/use-mobile"

interface ColorInfoProps {
  color: string
  onClose: () => void
  isOpen: boolean
}

export function ColorInfo({ color, onClose, isOpen }: ColorInfoProps) {
  const [copied, setCopied] = useState(false)
  const isMobile = useMobile()

  const rgb = hexToRgb(color)
  const colorName = getColorName(color)
  const harmony = getColorHarmony(color)
  const accessibility = getColorAccessibility(color)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s,
      l = (max + min) / 2

    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }

      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  // Convert RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - r / 255
    let m = 1 - g / 255
    let y = 1 - b / 255
    const k = Math.min(c, m, y)

    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 1 }
    }

    c = (c - k) / (1 - k)
    m = (m - k) / (1 - k)
    y = (y - k) / (1 - k)

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    }
  }

  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" id="modal-title">
            Color Details
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close color details">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="h-20 md:h-24 rounded-md mb-3" style={{ backgroundColor: color }}></div>

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{colorName}</h3>
            <button
              onClick={() => copyToClipboard(color)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {color.toUpperCase()}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Color Values</h4>
            <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">RGB</p>
                <p className="text-sm font-mono">
                  {rgb.r}, {rgb.g}, {rgb.b}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">HSL</p>
                <p className="text-sm font-mono">
                  {hsl.h}°, {hsl.s}%, {hsl.l}%
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">CMYK</p>
                <p className="text-sm font-mono">
                  {cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">HEX</p>
                <p className="text-sm font-mono">{color.toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Harmony Colors</h4>
            <div className="flex space-x-2">
              {harmony.map((harmonyColor, index) => (
                <div
                  key={`harmony-${index}`}
                  className="w-8 h-8 rounded cursor-pointer"
                  style={{ backgroundColor: harmonyColor }}
                  onClick={() => copyToClipboard(harmonyColor)}
                  title={harmonyColor}
                ></div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Accessibility</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm">White Text Contrast</p>
                <div
                  className={`px-2 py-1 rounded text-xs ${
                    accessibility.whiteContrast >= 4.5 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {accessibility.whiteContrast.toFixed(2)}:1 {accessibility.whiteContrast >= 4.5 ? "✓" : "✗"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Black Text Contrast</p>
                <div
                  className={`px-2 py-1 rounded text-xs ${
                    accessibility.blackContrast >= 4.5 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {accessibility.blackContrast.toFixed(2)}:1 {accessibility.blackContrast >= 4.5 ? "✓" : "✗"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  )
}
