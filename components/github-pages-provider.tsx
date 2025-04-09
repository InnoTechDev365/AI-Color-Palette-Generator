"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface GitHubPagesProviderProps {
  children: React.ReactNode
}

/**
 * This component handles GitHub Pages specific adjustments
 * It ensures assets are loaded correctly when deployed to GitHub Pages
 */
export function GitHubPagesProvider({ children }: GitHubPagesProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if we're running on GitHub Pages
    const isGitHubPages = window.location.hostname.includes("github.io")

    if (isGitHubPages) {
      // Add a class to the body for GitHub Pages specific styles if needed
      document.body.classList.add("github-pages")

      // You can add any GitHub Pages specific adjustments here
      console.log("Running on GitHub Pages")
    }

    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    // Simple loading state while we check the environment
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <>{children}</>
}
