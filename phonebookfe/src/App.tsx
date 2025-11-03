import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface Person {
  id: number
  name: string
  number: string
}

function App() {
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch phonebook data from backend
    axios
      .get<Person[]>('http://localhost:3001/api/persons')
      .then(response => {
        setPersons(response.data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to fetch data from backend')
        setLoading(false)
        console.error('Error fetching persons:', err)
      })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <h2>Numbers</h2>
      <div>
        {persons.map(person => (
          <div key={person.id}>
            {person.name} {person.number}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
