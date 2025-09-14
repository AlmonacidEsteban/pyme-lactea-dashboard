import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Plus, Mail, Phone, MoreHorizontal } from "lucide-react";

export function TeamSection() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Project Manager",
      department: "Operations",
      status: "Active",
      email: "sarah@company.com",
      phone: "+1 (555) 123-4567",
      initials: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Senior Developer",
      department: "Engineering",
      status: "Active",
      email: "mike@company.com",
      phone: "+1 (555) 234-5678",
      initials: "MC"
    },
    {
      name: "Emma Wilson",
      role: "Designer",
      department: "Creative",
      status: "Away",
      email: "emma@company.com",
      phone: "+1 (555) 345-6789",
      initials: "EW"
    },
    {
      name: "David Brown",
      role: "Marketing Lead",
      department: "Marketing",
      status: "Active",
      email: "david@company.com",
      phone: "+1 (555) 456-7890",
      initials: "DB"
    }
  ];

  const departments = [
    { name: "Engineering", count: 5, color: "bg-blue-100 text-blue-800" },
    { name: "Operations", count: 3, color: "bg-green-100 text-green-800" },
    { name: "Creative", count: 2, color: "bg-purple-100 text-purple-800" },
    { name: "Marketing", count: 2, color: "bg-orange-100 text-orange-800" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and departments.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((dept) => (
          <Card key={dept.name}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{dept.name}</h3>
                  <p className="text-2xl font-bold mt-2">{dept.count}</p>
                  <p className="text-xs text-muted-foreground">members</p>
                </div>
                <div className={`w-3 h-12 rounded ${dept.color}`}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Mail className="w-3 h-3" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {member.phone}
                    </div>
                  </div>
                  
                  <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                    {member.status}
                  </Badge>
                  
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