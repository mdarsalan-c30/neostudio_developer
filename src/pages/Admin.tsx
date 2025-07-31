import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PortfolioAdmin from "@/components/admin/PortfolioAdmin";
import TestimonialsAdmin from "@/components/admin/TestimonialsAdmin";
import FAQAdmin from "@/components/admin/FAQAdmin";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-foreground mb-2">
            Super Admin Panel
          </h1>
          <p className="text-muted-foreground font-light">
            Manage all website content from this centralized dashboard.
          </p>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-96">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <PortfolioAdmin />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsAdmin />
          </TabsContent>

          <TabsContent value="faq">
            <FAQAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;