import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Factory, 
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  DollarSign
} from "lucide-react";

export function ProductionCenterSection() {
  const recipes = [
    {
      product: "Muzzarella Cilindro 3kg",
      massConsumption: "3.2 kg",
      additives: "Sal: 90g, Cuajo: 5ml",
      productionTime: "4 horas",
      yield: "94%",
      unitCost: "$2,850",
      brand: "Marca 1"
    },
    {
      product: "Muzzarella Plancha 10kg",
      massConsumption: "10.5 kg",
      additives: "Sal: 300g, Cuajo: 15ml",
      productionTime: "6 horas",
      yield: "95%",
      unitCost: "$9,200",
      brand: "Marca 1"
    },
    {
      product: "Muzzarella Cilindro 1kg",
      massConsumption: "1.1 kg",
      additives: "Sal: 30g, Cuajo: 2ml",
      productionTime: "3 horas",
      yield: "91%",
      unitCost: "$980",
      brand: "Marca 2"
    },
    {
      product: "Ricota Fresca",
      massConsumption: "1.2 kg",
      additives: "Ácido cítrico: 2g",
      productionTime: "2 horas",
      yield: "83%",
      unitCost: "$1,150",
      brand: "Marca 1"
    }
  ];

  const yields = [
    {
      input: "100 kg Masa Base",
      outputs: [
        { product: "Muzzarella", quantity: "94 kg", efficiency: 94 },
        { product: "Suero", quantity: "45 L", efficiency: 100 },
        { product: "Merma", quantity: "6 kg", efficiency: 6 }
      ],
      date: "Hoy",
      shift: "Mañana"
    },
    {
      input: "80 kg Masa Ricota",
      outputs: [
        { product: "Ricota Fresca", quantity: "66 kg", efficiency: 83 },
        { product: "Suero", quantity: "35 L", efficiency: 100 },
        { product: "Merma", quantity: "14 kg", efficiency: 17 }
      ],
      date: "Ayer",
      shift: "Tarde"
    }
  ];

  const productionCosts = [
    {
      product: "Muzzarella Cilindro 3kg",
      materials: "$2,400",
      labor: "$300",
      utilities: "$100",
      packaging: "$50",
      total: "$2,850",
      margin: "65%"
    },
    {
      product: "Muzzarella Plancha 10kg",
      materials: "$7,800",
      labor: "$800",
      utilities: "$350",
      packaging: "$250",
      total: "$9,200",
      margin: "68%"
    },
    {
      product: "Ricota Fresca",
      materials: "$900",
      labor: "$150",
      utilities: "$50",
      packaging: "$50",
      total: "$1,150",
      margin: "72%"
    }
  ];

  const lossesControl = [
    {
      date: "2024-01-17",
      shift: "Mañana",
      product: "Muzzarella Cilindro 3kg",
      planned: "350 kg",
      produced: "320 kg",
      loss: "30 kg",
      lossPercentage: 8.6,
      reason: "Problema en cuajado",
      cost: "$28,500"
    },
    {
      date: "2024-01-16",
      shift: "Tarde",
      product: "Ricota Fresca",
      planned: "120 kg",
      produced: "115 kg",
      loss: "5 kg",
      lossPercentage: 4.2,
      reason: "Temperatura inadecuada",
      cost: "$5,750"
    },
    {
      date: "2024-01-15",
      shift: "Noche",
      product: "Muzzarella Plancha 10kg",
      planned: "300 kg",
      produced: "295 kg",
      loss: "5 kg",
      lossPercentage: 1.7,
      reason: "Normal",
      cost: "$4,600"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Centro de Producción</h1>
        <p className="text-muted-foreground">Gestiona recetas, rendimientos, costos y control de mermas.</p>
      </div>

      {/* Recipes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Recetas de Producción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recipes.map((recipe) => (
              <div key={recipe.product} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{recipe.product}</h4>
                  <Badge variant="outline">{recipe.brand}</Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Consumo de masa:</span>
                    <span className="font-medium">{recipe.massConsumption}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aditivos:</span>
                    <span className="font-medium">{recipe.additives}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tiempo:</span>
                    <span className="font-medium">{recipe.productionTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rendimiento:</span>
                    <span className="font-medium text-green-600">{recipe.yield}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Costo unitario:</span>
                    <span className="font-bold">{recipe.unitCost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Yields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Rendimientos de Producción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {yields.map((batch, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">{batch.input}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{batch.date}</Badge>
                    <Badge variant="secondary">{batch.shift}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {batch.outputs.map((output) => (
                    <div key={output.product} className="text-center p-3 bg-muted rounded-lg">
                      <h5 className="font-medium mb-2">{output.product}</h5>
                      <p className="text-2xl font-bold mb-1">{output.quantity}</p>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm text-muted-foreground">Eficiencia:</span>
                        <span className={`text-sm font-medium ${
                          output.efficiency >= 90 ? 'text-green-600' : 
                          output.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {output.efficiency}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Costs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Costos de Producción Unitarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productionCosts.map((cost) => (
                <div key={cost.product} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">{cost.product}</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Materiales:</span>
                      <span>{cost.materials}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mano de obra:</span>
                      <span>{cost.labor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Servicios:</span>
                      <span>{cost.utilities}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Empaque:</span>
                      <span>{cost.packaging}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-medium">
                      <span>Total:</span>
                      <span>{cost.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Margen:</span>
                      <span className="text-green-600 font-medium">{cost.margin}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Losses Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Control de Mermas y Pérdidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lossesControl.map((loss, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{loss.product}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{loss.date}</Badge>
                      <Badge variant="secondary">{loss.shift}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Planificado:</span>
                      <span>{loss.planned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Producido:</span>
                      <span>{loss.produced}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pérdida:</span>
                      <span className="text-red-600 font-medium">{loss.loss}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">% Pérdida:</span>
                      <span className={`font-medium ${
                        loss.lossPercentage <= 3 ? 'text-green-600' : 
                        loss.lossPercentage <= 7 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {loss.lossPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Costo pérdida:</span>
                      <span className="text-red-600 font-medium">{loss.cost}</span>
                    </div>
                    <div className="mt-2 p-2 bg-muted rounded text-xs">
                      <strong>Motivo:</strong> {loss.reason}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}