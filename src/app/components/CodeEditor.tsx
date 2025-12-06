"use client"

import { useEffect, useState, useRef } from "react"
import { Box, Typography, useTheme as useMuiTheme } from "@mui/material"
import { EditorView } from "@codemirror/view"
import { basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { java } from "@codemirror/lang-java"
import { cpp } from "@codemirror/lang-cpp"
import { php } from "@codemirror/lang-php"
import { rust } from "@codemirror/lang-rust"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { json } from "@codemirror/lang-json"
import { markdown } from "@codemirror/lang-markdown"
import { oneDark } from "@codemirror/theme-one-dark"
import { getLanguageLabel } from "../lib/utils"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
}

export default function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [editor, setEditor] = useState<EditorView | null>(null)
  const muiTheme = useMuiTheme()
  const onChangeRef = useRef(onChange)
  const initialValueRef = useRef(value)

  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case "javascript":
        return javascript()
      case "typescript":
        return javascript({ typescript: true })
      case "python":
        return python()
      case "java":
        return java()
      case "cpp":
      case "csharp":
        return cpp()
      case "php":
        return php()
      case "rust":
        return rust()
      case "html":
        return html()
      case "css":
        return css()
      case "json":
        return json()
      case "markdown":
        return markdown()
      default:
        return javascript()
    }
  }

  // Initialize editor when element is ready (ONLY ONCE or when language/theme changes)
  useEffect(() => {
    if (!element) return

    const startState = EditorState.create({
      doc: initialValueRef.current,
      extensions: [
        basicSetup,
        getLanguageExtension(language),
        muiTheme.palette.mode === "dark" ? oneDark : [],
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "14px",
          },
          ".cm-scroller": {
            overflow: "auto",
            fontFamily: '"Fira Code", "Roboto Mono", monospace',
            padding: "8px 0",
          },
          ".cm-gutters": {
            backgroundColor: muiTheme.palette.mode === "dark" ? "#1e1e1e" : "#f8f9fa",
            border: "none",
          },
          ".cm-activeLineGutter": {
            backgroundColor: muiTheme.palette.mode === "dark" ? "#333" : "#e9ecef",
          },
          ".cm-activeLine": {
            backgroundColor: muiTheme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          },
          ".cm-content": {
            caretColor: muiTheme.palette.primary.main,
          },
          ".cm-cursor": {
            borderLeftColor: muiTheme.palette.primary.main,
          },
          ".cm-selectionBackground": {
            backgroundColor: muiTheme.palette.mode === "dark" ? "rgba(58, 134, 255, 0.3)" : "rgba(58, 134, 255, 0.2)",
          },
        }),
      ],
    })

    const view = new EditorView({
      state: startState,
      parent: element,
    })

    setEditor(view)

    return () => {
      view.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, language, muiTheme.palette.mode, muiTheme.palette.primary.main])
  // Note: We use initialValueRef.current for the initial value, so we don't need value in dependencies

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (editor && value !== editor.state.doc.toString()) {
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: value },
      })
    }
  }, [value, editor])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
              backgroundColor: "#3a86ff",
              display: "inline-block",
            }}
          />
          {getLanguageLabel(language)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Auto-formatting enabled
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          transition: "all 0.2s ease",
          "&:focus-within": {
            borderColor: "primary.main",
            boxShadow: (theme) =>
              `0 0 0 2px ${theme.palette.mode === "dark" ? "rgba(58, 134, 255, 0.2)" : "rgba(58, 134, 255, 0.2)"}`,
          },
        }}
        ref={setElement}
      />
    </Box>
  )
}