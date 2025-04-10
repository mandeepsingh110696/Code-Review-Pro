"use client"

import { Box, Typography, CircularProgress, useTheme as useMuiTheme } from "@mui/material"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { materialDark, materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { useTheme } from "@mui/material/styles"
import { Info } from "@mui/icons-material"

interface ReviewPanelProps {
  review: string
  isLoading: boolean
}

export default function ReviewPanel({ review, isLoading }: ReviewPanelProps) {
  const theme = useTheme()
  const muiTheme = useMuiTheme()
  const isDarkMode = theme.palette.mode === "dark"

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ff006e",
              display: "inline-block",
            }}
          />
          AI Review
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          p: 2,
          overflow: "auto",
          bgcolor: theme.palette.background.paper,
          transition: "all 0.2s ease",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              gap: 2,
            }}
          >
            <CircularProgress size={40} sx={{ color: "#3a86ff" }} />
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                Analyzing your code...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI is reviewing your code for issues and improvements
              </Typography>
            </Box>
          </Box>
        ) : review ? (
          <Box
            sx={{
              "& a": {
                color: muiTheme.palette.primary.main,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              },
              "& h2": {
                fontSize: "1.5rem",
                fontWeight: 600,
                mt: 2,
                mb: 1,
                pb: 1,
                borderBottom: `1px solid ${muiTheme.palette.divider}`,
              },
              "& h3": {
                fontSize: "1.25rem",
                fontWeight: 600,
                mt: 2,
                mb: 1,
              },
              "& ul, & ol": {
                pl: 3,
              },
              "& li": {
                mb: 0.5,
              },
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || "")
                  return  match ? (
                    <SyntaxHighlighter
                      style={isDarkMode ? (materialDark) : (materialLight)}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        borderRadius: "8px",
                        marginTop: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className={className}
                      {...props}
                      style={{
                        backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        fontFamily: '"Fira Code", "Roboto Mono", monospace',
                      }}
                    >
                      {children}
                    </code>
                  )
                },
              }}
            >
              {review}
            </ReactMarkdown>
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              mt: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(45deg, rgba(58, 134, 255, 0.1) 0%, rgba(255, 0, 110, 0.1) 100%)",
              }}
            >
              <Info sx={{ fontSize: 40, color: "#3a86ff" }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Ready to Review Your Code
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mx: "auto" }}>
                Click the Review Code button to get AI-powered feedback on your code quality, performance, and best
                practices.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}