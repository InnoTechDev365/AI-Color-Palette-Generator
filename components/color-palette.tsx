"use client"

import { ColorCard } from "@/components/color-card"
import { useMobile } from "@/hooks/use-mobile"

interface ColorPaletteProps {
  colors: string[]
  onColorChange: (index: number, color: string) => void
  onSelectColor: (index: number) => void
  currentFormat?: string
}

export function ColorPalette({ colors, onColorChange, onSelectColor, currentFormat = "HEX" }: ColorPaletteProps) {
  const isMobile = useMobile()

  return (
    <div className={`mt-6 grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-5"}`}>
      {colors.map((color, index) => (
        <ColorCard
          key={`color-${index}`}
          color={color}
          index={index}
          onChange={onColorChange}
          onSelect={() => onSelectColor(index)}
          currentFormat={currentFormat}
        />
      ))}
    </div>
  )
}
