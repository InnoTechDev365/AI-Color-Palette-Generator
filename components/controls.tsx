"use client"

import { RefreshCw, Clock, ThumbsUp, ThumbsDown, Code, Import } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMobile } from "@/hooks/use-mobile"

interface ControlsProps {
  onGenerateNew: () => void
  onToggleHistory: () => void
  onLike: () => void
  onDislike: () => void
  generationMode: string
  setGenerationMode: (mode: string) => void
  onExportCSS: () => void
  onImportColors: () => void
  currentColorFormat?: string
  onChangeColorFormat?: () => void
}

export function Controls({
  onGenerateNew,
  onToggleHistory,
  onLike,
  onDislike,
  generationMode,
  setGenerationMode,
  onExportCSS,
  onImportColors,
  currentColorFormat = "HEX",
  onChangeColorFormat,
}: ControlsProps) {
  const isMobile = useMobile()

  return (
    <div className="space-y-4">
      <div className={`flex flex-wrap gap-2 ${isMobile ? "justify-between" : "justify-center gap-3"}`}>
        <Button
          onClick={onGenerateNew}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700"
          size={isMobile ? "sm" : "default"}
        >
          <RefreshCw className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          {isMobile ? "Generate" : "Generate New Palette"}
        </Button>

        <Button
          onClick={onToggleHistory}
          variant="outline"
          className="flex items-center gap-2"
          size={isMobile ? "sm" : "default"}
        >
          <Clock className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          {isMobile ? "History" : "View History"}
        </Button>

        <Button
          onClick={onChangeColorFormat}
          variant="outline"
          className="flex items-center gap-2"
          size={isMobile ? "sm" : "default"}
        >
          <Code className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          {currentColorFormat}
        </Button>

        <Button
          onClick={onLike}
          variant="outline"
          className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
          size={isMobile ? "sm" : "default"}
        >
          <ThumbsUp className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          Like
        </Button>

        <Button
          onClick={onDislike}
          variant="outline"
          className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
          size={isMobile ? "sm" : "default"}
        >
          <ThumbsDown className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          {isMobile ? "" : "Dislike"}
        </Button>

        <Button
          onClick={onExportCSS}
          variant="outline"
          className="flex items-center gap-2"
          size={isMobile ? "sm" : "default"}
        >
          <Code className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          {isMobile ? "Export" : "Export CSS"}
        </Button>

        <Button
          onClick={onImportColors}
          variant="outline"
          className="flex items-center gap-2"
          size={isMobile ? "sm" : "default"}
        >
          <Import className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          Import
        </Button>
      </div>

      <div className="flex justify-center">
        <div className={`${isMobile ? "w-full" : "w-full max-w-xs"}`}>
          <Select value={generationMode} onValueChange={setGenerationMode}>
            <SelectTrigger>
              <SelectValue placeholder="Generation Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">Random</SelectItem>
              <SelectItem value="ai">AI Suggested</SelectItem>
              <SelectItem value="harmonious">Harmonious</SelectItem>
              <SelectItem value="analogous">Analogous</SelectItem>
              <SelectItem value="monochromatic">Monochromatic</SelectItem>
              <SelectItem value="complementary">Complementary</SelectItem>
              <SelectItem value="triadic">Triadic</SelectItem>
              <SelectItem value="tetradic">Tetradic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
