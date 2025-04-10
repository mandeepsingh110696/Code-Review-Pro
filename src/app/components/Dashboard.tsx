"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Box, Container, Paper, useTheme as useMuiTheme } from "@mui/material"
import { useTheme } from "./ThemeProvider"
import Header from "./Header"
import Sidebar from "./Sidebar"
import CodeEditor from "./CodeEditor"
import ReviewPanel from "./ReviewPanel"


export default function Dashboard() {
  const [code, setCode] = useState<string>("// Write your code here")
  const [language, setLanguage] = useState<string>("javascript")
  const [review, setReview] = useState<string>("")
  const [isReviewing, setIsReviewing] = useState<boolean>(false)
  const { mode } = useTheme()
  const muiTheme = useMuiTheme()

  // State for resizable panels
  const [splitPosition, setSplitPosition] = useState<number>(50) // Default 50% split
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)


  const handleCodeChange = (value: string) => {
    setCode(value)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }



  const handleReviewCode = async () => {
    try {
      setIsReviewing(true)
      setReview("") 
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setReview(data.review || "No review was generated. Please try again.")
    } catch (error) {
      console.error("Error reviewing code:", error)
      setReview(`## Error Reviewing Code

An error occurred while trying to review your code:
\`\`\`
${error instanceof Error ? error.message : "Unknown error"}
\`\`\`

### Troubleshooting

- If you're running locally, make sure Ollama is installed and running
- For production, ensure the appropriate environment variables are set
- Check your network connection and try again`)
    } finally {
      setIsReviewing(false)
    }
  }


  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      const mouseX = e.clientX - containerRect.left

      // Calculate percentage (constrain between 20% and 80%)
      const newPosition = Math.min(Math.max((mouseX / containerWidth) * 100, 20), 80)
      setSplitPosition(newPosition)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          mode === "dark"
            ? "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)"
            : "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
      }}
    >
      <Header />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden", pt: 2 }}>
        <Sidebar
          language={language}
          onLanguageChange={handleLanguageChange}
          onReviewCode={handleReviewCode}
          isReviewing={isReviewing}
        />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, overflow: "auto" }}>
          <Container maxWidth={false} sx={{ mb: 4, px: 2 }} ref={containerRef}>
            <Box
              sx={{
                display: "flex",
                height: "calc(100vh - 160px)",
                position: "relative",
                cursor: isDragging ? "col-resize" : "default",
              }}
            >
              {/* Code Editor Panel */}
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: muiTheme.shadows[6],
                  },
                  width: `${splitPosition}%`,
                }}
              >
                <CodeEditor value={code} onChange={handleCodeChange} language={language} />
              </Paper>

              {/* Resizable Divider */}
              <Box
                sx={{
                  width: "10px",
                  backgroundColor: "transparent",
                  cursor: "col-resize",
                  position: "relative",
                  zIndex: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": {
                    "& .divider-line": {
                      backgroundColor: muiTheme.palette.primary.main,
                    },
                  },
                }}
                onMouseDown={handleMouseDown}
              >
                <Box
                  className="divider-line"
                  sx={{
                    width: "4px",
                    height: "50px",
                    backgroundColor: isDragging ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                    borderRadius: "2px",
                    transition: "background-color 0.2s",
                  }}
                />
              </Box>

              {/* Review Panel */}
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: muiTheme.shadows[6],
                  },
                  width: `${100 - splitPosition}%`,
                }}
              >
                <ReviewPanel review={review} isLoading={isReviewing} />
              </Paper>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}
