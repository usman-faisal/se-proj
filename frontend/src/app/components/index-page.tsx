'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export default function IndexPage() {
  const [generatedCode, setGeneratedCode] = useState('')

  const generateCode = useCallback(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const codeLength = 10
    let result = ''
    for (let i = 0; i < codeLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    setGeneratedCode(result)
  }, [])

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(generatedCode)
      .then(() => {
        toast('Code copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy code: ', err)
      })
  }, [generatedCode])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          GET A SECURE URL
        </h1>
        <div className="relative flex items-center">
          <Input
            type="text"
            value={generatedCode}
            readOnly
            placeholder="Generated code will appear here"
            className="pr-20 items-center justify-center"
          />
          <Button
            onClick={copyCode}
            className="absolute right-0 h-full w-8 p-0"
            disabled={!generatedCode}
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
        <Button onClick={generateCode} className="w-full">
          Generate
        </Button>
      </div>
    </div>
  )
}