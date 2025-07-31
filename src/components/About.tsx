import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, TrendingUp } from "lucide-react";

const stats = [
  { icon: Award, value: "150+", label: "Projects Completed" },
  { icon: Users, value: "50+", label: "Premium Clients" },
  { icon: TrendingUp, value: "300%", label: "Average Growth" }
];

const About = () => {
  return (
    <section id="about" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-8">
              Crafted for Excellence
            </h2>
            <p className="text-xl text-muted-foreground mb-8 font-light leading-relaxed">
              We partner with ambitious brands to create digital experiences that captivate audiences and drive unprecedented growth.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Our boutique approach ensures every client receives personalized attention and strategies tailored to their unique market position.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-card/30 backdrop-blur-sm border-border/20">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="text-3xl font-light text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;