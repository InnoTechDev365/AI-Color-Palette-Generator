"use client"

import type React from "react"

import { useState } from "react"
import { Copy, Check, Info } from "lucide-react"
import { hexToRgb } from "@/lib/color-utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMobile } from "@/hooks/use-mobile"

interface ColorCardProps {
  color: string
  index: number
  onChange: (index: number, color: string) => void
  onSelect: () => void
  currentFormat?: string
}

export function ColorCard({ color, index, onChange, onSelect, currentFormat = "HEX" }: ColorCardProps) {
  const [copied, setCopied] = useState(false)
  const isMobile = useMobile()
  const [displayFormat, setDisplayFormat] = useState(currentFormat)

  const rgbValue = hexToRgb(color)

  let displayValue = color.toUpperCase()
  if (currentFormat === "RGB") {
    displayValue = `RGB(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`
  } else if (currentFormat === "HSL") {
    const hsl = rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b)
    displayValue = `HSL(${Math.round(hsl.h)}°, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`
  } else if (currentFormat === "CSS") {
    displayValue = `var(--color-${index + 1})`
  } else if (currentFormat === "TW") {
    displayValue = `palette-${index + 1}`
  }

  const textColor = isLightColor(color) ? "text-gray-800" : "text-white"

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent other click handlers
    navigator.clipboard.writeText(displayValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, e.target.value)
  }

  const handleFormatChange = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent other click handlers
    if (displayFormat === "HEX") setDisplayFormat("RGB")
    else if (displayFormat === "RGB") setDisplayFormat("HSL")
    else if (displayFormat === "HSL") setDisplayFormat("CSS")
    else if (displayFormat === "CSS") setDisplayFormat("TW")
    else setDisplayFormat("HEX")
  }

  // Convert RGB to HSL
  function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
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

    return { h: h * 360, s, l }
  }

  return (
    <div
      className="rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:scale-105"
      style={{ backgroundColor: color }}
    >
      <div
        className={`${isMobile ? "h-28" : "h-32 sm:h-40"} cursor-pointer flex flex-col justify-between p-4`}
        onClick={onSelect}
      >
        <div className="flex justify-between">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${textColor} bg-white/20 hover:bg-white/30 h-7 w-7`}
                  onClick={(e) => {
                    e.stopPropagation() // Prevent parent onClick
                    onSelect()
                  }}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View color details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <button
            onClick={handleFormatChange}
            className={`${textColor} text-xs font-mono px-2 py-1 rounded bg-white/20 hover:bg-white/30`}
          >
            {displayFormat.toUpperCase()}
          </button>
        </div>

        <div className="mt-auto">
          <p className={`${textColor} font-mono text-sm truncate`}>{displayValue}</p>
        </div>
      </div>

      <div className="bg-white p-3 flex justify-between items-center">
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="w-8 h-8 rounded cursor-pointer"
          aria-label={`Change color ${index + 1}`}
        />

        <button onClick={copyToClipboard} className="p-2 rounded-full hover:bg-gray-100" aria-label="Copy color code">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-500" />}
        </button>
      </div>
    </div>
  )
}

// Helper function to determine if text should be dark or light based on background
function isLightColor(color: string): boolean {
  const hex = color.replace("#", "")
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)

  // Calculate perceived brightness using the formula: (R * 299 + G * 587 + B * 114) / 1000
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 128
}
