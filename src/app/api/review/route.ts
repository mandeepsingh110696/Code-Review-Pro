import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import os from "os"
import path from "path"
import { execSync } from "child_process"
export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const prompt = `
      You are a professional code reviewer. Please review the following ${language} code and provide feedback:
      - Identify any bugs or issues
      - Suggest improvements for readability and maintainability
      - Point out any performance concerns
      - Highlight good practices used
      
      Format your response in markdown with code examples where appropriate.
      Be concise but thorough. Focus on the most important issues first.
      
      Here's the code to review:
      
      \`\`\`${language}
      ${code}
      \`\`\`
    `


    if (process.env.OPENAI_API_KEY) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a code reviewer specialized in providing helpful, constructive feedback.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`)
        }

        const data = await response.json()
        const reviewText = data.choices[0].message.content
        return NextResponse.json({ review: reviewText })
      } catch (error) {
        console.error("Error calling OpenAI:", error)
        // Fall through to Ollama or use fallback
      }
    }

    // For local development, using Ollama
    try {
      const modelName = process.env.OLLAMA_MODEL || "codellama"
      const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434"

      console.log("Connecting to Ollama at:", ollamaUrl)
      try {
        // // Create a temporary file with the code to review
        const tempDir = os.tmpdir()
        const tempFilePath = path.join(tempDir, `code_to_review_${Date.now()}.txt`)

        // Write the prompt to the temp file
        fs.writeFileSync(tempFilePath, prompt)

       
        const command = `ollama run ${modelName} "$(cat ${tempFilePath})"`
        console.log("Executing command:", command)

        const output = execSync(command, {
          timeout: 60000, // 60 second timeout
          maxBuffer: 1024 * 1024 * 10, // 10MB buffer for large responses
        }).toString()

        // Clean up the temp file
        fs.unlinkSync(tempFilePath)

        console.log("Ollama command execution successful")
        return NextResponse.json({ review: output })
      } catch (execError) {
        console.error("Error executing Ollama command:", execError)
        throw new Error(`Failed to execute Ollama command: ${execError instanceof Error ? execError.message : String(execError)}`)
      }
    } catch (error) {
      console.error("Error calling Ollama:", error)

    
      const reviewText = `## Code Review - Connection Issue

### Unable to Connect to Ollama

I couldn't connect to the Ollama service. Here's how to fix this:

1. **Check if Ollama is running:**
   - Open a terminal/command prompt
   - Run \`ollama ps\` to check if Ollama is running
   - If not running, start it with \`ollama serve\`

2. **Verify the model is available:**
   - Run \`ollama list\` to see available models
   - If \`codellama\` is not listed, run \`ollama pull codellama\`

3. **Common issues:**
   - **API vs Command Line:** The application is trying to use the Ollama API, but there might be issues with it
   - **CORS issues:** Browser security might be blocking the connection
   - **Network configuration:** Make sure localhost is accessible from your application

4. **Technical details:**
   \`\`\`
   Error: ${error instanceof Error ? error.message : String(error)}
   \`\`\`

Try again after confirming Ollama is running properly.`

      return NextResponse.json({ review: reviewText })
    }
  } catch (error) {
    console.error("Error in review API:", error)
    return NextResponse.json({
      review: `## Error Processing Request

An error occurred while processing your review request:

\`\`\`
${error instanceof Error ? error.message : String(error)}
\`\`\`

Please try again later or check your server logs for more details.`,
    })
  }
}
