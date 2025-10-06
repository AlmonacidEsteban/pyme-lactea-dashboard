import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Cliente, VentaRapidaPayload, VentaRapidaItem, ProductoSugerido } from "@/types/clientes"
import { Loader2, Plus, Trash2, ShoppingCart } from "lucide-react"

interface VentaRapidaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: Cliente
  productos: ProductoSugerido[]
  onConfirm: (payload: VentaRapidaPayload) => Promise<void>
}

export function VentaRapidaDialog({
  open,
  onOpenChange,
  cliente,
  productos,
  onConfirm
}: VentaRapidaDialogProps) {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<VentaRapidaItem[]>([])
  const [formData, setFormData] = useState({
    metodo_pago: "efectivo",
    observaciones: ""
  })

  useEffect(() => {
    if (open && !cliente) {
      onOpenChange(false)
    }
    if (open) {
      // Inicializar con un item vacío
      setItems([{
        producto_id: "",
        producto_nombre: "",
        cantidad: 1,
        precio_unitario: 0,
        subtotal: 0
      }])
      setFormData({
        metodo_pago: "efectivo",
        observaciones: ""
      })
    }
  }, [open, cliente, onOpenChange])

  const handleProductoChange = (index: number, productoId: string) => {
    const producto = productos.find(p => p.id === productoId)
    if (!producto) return

    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      producto_id: productoId,
      producto_nombre: producto.nombre,
      precio_unitario: producto.precio,
      subtotal: newItems[index].cantidad * producto.precio
    }
    setItems(newItems)
  }

  const handleCantidadChange = (index: number, cantidad: number) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      cantidad: Math.max(1, cantidad),
      subtotal: Math.max(1, cantidad) * newItems[index].precio_unitario
    }
    setItems(newItems)
  }

  const handlePrecioChange = (index: number, precio: number) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      precio_unitario: Math.max(0, precio),
      subtotal: newItems[index].cantidad * Math.max(0, precio)
    }
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, {
      producto_id: "",
      producto_nombre: "",
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0
    }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cliente) return
    
    const validItems = items.filter(item => 
      item.producto_id && item.cantidad > 0 && item.precio_unitario > 0
    )
    
    if (validItems.length === 0) return

    setLoading(true)
    try {
      const payload: VentaRapidaPayload = {
        cliente_id: cliente.id,
        items: validItems,
        metodo_pago: formData.metodo_pago,
        observaciones: formData.observaciones,
        total: getTotal()
      }
      
      await onConfirm(payload)
      onOpenChange(false)
    } catch (error) {
      console.error("Error al procesar venta:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Venta Rápida
            {cliente && (
              <Badge variant="outline" className="ml-2">
                {cliente.nombre}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Registra una venta rápida seleccionando productos y cantidades.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Items de venta */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Productos</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar producto
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg">
                  {/* Producto */}
                  <div className="col-span-5">
                    <Label className="text-xs">Producto</Label>
                    <Select
                      value={item.producto_id}
                      onValueChange={(value) => handleProductoChange(index, value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {productos.map((producto) => (
                          <SelectItem key={producto.id} value={producto.id}>
                            {producto.nombre} - {formatCurrency(producto.precio)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cantidad */}
                  <div className="col-span-2">
                    <Label className="text-xs">Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => handleCantidadChange(index, parseInt(e.target.value) || 1)}
                      className="h-9"
                    />
                  </div>

                  {/* Precio unitario */}
                  <div className="col-span-2">
                    <Label className="text-xs">Precio</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.precio_unitario}
                      onChange={(e) => handlePrecioChange(index, parseFloat(e.target.value) || 0)}
                      className="h-9"
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-2">
                    <Label className="text-xs">Subtotal</Label>
                    <div className="h-9 px-3 py-2 bg-muted rounded-md text-sm">
                      {formatCurrency(item.subtotal)}
                    </div>
                  </div>

                  {/* Eliminar */}
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="h-9 w-9 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="text-right">
              <Label className="text-base font-semibold">Total</Label>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(getTotal())}
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div className="space-y-2">
            <Label htmlFor="metodo_pago">Método de pago</Label>
            <Select
              value={formData.metodo_pago}
              onValueChange={(value) => setFormData(prev => ({ ...prev, metodo_pago: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="credito">Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              placeholder="Observaciones adicionales..."
              rows={3}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || getTotal() === 0}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Procesar Venta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}