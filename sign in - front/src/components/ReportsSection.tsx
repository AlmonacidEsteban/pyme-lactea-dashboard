import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  FileText,
  PieChart,
  Users,
  DollarSign
} from "lucide-react";

export function ReportsSection() {
  const reportMetrics = [
    {
      title: "Monthly Revenue",
      value: "$48,590",
      change: "+12.3%",
      period: "vs last month"
    },
    {
      title: "Project Completion",
      value: "87%",
      change: "+5.2%",
      period: "vs last quarter"
    },
    {
      title: "Client Satisfaction",
      value: "4.8/5",
      change: "+0.3",
      period: "vs last quarter"
    },
    {
      title: "Team Productivity",
      value: "92%",
      change: "+8.1%",
      period: "vs last month"
    }
  ];

  const availableReports = [
    {
      name: "Financial Summary",
      description: "Revenue, expenses, and profit analysis",
      type: "Financial",
      lastGenerated: "Dec 1, 2024",
      icon: DollarSign,
      data: "Revenue, Expenses, Profit Margins"
    },
    {
      name: "Project Performance",
      description: "Project timelines, budgets, and deliverables",
      type: "Operations",
      lastGenerated: "Nov 30, 2024",
      icon: BarChart3,
      data: "Completion Rates, Budget Utilization"
    },
    {
      name: "Team Analytics",
      description: "Team productivity and workload distribution",
      type: "HR",
      lastGenerated: "Nov 28, 2024",
      icon: Users,
      data: "Productivity, Task Distribution"
    },
    {
      name: "Client Report",
      description: "Client satisfaction and engagement metrics",
      type: "Business",
      lastGenerated: "Nov 25, 2024",
      icon: PieChart,
      data: "Satisfaction Scores, Engagement"
    }
  ];

  const quickReports = [
    "Weekly Performance Summary",
    "Monthly Financial Overview",
    "Quarterly Business Review",
    "Annual Growth Report"
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Financial":
        return "default";
      case "Operations":
        return "secondary";
      case "HR":
        return "outline";
      case "Business":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate insights and track business performance.</p>
        </div>
        <Button className="gap-2">
          <FileText className="w-4 h-4" />
          Custom Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-xs text-green-600">
                  {metric.change} {metric.period}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableReports.map((report, index) => {
              const Icon = report.icon;
              return (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                    <Badge variant={getTypeColor(report.type)}>
                      {report.type}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Data: {report.data}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      Last generated: {report.lastGenerated}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-3 h-3 mr-1" />
                      Generate
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{report}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    Generate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium">Weekly Summary</h4>
                <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM</p>
                <Badge className="mt-2" variant="secondary">Active</Badge>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium">Monthly Financial</h4>
                <p className="text-sm text-muted-foreground">1st of each month</p>
                <Badge className="mt-2" variant="secondary">Active</Badge>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium">Quarterly Review</h4>
                <p className="text-sm text-muted-foreground">End of each quarter</p>
                <Badge className="mt-2" variant="outline">Paused</Badge>
              </div>

              <Button variant="outline" className="w-full mt-4">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule New Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}