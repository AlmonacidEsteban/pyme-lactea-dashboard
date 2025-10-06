"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Esquemas de validación por paso
const paso1Schema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  marca_id: z.number().positive("Selecciona una marca"),
  categoria_id: z.number().positive("Selecciona una categoría"),
  unidad_medida: z.string().min(1, "La unidad de medida es requerida"),
  peso_neto: z.number().positive("El peso debe ser mayor a 0"),
  con_sal: z.boolean().default(false),
  sku: z.string().optional(),
  descripcion: z.string().optional(),
});

const paso2Schema = z.object({
  lista_precio: z.string().min(1, "Selecciona una lista de precios"),
  moneda: z.string().min(1, "La moneda es requerida"),
  costo: z.number().positive("El costo debe ser mayor a 0"),
  precio_lista: z.number().positive("El precio debe ser mayor a 0"),
});

const paso3Schema = z.object({
  stock_inicial: z.number().min(0, "El stock no puede ser negativo"),
  stock_minimo: z.number().min(0, "El stock mínimo no puede ser negativo"),
  ubicacion: z.string().optional(),
  estado: z.enum(["activo", "inactivo"]).default("activo"),
});

const newProductSchema = paso1Schema.merge(paso2Schema).merge(paso3Schema);

export type NewProductPayload = z.infer<typeof newProductSchema>;

interface Marca {
  id: number;
  nombre: string;
  activo: boolean;
}

interface Categoria {
  id: number;
  nombre: string;
  activo: boolean;
}

interface NewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  marcas: Marca[];
  categorias: Categoria[];
  listasPrecios: string[];
  defaultLista?: string;
  generarSku?: (data: any) => string;
  onSubmit: (data: NewProductPayload) => Promise<void>;
  loading?: boolean;
}

export function NewProductDialog({
  open,
  onOpenChange,
  marcas,
  categorias,
  listasPrecios,
  defaultLista = "mayorista",
  generarSku,
  onSubmit,
  loading = false,
}: NewProductDialogProps) {
  const [paso, setPaso] = useState(1);

  // Validación defensiva para asegurar que marcas, categorías y listasPrecios sean arrays
  const safeMarcas = Array.isArray(marcas) ? marcas : [];
  const safeCategorias = Array.isArray(categorias) ? categorias : [];
  const safeListas = Array.isArray(listasPrecios) ? listasPrecios : [];

  const form = useForm<NewProductPayload>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      nombre: "",
      marca_id: undefined,
      categoria_id: undefined,
      unidad_medida: "kg",
      peso_neto: 0,
      con_sal: false,
      sku: "",
      descripcion: "",
      lista_precio: defaultLista ?? safeListas[0] ?? "",
      moneda: "ARS",
      costo: 0,
      precio_lista: 0,
      stock_inicial: 0,
      stock_minimo: 0,
      ubicacion: "",
      estado: "activo",
    },
  });

  // Validar si se puede avanzar al siguiente paso
  const canNext = () => {
    const values = form.watch();
    if (paso === 1) {
      return !!(
        values.nombre && 
        values.marca_id !== undefined && values.marca_id !== "" && 
        values.categoria_id !== undefined && values.categoria_id !== "" && 
        values.unidad_medida && 
        values.peso_neto > 0
      );
    } else if (paso === 2) {
      return !!(values.lista_precio);
    }
    return false;
  };

  const siguientePaso = async () => {
    let isValid = false;
    
    if (paso === 1) {
      isValid = await form.trigger([
        "nombre", "marca_id", "categoria_id", "unidad_medida", "peso_neto"
      ]);
    } else if (paso === 2) {
      isValid = await form.trigger([
        "lista_precio", "moneda", "costo", "precio_lista"
      ]);
    }
    
    if (isValid && paso < 3) {
      setPaso(paso + 1);
      
      // Generar SKU automáticamente si está disponible
      if (paso === 1 && generarSku && !form.getValues("sku")) {
        const data = form.getValues();
        const skuGenerado = generarSku(data);
        if (skuGenerado) {
          form.setValue("sku", skuGenerado);
        }
      }
    }
  };

  const prevStep = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    }
  };

  const handleSubmit = async (data: NewProductPayload) => {
    try {
      await onSubmit(data);
      form.reset();
      setPaso(1);
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    setPaso(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo Producto</DialogTitle>
          <DialogDescription>
            Completa los datos del producto en 3 pasos: información básica, precio e inventario inicial.
          </DialogDescription>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className={paso >= 1 ? "text-primary" : ""}>1. Datos básicos</span>
            <span>→</span>
            <span className={paso >= 2 ? "text-primary" : ""}>2. Precio inicial</span>
            <span>→</span>
            <span className={paso >= 3 ? "text-primary" : ""}>3. Inventario inicial</span>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {paso === 1 && (
              <section className="space-y-4">
                <h4 className="text-sm font-medium">1) Datos básicos</h4>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del producto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Muzzarella Cilindro 3kg Sin Sal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="marca_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar marca" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {safeMarcas.length === 0 ? (
                              <SelectItem value="" disabled>
                                No hay marcas disponibles
                              </SelectItem>
                            ) : (
                              safeMarcas.map((marca) => (
                                <SelectItem key={marca.id} value={marca.id.toString()}>
                                  {marca.nombre}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoria_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {safeCategorias.length === 0 ? (
                              <SelectItem value="" disabled>
                                No hay categorías disponibles
                              </SelectItem>
                            ) : (
                              safeCategorias.map((categoria) => (
                                <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                  {categoria.nombre}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="unidad_medida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidad</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="unidad">unidad</SelectItem>
                            <SelectItem value="litro">litro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="peso_neto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso neto</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="con_sal"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Con sal</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU (se genera automáticamente)</FormLabel>
                      <FormControl>
                        <Input placeholder="Se generará automáticamente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descripción detallada del producto..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            )}

            {paso === 2 && (
              <section className="space-y-4">
                <h4 className="text-sm font-medium">2) Precio inicial</h4>
                <Separator />
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="lista_precio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lista de precios</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {safeListas.map((lp, i) => {
                                const displayLabel = lp.charAt(0).toUpperCase() + lp.slice(1);
                                return (
                                  <SelectItem key={lp} value={lp}>
                                    {displayLabel}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="moneda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moneda</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="costo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Costo</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="precio_lista"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio de lista</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            )}

            {paso === 3 && (
              <section className="space-y-4">
                <h4 className="text-sm font-medium">3) Inventario inicial</h4>
                <Separator />
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="stock_inicial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock inicial</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock_minimo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock mínimo</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ubicacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Depósito A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="activo">Activo</SelectItem>
                          <SelectItem value="inactivo">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            )}

            <DialogFooter className="mt-2 gap-2">
              {paso > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Atrás
                </Button>
              )}
              {paso < 3 && (
                <Button type="button" onClick={siguientePaso} disabled={!canNext()}>
                  Siguiente
                </Button>
              )}
              {paso === 3 && (
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear producto"
                  )}
                </Button>
              )}
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}