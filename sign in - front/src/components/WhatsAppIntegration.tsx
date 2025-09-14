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
  Video,
  Paperclip,
  MoreHorizontal,
  CheckCheck,
  Clock,
  Settings,
  Bot,
  Users,
  TrendingUp,
  Star,
  Search,
  Filter
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface WhatsAppMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isOutgoing: boolean;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'document' | 'audio';
}

interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  clientId?: string;
  tags: string[];
}

export function WhatsAppIntegration() {
  const [selectedContact, setSelectedContact] = useState<string | null>('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const contacts: WhatsAppContact[] = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      phone: '+1 (555) 123-4567',
      lastMessage: 'Thanks for the project update. Can we schedule a call tomorrow?',
      lastMessageTime: new Date(Date.now() - 10 * 60 * 1000),
      unreadCount: 2,
      isOnline: true,
      clientId: 'client-1',
      tags: ['client', 'active-project']
    },
    {
      id: '2',
      name: 'Design Studio Pro',
      phone: '+1 (555) 234-5678',
      lastMessage: 'The design looks great! Minor feedback attached.',
      lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      clientId: 'client-2',
      tags: ['client', 'review']
    },
    {
      id: '3',
      name: 'Marketing Agency Ltd',
      phone: '+1 (555) 345-6789',
      lastMessage: 'Hi! I saw your portfolio. Interested in discussing a project.',
      lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unreadCount: 1,
      isOnline: true,
      clientId: 'client-3',
      tags: ['prospect', 'new-lead']
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      phone: '+1 (555) 456-7890',
      lastMessage: 'Project update: Website development is on track',
      lastMessageTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: true,
      clientId: 'team-1',
      tags: ['team', 'project-manager']
    }
  ];

  const messages: Record<string, WhatsAppMessage[]> = {
    '1': [
      {
        id: '1',
        senderId: '1',
        senderName: 'TechCorp Solutions',
        content: 'Hi! How is the website redesign project going?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOutgoing: false,
        status: 'read',
        type: 'text'
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'You',
        content: 'Great progress! We\'re about 75% complete. The new design is looking fantastic and should be ready for review by tomorrow.',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        isOutgoing: true,
        status: 'read',
        type: 'text'
      },
      {
        id: '3',
        senderId: '1',
        senderName: 'TechCorp Solutions',
        content: 'Thanks for the project update. Can we schedule a call tomorrow?',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        isOutgoing: false,
        status: 'delivered',
        type: 'text'
      }
    ],
    '2': [
      {
        id: '4',
        senderId: '2',
        senderName: 'Design Studio Pro',
        content: 'The design looks great! Minor feedback attached.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isOutgoing: false,
        status: 'read',
        type: 'text'
      }
    ],
    '3': [
      {
        id: '5',
        senderId: '3',
        senderName: 'Marketing Agency Ltd',
        content: 'Hi! I saw your portfolio. Interested in discussing a project.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isOutgoing: false,
        status: 'delivered',
        type: 'text'
      }
    ]
  };

  const whatsappStats = [
    { title: 'Total Conversations', value: '24', change: '+3 today' },
    { title: 'Response Rate', value: '98%', change: '+2% this week' },
    { title: 'Avg Response Time', value: '2.3 min', change: '-30s improvement' },
    { title: 'Active Leads', value: '8', change: '+2 this week' }
  ];

  const automatedMessages = [
    {
      trigger: 'First Contact',
      message: 'Hi! Thanks for reaching out. We\'ll get back to you within 2 hours during business hours.',
      active: true
    },
    {
      trigger: 'Project Inquiry',
      message: 'Thanks for your interest in our services! We\'d love to discuss your project. When would be a good time for a brief call?',
      active: true
    },
    {
      trigger: 'After Hours',
      message: 'We\'re currently offline but will respond first thing in the morning. For urgent matters, please call our emergency line.',
      active: false
    }
  ];

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return timestamp.toLocaleDateString();
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage: WhatsAppMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      content: messageInput,
      timestamp: new Date(),
      isOutgoing: true,
      status: 'sent',
      type: 'text'
    };

    // Update messages (in real app, this would be handled by state management)
    toast.success('Message sent successfully');
    setMessageInput('');
  };

  const selectedContactData = contacts.find(c => c.id === selectedContact);
  const contactMessages = selectedContact ? messages[selectedContact] || [] : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">WhatsApp Business</h1>
          <p className="text-muted-foreground">Manage customer communications and automate responses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Bot className="w-4 h-4" />
            Automation
          </Button>
          <Button className="gap-2 bg-[#F005CD] hover:bg-[#F005CD]/90">
            <Settings className="w-4 h-4" />
            Integration Settings
          </Button>
        </div>
      </div>

      {/* WhatsApp Statistics */}
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
                <MessageSquare className="w-8 h-8 text-[#F005CD]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Contacts List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Badge variant="secondary">{contacts.length}</Badge>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
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
              <div className="space-y-1 p-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedContact === contact.id
                        ? 'bg-[#1E12A6] text-white'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        {contact.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
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
                                className="bg-[#F005CD] hover:bg-[#F005CD]/90 text-xs h-5 min-w-5 flex items-center justify-center"
                              >
                                {contact.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm opacity-70 truncate mt-1">
                          {contact.lastMessage}
                        </p>
                        <div className="flex gap-1 mt-2">
                          {contact.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
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
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <ScrollArea className="h-[400px] mb-4">
                  <div className="space-y-4">
                    {contactMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.isOutgoing
                              ? 'bg-[#1E12A6] text-white'
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
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage}
                    className="bg-[#F005CD] hover:bg-[#F005CD]/90"
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
                <h3 className="font-medium mb-2">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a contact to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Automated Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automatedMessages.map((autoMsg, index) => (
              <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{autoMsg.trigger}</h4>
                    <Badge variant={autoMsg.active ? "default" : "secondary"}>
                      {autoMsg.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{autoMsg.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
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