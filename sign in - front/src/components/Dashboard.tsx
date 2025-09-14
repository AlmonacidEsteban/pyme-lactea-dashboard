import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  Users, 
  FolderOpen, 
  DollarSign,
  Calendar,
  AlertCircle,
  MessageSquare,
  Bell
} from "lucide-react";

export function Dashboard() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$24,580",
      change: "+12.3%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Active Projects",
      value: "8",
      change: "+2",
      icon: FolderOpen,
      trend: "up"
    },
    {
      title: "Team Members",
      value: "12",
      change: "No change",
      icon: Users,
      trend: "neutral"
    },
    {
      title: "Client Satisfaction",
      value: "94%",
      change: "+2.1%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "WhatsApp Messages",
      value: "127",
      change: "+23 today",
      icon: MessageSquare,
      trend: "up"
    }
  ];

  const recentProjects = [
    { name: "Website Redesign", status: "In Progress", progress: 75, deadline: "Dec 15" },
    { name: "Mobile App Development", status: "Planning", progress: 25, deadline: "Jan 30" },
    { name: "Brand Identity", status: "Review", progress: 90, deadline: "Dec 5" },
    { name: "Marketing Campaign", status: "In Progress", progress: 60, deadline: "Dec 20" }
  ];

  const upcomingTasks = [
    { task: "Client presentation", time: "10:00 AM", priority: "High" },
    { task: "Team standup", time: "2:00 PM", priority: "Medium" },
    { task: "Project review", time: "4:30 PM", priority: "High" },
    { task: "Budget planning", time: "Tomorrow", priority: "Low" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${metric.title === "WhatsApp Messages" ? "text-[#F005CD]" : "text-muted-foreground"}`}>
                  {metric.change} {metric.title === "WhatsApp Messages" ? "" : "from last month"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{project.name}</h4>
                  <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Progress value={project.progress} className="flex-1" />
                  <span>{project.progress}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Due: {project.deadline}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#F005CD]" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">WhatsApp message from TechCorp</h4>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <Badge variant="default" className="bg-[#F005CD] hover:bg-[#F005CD]/90">
                New
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Payment received</h4>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <Badge variant="secondary">
                Finance
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Project deadline approaching</h4>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
              <Badge variant="outline">
                Project
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-blue-600" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Team meeting completed</h4>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <Badge variant="secondary">
                Team
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}