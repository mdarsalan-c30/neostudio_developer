import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
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
              <p className="text-muted-foreground">hello@elitedigital.com</p>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-2xl transition-all duration-500 border-border/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Phone</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-2xl transition-all duration-500 border-border/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Location</h3>
              <p className="text-muted-foreground">New York, NY</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-16">
          <Button variant="luxury" size="lg" className="text-lg px-12 py-4">
            Schedule Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Contact;