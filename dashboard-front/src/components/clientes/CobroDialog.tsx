import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Cliente, CobroPayload, Comprobante } from "@/types/clientes"
import { Loader2, DollarSign, FileText, Calendar } from "lucide-react"

interface CobroDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: Cliente
  comprobantes: Comprobante[]
  onConfirm: (payload: CobroPayload) => Promise<void>
}

export function CobroDialog({
  open,
  onOpenChange,
  cliente,
  comprobantes,
  onConfirm
}: CobroDialogProps) {
  const [loading, setLoading] = useState(false)
  const [selectedComprobantes, setSelectedComprobantes] = useState<string[]>([])
  const [formData, setFormData] = useState({
    monto: 0,
    metodo_pago: "efectivo",
    referencia: "",
    observaciones: ""
  })

  useEffect(() => {
    if (open && !cliente) {
      onOpenChange(false)
    }
    if (open) {
      setSelectedComprobantes([])
      setFormData({
        monto: 0,
        metodo_pago: "efectivo",
        referencia: "",
        observaciones: ""
      })
    }
  }, [open, cliente, onOpenChange])

  const handleComprobanteToggle = (comprobanteId: string, checked: boolean) => {
    if (checked) {
      setSelectedComprobantes(prev => [...prev, comprobanteId])
    } else {
      setSelectedComprobantes(prev => prev.filter(id => id !== comprobanteId))
    }
  }

  const getSelectedTotal = () => {
    return comprobantes
      .filter(comp => selectedComprobantes.includes(comp.id))
      .reduce((sum, comp) => sum + comp.saldo_pendiente, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cliente || formData.monto <= 0) return

    setLoading(true)
    try {
      const payload: CobroPayload = {
        cliente_id: cliente.id,
        monto: formData.monto,
        metodo_pago: formData.metodo_pago,
        referencia: formData.referencia,
        observaciones: formData.observaciones,
        comprobantes_aplicados: selectedComprobantes
      }
      
      await onConfirm(payload)
      onOpenChange(false)
    } catch (error) {
      console.error("Error al registrar cobro:", error)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR')
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'factura': return 'bg-blue-100 text-blue-800'
      case 'nota_debito': return 'bg-red-100 text-red-800'
      case 'remito': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Registrar Cobro
            {cliente && (
              <Badge variant="outline" className="ml-2">
                {cliente.nombre}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Registra un pago del cliente seleccionando las facturas pendientes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del cliente */}
          {cliente && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Deuda actual:</span>
                  <span className="ml-2 text-red-600 font-semibold">
                    {formatCurrency(cliente.deuda || 0)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Límite de crédito:</span>
                  <span className="ml-2">
                    {formatCurrency(cliente.limite_credito || 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Comprobantes pendientes */}
          {comprobantes.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Comprobantes pendientes</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3">
                {comprobantes.map((comprobante) => (
                  <div key={comprobante.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded">
                    <Checkbox
                      id={comprobante.id}
                      checked={selectedComprobantes.includes(comprobante.id)}
                      onCheckedChange={(checked) => 
                        handleComprobanteToggle(comprobante.id, checked as boolean)
                      }
                    />
                    <div className="flex-1 grid grid-cols-4 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{comprobante.numero}</span>
                      </div>
                      <div>
                        <Badge variant="secondary" className={getTipoColor(comprobante.tipo)}>
                          {comprobante.tipo}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(comprobante.fecha)}
                      </div>
                      <div className="text-right font-semibold">
                        {formatCurrency(comprobante.saldo_pendiente)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedComprobantes.length > 0 && (
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Total seleccionado:</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(getSelectedTotal())}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Datos del cobro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monto">Monto a cobrar *</Label>
              <Input
                id="monto"
                type="number"
                min="0"
                step="0.01"
                value={formData.monto}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  monto: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0.00"
                required
              />
            </div>

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
                  <SelectItem value="tarjeta_debito">Tarjeta de débito</SelectItem>
                  <SelectItem value="tarjeta_credito">Tarjeta de crédito</SelectItem>
                  <SelectItem value="transferencia">Transferencia bancaria</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="mercado_pago">Mercado Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Referencia */}
          <div className="space-y-2">
            <Label htmlFor="referencia">Referencia</Label>
            <Input
              id="referencia"
              value={formData.referencia}
              onChange={(e) => setFormData(prev => ({ ...prev, referencia: e.target.value }))}
              placeholder="Número de operación, cheque, etc."
            />
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

          {/* Resumen */}
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Monto del cobro:</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(formData.monto)}
              </span>
            </div>
            {cliente && formData.monto > 0 && (
              <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                <span>Nueva deuda:</span>
                <span>
                  {formatCurrency(Math.max(0, (cliente.deuda || 0) - formData.monto))}
                </span>
              </div>
            )}
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
            <Button type="submit" disabled={loading || formData.monto <= 0}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrar Cobro
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}