import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Clock,
  Factory,
  Truck,
  UserCheck,
  DollarSign
} from "lucide-react";

export function TeamSection() {
  const productionTeam = [
    {
      name: "Carlos Mendoza",
      role: "Maestro Quesero",
      shift: "Turno Mañana (6:00-14:00)",
      experience: "15 años",
      specialty: "Muzzarella y Ricota",
      status: "Activo",
      hourlyRate: "$25/hora"
    },
    {
      name: "María González",
      role: "Operaria de Producción",
      shift: "Turno Tarde (14:00-22:00)",
      experience: "8 años",
      specialty: "Empaque y Control de Calidad",
      status: "Activo",
      hourlyRate: "$18/hora"
    },
    {
      name: "Roberto Silva",
      role: "Operario de Producción",
      shift: "Turno Noche (22:00-6:00)",
      experience: "5 años",
      specialty: "Limpieza y Mantenimiento",
      status: "Activo",
      hourlyRate: "$20/hora"
    }
  ];

  const logisticsTeam = [
    {
      name: "Juan Pérez",
      role: "Chofer Principal",
      vehicle: "Camión Refrigerado #1",
      route: "Zona Norte y Centro",
      license: "Profesional Vigente",
      status: "Activo",
      experience: "12 años"
    },
    {
      name: "Ana Martínez",
      role: "Chofer de Reparto",
      vehicle: "Camión Refrigerado #2",
      route: "Zona Sur y Este",
      license: "Profesional Vigente",
      status: "Activo",
      experience: "7 años"
    }
  ];

  const administrationTeam = [
    {
      name: "Patricia López",
      role: "Dueña/Socia Principal",
      permissions: "Acceso Total",
      responsibilities: "Decisiones Estratégicas, Finanzas",
      contact: "+54 11 1234-5678",
      status: "Activo"
    },
    {
      name: "Miguel Rodríguez",
      role: "Socio Operativo",
      permissions: "Producción y Ventas",
      responsibilities: "Operaciones Diarias, Control de Calidad",
      contact: "+54 11 2345-6789",
      status: "Activo"
    },
    {
      name: "Laura Fernández",
      role: "Administradora",
      permissions: "Contabilidad y RRHH",
      responsibilities: "Gestión Administrativa, Nóminas",
      contact: "+54 11 3456-7890",
      status: "Activo"
    }
  ];

  const departments = [
    { name: "Producción", count: 3, color: "bg-blue-100 text-blue-800", icon: Factory },
    { name: "Logística", count: 2, color: "bg-green-100 text-green-800", icon: Truck },
    { name: "Administración", count: 3, color: "bg-purple-100 text-purple-800", icon: UserCheck }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Gestión de Equipo</h1>
          <p className="text-muted-foreground">Administra los equipos de Producción, Logística y Administración.</p>
        </div>
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const IconComponent = dept.icon;
          return (
            <Card key={dept.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="w-5 h-5" />
                      <h3 className="font-medium">{dept.name}</h3>
                    </div>
                    <p className="text-2xl font-bold">{dept.count}</p>
                    <p className="text-xs text-muted-foreground">miembros</p>
                  </div>
                  <div className={`w-3 h-12 rounded ${dept.color}`}></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Production Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="w-5 h-5" />
            Equipo de Producción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productionTeam.map((member) => (
              <div key={member.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.specialty}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3" />
                      {member.shift}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3" />
                      {member.experience}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {member.hourlyRate}
                    </div>
                  </div>
                  
                  <Badge variant={member.status === "Activo" ? "default" : "secondary"}>
                    {member.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logistics Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Equipo de Logística
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logisticsTeam.map((member) => (
              <div key={member.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.vehicle}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" />
                      {member.route}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <UserCheck className="w-3 h-3" />
                      {member.license}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {member.experience}
                    </div>
                  </div>
                  
                  <Badge variant={member.status === "Activo" ? "default" : "secondary"}>
                    {member.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Administration Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Equipo de Administración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {administrationTeam.map((member) => (
              <div key={member.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.permissions}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 mb-1">
                      <UserCheck className="w-3 h-3" />
                      {member.responsibilities}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {member.contact}
                    </div>
                  </div>
                  
                  <Badge variant={member.status === "Activo" ? "default" : "secondary"}>
                    {member.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}