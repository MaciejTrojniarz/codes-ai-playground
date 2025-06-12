import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddCodeDialog } from './AddCodeDialog'
import { CodeList } from './CodeList'
import { LogOut, User, Plus } from 'lucide-react'
import type { User as UserType } from '@/lib/types'

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [stats, setStats] = useState({
    active: 0,
    used: 0,
    expired: 0,
    total: 0
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({
          id: user.id,
          email: user.email || ''
        })
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('discount_codes')
          .select('status')
          .eq('user_id', user.id)

        if (error) throw error

        const stats = (data || []).reduce((acc, code) => {
          acc[code.status as keyof typeof acc]++
          acc.total++
          return acc
        }, { active: 0, used: 0, expired: 0, total: 0 })

        setStats(stats)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [refreshTrigger])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
  }

  const handleCodeAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kody Rabatowe</h1>
              <p className="text-sm text-gray-600">Zarządzaj swoimi kodami zniżkowymi</p>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              )}
              
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Wyloguj
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Aktywne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Użyte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.used}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Przeterminowane</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Łącznie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Twoje kody rabatowe</h2>
            <p className="text-sm text-gray-600">Filtruj i zarządzaj swoimi kodami</p>
          </div>
          
          <AddCodeDialog onCodeAdded={handleCodeAdded} />
        </div>

        <CodeList refreshTrigger={refreshTrigger} />
      </main>
    </div>
  )
}