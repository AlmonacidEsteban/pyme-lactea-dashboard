import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Cliente } from "@/types/clientes"
import { 
  Edit, 
  ShoppingCart, 
  DollarSign, 
  Eye, 
  MoreHorizontal, 
  MessageCircle, 
  Power, 
  Trash2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp
} from "lucide-react"

interface ClienteCardProps {
  cliente: Cliente
  onEdit: (cliente: Cliente) => void
  onVenta: (cliente: Cliente) => void
  onCobro: (cliente: Cliente) => void
  onDetalle: (cliente: Cliente) => void
  onToggleActivo: (cliente: Cliente) => void
  onEliminar: (cliente: Cliente) => void
  onWALista: (cliente: Cliente) => void
  onWAEstado: (cliente: Cliente) => void
  onWAPago: (cliente: Cliente) => void
}

export function ClienteCard({
  cliente,
  onEdit,
  onVenta,
  onCobro,
  onDetalle,
  onToggleActivo,
  onEliminar,
  onWALista,
  onWAEstado,
  onWAPago
}: ClienteCardProps) {
  const formatCurrency = (amount?: number) => {
    if (!amount) return "$0"
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Sin datos"
    return new Date(dateString).toLocaleDateString('es-AR')
  }

  const getTipoColor = (tipo?: string) => {
    switch (tipo) {
      case 'mayorista': return 'bg-blue-100 text-blue-800'
      case 'distribuidor': return 'bg-purple-100 text-purple-800'
      case 'minorista': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDeudaColor = (deuda?: number) => {
    if (!deuda || deuda <= 0) return 'text-green-600'
    if (deuda > 50000) return 'text-red-600'
    return 'text-yellow-600'
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-none">{cliente.nombre}</h3>
            <p className="text-sm text-muted-foreground">{cliente.identificacion}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {cliente.tipo && (
              <Badge variant="secondary" className={getTipoColor(cliente.tipo)}>
                {cliente.tipo}
              </Badge>
            )}
            <Badge variant={cliente.activo ? "default" : "secondary"}>
              {cliente.activo ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información de contacto */}
        <div className="space-y-2">
          {cliente.zona && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{cliente.zona}</span>
            </div>
          )}
          
          {cliente.telefono && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{cliente.telefono}</span>
            </div>
          )}
          
          {cliente.correo && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{cliente.correo}</span>
            </div>
          )}
        </div>

        {/* Información financiera */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Deuda</p>
            <p className={`font-semibold ${getDeudaColor(cliente.deuda)}`}>
              {formatCurrency(cliente.deuda)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">Límite</p>
            <p className="font-semibold">
              {formatCurrency(cliente.limite_credito)}
            </p>
          </div>
        </div>

        {/* Información comercial */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Última compra</p>
            </div>
            <p className="text-sm font-medium">
              {formatDate(cliente.ultima_compra)}
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Promedio</p>
            </div>
            <p className="text-sm font-medium">
              {formatCurrency(cliente.promedio_pedido)}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-2 border-t">
          {/* Acciones principales */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(cliente)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVenta(cliente)}
            className="flex-1"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Venta
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCobro(cliente)}
            className="flex-1"
          >
            <DollarSign className="h-4 w-4 mr-1" />
            Cobro
          </Button>

          {/* Menú de más acciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onDetalle(cliente)}>
                <Eye className="h-4 w-4 mr-2" />
                Ver detalle
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => onWALista(cliente)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Enviar lista de precios
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onWAEstado(cliente)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Enviar estado de cuenta
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onWAPago(cliente)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Recordatorio de pago
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => onToggleActivo(cliente)}>
                <Power className="h-4 w-4 mr-2" />
                {cliente.activo ? "Desactivar" : "Activar"}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => onEliminar(cliente)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}