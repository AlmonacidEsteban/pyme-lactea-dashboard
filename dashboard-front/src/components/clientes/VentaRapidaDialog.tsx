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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            Venta Rápida
            {cliente && (
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-300 font-medium">
                {cliente.nombre}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-600 font-medium">
            Registra una venta rápida seleccionando productos y cantidades.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Items de venta */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <Label className="text-lg font-bold text-gray-900">Productos</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100 font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar producto
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border-2 border-gray-300 rounded-lg bg-white shadow-sm">
                  {/* Producto */}
                  <div className="col-span-5">
                    <Label className="text-sm font-semibold text-gray-700 mb-1 block">Producto</Label>
                    <Select
                      value={item.producto_id}
                      onValueChange={(value) => handleProductoChange(index, value)}
                    >
                      <SelectTrigger className="h-10 border-2 border-gray-300 text-gray-900 font-medium">
                        <SelectValue placeholder="🛍️ Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-300 max-h-60">
                        {productos.map((producto) => (
                          <SelectItem key={producto.id} value={producto.id} className="text-gray-900 font-medium hover:bg-gray-100 py-2">
                            <div className="flex justify-between items-center w-full">
                              <span className="font-semibold">{producto.nombre}</span>
                              <span className="text-green-600 font-bold ml-2">{formatCurrency(producto.precio)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cantidad */}
                  <div className="col-span-2">
                    <Label className="text-sm font-semibold text-gray-700 mb-1 block">Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => handleCantidadChange(index, parseInt(e.target.value) || 1)}
                      className="h-10 border-2 border-gray-300 text-gray-900 font-medium"
                    />
                  </div>

                  {/* Precio unitario */}
                  <div className="col-span-2">
                    <Label className="text-sm font-semibold text-gray-700 mb-1 block">Precio</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.precio_unitario}
                      onChange={(e) => handlePrecioChange(index, parseFloat(e.target.value) || 0)}
                      className="h-10 border-2 border-gray-300 text-gray-900 font-medium"
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-2">
                    <Label className="text-sm font-semibold text-gray-700 mb-1 block">Subtotal</Label>
                    <div className="h-10 px-3 py-2 bg-blue-50 border-2 border-blue-200 rounded-md text-sm font-bold text-blue-900">
                      {formatCurrency(item.subtotal)}
                    </div>
                  </div>

                  {/* Eliminar */}
                  <div className="col-span-1">
                    <Label className="text-sm font-semibold text-gray-700 mb-1 block">Eliminar</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="h-10 w-10 p-0 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
            <div className="text-right">
              <Label className="text-lg font-bold text-gray-900 block mb-2">Total de la Venta</Label>
              <div className="text-3xl font-bold text-green-700 bg-green-50 px-4 py-2 rounded-lg border-2 border-green-300">
                {formatCurrency(getTotal())}
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
            <Label htmlFor="metodo_pago" className="text-lg font-bold text-gray-900">Método de pago</Label>
            <Select
              value={formData.metodo_pago}
              onValueChange={(value) => setFormData(prev => ({ ...prev, metodo_pago: value }))}
            >
              <SelectTrigger className="h-12 border-2 border-gray-300 text-gray-900 font-medium text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-300">
                <SelectItem value="efectivo" className="text-gray-900 font-medium hover:bg-gray-100">💵 Efectivo</SelectItem>
                <SelectItem value="tarjeta" className="text-gray-900 font-medium hover:bg-gray-100">💳 Tarjeta</SelectItem>
                <SelectItem value="transferencia" className="text-gray-900 font-medium hover:bg-gray-100">🏦 Transferencia</SelectItem>
                <SelectItem value="credito" className="text-gray-900 font-medium hover:bg-gray-100">📋 Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Observaciones */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
            <Label htmlFor="observaciones" className="text-lg font-bold text-gray-900">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              placeholder="Observaciones adicionales..."
              rows={3}
              className="border-2 border-gray-300 text-gray-900 font-medium resize-none"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-300 bg-gray-50 p-4 rounded-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="px-6 py-3 text-base font-semibold border-2 border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-gray-500"
            >
              ❌ Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || getTotal() === 0}
              className="px-6 py-3 text-base font-semibold bg-green-600 hover:bg-green-700 text-white border-2 border-green-600 hover:border-green-700"
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              💰 Procesar Venta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}