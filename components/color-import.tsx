"use client"

import { useState } from "react"
import { X, Import, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModalWrapper } from "./modal-wrapper"
import { useMobile } from "@/hooks/use-mobile"

interface ColorImportProps {
  isOpen: boolean
  onClose: () => void
  onImport: (colors: string[]) => void
}

export function ColorImport({ isOpen, onClose, onImport }: ColorImportProps) {
  const [hexInput, setHexInput] = useState("")
  const [cssInput, setCssInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [importType, setImportType] = useState<"hex" | "css">("hex")
  const isMobile = useMobile()

  // Validate hex color
  const isValidHex = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim())
  }

  // Extract colors from hex input
  const extractHexColors = (input: string): string[] => {
    // Split by newlines, commas, or spaces
    const parts = input.split(/[\n,\s]+/).filter(Boolean)

    // Process each part to ensure it's a valid hex color
    return parts
      .map((part) => {
        let color = part.trim()

        // Add # if missing
        if (!color.startsWith("#")) {
          color = "#" + color
        }

        // Expand 3-digit hex to 6-digit
        if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
          color = "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
        }

        return color
      })
      .filter(isValidHex)
  }

  // Extract colors from CSS input
  const extractCssColors = (input: string): string[] => {
    const colors: string[] = []

    // Match hex colors
    const hexMatches = input.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g)
    if (hexMatches) {
      colors.push(...hexMatches)
    }

    // Match rgb/rgba colors
    const rgbMatches = input.match(/rgb$$\s*\d+\s*,\s*\d+\s*,\s*\d+\s*$$/g)
    if (rgbMatches) {
      // Convert rgb to hex
      rgbMatches.forEach((rgb) => {
        const values = rgb.match(/\d+/g)
        if (values && values.length === 3) {
          const r = Number.parseInt(values[0])
          const g = Number.parseInt(values[1])
          const b = Number.parseInt(values[2])
          const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
          colors.push(hex)
        }
      })
    }

    return colors
  }

  // Handle import button click
  const handleImport = () => {
    setError(null)
    let extractedColors: string[] = []

    if (importType === "hex") {
      extractedColors = extractHexColors(hexInput)
    } else {
      extractedColors = extractCssColors(cssInput)
    }

    if (extractedColors.length === 0) {
      setError("No valid colors found. Please check your input.")
      return
    }

    // Limit to 5 colors for the palette
    const colorsToImport = extractedColors.slice(0, 5)

    // If less than 5 colors, fill with the last color
    while (colorsToImport.length < 5) {
      colorsToImport.push(colorsToImport[colorsToImport.length - 1] || "#000000")
    }

    onImport(colorsToImport)
    onClose()
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" id="modal-title">
            Import Colors
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close import panel">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Tabs defaultValue="hex" onValueChange={(value) => setImportType(value as any)}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="hex">Hex Colors</TabsTrigger>
            <TabsTrigger value="css">CSS Code</TabsTrigger>
          </TabsList>

          <TabsContent value="hex" className="mt-0">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Enter hex colors (one per line, or comma/space separated)</p>
                <Textarea
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value)}
                  placeholder="#FF5733
#33FF57
#5733FF"
                  className="font-mono h-32"
                />
              </div>

              <div className="text-xs text-gray-500">
                <p>Examples:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>#FF5733</li>
                  <li>FF5733 (# will be added automatically)</li>
                  <li>#F53 (will be expanded to #FF5533)</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="css" className="mt-0">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Paste CSS code containing colors</p>
                <Textarea
                  value={cssInput}
                  onChange={(e) => setCssInput(e.target.value)}
                  placeholder=":root {
  --primary: #FF5733;
  --secondary: #33FF57;
  --accent: #5733FF;
}"
                  className="font-mono h-32"
                />
              </div>

              <div className="text-xs text-gray-500">
                <p>Supported formats:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hex colors (#FF5733)</li>
                  <li>RGB colors (rgb(255, 87, 51))</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={handleImport} className="flex items-center gap-2">
            <Import className="h-4 w-4" />
            {isMobile ? "Import" : "Import Colors"}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}
