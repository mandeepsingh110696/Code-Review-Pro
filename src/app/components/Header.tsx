"use client"

import type React from "react"

import { useState } from "react"
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Tooltip } from "@mui/material"
import { Brightness4, Brightness7, AccountCircle } from "@mui/icons-material"
import { useTheme } from "./ThemeProvider"


export default function Header() {
  const { mode, setMode } = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleThemeToggle = () => {
    setMode(mode === "light" ? "dark" : "light")
  }

  return (
    <AppBar position="static" elevation={0} color="transparent">
      <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #3a86ff 30%, #ff006e 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              ml: 2,
            }}
          >
            CodeReview
          </Typography>
          <Typography
            variant="body2"
            sx={{
              ml: 1.5,
              opacity: 0.7,
              display: { xs: "none", sm: "block" },
            }}
          >
            AI-Powered Code Analysis
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={handleThemeToggle}
            sx={{
              transition: "transform 0.2s",
              "&:hover": { transform: "rotate(20deg)" },
            }}
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

        
    

      
       <Tooltip title="Coming soon" placement="bottom">
       <span>
         <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.1)" },
            }}
         
           disabled
          >
            <AccountCircle />
          </IconButton>
          </span>
            </Tooltip>
    
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
