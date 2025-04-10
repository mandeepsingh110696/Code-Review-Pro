"use client"

import type React from "react"

import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles"
import { useMediaQuery } from "@mui/material"
import { createContext, useContext, useMemo, useState } from "react"

type ThemeMode = "light" | "dark" | "system"

interface ThemeContextType {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("system")
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  const currentMode = useMemo(() => {
    if (mode === "system") {
      return prefersDarkMode ? "dark" : "light"
    }
    return mode
  }, [mode, prefersDarkMode])

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: currentMode === "dark" ? "dark" : "light",
          primary: {
            main: "#3a86ff",
          },
          secondary: {
            main: "#ff006e",
          },
          background: {
            default: currentMode === "dark" ? "#121212" : "#f8f9fa",
            paper: currentMode === "dark" ? "#1e1e1e" : "#ffffff",
          },
          text: {
            primary: currentMode === "dark" ? "#e0e0e0" : "#212121",
            secondary: currentMode === "dark" ? "#a0a0a0" : "#666666",
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 600,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 500,
          },
          h5: {
            fontWeight: 500,
          },
          h6: {
            fontWeight: 500,
          },
          subtitle1: {
            fontWeight: 500,
          },
          button: {
            fontWeight: 500,
            textTransform: "none",
          },
        },
        shape: {
          borderRadius: 10,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: "8px 16px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: currentMode === "dark" ? "0 5px 15px rgba(0,0,0,0.3)" : "0 5px 15px rgba(0,0,0,0.1)",
                },
              },
              contained: {
                boxShadow: currentMode === "dark" ? "0 2px 8px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.1)",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                boxShadow: currentMode === "dark" ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.05)",
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: currentMode === "dark" ? "0 2px 10px rgba(0,0,0,0.5)" : "0 2px 10px rgba(0,0,0,0.1)",
                backdropFilter: "blur(10px)",
                backgroundColor: currentMode === "dark" ? "rgba(30,30,30,0.8)" : "rgba(255,255,255,0.8)",
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: currentMode === "dark" ? "#1a1a1a" : "#ffffff",
                borderRight: "none",
              },
            },
          },
        },
      }),
    [currentMode],
  )

  const contextValue = useMemo(() => {
    return { mode, setMode }
  }, [mode])

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
