
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Clock, FileText, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  
  // Mock data for dashboard
  const stats = [
    { 
      title: "Tasks", 
      value: "3/8", 
      description: "Tasks completed today", 
      icon: Calendar,
      progress: 37,
      path: "/dashboard/tasks"
    },
    { 
      title: "Notes", 
      value: "12", 
      description: "Total notes created", 
      icon: FileText,
      path: "/dashboard/notes"
    },
    { 
      title: "Chat History", 
      value: "5", 
      description: "Recent conversations", 
      icon: MessageSquare,
      path: "/dashboard/chat"
    },
  ];

  const upcomingTasks = [
    { id: 1, title: "Complete project proposal", time: "Today, 2:00 PM", completed: false },
    { id: 2, title: "Review client feedback", time: "Today, 4:30 PM", completed: false },
    { id: 3, title: "Team standup meeting", time: "Tomorrow, 9:00 AM", completed: false },
  ];

  useEffect(() => {
    // Animate progress bar
    const timer = setTimeout(() => setProgress(37), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(stat.path)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              {stat.progress !== undefined && (
                <Progress value={stat.progress} className="h-2 mt-4" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Tasks overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
          <CardDescription>Your tasks for today and tomorrow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md task-item"
                onClick={() => navigate("/dashboard/tasks")}
              >
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-3 ${task.completed ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <div>
                    <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{task.time}</span>
                    </div>
                  </div>
                </div>
                {task.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 border-2 rounded-full border-muted-foreground/50" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick access section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Notes</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-md border-muted">
            <div className="text-center">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No recent notes</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click to create your first note
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Chat assistant */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Chat Assistant</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-md border-muted">
            <div className="text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Chat with AI assistant</p>
              <p className="text-xs text-muted-foreground mt-1">
                Get help with your tasks and questions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
