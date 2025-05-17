
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Chat from "./pages/Chat";
import News from "./pages/News";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          
          <Route path="/dashboard/tasks" element={
            <Layout>
              <Tasks />
            </Layout>
          } />
          
          <Route path="/dashboard/notes" element={
            <Layout>
              <Notes />
            </Layout>
          } />
          
          <Route path="/dashboard/chat" element={
            <Layout>
              <Chat />
            </Layout>
          } />
          
          <Route path="/dashboard/news" element={
            <Layout>
              <News />
            </Layout>
          } />
          
          <Route path="/dashboard/settings" element={
            <Layout>
              <Settings />
            </Layout>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
