import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function debounce<T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
  
    return (...args: Parameters<T>): void => {
      const later = () => {
        timeout = null
        func(...args)
      }
  
      if (timeout !== null) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(later, wait)
    }
  }
export function getLanguageLabel(languageCode: string): string {
  const languages: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    python: "Python",
    java: "Java",
    csharp: "C#",
    cpp: "C++",
    go: "Go",
    rust: "Rust",
    php: "PHP",
    ruby: "Ruby",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    markdown: "Markdown",
  }

  return languages[languageCode] || languageCode
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


