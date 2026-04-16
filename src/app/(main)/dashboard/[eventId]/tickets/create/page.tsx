"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/services/api";
import { Image as ImageIcon, ArrowLeft, Calendar, Ticket } from "lucide-react";

export default function CreateTicketPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quota: "",
    startDate: "",
    endDate: ""
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("Image too large");
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const priceNum = parseInt(formData.price) || 0;
    const quotaNum = parseInt(formData.quota) || 0;

    if (!formData.name || !formData.startDate || !formData.endDate || quotaNum < 1 || priceNum < 0) {
       toast.error("Please fill in all mandatory fields correctly.");
       setIsLoading(false);
       return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (start >= end) {
       toast.error("End Date must be after Start Date.");
       setIsLoading(false);
       return;
    }
    
    try {
        await api.createTicket(eventId, {
          name: formData.name,
          price: priceNum,
          quota: quotaNum,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          coverImage: previewImage || undefined
        });
        toast.success("Ticket category created!");
        router.push(`/dashboard/${eventId}?tab=tickets`);
    } catch {
        toast.error("Failed to create ticket");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/${eventId}?tab=tickets`)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Ticket</h1>
          <p className="text-muted-foreground">Add a new ticket tier for your event and see it live.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Kiri: Form Detail Ticket */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
                <CardDescription>Setup availability and pricing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="image">Cover Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Input id="image" name="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <Label htmlFor="image" className="cursor-pointer flex flex-col items-center text-center w-full">
                       <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                       <span className="text-sm font-medium">Upload custom ticket artwork</span>
                       <span className="text-xs text-muted-foreground mt-1">PNG, JPG, max 5MB. Aspect ratio 3:1 recommended.</span>
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Ticket Name *</Label>
                  <Input id="name" name="name" placeholder="e.g. Early Bird" required value={formData.name} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (Rp) *</Label>
                    <Input id="price" name="price" type="number" min="0" placeholder="e.g. 500000" required value={formData.price} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quota">Quota *</Label>
                    <Input id="quota" name="quota" type="number" min="1" placeholder="e.g. 100" required value={formData.quota} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Availability Start *</Label>
                    <Input id="startDate" name="startDate" type="datetime-local" required value={formData.startDate} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Availability End *</Label>
                    <Input id="endDate" name="endDate" type="datetime-local" required value={formData.endDate} onChange={handleChange} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4 bg-muted/20">
                 <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/${eventId}?tab=tickets`)}>Cancel</Button>
                 <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Create Ticket"}</Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Kanan: Live Preview Compact & Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="overflow-hidden border-2 border-primary/10 shadow-stripe hover:shadow-stripe-hover transition-all">
               <div className="relative">
                 {previewImage ? (
                    <div className="w-full h-32 bg-cover bg-center border-b" style={{ backgroundImage: `url(${previewImage})` }} />
                 ) : (
                    <div className="w-full h-32 bg-muted/60 relative flex flex-col items-center justify-center text-muted-foreground border-b border-primary/5">
                       <ImageIcon className="w-8 h-8 opacity-20 mb-2" />
                       <span className="text-xs font-medium uppercase tracking-wider">Ticket Art Preview</span>
                    </div>
                 )}
                 <div className="absolute top-4 right-4">
                    <Badge className="bg-background text-foreground shadow-sm">Ticket Preview</Badge>
                 </div>
               </div>
               
               <CardContent className="pt-6 space-y-5">
                 <h3 className="font-bold text-xl leading-tight line-clamp-2">
                    {formData.name || "Ticket Name Preview"}
                 </h3>
                 
                 <div className="space-y-3">
                    <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border">
                       <span className="text-sm text-muted-foreground font-medium">Price</span>
                       <span className="text-lg font-bold text-primary">
                          {formData.price ? `Rp ${parseInt(formData.price).toLocaleString('id-ID')}` : "Free / Rp 0"}
                       </span>
                    </div>

                    <div className="flex items-start gap-3 text-sm text-card-foreground">
                      <div className="bg-primary/10 p-2 rounded-md shrink-0">
                        <Ticket className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium mt-1.5">{formData.quota ? `${formData.quota} Tickets Available` : "Quota undefined"}</span>
                    </div>

                    <div className="flex items-start gap-3 text-sm text-card-foreground">
                      <div className="bg-primary/10 p-2 rounded-md shrink-0">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex flex-col mt-0.5">
                         <span className="font-medium">Sales End</span>
                         <span className="text-muted-foreground text-xs">{formData.endDate ? new Date(formData.endDate).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : "Undefined"}</span>
                      </div>
                    </div>
                 </div>
               </CardContent>
               <div className="p-6 pt-0 mt-2">
                  <Button className="w-full pointer-events-none" variant="default">Buy Now Placeholder</Button>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
