
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  
  // Mock data for dashboard
  const stats = [
    { 
      title: "News", 
      value: "Daily Updates", 
      description: "Today's top headlines", 
      icon: Calendar,
      path: "/dashboard/news"
    },
    { 
      title: "Chat Assistant", 
      value: "AI Helper", 
      description: "Ask me anything", 
      icon: MessageSquare,
      path: "/dashboard/chat"
    },
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(stat.path)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Daily News Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Latest News</CardTitle>
          <CardDescription>Stay updated with the latest headlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div 
              className="p-4 bg-muted/50 rounded-md cursor-pointer hover:bg-muted transition-colors"
              onClick={() => navigate("/dashboard/news")}
            >
              <p className="font-medium">Daily News Digest</p>
              <p className="text-sm text-muted-foreground">
                Click to view today's top stories across various categories
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Chat assistant section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Chat Assistant</CardTitle>
        </CardHeader>
        <CardContent className="h-[160px] flex items-center justify-center border-2 border-dashed rounded-md border-muted cursor-pointer" onClick={() => navigate("/dashboard/chat")}>
          <div className="text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Chat with AI assistant</p>
            <p className="text-xs text-muted-foreground mt-1">
              Get help with your questions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
