import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Calendar, Clock, Truck, Factory, DollarSign, MapPin, Package, AlertCircle, CheckCircle } from "lucide-react";

export function CalendarSection() {
  const todayEvents = [
    {
      time: "06:00 AM",
      title: "Ordeño Matutino",
      type: "Producción",
      duration: "2 horas",
      location: "Establo Principal",
      priority: "alta",
      status: "programado"
    },
    {
      time: "08:30 AM",
      title: "Entrega Supermercado Central",
      type: "Entrega",
      duration: "1 hora",
      location: "Av. Principal 123",
      client: "Supermercado Central",
      products: "Leche fresca 200L, Queso 50kg",
      priority: "alta",
      status: "en_ruta"
    },
    {
      time: "10:00 AM",
      title: "Producción Queso Fresco",
      type: "Producción",
      duration: "3 horas",
      location: "Planta de Procesamiento",
      quantity: "100kg",
      priority: "media",
      status: "programado"
    },
    {
      time: "02:00 PM",
      title: "Cobro Restaurante La Esquina",
      type: "Pago",
      duration: "30 min",
      location: "Calle 5 #45",
      amount: "$850.000",
      priority: "alta",
      status: "pendiente"
    },
    {
      time: "04:00 PM",
      title: "Entrega Panadería San José",
      type: "Entrega",
      duration: "45 min",
      location: "Barrio Centro",
      client: "Panadería San José",
      products: "Leche 80L, Mantequilla 20kg",
      priority: "media",
      status: "programado"
    },
    {
      time: "06:00 PM",
      title: "Ordeño Vespertino",
      type: "Producción",
      duration: "2 horas",
      location: "Establo Principal",
      priority: "alta",
      status: "programado"
    }
  ];

  const upcomingEvents = [
    {
      date: "Mañana",
      title: "Entrega Mayorista Lácteos del Norte",
      time: "07:00 AM",
      type: "Entrega",
      amount: "$2.500.000",
      priority: "alta"
    },
    {
      date: "Dic 5",
      title: "Pago Proveedor Alimentos",
      time: "10:00 AM",
      type: "Pago",
      amount: "$1.200.000",
      priority: "alta"
    },
    {
      date: "Dic 6",
      title: "Producción Yogurt Natural",
      time: "08:00 AM",
      type: "Producción",
      quantity: "500L",
      priority: "media"
    },
    {
      date: "Dic 8",
      title: "Revisión Veterinaria Ganado",
      time: "09:00 AM",
      type: "Mantenimiento",
      priority: "alta"
    },
    {
      date: "Dic 10",
      title: "Entrega Especial Navidad",
      time: "06:00 AM",
      type: "Entrega",
      amount: "$3.800.000",
      priority: "alta"
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Entrega":
        return "default";
      case "Producción":
        return "secondary";
      case "Pago":
        return "destructive";
      case "Mantenimiento":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "Entrega":
        return <Truck className="w-4 h-4" />;
      case "Producción":
        return <Factory className="w-4 h-4" />;
      case "Pago":
        return <DollarSign className="w-4 h-4" />;
      case "Mantenimiento":
        return <Package className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completado":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "en_ruta":
        return <Truck className="w-4 h-4 text-blue-500" />;
      case "pendiente":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "text-red-500";
      case "media":
        return "text-yellow-500";
      case "baja":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Calendario</h1>
          <p className="text-muted-foreground">Agenda de entregas, producción y pagos de Mi PyME Lácteos</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Actividad
        </Button>
      </div>

      {/* Calendar Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Entregas Hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Factory className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Producciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">Cobros Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Prioridad Alta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Agenda de Hoy</CardTitle>
            <p className="text-sm text-muted-foreground">Martes, 3 de Diciembre 2024</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                  <div className="text-center min-w-20">
                    <p className="text-sm font-medium">{event.time}</p>
                    <p className="text-xs text-muted-foreground">{event.duration}</p>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getEventTypeIcon(event.type)}
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant={getEventTypeColor(event.type)} className="text-xs">
                        {event.type}
                      </Badge>
                      {event.priority && (
                        <span className={`text-xs font-medium ${getPriorityColor(event.priority)}`}>
                          ●
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                        {event.status && (
                          <div className="flex items-center gap-1 ml-2">
                            {getStatusIcon(event.status)}
                            <span className="capitalize">{event.status.replace('_', ' ')}</span>
                          </div>
                        )}
                      </div>
                      
                      {event.client && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Package className="w-3 h-3" />
                          Cliente: {event.client}
                        </div>
                      )}
                      
                      {event.products && (
                        <div className="text-xs text-muted-foreground">
                          Productos: {event.products}
                        </div>
                      )}
                      
                      {event.quantity && (
                        <div className="text-xs text-muted-foreground">
                          Cantidad: {event.quantity}
                        </div>
                      )}
                      
                      {event.amount && (
                        <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                          <DollarSign className="w-3 h-3" />
                          {event.amount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Actividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getEventTypeIcon(event.type)}
                      <h4 className="font-medium">{event.title}</h4>
                      {event.priority && (
                        <span className={`text-xs font-medium ${getPriorityColor(event.priority)}`}>
                          ●
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                      <Clock className="w-3 h-3 ml-2" />
                      {event.time}
                    </div>
                    {event.amount && (
                      <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                        <DollarSign className="w-3 h-3" />
                        {event.amount}
                      </div>
                    )}
                    {event.quantity && (
                      <div className="text-xs text-muted-foreground">
                        Cantidad: {event.quantity}
                      </div>
                    )}
                  </div>
                  <Badge variant={getEventTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Acciones Rápidas</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Truck className="w-3 h-3" />
                  Nueva Entrega
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Factory className="w-3 h-3" />
                  Programar Producción
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <DollarSign className="w-3 h-3" />
                  Agendar Cobro
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Calendar className="w-3 h-3" />
                  Ver Semana
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}