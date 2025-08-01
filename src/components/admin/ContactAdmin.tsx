import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Trash2, Eye } from "lucide-react";
import { ContactSubmission } from "@/types/database";

const ContactAdmin = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions((data as unknown as ContactSubmission[]) || []);
    } catch (error) {
      toast({
        title: "Error fetching submissions",
        description: "Failed to load contact submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'new' | 'in_progress' | 'resolved') => {
    try {
      const { error } = await supabase
        .from('contact_submissions' as any)
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev =>
        prev.map(sub => sub.id === id ? { ...sub, status } : sub)
      );

      toast({
        title: "Status updated",
        description: "Contact submission status has been updated"
      });
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Failed to update submission status",
        variant: "destructive"
      });
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      setSelectedSubmission(null);

      toast({
        title: "Submission deleted",
        description: "Contact submission has been deleted"
      });
    } catch (error) {
      toast({
        title: "Error deleting submission",
        description: "Failed to delete submission",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading contact submissions...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-light">Contact Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {submissions.filter(s => s.status === 'new').length}
                </div>
                <div className="text-sm text-muted-foreground">New</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-yellow-500">
                  {submissions.filter(s => s.status === 'in_progress').length}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-green-500">
                  {submissions.filter(s => s.status === 'resolved').length}
                </div>
                <div className="text-sm text-muted-foreground">Resolved</div>
              </Card>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.company || '-'}</TableCell>
                      <TableCell>
                        <Select
                          value={submission.status}
                          onValueChange={(value) => updateStatus(submission.id, value as any)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {format(new Date(submission.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteSubmission(submission.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedSubmission && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Message Details
              <Badge className={getStatusColor(selectedSubmission.status)}>
                {selectedSubmission.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedSubmission.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-sm text-muted-foreground">{selectedSubmission.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Company</label>
                  <p className="text-sm text-muted-foreground">{selectedSubmission.company || '-'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <p className="text-sm text-muted-foreground mt-2 p-4 bg-muted/50 rounded-lg">
                  {selectedSubmission.message}
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactAdmin;