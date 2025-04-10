"use client"

import {
  Box,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
  alpha,
  IconButton,
} from "@mui/material"
import {
  AutoFixHigh as AutoFixHighIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  BugReport,
} from "@mui/icons-material"
import { useState } from "react"

const drawerWidth = 260

interface SidebarProps {
  language: string
  onLanguageChange: (language: string) => void
  onReviewCode: () => void
  isReviewing: boolean
  autoDetect?: boolean
}

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
]

export default function Sidebar({
  language,
  onLanguageChange,
  onReviewCode,
  isReviewing,
}: SidebarProps) {
  const [open, setOpen] = useState(true)

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleLanguageChange = (event: SelectChangeEvent) => {
    onLanguageChange(event.target.value)
  }

  return (
    <>
    
      {!open && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            left: '10px',
            top: '10px',
            zIndex: 1200,
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "none",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(180deg, #1a1a1a 0%, #121212 100%)"
                : "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
          },
        }}
      >
        <Box
          sx={{
            overflow: "auto",
            mt: 8,
            px: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BugReport color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold" minWidth={160}>
                CodeReview Pro
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                opacity: 0.7,
                fontWeight: 500,
                px: 1,
              }}
            >
              CODE SETTINGS
            </Typography>

            <Box sx={{ mb: 2 }}>
              <FormControl
                fullWidth
                size="small"
                sx={{
                  "& .Mui-disabled": {
                    opacity: 1,
                  },
                }}
              >
                <InputLabel id="language-select-label">Language</InputLabel>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  value={language}
                  label="Language"
                  onChange={handleLanguageChange}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Tooltip title={isReviewing ? "Processing..." : "Analyze your code for improvements"} placement="right">
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={isReviewing ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                onClick={onReviewCode}
                disabled={isReviewing}
                sx={{
                  py: 1.2,
                  background: "linear-gradient(45deg, #3a86ff 30%, #4361ee 90%)",
                  transition: "all 0.3s ease",
                }}
              >
                {isReviewing ? "Analyzing..." : "Review Code"}
              </Button>
            </Tooltip>
          </Box>

   
        </Box>
      </Drawer>
    </>
  )
}