import React from 'react'
import type { PersonDTO } from '../services/phonebook'

interface UserListProps {
  persons: PersonDTO[]
}

const UserList: React.FC<UserListProps> = ({ persons }) => (
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
)

export default UserList
