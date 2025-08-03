import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Eye, Calendar, Tag, Search } from "lucide-react";

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
  description: string;
  color: string;
}

const BlogAdmin = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    status: 'draft',
    featured: false,
    category: '',
    tags: [] as string[],
    reading_time: 0,
    meta_title: '',
    meta_description: '',
    meta_keywords: [] as string[],
    og_title: '',
    og_description: '',
    og_image_url: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image_url: '',
    canonical_url: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      });
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
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const blogData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        reading_time: calculateReadingTime(formData.content),
        author_id: (await supabase.auth.getUser()).data.user?.id
      };

      if (isEditing && selectedBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', selectedBlog.id);

        if (error) throw error;
        toast({ title: "Success", description: "Blog updated successfully" });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert(blogData);

        if (error) throw error;
        toast({ title: "Success", description: "Blog created successfully" });
      }

      resetForm();
      fetchBlogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save blog",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Blog deleted successfully" });
      fetchBlogs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt || '',
      featured_image_url: blog.featured_image_url || '',
      status: blog.status,
      featured: blog.featured,
      category: blog.category || '',
      tags: blog.tags || [],
      reading_time: blog.reading_time || 0,
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || '',
      meta_keywords: blog.meta_keywords || [],
      og_title: blog.og_title || '',
      og_description: blog.og_description || '',
      og_image_url: blog.og_image_url || '',
      twitter_title: blog.twitter_title || '',
      twitter_description: blog.twitter_description || '',
      twitter_image_url: blog.twitter_image_url || '',
      canonical_url: blog.canonical_url || ''
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image_url: '',
      status: 'draft',
      featured: false,
      category: '',
      tags: [],
      reading_time: 0,
      meta_title: '',
      meta_description: '',
      meta_keywords: [],
      og_title: '',
      og_description: '',
      og_image_url: '',
      twitter_title: '',
      twitter_description: '',
      twitter_image_url: '',
      canonical_url: ''
    });
    setSelectedBlog(null);
    setIsEditing(false);
    setTagInput('');
    setKeywordInput('');
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.meta_keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        meta_keywords: [...prev.meta_keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      meta_keywords: prev.meta_keywords.filter(k => k !== keyword)
    }));
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Button onClick={resetForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Blog Post
        </Button>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Blog Posts</TabsTrigger>
          <TabsTrigger value="editor">
            {isEditing ? 'Edit Post' : 'Create Post'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
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

          {/* Blog List */}
          <div className="grid gap-4">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{blog.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                          {blog.status}
                        </Badge>
                        {blog.featured && <Badge variant="outline">Featured</Badge>}
                        {blog.category && (
                          <Badge variant="outline" style={{ 
                            backgroundColor: categories.find(c => c.slug === blog.category)?.color + '20',
                            borderColor: categories.find(c => c.slug === blog.category)?.color 
                          }}>
                            {blog.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(blog)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(blog.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {blog.view_count} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {blog.reading_time} min read
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO Settings</TabsTrigger>
                <TabsTrigger value="settings">Post Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          title: e.target.value,
                          slug: generateSlug(e.target.value)
                        }));
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="auto-generated-from-title"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the blog post..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your blog post content here..."
                    rows={15}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="featured_image">Featured Image URL</Label>
                  <Input
                    id="featured_image"
                    type="url"
                    value={formData.featured_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                      placeholder="SEO title (60 chars max)"
                      maxLength={60}
                    />
                  </div>
                  <div>
                    <Label htmlFor="canonical_url">Canonical URL</Label>
                    <Input
                      id="canonical_url"
                      type="url"
                      value={formData.canonical_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                      placeholder="https://yourdomain.com/blog/post-slug"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="SEO description (160 chars max)"
                    maxLength={160}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Meta Keywords</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      placeholder="Add keyword"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.meta_keywords.map(keyword => (
                      <Badge key={keyword} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword(keyword)}>
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="og_title">Open Graph Title</Label>
                    <Input
                      id="og_title"
                      value={formData.og_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                      placeholder="Title for social media sharing"
                    />
                  </div>
                  <div>
                    <Label htmlFor="og_image">Open Graph Image</Label>
                    <Input
                      id="og_image"
                      type="url"
                      value={formData.og_image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, og_image_url: e.target.value }))}
                      placeholder="https://example.com/og-image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="og_description">Open Graph Description</Label>
                  <Textarea
                    id="og_description"
                    value={formData.og_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                    placeholder="Description for social media sharing"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="twitter_title">Twitter Title</Label>
                    <Input
                      id="twitter_title"
                      value={formData.twitter_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, twitter_title: e.target.value }))}
                      placeholder="Twitter card title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter_description">Twitter Description</Label>
                    <Input
                      id="twitter_description"
                      value={formData.twitter_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, twitter_description: e.target.value }))}
                      placeholder="Twitter card description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter_image">Twitter Image</Label>
                    <Input
                      id="twitter_image"
                      type="url"
                      value={formData.twitter_image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, twitter_image_url: e.target.value }))}
                      placeholder="Twitter card image URL"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured Post</Label>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit" className="flex-1">
                {isEditing ? 'Update Blog Post' : 'Create Blog Post'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogAdmin;