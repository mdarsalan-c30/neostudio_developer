import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions' as any)
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours."
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-32 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">
            Let's Create Something Extraordinary
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Ready to elevate your digital presence? Connect with our team of experts.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="group hover:shadow-2xl transition-all duration-500 border-border/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground">team.neostudio@gmail.com</p>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-2xl transition-all duration-500 border-border/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Phone</h3>
              <p className="text-muted-foreground">+91 98182 17507</p>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-2xl transition-all duration-500 border-border/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Location</h3>
              <p className="text-muted-foreground">GTB ENCLAVE, DILSHAD GARDEN, NEW DELHI, 110093</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16">
          <Card className="max-w-2xl mx-auto border-border/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-light text-foreground mb-6 text-center">
                Get a Free Consultation
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="bg-background/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="bg-background/50"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
