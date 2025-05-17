
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Tag, Trash, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<"all" | "title" | "content" | "tags">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Example notes
      const exampleNotes: Note[] = [
        {
          id: 1,
          title: "Project Ideas",
          content: "1. Mobile app for task tracking\n2. Blog platform with AI content suggestions\n3. Smart home dashboard with IoT integration",
          tags: ["ideas", "projects", "development"],
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: "Meeting Notes",
          content: "- Discussed project timeline\n- Assigned tasks to team members\n- Next meeting scheduled for Friday",
          tags: ["meeting", "work"],
          createdAt: new Date().toISOString()
        },
      ];
      setNotes(exampleNotes);
      localStorage.setItem("notes", JSON.stringify(exampleNotes));
    }
  }, []);
  
  const saveNotesToStorage = (updatedNotes: Note[]) => {
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };
  
  const handleAddNote = () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Note title cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const newNote: Note = {
      id: Date.now(),
      title,
      content,
      tags,
      createdAt: new Date().toISOString()
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    
    // Reset form
    setTitle("");
    setContent("");
    setTags([]);
    setDialogOpen(false);
    
    toast({
      title: "Note created",
      description: "Your new note has been saved",
    });
  };
  
  const handleDeleteNote = (id: number) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    
    toast({
      title: "Note deleted",
      description: "The note has been removed",
    });
  };
  
  const handleAddTag = () => {
    if (!currentTag.trim()) return;
    
    if (!tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
    }
    
    setCurrentTag("");
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    
    switch (searchFilter) {
      case "title":
        return note.title.toLowerCase().includes(query);
      case "content":
        return note.content.toLowerCase().includes(query);
      case "tags":
        return note.tags.some(tag => tag.toLowerCase().includes(query));
      default:
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
  });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Notes</h1>
        <div className="flex items-center w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
                <DialogDescription>
                  Add title, content and tags for your note.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your note here..."
                    className="min-h-[150px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="tags"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add tag and press Enter"
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map(tag => (
                        <div 
                          key={tag} 
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1 text-sm"
                        >
                          <Tag className="h-3 w-3" />
                          <span>{tag}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent hover:text-destructive"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {tag} tag</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddNote}>Save Note</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Notes</TabsTrigger>
          <TabsTrigger value="title">Search by Title</TabsTrigger>
          <TabsTrigger value="content">Search by Content</TabsTrigger>
          <TabsTrigger value="tags">Search by Tags</TabsTrigger>
        </TabsList>
        {["all", "title", "content", "tags"].map((filter) => (
          <TabsContent 
            key={filter} 
            value={filter}
            className="mt-6"
            onSelect={() => setSearchFilter(filter as "all" | "title" | "content" | "tags")}
          >
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg">No notes found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search terms." : "Create your first note to get started."}
                </p>
                {!searchQuery && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setDialogOpen(true)}>Create Note</Button>
                    </DialogTrigger>
                  </Dialog>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                  <Card key={note.id} className="overflow-hidden flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{note.title}</CardTitle>
                      <CardDescription>{formatDate(note.createdAt)}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="whitespace-pre-line text-sm">
                        {note.content.length > 150
                          ? `${note.content.slice(0, 150)}...`
                          : note.content}
                      </p>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-4 pt-2">
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map(tag => (
                            <span 
                              key={tag}
                              className="bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-end w-full">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Notes;
