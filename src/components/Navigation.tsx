import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold text-foreground">
            NeoStudio<span className="text-muted-foreground">.</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="#portfolio" className="text-foreground hover:text-primary transition-colors">
              Portfolio
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">
              Testimonials
            </a>
            <a href="/blog" className="text-foreground hover:text-primary transition-colors">Blog</a>
            <a href="#faq" className="text-foreground hover:text-primary transition-colors">
              FAQ
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>
          
{/*           <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href="/admin">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {user.email}
                </Button>
              </div>
            ) : (
              <Button variant="luxury" asChild>
                <a href="/auth">Login</a>
              </Button>
            )}
          </div> */}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/20">
            <div className="flex flex-col space-y-2 pt-4">
              <a href="#services" className="block px-3 py-2 text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Services
              </a>
              <a href="#portfolio" className="block px-3 py-2 text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Portfolio
              </a>
              <a href="#about" className="block px-3 py-2 text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                About
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Testimonials
              </a>
              <a href="#faq" className="block px-3 py-2 text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                FAQ
              </a>
              <a href="#contact" className="block px-3 py-2 text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Contact
              </a>
              
{/*               <div className="px-3 py-4 border-t border-border/20 mt-4">
                {user ? (
                  <div className="space-y-2">
                    {isAdmin && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </a>
                      </Button>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Logged in as {user.email}
                    </div>
                  </div>
                ) : (
                  <Button variant="luxury" className="w-full" asChild>
                    <a href="/auth">Login</a>
                  </Button>
                )}
              </div> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
