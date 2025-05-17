
import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, Home, Layout as LayoutIcon, LogOut, MessageSquare, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
    
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Close sidebar on mobile by default
    if (isMobile) {
      setIsOpen(false);
    }
    
    return () => clearInterval(interval);
  }, [navigate, isMobile]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Tasks", icon: Calendar, path: "/dashboard/tasks" },
    { name: "Notes", icon: FileText, path: "/dashboard/notes" },
    { name: "Chat", icon: MessageSquare, path: "/dashboard/chat" },
    { name: "News", icon: LayoutIcon, path: "/dashboard/news" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`${
          isOpen ? "w-64" : "w-0 md:w-16"
        } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className={`font-bold text-xl transition-opacity ${isOpen ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
              {isOpen ? "Productivity" : ""}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <Clock className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="flex-1 py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isOpen ? "" : "justify-center"}`}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {isOpen && <span>{item.name}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className={`w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 ${isOpen ? "" : "justify-center"}`}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              {isOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="mr-2"
              >
                <LayoutIcon className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{formatDate(currentTime)}</h1>
                <p className="text-sm text-muted-foreground">{formatTime(currentTime)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">
                  {JSON.parse(localStorage.getItem("user") || "{}").email || "User"}
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-full h-8 w-8 p-0"
                onClick={() => navigate("/dashboard/settings")}
              >
                <span className="sr-only">Settings</span>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
