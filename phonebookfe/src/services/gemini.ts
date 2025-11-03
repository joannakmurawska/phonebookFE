import axios from 'axios'

export type CrudOp = 'create' | 'read' | 'update' | 'delete'
export type IdentifyBy = 'id' | 'name'

export interface CrudCommand {
  op: CrudOp
  by?: IdentifyBy
  id?: number
  userName?: string
  phoneNumbers?: string[]
  updates?: {
    userName?: string
    phoneNumbers?: string[]
  }
  result?: any
}

export async function interpretCrudInstruction(instruction: string): Promise<CrudCommand & { result?: any }> {
  const backendBase = import.meta.env.VITE_GEMINI_BACKEND_URL as string | undefined

  if (!backendBase) {
    throw new Error('No Gemini configuration found. Set VITE_GEMINI_BACKEND_URL.')
  }

  const url = backendBase.endsWith('/') ? `${backendBase}api/gemini/user-crud` : `${backendBase}/api/gemini/user-crud`

  try {
    const res = await axios.post(url, { userRequest: instruction })
    
    if (res.data?.success && res.data?.operation) {
      const backendResponse = res.data
      
      const crudCommand: CrudCommand & { result?: any } = {
        op: backendResponse.operation.toLowerCase() as CrudOp,
        by: (backendResponse.by as IdentifyBy | undefined) || undefined,
        id: backendResponse.id || undefined,
        userName: backendResponse.userName || undefined,
        phoneNumbers: backendResponse.phoneNumbers || [],
        updates: backendResponse.updates || undefined,
        result: backendResponse.result
      }
      
      return crudCommand
    }
    
    throw new Error('Invalid response from backend')
  } catch (error) {
    console.error('Error interpreting CRUD instruction:', error)
    throw error
  }
}
