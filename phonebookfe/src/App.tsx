import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface PhoneNumber {
  id: number;
  phoneNumber: string;
}

interface Person {
  id: number;
  userName: string;
  phoneNumbers: PhoneNumber[];
}

function App() {
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch phonebook data from backend
    axios
      .get<Person[]>('http://localhost:8080/api/users')
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

console.log(persons)

  return (
    <div>
      <h1>Phonebook</h1>
      <h2>Numbers</h2>
      <div>
        {persons.map(person => (
        <div key={person.id}>
          <h3>{person.userName}</h3>
          <ul>
            {person.phoneNumbers.map(phone => (
              <li key={phone.id}>{phone.phoneNumber}</li>
            ))}
          </ul>
        </div>
      ))}
      </div>
    </div>
  )
}

export default App
