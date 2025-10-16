import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RubroSelector } from "@/components/RubroSelector"
import { Cliente } from "@/types/clientes"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ClienteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: Cliente
  onSave: (cliente: Partial<Cliente>) => Promise<void>
}

export function ClienteFormDialog({
  open,
  onOpenChange,
  cliente,
  onSave
}: ClienteFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Cliente>>({
    nombre: "",
    identificacion: "",
    telefono: "",
    correo: "",
    direccion: "",
    zona: "",
    tipo: "minorista",
    limite_credito: 0,
    rubro: null,
    activo: true
  })

  useEffect(() => {
    if (cliente) {
      console.log("🔄 Cargando datos del cliente para edición:", cliente);
      setFormData({
        nombre: cliente.nombre || "",
        identificacion: cliente.identificacion || "",
        telefono: cliente.telefono || "",
        correo: cliente.correo || "",
        direccion: cliente.direccion || "",
        zona: cliente.zona || "",
        tipo: cliente.tipo || "minorista",
        limite_credito: cliente.limite_credito || 0,
        rubro: cliente.rubro || null,
        activo: cliente.activo ?? true
      })
      console.log("📝 FormData inicializado con rubro:", cliente.rubro);
    } else {
      console.log("➕ Inicializando formulario para nuevo cliente");
      setFormData({
        nombre: "",
        identificacion: "",
        telefono: "",
        correo: "",
        direccion: "",
        zona: "",
        tipo: "minorista",
        limite_credito: 0,
        rubro: null,
        activo: true
      })
    }
  }, [cliente, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre?.trim() || !formData.identificacion?.trim()) {
      return
    }

    console.log("💾 Guardando cliente con datos:", formData);
    console.log("🏷️ Rubro seleccionado:", formData.rubro);

    setLoading(true)
    try {
      await onSave(formData)
      console.log("✅ Cliente guardado exitosamente");
      onOpenChange(false)
    } catch (error) {
      console.error("❌ Error al guardar cliente:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Cliente, value: any) => {
    if (field === 'rubro') {
      console.log("🏷️ Cambiando rubro a:", value);
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {cliente ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {cliente ? "Modifica los datos del cliente existente." : "Completa la información para crear un nuevo cliente. Puedes crear múltiples sucursales con el mismo CUIT usando nombres diferentes."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre / Sucursal *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Ej: Supermercado Central - Sucursal Norte"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="identificacion">CUIT / Identificación *</Label>
              <Input
                id="identificacion"
                value={formData.identificacion}
                onChange={(e) => handleInputChange("identificacion", e.target.value)}
                placeholder="Ej: 20-12345678-9 (puede repetirse para sucursales)"
                required
              />
            </div>
          </div>

          {/* Información de contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                placeholder="+54 9 11 1234-5678 (puede ser el mismo para sucursales)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => handleInputChange("correo", e.target.value)}
                placeholder="cliente@ejemplo.com"
              />
            </div>
          </div>

          {/* Dirección y zona */}
          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Textarea
              id="direccion"
              value={formData.direccion}
              onChange={(e) => handleInputChange("direccion", e.target.value)}
              placeholder="Dirección completa del cliente"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zona">Zona</Label>
            <Input
              id="zona"
              value={formData.zona}
              onChange={(e) => handleInputChange("zona", e.target.value)}
              placeholder="Zona geográfica o región"
            />
          </div>

          {/* Información comercial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de cliente</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleInputChange("tipo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minorista">Minorista</SelectItem>
                  <SelectItem value="mayorista">Mayorista</SelectItem>
                  <SelectItem value="distribuidor">Distribuidor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limite_credito">Límite de crédito</Label>
              <Input
                id="limite_credito"
                type="number"
                min="0"
                step="0.01"
                value={formData.limite_credito}
                onChange={(e) => handleInputChange("limite_credito", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Rubro del negocio */}
          <div className="space-y-2">
            <Label htmlFor="rubro">Rubro del negocio</Label>
            <RubroSelector
              value={formData.rubro}
              onChange={(rubroId) => handleInputChange("rubro", rubroId)}
            />
          </div>

          {/* Estado activo */}
          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={formData.activo}
              onCheckedChange={(checked) => handleInputChange("activo", checked)}
            />
            <Label htmlFor="activo">Cliente activo</Label>
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
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {cliente ? "Actualizar" : "Crear"} Cliente
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}