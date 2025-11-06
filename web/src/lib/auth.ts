'use client'

export function setToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem('token', token)
}

export function clearToken() {
  if (typeof window !== 'undefined') localStorage.removeItem('token')
}
