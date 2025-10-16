import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ClientesHeader } from "@/components/clientes/ClientesHeader"
import { ClienteCard } from "@/components/clientes/ClienteCard"
import { ClienteFormDialog } from "@/components/clientes/ClienteFormDialog"
import { VentaRapidaDialog } from "@/components/clientes/VentaRapidaDialog"
import { CobroDialog } from "@/components/clientes/CobroDialog"
import { Cliente, ClienteFilters, ProductoSugerido, Comprobante } from "@/types/clientes"
import { clientesService } from "@/services/clientesService"
import { Loader2 } from "lucide-react"

export function ClientesPage() {
  // Estados principales
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filters, setFilters] = useState<ClienteFilters>({
    search: "",
    tipo: "",
    zona: "",
    activo: "Activos"
  })

  // Estados de diálogos
  const [formOpen, setFormOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>()
  const [ventaOpen, setVentaOpen] = useState({ open: false, cliente: undefined as Cliente | undefined })
  const [cobroOpen, setCobroOpen] = useState({ open: false, cliente: undefined as Cliente | undefined })

  // Estados para datos auxiliares
  const [productos, setProductos] = useState<ProductoSugerido[]>([])
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([])

  // Cargar datos iniciales
  useEffect(() => {
    loadClientes()
  }, [filters])

  const loadClientes = async () => {
    setLoading(true)
    try {
      const response = await clientesService.list(filters)
      setClientes(response.results || [])
    } catch (error) {
      console.error("Error al cargar clientes:", error)
      toast.error("Error al cargar la lista de clientes")
    } finally {
      setLoading(false)
    }
  }

  const loadProductos = async (clienteId: string) => {
    try {
      const productos = await clientesService.getProductosSugeridos(parseInt(clienteId))
      setProductos(productos)
    } catch (error) {
      console.error("Error al cargar productos:", error)
      setProductos([])
    }
  }

  const loadComprobantes = async (clienteId: string) => {
    try {
      const comprobantes = await clientesService.getComprobantesPendientes(clienteId)
      setComprobantes(comprobantes)
    } catch (error) {
      console.error("Error al cargar comprobantes:", error)
      setComprobantes([])
    }
  }

  // Funciones de manejo de clientes
  const handleCreateCliente = () => {
    setEditingCliente(undefined)
    setFormOpen(true)
  }

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormOpen(true)
  }

  const handleSaveCliente = async (clienteData: Partial<Cliente>) => {
    try {
      if (editingCliente) {
        await clientesService.update(editingCliente.id, clienteData)
        toast.success("Cliente actualizado correctamente")
      } else {
        await clientesService.create(clienteData)
        toast.success("Cliente creado correctamente")
      }
      setFormOpen(false)
      setEditingCliente(undefined)
      await loadClientes()
    } catch (error) {
      console.error("Error al guardar cliente:", error)
      toast.error("Error al guardar el cliente")
      throw error
    }
  }

  const handleDeleteCliente = async (cliente: Cliente) => {
    if (!confirm(`¿Está seguro de eliminar el cliente "${cliente.nombre}"?`)) {
      return
    }

    try {
      await clientesService.delete(cliente.id)
      toast.success("Cliente eliminado correctamente")
      await loadClientes()
    } catch (error) {
      console.error("Error al eliminar cliente:", error)
      toast.error("Error al eliminar el cliente")
    }
  }

  const handleToggleActivo = async (cliente: Cliente) => {
    try {
      await clientesService.update(cliente.id, { activo: !cliente.activo })
      toast.success(`Cliente ${!cliente.activo ? "activado" : "desactivado"} correctamente`)
      await loadClientes()
    } catch (error) {
      console.error("Error al cambiar estado del cliente:", error)
      toast.error("Error al cambiar el estado del cliente")
    }
  }

  // Funciones de venta rápida
  const handleVentaRapida = (cliente: Cliente) => {
    setVentaOpen({ open: true, cliente })
  }

  const handleConfirmVenta = async (payload: any) => {
    try {
      await clientesService.ventaRapida(payload)
      toast.success("Venta procesada correctamente")
      await loadClientes()
    } catch (error) {
      console.error("Error al procesar venta:", error)
      toast.error("Error al procesar la venta")
      throw error
    }
  }

  // Funciones de cobro
  const handleCobro = async (cliente: Cliente) => {
    await loadComprobantes(cliente.id)
    setCobroOpen({ open: true, cliente })
  }

  const handleConfirmCobro = async (payload: any) => {
    try {
      await clientesService.registrarCobro(payload)
      toast.success("Cobro registrado correctamente")
      await loadClientes()
    } catch (error) {
      console.error("Error al registrar cobro:", error)
      toast.error("Error al registrar el cobro")
      throw error
    }
  }

  // Funciones de WhatsApp
  const handleWhatsAppLista = async (cliente: Cliente) => {
    try {
      await clientesService.enviarWhatsApp({
        cliente_id: cliente.id,
        template: "lista_precios",
        datos: {}
      })
      toast.success("Lista de precios enviada por WhatsApp")
    } catch (error) {
      console.error("Error al enviar WhatsApp:", error)
      toast.error("Error al enviar mensaje de WhatsApp")
    }
  }

  const handleWhatsAppEstado = async (cliente: Cliente) => {
    try {
      await clientesService.enviarWhatsApp({
        cliente_id: cliente.id,
        template: "estado_cuenta",
        datos: {}
      })
      toast.success("Estado de cuenta enviado por WhatsApp")
    } catch (error) {
      console.error("Error al enviar WhatsApp:", error)
      toast.error("Error al enviar mensaje de WhatsApp")
    }
  }

  const handleWhatsAppPago = async (cliente: Cliente) => {
    try {
      await clientesService.enviarWhatsApp({
        cliente_id: cliente.id,
        template: "recordatorio_pago",
        datos: {}
      })
      toast.success("Recordatorio de pago enviado por WhatsApp")
    } catch (error) {
      console.error("Error al enviar WhatsApp:", error)
      toast.error("Error al enviar mensaje de WhatsApp")
    }
  }

  // Función para ver detalle del cliente
  const handleVerDetalle = (cliente: Cliente) => {
    // Navegar a la página de detalle del cliente
    window.location.href = `/clientes/${cliente.id}`
  }

  // Funciones de importación y exportación
  const handleImport = async (file: File) => {
    try {
      const result = await clientesService.importar(file)
      toast.success(`Importación completada: ${result.procesados} clientes procesados`)
      await loadClientes()
    } catch (error) {
      console.error("Error al importar:", error)
      toast.error("Error al importar clientes")
    }
  }

  const handleExport = async (options: any) => {
    try {
      await clientesService.exportar(options)
      toast.success("Exportación iniciada")
    } catch (error) {
      console.error("Error al exportar:", error)
      toast.error("Error al exportar clientes")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros y acciones */}
      <ClientesHeader
        filters={filters}
        onChangeFilters={setFilters}
        onNew={handleCreateCliente}
        onImport={handleImport}
      />

      {/* Lista de clientes */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando clientes...</span>
        </div>
      ) : clientes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron clientes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clientes.map((cliente) => (
            <ClienteCard
              key={cliente.id}
              cliente={cliente}
              onEdit={handleEditCliente}
              onVenta={handleVentaRapida}
              onCobro={handleCobro}
              onDetalle={handleVerDetalle}
              onToggleActivo={handleToggleActivo}
              onEliminar={handleDeleteCliente}
              onWALista={handleWhatsAppLista}
              onWAEstado={handleWhatsAppEstado}
              onWAPago={handleWhatsAppPago}
            />
          ))}
        </div>
      )}

      {/* Diálogos */}
      <ClienteFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        cliente={editingCliente}
        onSave={handleSaveCliente}
      />

      <VentaRapidaDialog
        open={ventaOpen.open}
        onOpenChange={(open) => setVentaOpen({ open, cliente: open ? ventaOpen.cliente : undefined })}
        cliente={ventaOpen.cliente}
        productos={productos}
        onConfirm={handleConfirmVenta}
      />

      <CobroDialog
        open={cobroOpen.open}
        onOpenChange={(open) => setCobroOpen({ open, cliente: open ? cobroOpen.cliente : undefined })}
        cliente={cobroOpen.cliente}
        comprobantes={comprobantes}
        onConfirm={handleConfirmCobro}
      />
    </div>
  )
}