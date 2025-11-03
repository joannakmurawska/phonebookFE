import { useState } from 'react'
import './App.css'
import { interpretCrudInstruction } from './services/gemini'
import type { CrudCommand } from './services/gemini'
import { listUsers, createUser, updateUser, deleteUser } from './services/phonebook'
import type { PersonDTO } from './services/phonebook'

type Person = PersonDTO

function App() {
  const [persons, setPersons] = useState<Person[]>([])
  const [prompt, setPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiResponse, setAiResponse] = useState('')
  const [showPersons, setShowPersons] = useState(false)

  const onSubmitPrompt = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = prompt.trim()
    if (!trimmed) return
    
    setAiLoading(true)
    setAiError(null)
    setAiResponse('')
    
    try {
      const cmd: CrudCommand = await interpretCrudInstruction(trimmed)
      let outcome = ''

      if (cmd.op === 'read') {
        if (cmd.result && Array.isArray(cmd.result)) {
          setPersons(cmd.result as Person[])
        } else if (cmd.result) {
          setPersons([cmd.result as Person])
        } else {
          setPersons([])
        }
        setShowPersons(true)
        outcome = `Read ${Array.isArray(cmd.result) ? cmd.result.length : (cmd.result ? 1 : 0)} user(s).`
      }

      if (cmd.op === 'create' && cmd.userName && cmd.phoneNumbers && cmd.phoneNumbers.length > 0) {
        const created = await createUser(cmd.userName, cmd.phoneNumbers)
        setPersons(prev => [...prev, created as Person])
        setShowPersons(true)
        outcome = `Created user ${created.userName}.`
      }

      if (cmd.op === 'update') {
        let id = cmd.id
        if (!id && cmd.by === 'name' && cmd.userName) {
          const match = persons.find(p => p.userName.toLowerCase() === cmd.userName!.toLowerCase())
          id = match?.id
        }
        if (id) {
          const updated = await updateUser(id, cmd.updates ?? {})
          setPersons(prev => prev.map(p => (p.id === id ? (updated as Person) : p)))
          outcome = `Updated user ${updated.userName}.`
        } else {
          outcome = 'Could not resolve user to update.'
        }
      }

      if (cmd.op === 'delete') {
        let id = cmd.id
        if (!id && cmd.by === 'name' && cmd.userName) {
          const match = persons.find(p => p.userName.toLowerCase() === cmd.userName!.toLowerCase())
          id = match?.id
        }
        if (id) {
          await deleteUser(id)
          setPersons(prev => prev.filter(p => p.id !== id))
          outcome = `Deleted user with id ${id}.`
        } else {
          outcome = 'Could not resolve user to delete.'
        }
      }

      if (cmd.op === 'create' || cmd.op === 'update' || cmd.op === 'delete') {
        const updated = await listUsers()
        setPersons(updated as Person[])
        setShowPersons(true)
      }

      setAiResponse(outcome)
      setPrompt('')
    } catch (err: any) {
      console.error('Gemini request failed', err)
      setAiError(err?.message || 'Gemini request failed')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Phonebook</h1>
      
      <hr />
      <h2>Ask Gemini</h2>
      <form onSubmit={onSubmitPrompt} style={{ display: 'grid', gap: 8, maxWidth: 700 }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Try: 'show all users' or 'add John with +48123456789' or 'delete John'"
          rows={4}
          style={{ padding: 8, fontFamily: 'monospace' }}
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
          <button style={{ backgroundColor: 'blue', color: 'white'}} type="submit" disabled={aiLoading || !prompt.trim()}>
            {aiLoading ? 'Thinking…' : 'Send to Gemini'}
          </button>
          {aiError && <span style={{ color: 'crimson' }}>Error: {aiError}</span>}
        </div>
      </form>
      
      {aiResponse && (
        <div style={{ marginTop: 20, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
          <h3>Response</h3>
          <div style={{ whiteSpace: 'pre-wrap' }}>{aiResponse}</div>
        </div>
      )}

      <hr />
      <h2>Numbers</h2>
      {showPersons ? (
        <div>
          {persons.length === 0 ? (
            <p>No users found.</p>
          ) : (
            persons.map(person => (
              <div key={person.id} style={{ marginBottom: 16, padding: 12, border: '1px solid #ccc', borderRadius: 4 }}>
                <h3>{person.userName}</h3>
                <ul>
                  {person.phoneNumbers.map(phone => (
                    <li key={phone.id}>{phone.phoneNumber}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      ) : (
        <p style={{ color: '#999' }}>Users will appear here when you query them</p>
      )}
    </div>
  )
}

export default App
