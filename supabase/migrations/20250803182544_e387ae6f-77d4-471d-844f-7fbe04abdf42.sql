
-- Create blogs table for storing blog posts
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image_url TEXT,
  canonical_url TEXT,
  
  -- Content organization
  category TEXT,
  tags TEXT[],
  reading_time INTEGER, -- in minutes
  view_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

-- Create blog_categories table for better category management
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_blogs_status ON public.blogs(status);
CREATE INDEX idx_blogs_publish_date ON public.blogs(publish_date);
CREATE INDEX idx_blogs_slug ON public.blogs(slug);
CREATE INDEX idx_blogs_category ON public.blogs(category);
CREATE INDEX idx_blogs_featured ON public.blogs(featured);

-- Add trigger for updated_at
CREATE TRIGGER update_blogs_updated_at 
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at 
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blogs
CREATE POLICY "Published blogs are viewable by everyone" 
  ON public.blogs 
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Admins can manage all blogs" 
  ON public.blogs 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for blog_categories
CREATE POLICY "Blog categories are viewable by everyone" 
  ON public.blog_categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage blog categories" 
  ON public.blog_categories 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert some default categories
INSERT INTO public.blog_categories (name, slug, description, color) VALUES
  ('Technology', 'technology', 'Latest technology trends and insights', '#3B82F6'),
  ('Digital Marketing', 'digital-marketing', 'Marketing strategies and tips', '#10B981'),
  ('Web Development', 'web-development', 'Web development tutorials and guides', '#8B5CF6'),
  ('SEO', 'seo', 'Search engine optimization tips', '#F59E0B'),
  ('Business', 'business', 'Business growth and strategies', '#EF4444');
