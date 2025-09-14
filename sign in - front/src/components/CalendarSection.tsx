import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Calendar, Clock, Users, Video, MapPin } from "lucide-react";

export function CalendarSection() {
  const todayEvents = [
    {
      time: "09:00 AM",
      title: "Team Standup",
      type: "Meeting",
      duration: "30 min",
      attendees: ["Sarah", "Mike", "Emma"],
      location: "Conference Room A"
    },
    {
      time: "11:00 AM",
      title: "Client Presentation - TechCorp",
      type: "Presentation",
      duration: "1 hour",
      attendees: ["Sarah", "David"],
      location: "Video Call"
    },
    {
      time: "02:00 PM",
      title: "Project Review - Website",
      type: "Review",
      duration: "45 min",
      attendees: ["Mike", "Emma"],
      location: "Conference Room B"
    },
    {
      time: "04:30 PM",
      title: "Budget Planning Session",
      type: "Planning",
      duration: "1.5 hours",
      attendees: ["Sarah", "David", "Emma"],
      location: "Conference Room A"
    }
  ];

  const upcomingEvents = [
    {
      date: "Tomorrow",
      title: "Design Workshop",
      time: "10:00 AM",
      type: "Workshop"
    },
    {
      date: "Dec 5",
      title: "Client Onboarding - New Client",
      time: "02:00 PM",
      type: "Meeting"
    },
    {
      date: "Dec 8",
      title: "Quarterly Business Review",
      time: "09:00 AM",
      type: "Review"
    },
    {
      date: "Dec 10",
      title: "Team Holiday Party",
      time: "06:00 PM",
      type: "Event"
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Meeting":
        return "default";
      case "Presentation":
        return "destructive";
      case "Review":
        return "secondary";
      case "Planning":
        return "outline";
      case "Workshop":
        return "default";
      case "Event":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Calendar & Schedule</h1>
          <p className="text-muted-foreground">Manage your meetings and events.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Event
        </Button>
      </div>

      {/* Calendar Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">Events Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">6.5h</p>
                <p className="text-xs text-muted-foreground">Meeting Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Video className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Video Calls</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <p className="text-sm text-muted-foreground">Tuesday, December 3, 2024</p>
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
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant={getEventTypeColor(event.type)} className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.attendees.join(", ")}
                      </div>
                      <div className="flex items-center gap-1">
                        {event.location === "Video Call" ? (
                          <Video className="w-3 h-3" />
                        ) : (
                          <MapPin className="w-3 h-3" />
                        )}
                        {event.location}
                      </div>
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
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                      <Clock className="w-3 h-3 ml-2" />
                      {event.time}
                    </div>
                  </div>
                  <Badge variant={getEventTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Schedule Meeting
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Block Time
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  View Week
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Export Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}