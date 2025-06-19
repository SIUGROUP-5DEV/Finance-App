"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"
import { Bell, Shield, Palette, Download, HelpCircle, LogOut, ChevronRight, Edit } from "lucide-react"
import ImageUpload from "@/components/image-upload" // Import ImageUpload component

interface UserInterface {
  id: string
  name: string
  email: string
  profileImage?: string
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserInterface | null>(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedName, setEditedName] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("financeAppUser")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setEditedName(userData.name)
    }
  }, [])

  const handleImageChange = (imageUrl: string) => {
    if (user) {
      const updatedUser = { ...user, profileImage: imageUrl }
      setUser(updatedUser)
      localStorage.setItem("financeAppUser", JSON.stringify(updatedUser))
    }
  }

  const handleNameUpdate = () => {
    if (user && editedName.trim()) {
      const updatedUser = { ...user, name: editedName.trim() }
      setUser(updatedUser)
      localStorage.setItem("financeAppUser", JSON.stringify(updatedUser))
      setIsEditingProfile(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("financeAppUser")
    window.location.href = "/"
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex justify-center">
              <ImageUpload currentImage={user.profileImage} onImageChange={handleImageChange} userName={user.name} />
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditingProfile ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter your name"
                    />
                    <Button onClick={handleNameUpdate} size="sm">
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false)
                        setEditedName(user.name)
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-medium">{user.name}</p>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch id="push-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="budget-alerts">Budget Alerts</Label>
              <Switch id="budget-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="transaction-alerts">Transaction Alerts</Label>
              <Switch id="transaction-alerts" />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="biometric">Biometric Login</Label>
              <Switch id="biometric" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <Switch id="two-factor" />
            </div>
            <Button variant="outline" className="w-full justify-between">
              Change Password
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch id="dark-mode" />
            </div>
            <Button variant="outline" className="w-full justify-between">
              Currency Settings
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              Language
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              Privacy Policy
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              Terms of Service
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Help Center
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              Contact Support
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="pt-6">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav user={user} onLogout={handleLogout} />
    </div>
  )
}
