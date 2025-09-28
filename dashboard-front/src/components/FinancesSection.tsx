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
  AlertTriangle,
  Wallet,
  PieChart,
  Calculator,
  CheckCircle,
  Clock,
  FileText,
  Target
} from "lucide-react";

export function FinancesSection() {
  // Datos de gastos
  const expenses = [
    { category: 'Sueldos', amount: 450000, percentage: 35, trend: 'up', change: 5 },
    { category: 'Compra de Masa', amount: 320000, percentage: 25, trend: 'down', change: -8 },
    { category: 'Combustible', amount: 85000, percentage: 7, trend: 'up', change: 12 },
    { category: 'Servicios', amount: 65000, percentage: 5, trend: 'stable', change: 0 },
    { category: 'Mantenimiento', amount: 45000, percentage: 3, trend: 'up', change: 15 },
    { category: 'Otros', amount: 35000, percentage: 3, trend: 'down', change: -5 }
  ];

  // Datos de ingresos
  const income = [
    { source: 'Ventas Contado', amount: 680000, percentage: 55, trend: 'up', change: 8 },
    { source: 'Ventas Fiado', amount: 420000, percentage: 34, trend: 'up', change: 12 },
    { source: 'Transferencias', amount: 135000, percentage: 11, trend: 'up', change: 25 }
  ];

  // Estado de cuentas pendientes
  const pendingAccounts = {
    clientsOwe: [
      { client: 'Almacén Central', amount: 125000, days: 15, status: 'normal' },
      { client: 'Super Norte', amount: 89000, days: 8, status: 'normal' },
      { client: 'Distribuidora Sur', amount: 156000, days: 25, status: 'warning' },
      { client: 'Mercado del Barrio', amount: 67000, days: 35, status: 'critical' },
      { client: 'Kiosco La Esquina', amount: 34000, days: 12, status: 'normal' }
    ],
    suppliersOwe: [
      { supplier: 'Lácteos San Juan', amount: 180000, dueDate: '2024-01-25', status: 'pending' },
      { supplier: 'Transportes Rápidos', amount: 45000, dueDate: '2024-01-20', status: 'overdue' },
      { supplier: 'Envases del Norte', amount: 67000, dueDate: '2024-01-30', status: 'pending' }
    ]
  };

  // Rentabilidad por producto
  const productProfitability = [
    { 
      product: 'Muzzarella Cilindro 3kg', 
      brand: 'Marca 1', 
      cost: 2800, 
      price: 3500, 
      margin: 700, 
      marginPercent: 25, 
      unitsSold: 450,
      totalProfit: 315000
    },
    { 
      product: 'Muzzarella Plancha 10kg', 
      brand: 'Marca 1', 
      cost: 9200, 
      price: 11500, 
      margin: 2300, 
      marginPercent: 25, 
      unitsSold: 180,
      totalProfit: 414000
    },
    { 
      product: 'Muzzarella Cilindro 3kg', 
      brand: 'Marca 2', 
      cost: 2650, 
      price: 3200, 
      margin: 550, 
      marginPercent: 20.7, 
      unitsSold: 320,
      totalProfit: 176000
    },
    { 
      product: 'Muzzarella Sin Sal 1kg', 
      brand: 'Marca 1', 
      cost: 950, 
      price: 1200, 
      margin: 250, 
      marginPercent: 26.3, 
      unitsSold: 280,
      totalProfit: 70000
    }
  ];

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = ((netProfit / totalIncome) * 100).toFixed(1);

  const financialMetrics = [
    {
      title: "Ingresos Totales",
      value: `$${totalIncome.toLocaleString()}`,
      change: "+12%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Gastos Totales",
      value: `$${totalExpenses.toLocaleString()}`,
      change: "+3%",
      trend: "up",
      icon: CreditCard
    },
    {
      title: "Ganancia Neta",
      value: `$${netProfit.toLocaleString()}`,
      change: `${profitMargin}%`,
      trend: "up",
      icon: Wallet
    },
    {
      title: "Cuentas por Cobrar",
      value: `$${pendingAccounts.clientsOwe.reduce((sum, client) => sum + client.amount, 0).toLocaleString()}`,
      change: `${pendingAccounts.clientsOwe.length} clientes`,
      trend: "down",
      icon: Receipt
    }
  ];

  const recentTransactions = [
    {
      id: "TXN001",
      description: "Venta Almacén Central",
      amount: "+$125,000",
      date: "15 Ene, 2024",
      status: "Completado",
      type: "income"
    },
    {
      id: "TXN002",
      description: "Compra Masa - Lácteos San Juan",
      amount: "-$180,000",
      date: "14 Ene, 2024",
      status: "Completado",
      type: "expense"
    },
    {
      id: "TXN003",
      description: "Venta Super Norte",
      amount: "+$89,000",
      date: "13 Ene, 2024",
      status: "Pendiente",
      type: "income"
    },
    {
      id: "TXN004",
      description: "Pago Sueldos",
      amount: "-$75,000",
      date: "12 Ene, 2024",
      status: "Completado",
      type: "expense"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Finanzas</h1>
          <p className="text-muted-foreground">Control financiero y rentabilidad de Mi PyME Lácteos.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Exportar Reporte
          </Button>
          <Button className="gap-2">
            <Calculator className="w-4 h-4" />
            Nuevo Análisis
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
        {/* Gastos por Categoría */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Gastos por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{expense.category}</span>
                      {getTrendIcon(expense.trend)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${expense.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {expense.percentage}% ({expense.change > 0 ? '+' : ''}{expense.change}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ingresos por Fuente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ingresos por Fuente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {income.map((inc, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{inc.source}</span>
                      {getTrendIcon(inc.trend)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">${inc.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {inc.percentage}% (+{inc.change}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cuentas por Cobrar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Cuentas por Cobrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingAccounts.clientsOwe.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{client.client}</div>
                    <div className="text-sm text-muted-foreground">{client.days} días</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${client.amount.toLocaleString()}</div>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status === 'normal' ? 'Normal' : 
                       client.status === 'warning' ? 'Atención' : 'Crítico'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cuentas por Pagar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Cuentas por Pagar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingAccounts.suppliersOwe.map((supplier, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{supplier.supplier}</div>
                    <div className="text-sm text-muted-foreground">Vence: {supplier.dueDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${supplier.amount.toLocaleString()}</div>
                    <Badge className={getStatusColor(supplier.status)}>
                      {supplier.status === 'pending' ? 'Pendiente' : 'Vencido'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transacciones Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
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
                  <Badge variant={transaction.status === "Completado" ? "default" : "secondary"}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rentabilidad por Producto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Rentabilidad por Producto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Producto</th>
                  <th className="text-left p-2">Marca</th>
                  <th className="text-right p-2">Costo</th>
                  <th className="text-right p-2">Precio</th>
                  <th className="text-right p-2">Margen</th>
                  <th className="text-right p-2">%</th>
                  <th className="text-right p-2">Vendidos</th>
                  <th className="text-right p-2">Ganancia Total</th>
                </tr>
              </thead>
              <tbody>
                {productProfitability.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{product.product}</td>
                    <td className="p-2">
                      <Badge variant="outline">{product.brand}</Badge>
                    </td>
                    <td className="p-2 text-right">${product.cost}</td>
                    <td className="p-2 text-right">${product.price}</td>
                    <td className="p-2 text-right text-green-600">${product.margin}</td>
                    <td className="p-2 text-right">{product.marginPercent}%</td>
                    <td className="p-2 text-right">{product.unitsSold}</td>
                    <td className="p-2 text-right font-semibold text-green-600">
                      ${product.totalProfit.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}