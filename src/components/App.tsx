import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthForm } from './AuthForm'
import { Dashboard } from './Dashboard'
import { Toaster } from '@/components/ui/toaster'
import type { User } from '@/lib/types'

export function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || ''
        })
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthSuccess = () => {
    // User state will be updated by the auth state change listener
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Ładowanie...</div>
          <div className="text-sm text-muted-foreground">Sprawdzanie sesji użytkownika</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {user ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Kody Rabatowe</h1>
              <p className="text-gray-600">Zarządzaj swoimi kodami zniżkowymi w jednym miejscu</p>
            </div>
            <AuthForm onAuthSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}
      <Toaster />
    </>
  )
}