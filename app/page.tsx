"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Plus, TrendingUp, PiggyBank, Target, Wallet } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { AddTransactionModal } from "@/components/add-transaction-modal"
import { AuthModal } from "@/components/auth-modal"
import { ProfileImage } from "@/components/profile-image"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
}

interface User {
  id: string
  name: string
  email: string
  profileImage?: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "expense",
      amount: 45.5,
      category: "Food",
      description: "Grocery shopping",
      date: "2024-01-15",
    },
    {
      id: "2",
      type: "income",
      amount: 2500.0,
      category: "Salary",
      description: "Monthly salary",
      date: "2024-01-14",
    },
    {
      id: "3",
      type: "expense",
      amount: 120.0,
      category: "Transport",
      description: "Gas station",
      date: "2024-01-13",
    },
    {
      id: "4",
      type: "expense",
      amount: 25.99,
      category: "Entertainment",
      description: "Netflix subscription",
      date: "2024-01-12",
    },
    {
      id: "5",
      type: "expense",
      amount: 89.99,
      category: "Shopping",
      description: "New shoes",
      date: "2024-01-11",
    },
    {
      id: "6",
      type: "expense",
      amount: 200.0,
      category: "Bills",
      description: "Electricity bill",
      date: "2024-01-10",
    },
  ])

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem("financeAppUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("financeAppUser", JSON.stringify(userData))
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("financeAppUser")
  }

  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("financeAppUser", JSON.stringify(updatedUser))
  }

  // If user is not authenticated, show auth modal
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">FinanceApp</h1>
            <p className="text-blue-100">Take control of your finances</p>
          </div>

          <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardContent className="p-8">
              <div className="space-y-4">
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-white text-blue-600 hover:bg-gray-100"
                  size="lg"
                >
                  Get Started
                </Button>
                <p className="text-center text-sm text-blue-100">
                  Join thousands of users managing their finances smarter
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} onLogin={handleLogin} />
      </div>
    )
  }

  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount
  }, 0)

  const monthlyIncome = transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0)

  const monthlyExpenses = transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0)

  // Prepare chart data
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  const monthlyData = [
    { month: "Jan", income: 2500, expenses: 1800 },
    { month: "Feb", income: 2600, expenses: 1900 },
    { month: "Mar", income: 2400, expenses: 1700 },
    { month: "Apr", income: 2700, expenses: 2000 },
    { month: "May", income: 2500, expenses: monthlyExpenses },
  ]

  const trendData = [
    { day: "Mon", balance: 2200 },
    { day: "Tue", balance: 2180 },
    { day: "Wed", balance: 2150 },
    { day: "Thu", balance: 2100 },
    { day: "Fri", balance: 2080 },
    { day: "Sat", balance: balance },
  ]

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions([newTransaction, ...transactions])
    setShowAddTransaction(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <ProfileImage src={user.profileImage} alt={user.name} size="md" />
            <div>
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-cyan-100">{user.name}</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddTransaction(true)}
            size="icon"
            className="bg-white/20 hover:bg-white/30 border-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* 4 Circular Cards in Header */}
        <div className="flex justify-between items-center bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
          {/* Savings Card */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 bg-white/20 rounded-full shadow-md flex items-center justify-center mb-3">
              <PiggyBank className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">${(balance * 0.2).toFixed(0)}</p>
              <p className="text-xs text-cyan-100">Savings</p>
            </div>
          </div>

          {/* Budget Card */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 bg-white/20 rounded-full shadow-md flex items-center justify-center mb-3">
              <Wallet className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">${(2300 - monthlyExpenses).toFixed(0)}</p>
              <p className="text-xs text-cyan-100">Budget</p>
            </div>
          </div>

          {/* Goals Card */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 bg-white/20 rounded-full shadow-md flex items-center justify-center mb-3">
              <Target className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">68%</p>
              <p className="text-xs text-cyan-100">Goals</p>
            </div>
          </div>

          {/* Investment Card */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 bg-white/20 rounded-full shadow-md flex items-center justify-center mb-3">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">${(balance * 0.35).toFixed(0)}</p>
              <p className="text-xs text-cyan-100">Invest</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="p-6 -mt-6">
        {/* Balance Overview */}
      

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowDownRight className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddTransactionModal
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
        onAddTransaction={addTransaction}
      />

      <BottomNav user={user} onLogout={handleLogout} onUpdateProfile={updateUserProfile} />
    </div>
  )
}
