-- Create portfolio table
CREATE TABLE public.portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  category TEXT NOT NULL,
  technologies TEXT[],
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_company TEXT,
  client_position TEXT,
  testimonial TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create FAQs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Portfolio is viewable by everyone" 
ON public.portfolio 
FOR SELECT 
USING (true);

CREATE POLICY "Testimonials are viewable by everyone" 
ON public.testimonials 
FOR SELECT 
USING (true);

CREATE POLICY "FAQs are viewable by everyone" 
ON public.faqs 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_portfolio_updated_at
  BEFORE UPDATE ON public.portfolio
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.portfolio (title, description, image_url, category, technologies, featured, sort_order) VALUES
('E-commerce Platform', 'Complete digital transformation for luxury retail brand', '/api/placeholder/600/400', 'Web Development', ARRAY['React', 'Node.js', 'Stripe'], true, 1),
('Brand Identity Campaign', 'Full rebrand and marketing strategy implementation', '/api/placeholder/600/400', 'Branding', ARRAY['Design', 'Strategy', 'SEO'], true, 2),
('Mobile App Development', 'iOS and Android app for premium fitness brand', '/api/placeholder/600/400', 'Mobile', ARRAY['React Native', 'Firebase'], false, 3);

INSERT INTO public.testimonials (client_name, client_company, client_position, testimonial, rating, featured, sort_order) VALUES
('Sarah Johnson', 'Luxury Brands Inc.', 'CEO', 'Elite delivered exceptional results that exceeded our expectations. Their strategic approach transformed our digital presence.', 5, true, 1),
('Michael Chen', 'Tech Innovations', 'Marketing Director', 'Outstanding creativity and professionalism. The ROI from their campaigns has been incredible.', 5, true, 2),
('Emma Williams', 'Premium Services Co.', 'Founder', 'Their attention to detail and premium service quality makes them our go-to marketing partner.', 5, false, 3);

INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
('What services do you offer?', 'We provide comprehensive digital marketing solutions including SEO, PPC advertising, brand strategy, and growth analytics for premium brands.', 'Services', 1),
('How long does a typical project take?', 'Project timelines vary based on scope and complexity. Most projects range from 4-12 weeks, with ongoing optimization and support available.', 'Process', 2),
('Do you work with small businesses?', 'We specialize in working with established brands and growing businesses that are ready to invest in premium marketing solutions.', 'Pricing', 3),
('What makes your approach different?', 'Our boutique approach ensures personalized attention, sophisticated strategies, and measurable results tailored to each client''s unique market position.', 'Approach', 4);