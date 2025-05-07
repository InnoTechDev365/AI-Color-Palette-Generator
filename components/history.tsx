"use client"

import { X } from "lucide-react"
import { ModalWrapper } from "./modal-wrapper"
import { useMobile } from "@/hooks/use-mobile"

interface HistoryProps {
  palettes: string[][]
  onSelect: (palette: string[]) => void
  onClose: () => void
  isOpen: boolean
}

export function History({ palettes, onSelect, onClose, isOpen }: HistoryProps) {
  const isMobile = useMobile()

  // Use the ModalWrapper to handle DOM operations safely
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" id="modal-title">
            Palette History
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close history">
            <X className="h-5 w-5" />
          </button>
        </div>

        {palettes.length === 0 ? (
          <p className="text-gray-600">No palette history available yet.</p>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {palettes.map((palette, index) => (
              <div
                key={`palette-${index}`}
                className="cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onSelect(palette)}
              >
                <div className="flex h-10 md:h-12 rounded-md overflow-hidden shadow mb-2">
                  {palette.map((color, colorIndex) => (
                    <div
                      key={`color-${index}-${colorIndex}`}
                      className="flex-1 h-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Palette #{index + 1}</span>
                  <span>Click to select</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalWrapper>
  )
}
