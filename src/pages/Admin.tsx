import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, LogOut, Settings, Users, FileText, MessageSquare, Briefcase, HelpCircle } from "lucide-react";
import PortfolioAdmin from "@/components/admin/PortfolioAdmin";
import TestimonialsAdmin from "@/components/admin/TestimonialsAdmin";
import FAQAdmin from "@/components/admin/FAQAdmin";
import ContactAdmin from "@/components/admin/ContactAdmin";

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h1 className="text-2xl font-light mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access the admin panel.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Admin Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">NeoStudio Content Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Users className="h-3 w-3 mr-1" />
                Admin
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Portfolio</p>
                  <p className="text-2xl font-bold text-foreground">Projects</p>
                </div>
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Testimonials</p>
                  <p className="text-2xl font-bold text-foreground">Reviews</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">FAQs</p>
                  <p className="text-2xl font-bold text-foreground">Questions</p>
                </div>
                <HelpCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contacts</p>
                  <p className="text-2xl font-bold text-foreground">Messages</p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <Tabs defaultValue="contacts" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
                <TabsTrigger value="contacts" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Contacts</span>
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Portfolio</span>
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Testimonials</span>
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">FAQ</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contacts">
                <ContactAdmin />
              </TabsContent>

              <TabsContent value="portfolio">
                <PortfolioAdmin />
              </TabsContent>

              <TabsContent value="testimonials">
                <TestimonialsAdmin />
              </TabsContent>

              <TabsContent value="faq">
                <FAQAdmin />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;