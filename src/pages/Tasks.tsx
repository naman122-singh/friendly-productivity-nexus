import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  recurring: boolean;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Example tasks
      const exampleTasks: Task[] = [
        {
          id: 1,
          title: "Complete project proposal",
          description: "Finish the draft and send for review",
          dueDate: "2025-05-17T14:00",
          completed: false,
          recurring: false
        },
        {
          id: 2,
          title: "Team meeting",
          description: "Weekly standup with the development team",
          dueDate: "2025-05-18T09:00",
          completed: false,
          recurring: true
        },
        {
          id: 3,
          title: "Review client feedback",
          description: "Go through client comments and prepare responses",
          dueDate: "2025-05-17T16:30",
          completed: false,
          recurring: false
        },
      ];
      setTasks(exampleTasks);
      localStorage.setItem("tasks", JSON.stringify(exampleTasks));
    }
  }, []);
  
  const saveTasksToStorage = (updatedTasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };
  
  const handleAddTask = () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Task title cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      dueDate: dueDate || new Date().toISOString(),
      completed: false,
      recurring,
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    
    // Reset form
    setTitle("");
    setDescription("");
    setDueDate("");
    setRecurring(false);
    setDialogOpen(false);
    
    toast({
      title: "Task added",
      description: "Your new task has been created",
    });
  };
  
  const handleToggleComplete = (id: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };
  
  const handleDeleteTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    
    toast({
      title: "Task deleted",
      description: "The task has been removed",
    });
  };
  
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if it's tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise return full date
    return date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const isOverdue = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    return dueDate < now;
  };
  
  const filterTasks = (filter: "all" | "active" | "completed") => {
    switch (filter) {
      case "active":
        return tasks.filter(task => !task.completed);
      case "completed":
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };
  
  // Calculate progress
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;
  const progressPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new task</DialogTitle>
              <DialogDescription>
                Add details for your new task. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details about your task"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due date and time</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={recurring}
                  onCheckedChange={(checked) => setRecurring(checked === true)}
                />
                <Label htmlFor="recurring">Recurring task</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTask}>Save Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Task progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Task Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{completedTasksCount}/{totalTasksCount}</p>
              <p className="text-xs text-muted-foreground">tasks completed</p>
            </div>
            <div className="w-[60px] h-[60px] rounded-full border-8 border-muted flex items-center justify-center">
              <span className="text-lg font-bold">{progressPercentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Task list */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Tasks</CardTitle>
          <CardDescription>Manage your tasks and track your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tasks yet. Click "Add Task" to create your first task.
                </p>
              ) : (
                filterTasks("all").map(task => (
                  <div 
                    key={task.id}
                    className={`flex items-start p-3 rounded-md task-item ${task.completed ? 'bg-muted/30' : 'bg-card'} border`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className={isOverdue(task.dueDate) && !task.completed ? 'text-red-500 font-medium' : ''}>
                          {formatDueDate(task.dueDate)}
                        </span>
                        {task.recurring && (
                          <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded-full text-[10px]">
                            Recurring
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              {filterTasks("active").length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active tasks. All tasks are completed!
                </p>
              ) : (
                filterTasks("active").map(task => (
                  <div 
                    key={task.id}
                    className="flex items-start p-3 rounded-md task-item bg-card border"
                  >
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className={isOverdue(task.dueDate) ? 'text-red-500 font-medium' : ''}>
                          {formatDueDate(task.dueDate)}
                        </span>
                        {task.recurring && (
                          <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded-full text-[10px]">
                            Recurring
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {filterTasks("completed").length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No completed tasks yet.
                </p>
              ) : (
                filterTasks("completed").map(task => (
                  <div 
                    key={task.id}
                    className="flex items-start p-3 rounded-md task-item bg-muted/30 border"
                  >
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium line-through text-muted-foreground">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-through">{task.description}</p>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatDueDate(task.dueDate)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            {completedTasksCount} of {totalTasksCount} tasks completed
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Tasks;
