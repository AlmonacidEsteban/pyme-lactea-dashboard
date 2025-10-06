"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Loader2, DollarSign, Percent } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const changePriceSchema = z.object({
  lista_precio: z.string().min(1, "Selecciona una lista de precios"),
  moneda: z.string().min(1, "La moneda es requerida"),
  modo: z.enum(["monto", "porcentaje"], {
    required_error: "Selecciona el modo de cambio",
  }),
  valor: z.number({
    required_error: "El valor es requerido",
    invalid_type_error: "Debe ser un número válido",
  }).positive("El valor debe ser mayor a 0"),
  aplicarSobre: z.enum(["precio", "costo"], {
    required_error: "Selecciona sobre qué aplicar el cambio",
  }),
  vigente_desde: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  vigente_hasta: z.date().optional(),
  recalcular_margen: z.boolean().default(false),
});

export type ChangePricePayload = z.infer<typeof changePriceSchema>;

interface ChangePriceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  currentPrice?: number;
  listasPrecios?: string[];
  defaultLista?: string;
  onSubmit: (data: ChangePricePayload) => Promise<void>;
  loading?: boolean;
}

export function ChangePriceDialog({
  open,
  onOpenChange,
  productName = "Producto",
  currentPrice = 0,
  listasPrecios = ["mayorista", "minorista"],
  defaultLista = "mayorista",
  onSubmit,
  loading = false,
}: ChangePriceDialogProps) {
  const form = useForm<ChangePricePayload>({
    resolver: zodResolver(changePriceSchema),
    defaultValues: {
      lista_precio: defaultLista,
      moneda: "ARS",
      modo: "monto",
      valor: 0,
      aplicarSobre: "precio",
      vigente_desde: new Date(),
      vigente_hasta: undefined,
      recalcular_margen: false,
    },
  });

  const handleSubmit = async (data: ChangePricePayload) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Error al cambiar precio:", error);
    }
  };

  const watchModo = form.watch("modo");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cambiar Precio</DialogTitle>
          <DialogDescription>
            Actualiza el precio del producto especificando el nuevo valor y el motivo del cambio.
          </DialogDescription>
          <p className="text-sm text-muted-foreground">
            {productName} - Precio actual: ${currentPrice?.toLocaleString()}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
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
                          {listasPrecios.map((lista) => (
                            <SelectItem key={lista} value={lista}>
                              {lista.charAt(0).toUpperCase() + lista.slice(1)}
                            </SelectItem>
                          ))}
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
                      <Input placeholder="ARS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="modo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monto">
                          <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Monto fijo
                          </div>
                        </SelectItem>
                        <SelectItem value="porcentaje">
                          <div className="flex items-center">
                            <Percent className="mr-2 h-4 w-4" />
                            Porcentaje
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {watchModo === "monto" ? "Nuevo precio" : "Porcentaje de cambio"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={watchModo === "monto" ? "0.01" : "0.1"}
                        min="0"
                        placeholder={watchModo === "monto" ? "0.00" : "0.0"}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="aplicarSobre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aplicar sobre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="precio">Precio actual</SelectItem>
                      <SelectItem value="costo">Costo del producto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recalcular_margen"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Recalcular margen</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Ajustar automáticamente el margen de ganancia
                    </div>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vigente_desde"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Vigente desde</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vigente_hasta"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Vigente hasta (opcional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Sin fecha límite</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date < new Date() || 
                            (form.getValues("vigente_desde") && date <= form.getValues("vigente_desde"))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambio"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}