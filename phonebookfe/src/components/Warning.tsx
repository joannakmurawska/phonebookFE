import React from 'react'

const Warning: React.FC<{ message: string | null }> = ({ message }) => (
  message ? <div style={{ color: 'orange', marginBottom: 8 }}>{message}</div> : null
)

export default Warning
