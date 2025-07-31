import { Card, CardContent } from "@/components/ui/card";
import { Search, Target, TrendingUp, Palette } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "SEO Mastery",
    description: "Dominate search rankings with sophisticated SEO strategies tailored for premium brands."
  },
  {
    icon: Target,
    title: "Precision PPC",
    description: "Maximize ROI with data-driven advertising campaigns that convert prospects into loyal customers."
  },
  {
    icon: TrendingUp,
    title: "Growth Analytics",
    description: "Advanced insights and performance optimization to accelerate your business growth trajectory."
  },
  {
    icon: Palette,
    title: "Brand Strategy",
    description: "Craft compelling brand narratives that resonate with your target audience and drive engagement."
  }
];

const Services = () => {
  return (
    <section id="services" className="py-32 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">
            Our Expertise
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Comprehensive digital solutions designed to elevate your brand and drive measurable results.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-border/20 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;