import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  client_name: string;
  client_company: string;
  client_position: string;
  testimonial: string;
  avatar_url: string;
  rating: number;
  featured: boolean;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-32 bg-secondary/10">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">Loading testimonials...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-32 bg-secondary/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">
            Client Success Stories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Hear from our clients about their transformative experiences with Elite.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card/50 backdrop-blur-sm border-border/20 hover:shadow-2xl transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote className="text-muted-foreground font-light leading-relaxed mb-6 italic">
                  "{testimonial.testimonial}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">
                      {testimonial.client_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {testimonial.client_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.client_position} • {testimonial.client_company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;