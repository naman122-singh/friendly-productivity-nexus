
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

type AuthMode = "login" | "register" | "forgot";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (authMode === "register" && password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      // Here we would connect to Supabase for authentication
      // For now, simulate a successful login
      setTimeout(() => {
        toast({
          title: authMode === "login" ? "Login successful!" : 
                 authMode === "register" ? "Registration successful!" : 
                 "Password reset email sent!",
          description: authMode === "forgot" ? 
                      "Please check your email for password reset instructions." :
                      "Welcome to Productivity Dashboard",
        });
        
        if (authMode !== "forgot") {
          localStorage.setItem("user", JSON.stringify({ email }));
          navigate("/dashboard");
        } else {
          setAuthMode("login");
        }
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Productivity Dashboard</CardTitle>
          <CardDescription>
            {authMode === "login" 
              ? "Sign in to access your dashboard" 
              : authMode === "register" 
              ? "Create an account to get started" 
              : "Enter your email to reset your password"}
          </CardDescription>
        </CardHeader>
        <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as AuthMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleAuth}>
            <TabsContent value="login" className="space-y-4">
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="example@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button 
                      variant="link" 
                      className="px-0 text-xs text-muted-foreground" 
                      type="button"
                      onClick={() => setAuthMode("forgot")}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <span>Don't have an account? </span>
                  <Button 
                    variant="link" 
                    className="p-0" 
                    type="button"
                    onClick={() => setAuthMode("register")}
                  >
                    Sign up
                  </Button>
                </div>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email"
                    type="email" 
                    placeholder="example@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    id="register-password"
                    type="password" 
                    placeholder="••••••••" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password"
                    type="password" 
                    placeholder="••••••••" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <span>Already have an account? </span>
                  <Button 
                    variant="link" 
                    className="p-0" 
                    type="button"
                    onClick={() => setAuthMode("login")}
                  >
                    Sign in
                  </Button>
                </div>
              </CardFooter>
            </TabsContent>
          </form>
          
          <TabsContent value="forgot">
            <form onSubmit={handleAuth}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input 
                    id="reset-email"
                    type="email" 
                    placeholder="example@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
                <Button 
                  variant="link" 
                  className="mt-4 p-0 text-sm" 
                  type="button"
                  onClick={() => setAuthMode("login")}
                >
                  Back to sign in
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
