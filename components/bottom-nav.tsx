"use client"
import { Home, BarChart3, CreditCard, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  profileImage?: string
}

interface BottomNavProps {
  user?: User
  onLogout?: () => void
  onUpdateProfile?: (user: User) => void
}

export function BottomNav({ user, onLogout, onUpdateProfile }: BottomNavProps) {
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: CreditCard, label: "Transactions", href: "/transactions" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
