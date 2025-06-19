"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  profileImage?: string
}

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (user: User) => void
}

export function AuthModal({ open, onOpenChange, onLogin }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user: User = {
      id: "1",
      name: "John Doe",
      email: loginData.email,
      profileImage: "/placeholder.svg?height=40&width=40",
    }

    onLogin(user)
    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user: User = {
      id: Date.now().toString(),
      name: signupData.name,
      email: signupData.email,
      profileImage: "/placeholder.svg?height=40&width=40",
    }

    onLogin(user)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to FinanceApp</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
