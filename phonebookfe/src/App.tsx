import { useState} from 'react'
import './App.css'
import { interpretCrudInstruction } from './services/gemini'
import type { CrudCommand } from './services/gemini'
import { listUsers, createUser, updateUser, deleteUser } from './services/phonebook'
import type { PersonDTO } from './services/phonebook'
import PromptForm from './components/PromptForm'
import UserList from './components/UserList'
import Warning from './components/Warning'

type Person = PersonDTO

function App() {
  const [persons, setPersons] = useState<Person[]>([])
  const [prompt, setPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiResponse, setAiResponse] = useState('')
  const [warning, setWarning] = useState<string | null>(null)
  const [showUsers, setShowUsers] = useState(false)

  const onSubmitPrompt = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = prompt.trim()
    if (!trimmed) return
    setAiLoading(true)
    setAiError(null)
    setAiResponse('')
    setWarning(null)
    try {
      const cmd: CrudCommand = await interpretCrudInstruction(trimmed)
      let outcome = ''
      if (cmd.op === 'read') {
        let users = await listUsers()
        if (cmd.userName) {
          const q = cmd.userName.toLowerCase()
          users = users.filter(p => p.userName.toLowerCase().includes(q))
        }
        setPersons(users)
        setShowUsers(true)
        outcome = `Read ${users.length} user(s).`
      }
      if (cmd.op === 'create' && cmd.userName && cmd.phoneNumbers && cmd.phoneNumbers.length > 0) {
        await createUser(cmd.userName, cmd.phoneNumbers)
        const users = await listUsers()
        setPersons(users)
        setShowUsers(true)
        outcome = `Created user ${cmd.userName}.`
      }
      if (cmd.op === 'update') {
        let id = cmd.id
        let matches: Person[] = []
        if (!id && cmd.by === 'name' && cmd.userName) {
          matches = persons.filter(p => p.userName.toLowerCase() === cmd.userName!.toLowerCase())
          if (matches.length > 1) {
            setWarning(`Multiple users match name '${cmd.userName}'. Only the first will be updated.`)
          }
          id = matches[0]?.id
        }
        if (id) {
          await updateUser(id, cmd.updates ?? {})
          const users = await listUsers()
          setPersons(users)
          setShowUsers(true)
          outcome = `Updated user with id ${id}.`
        } else {
          outcome = 'Could not resolve user to update.'
        }
      }
      if (cmd.op === 'delete') {
        let id = cmd.id
        let matches: Person[] = []
        if (!id && cmd.by === 'name' && cmd.userName) {
          matches = persons.filter(p => p.userName.toLowerCase() === cmd.userName!.toLowerCase())
          if (matches.length > 1) {
            setWarning(`Multiple users match name '${cmd.userName}'. Only the first will be deleted.`)
          }
          id = matches[0]?.id
        }
        if (id) {
          await deleteUser(id)
          const users = await listUsers()
          setPersons(users)
          setShowUsers(true)
          outcome = `Deleted user with id ${id}.`
        } else {
          outcome = 'Could not resolve user to delete.'
        }
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
      <PromptForm
        prompt={prompt}
        loading={aiLoading}
        error={aiError}
        onChange={setPrompt}
        onSubmit={onSubmitPrompt}
      />
      
      {aiResponse && (
        <div style={{ marginTop: 20, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
          <h3>Response</h3>
          <div style={{ whiteSpace: 'pre-wrap' }}>{aiResponse}</div>
        </div>
      )}

      <hr />
      <h2>Numbers</h2>
      <Warning message={warning} />
      {showUsers ? (
        <UserList persons={persons} />
      ) : (
        <p style={{ color: '#999' }}>Ask me to show users to see the list</p>
      )}
    </div>
  )
}

export default App
