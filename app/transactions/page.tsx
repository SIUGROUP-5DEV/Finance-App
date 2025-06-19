"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, ArrowDownRight, Search } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
}

const mockTransactions: Transaction[] = [
  { id: "1", type: "expense", amount: 45.5, category: "Food", description: "Grocery shopping", date: "2024-01-15" },
  { id: "2", type: "income", amount: 2500.0, category: "Salary", description: "Monthly salary", date: "2024-01-14" },
  { id: "3", type: "expense", amount: 120.0, category: "Transport", description: "Gas station", date: "2024-01-13" },
  {
    id: "4",
    type: "expense",
    amount: 25.99,
    category: "Entertainment",
    description: "Netflix subscription",
    date: "2024-01-12",
  },
  { id: "5", type: "expense", amount: 89.99, category: "Shopping", description: "New shoes", date: "2024-01-11" },
  {
    id: "6",
    type: "income",
    amount: 150.0,
    category: "Freelance",
    description: "Web design project",
    date: "2024-01-10",
  },
  { id: "7", type: "expense", amount: 35.0, category: "Food", description: "Restaurant dinner", date: "2024-01-09" },
  { id: "8", type: "expense", amount: 200.0, category: "Bills", description: "Electricity bill", date: "2024-01-08" },
]

export default function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || transaction.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button variant={filterType === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterType("all")}>
            All
          </Button>
          <Button
            variant={filterType === "income" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("income")}
          >
            Income
          </Button>
          <Button
            variant={filterType === "expense" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("expense")}
          >
            Expenses
          </Button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-6">
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowDownRight className="h-6 w-6" />
                      ) : (
                        <ArrowUpRight className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-bold text-lg ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
