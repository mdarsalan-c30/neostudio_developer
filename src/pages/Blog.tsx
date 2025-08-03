import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Eye, Search, Tag } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  status: string;
  featured: boolean;
  publish_date: string;
  category: string;
  tags: string[];
  view_count: number;
  reading_time: number;
  created_at: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false });

      if (error) throw error;
      
      const allBlogs = data || [];
      setBlogs(allBlogs);
      setFeaturedBlogs(allBlogs.filter(blog => blog.featured).slice(0, 3));
    } catch (error) {
      console.error('Error fetching blogs:', error);
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

  const incrementViewCount = async (blogId: string) => {
    try {
      // First get current view count
      const { data: currentBlog } = await supabase
        .from('blogs')
        .select('view_count')
        .eq('id', blogId)
        .single();
      
      if (currentBlog) {
        const { error } = await supabase
          .from('blogs')
          .update({ view_count: currentBlog.view_count + 1 })
          .eq('id', blogId);
        if (error) console.error('Error incrementing view count:', error);
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter;
    
    return matchesSearch && matchesCategory && !blog.featured;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Blog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover insights, tips, and stories from our team. Stay updated with the latest trends in technology, design, and business.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Posts */}
        {featuredBlogs.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBlogs.map((blog) => (
                <Card key={blog.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {blog.featured_image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.featured_image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary/90 text-primary-foreground">Featured</Badge>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
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
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      <Link 
                        to={`/blog/${blog.slug}`}
                        onClick={() => incrementViewCount(blog.id)}
                      >
                        {blog.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(blog.publish_date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {blog.reading_time} min
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {blog.view_count}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <section>
          <h2 className="text-3xl font-bold mb-8">All Posts</h2>
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <Card key={blog.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {blog.featured_image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.featured_image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
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
                      {blog.tags && blog.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      <Link 
                        to={`/blog/${blog.slug}`}
                        onClick={() => incrementViewCount(blog.id)}
                      >
                        {blog.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(blog.publish_date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {blog.reading_time} min
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {blog.view_count}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;