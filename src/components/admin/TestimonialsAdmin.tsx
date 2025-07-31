import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, Save, X, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: string;
  client_name: string;
  client_company: string;
  client_position: string;
  testimonial: string;
  avatar_url: string;
  rating: number;
  featured: boolean;
  sort_order: number;
}

const TestimonialsAdmin = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    client_name: "",
    client_company: "",
    client_position: "",
    testimonial: "",
    avatar_url: "",
    rating: 5,
    featured: false,
    sort_order: 0
  });

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
      setItems(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: "Success", description: "Testimonial updated" });
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert(formData);

        if (error) throw error;
        toast({ title: "Success", description: "Testimonial created" });
      }

      resetForm();
      fetchTestimonials();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: Testimonial) => {
    setFormData({
      client_name: item.client_name,
      client_company: item.client_company,
      client_position: item.client_position,
      testimonial: item.testimonial,
      avatar_url: item.avatar_url,
      rating: item.rating,
      featured: item.featured,
      sort_order: item.sort_order
    });
    setEditingId(item.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Testimonial deleted" });
      fetchTestimonials();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: "",
      client_company: "",
      client_position: "",
      testimonial: "",
      avatar_url: "",
      rating: 5,
      featured: false,
      sort_order: 0
    });
    setEditingId(null);
    setShowAddForm(false);
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
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium text-foreground">Testimonials Management</h2>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Testimonial
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'Add'} Testimonial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_name">Client Name</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="client_company">Company</Label>
                <Input
                  id="client_company"
                  value={formData.client_company}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_company: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_position">Position</Label>
                <Input
                  id="client_position"
                  value={formData.client_position}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_position: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="testimonial">Testimonial</Label>
              <Textarea
                id="testimonial"
                value={formData.testimonial}
                onChange={(e) => setFormData(prev => ({ ...prev, testimonial: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) || 5 }))}
                />
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-foreground">{item.client_name}</h3>
                    <Badge variant="secondary">{item.client_company}</Badge>
                    {item.featured && <Badge variant="default">Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.client_position}</p>
                  <div className="flex mb-2">
                    {renderStars(item.rating)}
                  </div>
                  <p className="text-muted-foreground mb-2 italic">"{item.testimonial}"</p>
                  <p className="text-xs text-muted-foreground">Sort Order: {item.sort_order}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsAdmin;