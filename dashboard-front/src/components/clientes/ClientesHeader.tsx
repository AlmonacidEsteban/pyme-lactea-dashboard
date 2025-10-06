import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ClienteFilters, ExportOptions } from "@/types/clientes"
import { clientesService } from "@/services/clientesService"
import { toast } from "sonner";
import { Search, Filter, Download, Upload, Plus, FileSpreadsheet, FileText } from "lucide-react"

interface ClientesHeaderProps {
  filters: ClienteFilters
  onChangeFilters: (filters: ClienteFilters) => void
  onNew: () => void
  onImport: (file: File) => Promise<void>
}

export function ClientesHeader({ filters, onChangeFilters, onNew, onImport }: ClientesHeaderProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [searchValue, setSearchValue] = useState(filters.search || "")
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    formato: 'excel',
    campos: ['nombre', 'identificacion', 'telefono', 'correo', 'zona', 'tipo']
  })

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      onChangeFilters({ ...filters, search: searchValue })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  const handleExport = async () => {
    try {
      const blob = await clientesService.export({
        ...exportOptions,
        filtros: filters
      })
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `clientes.${exportOptions.formato === 'excel' ? 'xlsx' : 'csv'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      setShowExport(false)
      toast({ title: "Exportación completa", description: "Archivo descargado exitosamente" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      await onImport(file)
      setShowImport(false)
      event.target.value = '' // Reset input
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const resetFilters = () => {
    const newFilters: ClienteFilters = { activo: "Todos" }
    onChangeFilters(newFilters)
    setSearchValue("")
  }

  return (
    <div className="space-y-4">
      {/* Barra principal */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar clientes..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExport(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImport(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          
          <Button onClick={onNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Zona</Label>
                <Input
                  placeholder="Zona"
                  value={filters.zona || ""}
                  onChange={(e) => onChangeFilters({ ...filters, zona: e.target.value })}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Tipo</Label>
                <Select
                  value={filters.tipo || "Todos"}
                  onValueChange={(value) => onChangeFilters({ ...filters, tipo: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="minorista">Minorista</SelectItem>
                    <SelectItem value="mayorista">Mayorista</SelectItem>
                    <SelectItem value="distribuidor">Distribuidor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Estado</Label>
                <Select
                  value={filters.activo || "Todos"}
                  onValueChange={(value) => onChangeFilters({ ...filters, activo: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Activos">Activos</SelectItem>
                    <SelectItem value="Inactivos">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Deuda mínima</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.deuda_minima || ""}
                  onChange={(e) => onChangeFilters({ ...filters, deuda_minima: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={resetFilters}>
                Limpiar filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de exportación */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar Clientes</DialogTitle>
            <DialogDescription>
              Selecciona el formato para exportar la lista de clientes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Formato</Label>
              <Select
                value={exportOptions.formato}
                onValueChange={(value) => setExportOptions({ ...exportOptions, formato: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel (.xlsx)
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CSV (.csv)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExport(false)}>
                Cancelar
              </Button>
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de importación */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Clientes</DialogTitle>
            <DialogDescription>
              Sube un archivo Excel o CSV para importar clientes masivamente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Archivo</Label>
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleImportFile}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Formatos soportados: Excel (.xlsx, .xls) y CSV (.csv)
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowImport(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}