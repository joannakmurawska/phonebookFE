import axios from 'axios'

export interface PhoneNumberDTO {
  id: number
  phoneNumber: string
}

export interface PersonDTO {
  id: number
  userName: string
  phoneNumbers: PhoneNumberDTO[]
}

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://phonebookbe-do1g.onrender.com'
const USERS = `${BASE}/api/users`

export async function listUsers() {
  const res = await axios.get<PersonDTO[]>(USERS)
  return res.data
}

export async function createUser(userName: string, phoneNumbers: string[]) {
  // Assume backend accepts array of strings; adjust here if needs object shape
  const payload = { userName, phoneNumbers }
  const res = await axios.post<PersonDTO>(USERS, payload)
  return res.data
}

export async function updateUser(id: number, updates: { userName?: string; phoneNumbers?: string[] }) {
  const res = await axios.put<PersonDTO>(`${USERS}/${id}`, updates)
  return res.data
}

export async function deleteUser(id: number) {
  await axios.delete(`${USERS}/${id}`)
}
