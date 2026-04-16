"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/services/api";
import { Image as ImageIcon, ArrowLeft } from "lucide-react";

export default function EditTicketPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;
  const ticketId = params.ticketId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quota: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    const fetchTicket = async () => {
      const eventInfo = await api.getEventById(eventId);
      if (eventInfo) {
        const ticketInfo = eventInfo.tickets.find(t => t.id === ticketId);
        if (ticketInfo) {
          setFormData({
            name: ticketInfo.name,
            price: ticketInfo.price.toString(),
            quota: ticketInfo.quota.toString(),
            startDate: ticketInfo.startDate.slice(0, 16),
            endDate: ticketInfo.endDate.slice(0, 16),
          });
          if (ticketInfo.coverImage) setPreviewImage(ticketInfo.coverImage);
        }
      }
      setIsFetching(false);
    };
    fetchTicket();
  }, [eventId, ticketId]);

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
    
    try {
        await api.updateTicket(eventId, ticketId, {
          name: formData.name,
          price: parseInt(formData.price) || 0,
          quota: parseInt(formData.quota) || 0,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          coverImage: previewImage || undefined
        });
        toast.success("Ticket category updated!");
        router.push(`/dashboard/${eventId}?tab=tickets`);
    } catch {
        toast.error("Failed to update ticket");
    } finally {
        setIsLoading(false);
    }
  };

  if (isFetching) return <div className="p-8 text-center text-muted-foreground">Loading ticket details...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/${eventId}?tab=tickets`)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Ticket</h1>
          <p className="text-muted-foreground">Modify an existing ticket tier for your event.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Input id="price" name="price" type="number" min="0" required value={formData.price} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quota">Quota *</Label>
                  <Input id="quota" name="quota" type="number" min="1" required value={formData.quota} onChange={handleChange} />
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
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
               <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/${eventId}?tab=tickets`)}>Cancel</Button>
               <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Update Ticket"}</Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-4">
           <Label>Live Preview</Label>
           <div className="bg-muted/30 border rounded-xl p-8 flex items-center justify-center min-h-[400px]">
              <div className="w-full max-w-sm bg-background rounded-2xl shadow-lg border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
                 {previewImage ? (
                    <div className="w-full h-32 bg-cover bg-center border-b" style={{ backgroundImage: `url(${previewImage})` }} />
                 ) : (
                    <div className="w-full h-32 bg-primary/10 border-b flex items-center justify-center">
                       <ImageIcon className="w-8 h-8 text-primary/40" />
                    </div>
                 )}
                 <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h3 className="font-bold text-lg">{formData.name || "Ticket Name"}</h3>
                          <p className="text-sm text-muted-foreground mt-1">Available until: {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : "-"}</p>
                       </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-dashed">
                       <div className="text-xl font-bold text-primary">
                          {formData.price ? `Rp ${parseInt(formData.price).toLocaleString('id-ID')}` : "Free / Rp 0"}
                       </div>
                       <Button size="sm">Buy Ticket</Button>
                    </div>
                 </div>
              </div>
           </div>
           <p className="text-xs text-muted-foreground text-center">This is how your ticket will appear to buyers.</p>
        </div>
      </div>
    </div>
  );
}
