import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/80" />
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-light text-foreground mb-6 leading-tight">
          Elevate Your
          <span className="block font-medium">Digital Presence</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          Premium digital marketing solutions for discerning brands seeking exceptional growth and market leadership.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="luxury" size="lg" className="text-lg px-8 py-4">
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button variant="minimal" size="lg" className="text-lg px-8 py-4">
            View Our Work
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;