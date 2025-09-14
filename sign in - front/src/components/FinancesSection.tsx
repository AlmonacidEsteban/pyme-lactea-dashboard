import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Receipt, 
  PlusCircle,
  AlertTriangle
} from "lucide-react";

export function FinancesSection() {
  const financialMetrics = [
    {
      title: "Total Revenue",
      value: "$48,590",
      change: "+12.3%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Monthly Expenses",
      value: "$18,240",
      change: "+5.2%",
      trend: "up",
      icon: CreditCard
    },
    {
      title: "Net Profit",
      value: "$30,350",
      change: "+18.7%",
      trend: "up",
      icon: TrendingUp
    },
    {
      title: "Outstanding Invoices",
      value: "$12,750",
      change: "-8.1%",
      trend: "down",
      icon: Receipt
    }
  ];

  const recentTransactions = [
    {
      id: "TXN001",
      description: "Website Development - Client A",
      amount: "+$8,500",
      date: "Dec 1, 2024",
      status: "Completed",
      type: "income"
    },
    {
      id: "TXN002",
      description: "Software Licenses",
      amount: "-$1,200",
      date: "Nov 30, 2024",
      status: "Completed",
      type: "expense"
    },
    {
      id: "TXN003",
      description: "Marketing Campaign - Client B",
      amount: "+$4,750",
      date: "Nov 28, 2024",
      status: "Pending",
      type: "income"
    },
    {
      id: "TXN004",
      description: "Office Rent",
      amount: "-$2,800",
      date: "Nov 25, 2024",
      status: "Completed",
      type: "expense"
    }
  ];

  const budgetCategories = [
    { name: "Personnel", budget: 25000, spent: 22500, percentage: 90 },
    { name: "Marketing", budget: 8000, spent: 6800, percentage: 85 },
    { name: "Operations", budget: 12000, spent: 9600, percentage: 80 },
    { name: "Technology", budget: 6000, spent: 3600, percentage: 60 },
    { name: "Office", budget: 4000, spent: 3800, percentage: 95 }
  ];

  const pendingInvoices = [
    {
      client: "TechCorp Solutions",
      amount: "$6,500",
      dueDate: "Dec 15, 2024",
      status: "Overdue",
      days: 5
    },
    {
      client: "Design Studio Pro",
      amount: "$3,750",
      dueDate: "Dec 20, 2024",
      status: "Due Soon",
      days: 2
    },
    {
      client: "Marketing Agency Ltd",
      amount: "$2,500",
      dueDate: "Jan 5, 2025",
      status: "Pending",
      days: 18
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Financial Overview</h1>
          <p className="text-muted-foreground">Track your business finances and cash flow.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Receipt className="w-4 h-4" />
            New Invoice
          </Button>
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>
                    {metric.change}
                  </span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">{transaction.description}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{transaction.id}</span>
                      <span>•</span>
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount}
                    </span>
                    <Badge variant={transaction.status === "Completed" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetCategories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{category.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      ${category.spent.toLocaleString()} / ${category.budget.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={category.percentage} 
                    className={category.percentage > 90 ? "bg-red-100" : ""} 
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{category.percentage}% used</span>
                    {category.percentage > 90 && (
                      <span className="text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Budget Alert
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingInvoices.map((invoice, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">{invoice.client}</h4>
                  <p className="text-sm text-muted-foreground">Due: {invoice.dueDate}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{invoice.amount}</span>
                  <Badge 
                    variant={invoice.status === "Overdue" ? "destructive" : 
                           invoice.status === "Due Soon" ? "default" : "secondary"}
                  >
                    {invoice.status}
                  </Badge>
                  {invoice.status === "Overdue" && (
                    <span className="text-xs text-destructive">
                      {invoice.days} days overdue
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}