import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface AuthFormProps {
  onAuthSuccess: () => void
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Hasło musi mieć co najmniej 6 znaków'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          if (error.message.includes('email_not_confirmed')) {
            throw new Error('Email nie został potwierdzony. Sprawdź swoją skrzynkę pocztową i kliknij link aktywacyjny.')
          }
          throw error
        }
        
        toast({
          title: "Zalogowano pomyślnie",
          description: "Witaj z powrotem!",
        })
        onAuthSuccess()
      } else {
        if (password !== confirmPassword) {
          throw new Error('Hasła nie są identyczne')
        }
        
        const passwordError = validatePassword(password)
        if (passwordError) {
          throw new Error(passwordError)
        }
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        
        toast({
          title: "Konto utworzone",
          description: "Sprawdź swoją skrzynkę pocztową i potwierdź email, aby się zalogować",
        })
        setIsLogin(true) // Switch to login mode after successful registration
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isLogin ? 'Logowanie' : 'Rejestracja'}</CardTitle>
        <CardDescription>
          {isLogin 
            ? 'Zaloguj się do swojego konta' 
            : 'Utwórz nowe konto'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">
              Hasło {!isLogin && <span className="text-xs text-muted-foreground">(min. 6 znaków)</span>}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Ładowanie...' : (isLogin ? 'Zaloguj się' : 'Zarejestruj się')}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin 
              ? 'Nie masz konta? Zarejestruj się' 
              : 'Masz już konto? Zaloguj się'
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}