"use client"

import { useState } from "react"
import { Copy, Check, Code, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModalWrapper } from "./modal-wrapper"
import { useMobile } from "@/hooks/use-mobile"

interface CSSExportProps {
  colors: string[]
  isOpen: boolean
  onClose: () => void
}

export function CSSExport({ colors, isOpen, onClose }: CSSExportProps) {
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState<"css" | "scss" | "tailwind" | "hex">("css")
  const isMobile = useMobile()

  // Generate CSS variables
  const generateCSSVariables = () => {
    let cssCode = ":root {\n"
    colors.forEach((color, index) => {
      cssCode += `  --color-${index + 1}: ${color};\n`
    })
    cssCode += "}"
    return cssCode
  }

  // Generate SCSS variables
  const generateSCSSVariables = () => {
    let scssCode = ""
    colors.forEach((color, index) => {
      scssCode += `$color-${index + 1}: ${color};\n`
    })
    return scssCode
  }

  // Generate Tailwind config
  const generateTailwindConfig = () => {
    let tailwindCode = "// Add this to your tailwind.config.js\n"
    tailwindCode += "module.exports = {\n"
    tailwindCode += "  theme: {\n"
    tailwindCode += "    extend: {\n"
    tailwindCode += "      colors: {\n"

    colors.forEach((color, index) => {
      const colorName = `palette-${index + 1}`
      tailwindCode += `        '${colorName}': '${color}',\n`
    })

    tailwindCode += "      }\n"
    tailwindCode += "    }\n"
    tailwindCode += "  }\n"
    tailwindCode += "}"

    return tailwindCode
  }

  // Generate simple hex list
  const generateHexList = () => {
    return colors.join("\n")
  }

  // Get the appropriate code based on the selected format
  const getExportCode = () => {
    switch (exportFormat) {
      case "css":
        return generateCSSVariables()
      case "scss":
        return generateSCSSVariables()
      case "tailwind":
        return generateTailwindConfig()
      case "hex":
        return generateHexList()
      default:
        return generateCSSVariables()
    }
  }

  // Copy code to clipboard
  const copyToClipboard = () => {
    const code = getExportCode()
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download code as file
  const downloadCode = () => {
    const code = getExportCode()
    const fileExtension = exportFormat === "tailwind" ? "js" : exportFormat
    const fileName = `palette-export.${fileExtension}`

    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" id="modal-title">
            Export Palette as Code
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close export panel">
            <Code className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex h-12 rounded-md overflow-hidden shadow mb-4">
            {colors.map((color, index) => (
              <div key={`preview-${index}`} className="flex-1 h-full" style={{ backgroundColor: color }} />
            ))}
          </div>

          <Tabs defaultValue="css" onValueChange={(value) => setExportFormat(value as any)}>
            <TabsList className={`grid ${isMobile ? "grid-cols-2 gap-1" : "grid-cols-4"} mb-4`}>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="scss">SCSS</TabsTrigger>
              {!isMobile && <TabsTrigger value="tailwind">Tailwind</TabsTrigger>}
              {!isMobile && <TabsTrigger value="hex">Hex</TabsTrigger>}
              {isMobile && (
                <TabsTrigger value="tailwind" className="col-span-2 mt-1">
                  Tailwind
                </TabsTrigger>
              )}
              {isMobile && (
                <TabsTrigger value="hex" className="col-span-2 mt-1">
                  Hex
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="css" className="mt-0">
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-auto max-h-60">
                <pre className="whitespace-pre-wrap">{generateCSSVariables()}</pre>
              </div>
            </TabsContent>

            <TabsContent value="scss" className="mt-0">
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-auto max-h-60">
                <pre className="whitespace-pre-wrap">{generateSCSSVariables()}</pre>
              </div>
            </TabsContent>

            <TabsContent value="tailwind" className="mt-0">
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-auto max-h-60">
                <pre className="whitespace-pre-wrap">{generateTailwindConfig()}</pre>
              </div>
            </TabsContent>

            <TabsContent value="hex" className="mt-0">
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-auto max-h-60">
                <pre className="whitespace-pre-wrap">{generateHexList()}</pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={downloadCode} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {isMobile ? "Download" : "Download File"}
          </Button>

          <Button onClick={copyToClipboard} className="flex items-center gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : isMobile ? "Copy" : "Copy to Clipboard"}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}
