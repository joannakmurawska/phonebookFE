import React, { useState, useEffect } from 'react'

interface PromptFormProps {
  prompt: string
  loading: boolean
  error: string | null
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

const EXAMPLE_PROMPTS = [
  "Try: 'show all users'",
  "Try: 'find users named Ana'",
  "Try: 'add John Doe with +48123456789, +48987654321'",
  "Try: 'create user Alice with +1234567890'",
  "Try: 'update John Doe: set numbers to +44123456789'",
  "Try: 'delete user John Doe'",
  "Try: 'remove user with id 5'",
  "Try: 'list all contacts'",
]

const PromptForm: React.FC<PromptFormProps> = ({ prompt, loading, error, onChange, onSubmit }) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % EXAMPLE_PROMPTS.length)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 1200 }}>
      <textarea
        value={prompt}
        onChange={e => onChange(e.target.value)}
        placeholder={EXAMPLE_PROMPTS[placeholderIndex]}
        rows={4}
        style={{ padding: 8, fontFamily: 'monospace' }}
      />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
        <button style={{ backgroundColor: 'blue', color: 'white'}} type="submit" disabled={loading || !prompt.trim()}>
          {loading ? 'Thinking…' : 'Send to Gemini'}
        </button>
        {error && <span style={{ color: 'crimson' }}>Error: {error}</span>}
      </div>
    </form>
  )
}

export default PromptForm
