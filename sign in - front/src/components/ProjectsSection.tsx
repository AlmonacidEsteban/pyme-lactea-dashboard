import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Plus, Calendar, Users, MoreHorizontal, Clock } from "lucide-react";

export function ProjectsSection() {
  const projects = [
    {
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern design",
      status: "In Progress",
      priority: "High",
      progress: 75,
      budget: "$15,000",
      spent: "$11,250",
      startDate: "Nov 1, 2024",
      dueDate: "Dec 15, 2024",
      team: ["SJ", "MC", "EW"],
      tasks: { completed: 15, total: 20 }
    },
    {
      name: "Mobile App Development",
      description: "Native mobile app for iOS and Android platforms",
      status: "Planning",
      priority: "Medium",
      progress: 25,
      budget: "$45,000",
      spent: "$5,000",
      startDate: "Dec 1, 2024",
      dueDate: "Jan 30, 2025",
      team: ["MC", "DB"],
      tasks: { completed: 3, total: 25 }
    },
    {
      name: "Brand Identity Refresh",
      description: "Update logo, colors, and brand guidelines",
      status: "Review",
      priority: "High",
      progress: 90,
      budget: "$8,000",
      spent: "$7,200",
      startDate: "Oct 15, 2024",
      dueDate: "Dec 5, 2024",
      team: ["EW", "DB"],
      tasks: { completed: 18, total: 20 }
    },
    {
      name: "Marketing Campaign Q1",
      description: "Digital marketing strategy for Q1 2025",
      status: "In Progress",
      priority: "Medium",
      progress: 60,
      budget: "$12,000",
      spent: "$6,800",
      startDate: "Nov 15, 2024",
      dueDate: "Dec 20, 2024",
      team: ["DB", "SJ"],
      tasks: { completed: 8, total: 15 }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "default";
      case "Planning":
        return "secondary";
      case "Review":
        return "outline";
      case "Completed":
        return "default";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Projects</h1>
          <p className="text-muted-foreground">Track and manage all your business projects.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Projects</h3>
            <p className="text-2xl font-bold mt-2">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
            <p className="text-2xl font-bold mt-2">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
            <p className="text-2xl font-bold mt-2">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">On Hold</h3>
            <p className="text-2xl font-bold mt-2">1</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.name}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge variant={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge variant={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Due Date</p>
                    <p className="text-muted-foreground">{project.dueDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Team</p>
                    <div className="flex -space-x-2">
                      {project.team.map((member, index) => (
                        <Avatar key={index} className="w-6 h-6 border-2 border-background">
                          <AvatarFallback className="text-xs">{member}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Tasks</p>
                    <p className="text-muted-foreground">{project.tasks.completed}/{project.tasks.total}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium">Budget</p>
                  <p className="text-muted-foreground">{project.spent} / {project.budget}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}