"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useMobile } from "@/hooks/use-mobile"

interface ModalWrapperProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

/**
 * A wrapper component that safely renders modal content using React portals
 * with cross-browser compatibility and responsive design
 */
export function ModalWrapper({ children, isOpen, onClose }: ModalWrapperProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const isMobile = useMobile()

  // Create the modal element only once
  useEffect(() => {
    // Create a div that will be the modal container
    const modalElement = document.createElement("div")
    modalElement.className = "modal-portal-root"
    document.body.appendChild(modalElement)

    // Store the reference
    modalRef.current = modalElement
    setMounted(true)

    // Clean up function to safely remove the element when component unmounts
    return () => {
      if (document.body.contains(modalElement)) {
        document.body.removeChild(modalElement)
      }
    }
  }, [])

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen, onClose])

  // Handle click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (contentRef.current && e.target instanceof Node) {
        // Check if click is directly on the modal background (not its children)
        if (!contentRef.current.contains(e.target) && isOpen) {
          onClose()
        }
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isOpen, onClose])

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen])

  // Don't render anything if the modal is closed or the ref isn't ready
  if (!isOpen || !mounted || !modalRef.current) {
    return null
  }

  // Use createPortal to render the modal content in the separate div
  return createPortal(
    <div
      className="modal-background fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn overscroll-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={contentRef}
        className={`modal-content bg-white rounded-lg shadow-xl max-h-[90vh] overflow-auto ${
          isMobile ? "w-full" : "max-w-2xl w-full"
        }`}
      >
        {children}
      </div>
    </div>,
    modalRef.current,
  )
}
