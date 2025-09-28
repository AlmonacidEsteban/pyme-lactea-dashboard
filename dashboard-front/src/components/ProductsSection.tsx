import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Package, 
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Layers
} from "lucide-react";

export function ProductsSection() {
  const products = [
    {
      code: "MZ-C3-SS-M1",
      name: "Muzzarella Cilindro 3kg Sin Sal",
      category: "Cilindro",
      presentation: "3kg",
      brand: "Marca 1",
      unitCost: "$2,850",
      salePrice: "$4,700",
      currentStock: 45,
      minStock: 20,
      stockStatus: "normal",
      lastProduction: "2024-01-17",
      margin: "65%"
    },
    {
      code: "MZ-C1-CS-M1",
      name: "Muzzarella Cilindro 1kg Con Sal",
      category: "Cilindro",
      presentation: "1kg",
      brand: "Marca 1",
      unitCost: "$980",
      salePrice: "$1,650",
      currentStock: 12,
      minStock: 15,
      stockStatus: "low",
      lastProduction: "2024-01-16",
      margin: "68%"
    },
    {
      code: "MZ-C3-CS-M1",
      name: "Muzzarella Cilindro 3kg Con Sal",
      category: "Cilindro",
      presentation: "3kg",
      brand: "Marca 1",
      unitCost: "$2,850",
      salePrice: "$4,800",
      currentStock: 38,
      minStock: 25,
      stockStatus: "normal",
      lastProduction: "2024-01-17",
      margin: "68%"
    },
    {
      code: "MZ-P10-CS-M1",
      name: "Muzzarella Plancha 10kg Con Sal",
      category: "Plancha",
      presentation: "10kg",
      brand: "Marca 1",
      unitCost: "$9,200",
      salePrice: "$15,500",
      currentStock: 22,
      minStock: 10,
      stockStatus: "normal",
      lastProduction: "2024-01-16",
      margin: "68%"
    },
    {
      code: "MZ-C3-CS-M2",
      name: "Muzzarella Cilindro 3kg Con Sal",
      category: "Cilindro",
      presentation: "3kg",
      brand: "Marca 2",
      unitCost: "$2,750",
      salePrice: "$4,600",
      currentStock: 8,
      minStock: 20,
      stockStatus: "critical",
      lastProduction: "2024-01-15",
      margin: "67%"
    },
    {
      code: "MZ-P10-CS-M2",
      name: "Muzzarella Plancha 10kg Con Sal",
      category: "Plancha",
      presentation: "10kg",
      brand: "Marca 2",
      unitCost: "$8,900",
      salePrice: "$15,200",
      currentStock: 15,
      minStock: 12,
      stockStatus: "normal",
      lastProduction: "2024-01-16",
      margin: "71%"
    },
    {
      code: "RC-F1-M1",
      name: "Ricota Fresca 1kg",
      category: "Ricota",
      presentation: "1kg",
      brand: "Marca 1",
      unitCost: "$1,150",
      salePrice: "$1,980",
      currentStock: 25,
      minStock: 15,
      stockStatus: "normal",
      lastProduction: "2024-01-17",
      margin: "72%"
    },
    {
      code: "QC-T500-M1",
      name: "Queso Cremoso Tarro 500g",
      category: "Queso Cremoso",
      presentation: "500g",
      brand: "Marca 1",
      unitCost: "$850",
      salePrice: "$1,450",
      currentStock: 18,
      minStock: 20,
      stockStatus: "low",
      lastProduction: "2024-01-16",
      margin: "71%"
    }
  ];

  const stockSummary = {
    totalProducts: products.length,
    totalValue: "$1,245,800",
    lowStock: products.filter(p => p.stockStatus === "low").length,
    criticalStock: products.filter(p => p.stockStatus === "critical").length,
    normalStock: products.filter(p => p.stockStatus === "normal").length
  };

  const categoryStats = [
    {
      category: "Cilindro",
      count: 4,
      totalStock: 103,
      value: "$485,200",
      trend: "up"
    },
    {
      category: "Plancha",
      count: 2,
      totalStock: 37,
      value: "$572,400",
      trend: "stable"
    },
    {
      category: "Ricota",
      count: 1,
      totalStock: 25,
      value: "$49,500",
      trend: "up"
    },
    {
      category: "Queso Cremoso",
      count: 1,
      totalStock: 18,
      value: "$26,100",
      trend: "down"
    }
  ];

  const brandComparison = [
    {
      brand: "Marca 1",
      products: 6,
      totalStock: 160,
      avgMargin: "68%",
      totalValue: "$892,300",
      performance: "excellent"
    },
    {
      brand: "Marca 2",
      products: 2,
      totalStock: 23,
      avgMargin: "69%",
      totalValue: "$353,500",
      performance: "good"
    }
  ];

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "text-red-600 bg-red-50";
      case "low": return "text-yellow-600 bg-yellow-50";
      case "normal": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case "critical": return <AlertTriangle className="w-4 h-4" />;
      case "low": return <AlertTriangle className="w-4 h-4" />;
      case "normal": return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Catálogo de Productos</h1>
        <p className="text-muted-foreground">Gestiona tu inventario, precios y stock de productos lácteos.</p>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{stockSummary.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">{stockSummary.totalValue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Stock Normal</p>
                <p className="text-2xl font-bold">{stockSummary.normalStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Stock Bajo</p>
                <p className="text-2xl font-bold">{stockSummary.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Stock Crítico</p>
                <p className="text-2xl font-bold">{stockSummary.criticalStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{cat.category}</h4>
                    <p className="text-sm text-muted-foreground">{cat.count} productos</p>
                    <p className="text-sm font-medium">{cat.value}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{cat.totalStock}</p>
                    <div className="flex items-center gap-1">
                      {cat.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {cat.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600" />}
                      {cat.trend === "stable" && <div className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Brand Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Por Marca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {brandComparison.map((brand) => (
                <div key={brand.brand} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{brand.brand}</h4>
                    <Badge variant={brand.performance === "excellent" ? "default" : "secondary"}>
                      {brand.performance === "excellent" ? "Excelente" : "Bueno"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Productos:</span>
                      <span className="font-medium">{brand.products}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stock total:</span>
                      <span className="font-medium">{brand.totalStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Margen promedio:</span>
                      <span className="font-medium text-green-600">{brand.avgMargin}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-muted-foreground">Valor total:</span>
                      <span className="font-bold">{brand.totalValue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">Agregar Producto</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Crear nuevo producto en catálogo</p>
              </button>
              
              <button className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Revisar Stock Bajo</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Ver productos con stock crítico</p>
              </button>
              
              <button className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">Actualizar Precios</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Modificar lista de precios</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Catalog */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Catálogo Completo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.code} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">{product.code}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{product.brand}</Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                  <Badge variant="outline" className="text-xs">{product.presentation}</Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Costo:</span>
                    <span className="font-medium">{product.unitCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio venta:</span>
                    <span className="font-medium">{product.salePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Margen:</span>
                    <span className="font-medium text-green-600">{product.margin}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stock actual:</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStockStatusColor(product.stockStatus)}`}>
                      {getStockStatusIcon(product.stockStatus)}
                      <span className="font-medium">{product.currentStock}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Mínimo: {product.minStock}</span>
                      <span>{Math.round((product.currentStock / (product.minStock * 2)) * 100)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((product.currentStock / (product.minStock * 2)) * 100, 100)} 
                      className="h-2"
                    />
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground border-t pt-2">
                  Última producción: {product.lastProduction}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}