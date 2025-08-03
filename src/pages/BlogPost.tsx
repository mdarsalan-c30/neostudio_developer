import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye, ArrowLeft, Tag, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  status: string;
  featured: boolean;
  publish_date: string;
  category: string;
  tags: string[];
  view_count: number;
  reading_time: number;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  og_title: string;
  og_description: string;
  og_image_url: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image_url: string;
  canonical_url: string;
  created_at: string;
  updated_at: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchBlog();
      fetchCategories();
    }
  }, [slug]);

  useEffect(() => {
    if (blog) {
      fetchRelatedBlogs();
      incrementViewCount();
      updatePageMeta();
    }
  }, [blog]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Blog post not found');
        } else {
          throw error;
        }
        return;
      }

      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchRelatedBlogs = async () => {
    if (!blog) return;

    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .neq('id', blog.id)
        .or(`category.eq.${blog.category},tags.cs.{${blog.tags?.join(',') || ''}}`)
        .limit(3);

      if (error) throw error;
      setRelatedBlogs(data || []);
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const incrementViewCount = async () => {
    if (!blog) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .update({ view_count: blog.view_count + 1 })
        .eq('id', blog.id);

      if (error) console.error('Error incrementing view count:', error);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const updatePageMeta = () => {
    if (!blog) return;

    // Update page title
    document.title = blog.meta_title || blog.title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', blog.meta_description || blog.excerpt || '');
    }

    // Update canonical URL
    if (blog.canonical_url) {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', blog.canonical_url);
      } else {
        const newCanonical = document.createElement('link');
        newCanonical.rel = 'canonical';
        newCanonical.href = blog.canonical_url;
        document.head.appendChild(newCanonical);
      }
    }

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', blog.og_title || blog.title);
    updateMetaTag('property', 'og:description', blog.og_description || blog.excerpt || '');
    updateMetaTag('property', 'og:image', blog.og_image_url || blog.featured_image_url || '');
    updateMetaTag('property', 'og:type', 'article');

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', blog.twitter_title || blog.title);
    updateMetaTag('name', 'twitter:description', blog.twitter_description || blog.excerpt || '');
    updateMetaTag('name', 'twitter:image', blog.twitter_image_url || blog.featured_image_url || '');

    // Update keywords
    if (blog.meta_keywords && blog.meta_keywords.length > 0) {
      updateMetaTag('name', 'keywords', blog.meta_keywords.join(', '));
    }
  };

  const updateMetaTag = (attribute: string, name: string, content: string) => {
    if (!content) return;

    let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);
    if (metaTag) {
      metaTag.setAttribute('content', content);
    } else {
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, name);
      metaTag.setAttribute('content', content);
      document.head.appendChild(metaTag);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = blog?.title || '';

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "The blog post link has been copied to your clipboard.",
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded-lg mb-8"></div>
              <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || "The blog post you're looking for doesn't exist or has been removed."}
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Article Header */}
      <article className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/blog" className="hover:text-primary">Blog</Link>
              <span>/</span>
              <span>{blog.title}</span>
            </nav>

            {/* Featured Image */}
            {blog.featured_image_url && (
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                <img
                  src={blog.featured_image_url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {blog.category && (
                <Badge 
                  variant="outline"
                  style={{ 
                    backgroundColor: categories.find(c => c.slug === blog.category)?.color + '20',
                    borderColor: categories.find(c => c.slug === blog.category)?.color 
                  }}
                >
                  {categories.find(c => c.slug === blog.category)?.name || blog.category}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(blog.publish_date)}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {blog.reading_time} min read
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                {blog.view_count} views
              </div>
            </div>

            {/* Article Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{blog.title}</h1>

            {/* Article Excerpt */}
            {blog.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{blog.excerpt}</p>
            )}

            {/* Share Button */}
            <div className="flex justify-between items-center mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                {blog.tags && blog.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              {blog.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            {/* Back to Blog */}
            <div className="flex justify-center mb-16">
              <Button asChild variant="outline">
                <Link to="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to All Posts
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <Card key={relatedBlog.id} className="group hover:shadow-lg transition-shadow">
                    {relatedBlog.featured_image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relatedBlog.featured_image_url}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {relatedBlog.category && (
                          <Badge 
                            variant="outline" 
                            style={{ 
                              backgroundColor: categories.find(c => c.slug === relatedBlog.category)?.color + '20',
                              borderColor: categories.find(c => c.slug === relatedBlog.category)?.color 
                            }}
                          >
                            {categories.find(c => c.slug === relatedBlog.category)?.name || relatedBlog.category}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        <Link to={`/blog/${relatedBlog.slug}`}>
                          {relatedBlog.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{relatedBlog.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(relatedBlog.publish_date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {relatedBlog.reading_time} min
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPost;