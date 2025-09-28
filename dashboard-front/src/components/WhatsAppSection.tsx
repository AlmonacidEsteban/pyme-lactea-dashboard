import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Users,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  Star,
  Clock,
  CheckCheck,
  Bot,
  Settings,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  Truck,
  AlertCircle,
  Plus
} from "lucide-react";

interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  clientType: 'mayorista' | 'minorista' | 'distribuidor' | 'prospecto';
  zone: string;
  totalPurchases: number;
  lastPurchase: Date;
  preferredProducts: string[];
}

interface WhatsAppMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isOutgoing: boolean;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'price_list' | 'order' | 'payment_reminder';
}

interface PriceList {
  id: string;
  name: string;
  products: Array<{
    name: string;
    brand: string;
    price: number;
    unit: string;
    stock: number;
  }>;
  validUntil: Date;
  clientType: 'mayorista' | 'minorista' | 'distribuidor';
}

export function WhatsAppSection() {
  const [selectedContact, setSelectedContact] = useState<string | null>('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceList, setSelectedPriceList] = useState<string>('');

  // Datos de contactos específicos para la PyME láctea
  const contacts: WhatsAppContact[] = [
    {
      id: '1',
      name: 'Almacén Central',
      phone: '+54 9 11 2345-6789',
      lastMessage: 'Necesito la lista de precios actualizada de muzzarella',
      lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 2,
      isOnline: true,
      clientType: 'mayorista',
      zone: 'CABA',
      totalPurchases: 125000,
      lastPurchase: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      preferredProducts: ['Muzzarella La Serenísima', 'Queso Cremoso Sancor']
    },
    {
      id: '2',
      name: 'Distribuidora Norte',
      phone: '+54 9 11 3456-7890',
      lastMessage: 'Confirmo pedido de 50kg muzzarella para mañana',
      lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      clientType: 'distribuidor',
      zone: 'Zona Norte',
      totalPurchases: 89000,
      lastPurchase: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      preferredProducts: ['Muzzarella La Serenísima', 'Ricota Sancor']
    },
    {
      id: '3',
      name: 'Supermercado San Martín',
      phone: '+54 9 11 4567-8901',
      lastMessage: 'Hola! Quería consultar precios para minoristas',
      lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unreadCount: 1,
      isOnline: true,
      clientType: 'minorista',
      zone: 'Zona Oeste',
      totalPurchases: 45000,
      lastPurchase: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      preferredProducts: ['Queso Cremoso Sancor', 'Manteca La Serenísima']
    },
    {
      id: '4',
      name: 'Panadería El Buen Pan',
      phone: '+54 9 11 5678-9012',
      lastMessage: 'Gracias por la entrega puntual!',
      lastMessageTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      clientType: 'minorista',
      zone: 'Centro',
      totalPurchases: 28000,
      lastPurchase: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      preferredProducts: ['Muzzarella La Serenísima', 'Queso Cremoso Sancor']
    }
  ];

  // Listas de precios disponibles
  const priceLists: PriceList[] = [
    {
      id: '1',
      name: 'Lista Mayorista - Enero 2024',
      clientType: 'mayorista',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      products: [
        { name: 'Muzzarella', brand: 'La Serenísima', price: 2800, unit: 'kg', stock: 150 },
        { name: 'Queso Cremoso', brand: 'Sancor', price: 3200, unit: 'kg', stock: 80 },
        { name: 'Ricota', brand: 'Sancor', price: 2400, unit: 'kg', stock: 60 },
        { name: 'Manteca', brand: 'La Serenísima', price: 1800, unit: 'kg', stock: 40 }
      ]
    },
    {
      id: '2',
      name: 'Lista Minorista - Enero 2024',
      clientType: 'minorista',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      products: [
        { name: 'Muzzarella', brand: 'La Serenísima', price: 3200, unit: 'kg', stock: 150 },
        { name: 'Queso Cremoso', brand: 'Sancor', price: 3600, unit: 'kg', stock: 80 },
        { name: 'Ricota', brand: 'Sancor', price: 2800, unit: 'kg', stock: 60 },
        { name: 'Manteca', brand: 'La Serenísima', price: 2200, unit: 'kg', stock: 40 }
      ]
    },
    {
      id: '3',
      name: 'Lista Distribuidor - Enero 2024',
      clientType: 'distribuidor',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      products: [
        { name: 'Muzzarella', brand: 'La Serenísima', price: 2600, unit: 'kg', stock: 150 },
        { name: 'Queso Cremoso', brand: 'Sancor', price: 3000, unit: 'kg', stock: 80 },
        { name: 'Ricota', brand: 'Sancor', price: 2200, unit: 'kg', stock: 60 },
        { name: 'Manteca', brand: 'La Serenísima', price: 1600, unit: 'kg', stock: 40 }
      ]
    }
  ];

  // Mensajes por contacto
  const messages: Record<string, WhatsAppMessage[]> = {
    '1': [
      {
        id: '1',
        senderId: '1',
        senderName: 'Almacén Central',
        content: 'Hola! ¿Tienen stock de muzzarella La Serenísima?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOutgoing: false,
        status: 'read',
        type: 'text'
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'Mi PyME Lácteos',
        content: 'Hola! Sí, tenemos 150kg disponibles. Te envío la lista de precios actualizada.',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        isOutgoing: true,
        status: 'read',
        type: 'text'
      },
      {
        id: '3',
        senderId: '1',
        senderName: 'Almacén Central',
        content: 'Necesito la lista de precios actualizada de muzzarella',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isOutgoing: false,
        status: 'delivered',
        type: 'text'
      }
    ]
  };

  // Estadísticas de WhatsApp
  const whatsappStats = [
    { title: 'Contactos Activos', value: '48', change: '+5 esta semana', icon: Users },
    { title: 'Listas Enviadas', value: '23', change: '+8 hoy', icon: FileText },
    { title: 'Pedidos por WhatsApp', value: '15', change: '+3 hoy', icon: Package },
    { title: 'Tasa de Respuesta', value: '94%', change: '+2% esta semana', icon: TrendingUp }
  ];

  // Mensajes automáticos predefinidos
  const automatedMessages = [
    {
      trigger: 'Saludo Inicial',
      message: '¡Hola! Gracias por contactar a Mi PyME Lácteos. ¿En qué podemos ayudarte hoy?',
      active: true
    },
    {
      trigger: 'Lista de Precios',
      message: 'Te envío nuestra lista de precios actualizada. Todos nuestros productos son frescos y de primera calidad.',
      active: true
    },
    {
      trigger: 'Confirmación de Pedido',
      message: 'Perfecto! Tu pedido ha sido confirmado. Te avisaremos cuando esté listo para entrega.',
      active: true
    },
    {
      trigger: 'Recordatorio de Pago',
      message: 'Hola! Te recordamos que tienes una factura pendiente. ¿Podrías confirmar el pago?',
      active: false
    }
  ];

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) return 'ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return timestamp.toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const getClientTypeColor = (type: string) => {
    switch (type) {
      case 'mayorista': return 'bg-blue-100 text-blue-800';
      case 'distribuidor': return 'bg-green-100 text-green-800';
      case 'minorista': return 'bg-purple-100 text-purple-800';
      case 'prospecto': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;
    // Aquí iría la lógica para enviar el mensaje
    setMessageInput('');
  };

  const sendPriceList = () => {
    if (!selectedPriceList || !selectedContact) return;
    const priceList = priceLists.find(pl => pl.id === selectedPriceList);
    if (priceList) {
      // Aquí iría la lógica para enviar la lista de precios
      console.log(`Enviando lista de precios: ${priceList.name}`);
    }
  };

  const selectedContactData = contacts.find(c => c.id === selectedContact);
  const contactMessages = selectedContact ? messages[selectedContact] || [] : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">WhatsApp Business</h1>
          <p className="text-muted-foreground">Gestión de contactos y envío de listas de precios para Mi PyME Lácteos.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Bot className="w-4 h-4" />
            Mensajes Automáticos
          </Button>
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4" />
            Nuevo Contacto
          </Button>
        </div>
      </div>

      {/* Estadísticas de WhatsApp */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {whatsappStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <stat.icon className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Lista de Contactos */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Contactos</CardTitle>
              <Badge variant="secondary">{contacts.length}</Badge>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contactos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedContact === contact.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        {contact.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">{contact.name}</h4>
                          <div className="flex items-center gap-1">
                            <span className="text-xs opacity-70">
                              {formatTimestamp(contact.lastMessageTime)}
                            </span>
                            {contact.unreadCount > 0 && (
                              <Badge 
                                variant="default" 
                                className="bg-green-600 hover:bg-green-700 text-xs h-5 min-w-5 flex items-center justify-center"
                              >
                                {contact.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm opacity-70 truncate mt-1">
                          {contact.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={`text-xs ${getClientTypeColor(contact.clientType)}`}>
                            {contact.clientType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{contact.zone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Área de Chat */}
        <Card className="lg:col-span-2">
          {selectedContactData ? (
            <>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedContactData.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedContactData.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedContactData.phone}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getClientTypeColor(selectedContactData.clientType)}`}>
                          {selectedContactData.clientType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{selectedContactData.zone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <ScrollArea className="h-[350px] mb-4">
                  <div className="space-y-4">
                    {contactMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.isOutgoing
                              ? 'bg-green-600 text-white'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-2 text-xs ${
                            message.isOutgoing ? 'text-white/70' : 'text-muted-foreground'
                          }`}>
                            <span>{formatTimestamp(message.timestamp)}</span>
                            {message.isOutgoing && (
                              <CheckCheck className={`w-3 h-3 ${
                                message.status === 'read' ? 'text-blue-300' : 'text-white/50'
                              }`} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Envío de Lista de Precios */}
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Enviar Lista de Precios</h4>
                  <div className="flex gap-2">
                    <select 
                      value={selectedPriceList}
                      onChange={(e) => setSelectedPriceList(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border rounded-md"
                    >
                      <option value="">Seleccionar lista...</option>
                      {priceLists
                        .filter(pl => pl.clientType === selectedContactData.clientType)
                        .map(pl => (
                          <option key={pl.id} value={pl.id}>{pl.name}</option>
                        ))}
                    </select>
                    <Button 
                      onClick={sendPriceList}
                      disabled={!selectedPriceList}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Enviar
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Escribir mensaje..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-medium mb-2">Selecciona un contacto</h3>
                <p className="text-sm text-muted-foreground">Elige un contacto para comenzar a chatear</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Mensajes Automáticos */}
      <Card>
        <CardHeader>
          <CardTitle>Mensajes Automáticos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automatedMessages.map((autoMsg, index) => (
              <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{autoMsg.trigger}</h4>
                    <Badge variant={autoMsg.active ? "default" : "secondary"}>
                      {autoMsg.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{autoMsg.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}