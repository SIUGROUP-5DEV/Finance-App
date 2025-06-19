"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BottomNav } from "@/components/bottom-nav"
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"

export default function AnalyticsPage() {
  const categoryData = [
    { name: "Food", amount: 450, budget: 600, color: "bg-red-500" },
    { name: "Transport", amount: 320, budget: 400, color: "bg-blue-500" },
    { name: "Entertainment", amount: 180, budget: 200, color: "bg-green-500" },
    { name: "Shopping", amount: 250, budget: 300, color: "bg-purple-500" },
    { name: "Bills", amount: 800, budget: 800, color: "bg-orange-500" },
  ]

  const totalSpent = categoryData.reduce((acc, cat) => acc + cat.amount, 0)
  const totalBudget = categoryData.reduce((acc, cat) => acc + cat.budget, 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-green-100">Track your spending patterns</p>
      </div>

      <div className="p-6 -mt-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-red-600">${totalSpent}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Budget Left</p>
                  <p className="text-2xl font-bold text-green-600">${totalBudget - totalSpent}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Total Budget Usage</span>
                <span>{Math.round((totalSpent / totalBudget) * 100)}%</span>
              </div>
              <Progress value={(totalSpent / totalBudget) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryData.map((category) => {
              const percentage = (category.amount / category.budget) * 100
              const isOverBudget = percentage > 100

              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <span className="font-medium">{category.name}</span>
                      {isOverBudget && (
                        <Badge variant="destructive" className="text-xs">
                          Over Budget
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${category.amount}</p>
                      <p className="text-xs text-gray-500">of ${category.budget}</p>
                    </div>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className={`h-2 ${isOverBudget ? "bg-red-100" : ""}`} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{percentage.toFixed(1)}% used</span>
                    <span>${category.budget - category.amount} left</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Spending Trends */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>This Month vs Last Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Food Expenses</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">-15%</p>
                  <p className="text-xs text-gray-500">$450 vs $530</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                  <span className="font-medium">Transport</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">+8%</p>
                  <p className="text-xs text-gray-500">$320 vs $296</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
