"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Loader2, Fingerprint, Key, Smartphone, Shield } from "lucide-react"

const mockUsers = [
  { email: "admin@kegtracker.com", password: "admin123", role: "Admin", name: "John Doe" },
  { email: "brewer@brewery.com", password: "brew123", role: "Brewer", name: "Sarah Miller" },
  { email: "partner@distributor.com", password: "partner123", role: "Partner", name: "Mike Johnson" },
  { email: "driver@logistics.com", password: "driver123", role: "Driver", name: "Alex Chen" },
]

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (user) {
      login({
        id: user.email,
        email: user.email,
        name: user.name,
        role: user.role as "Admin" | "Brewer" | "Partner" | "Driver",
      })

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      })

      router.push("/")
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleDemoLogin = (user: (typeof mockUsers)[0]) => {
    setEmail(user.email)
    setPassword(user.password)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 text-base"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button
              type="button"
              variant="link"
              className="px-0 font-normal text-sm h-auto"
              onClick={() => {
                toast({
                  title: "Password Reset",
                  description: "Password reset functionality would be implemented here.",
                })
              }}
            >
              Forgot password?
            </Button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 text-base pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Multi-Factor Authentication Available</span>
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="flex flex-col items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-12 w-12 p-0 bg-transparent"
                onClick={() => {
                  toast({
                    title: "Biometric Auth",
                    description: "Biometric authentication would be implemented here.",
                  })
                }}
              >
                <Fingerprint className="h-5 w-5" />
              </Button>
              <span className="text-xs text-muted-foreground">Biometric</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-12 w-12 p-0 bg-transparent"
                onClick={() => {
                  toast({
                    title: "Security Key",
                    description: "Security key authentication would be implemented here.",
                  })
                }}
              >
                <Key className="h-5 w-5" />
              </Button>
              <span className="text-xs text-muted-foreground">Security Key</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-12 w-12 p-0 bg-transparent"
                onClick={() => {
                  toast({
                    title: "TOTP",
                    description: "Time-based OTP authentication would be implemented here.",
                  })
                }}
              >
                <Smartphone className="h-5 w-5" />
              </Button>
              <span className="text-xs text-muted-foreground">TOTP</span>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Quick Access</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-center text-sm text-muted-foreground">Demo Accounts (Click to auto-fill)</div>

        <div className="grid gap-2">
          {mockUsers.map((user) => (
            <Card
              key={user.email}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleDemoLogin(user)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">New to KegTracker?</span>
        </div>
      </div>

      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 bg-transparent"
          onClick={() => {
            toast({
              title: "Sign Up",
              description: "Account registration would be implemented here.",
            })
          }}
        >
          Create New Account
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Join the KegTracker network to manage your beer supply chain
        </p>
      </div>
    </div>
  )
}
