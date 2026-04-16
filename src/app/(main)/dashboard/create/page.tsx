"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/forms/RichTextEditor";
import { CustomFieldBuilder } from "@/components/forms/CustomFieldBuilder";
import { toast } from "sonner";
import { api } from "@/services/api";
import { CustomField } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, ImageIcon } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Controlled fields for live preview
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const capacityNum = parseInt(capacity) || 0;
    
    if (!name || !location || !startDate || !endDate || capacityNum < 1) {
       toast.error("Please fill in all mandatory fields correctly.");
       setIsLoading(false);
       return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
       toast.error("End Date must be after Start Date.");
       setIsLoading(false);
       return;
    }
    
    try {
        const newEvent = await api.createEvent({
          name,
          location,
          description,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          capacity: capacityNum,
          bannerUrl: "",
          customFields
        });
        toast.success("Event created successfully as Draft!");
        router.push(`/dashboard/${newEvent.id}`);
    } catch {
        toast.error("Failed to create event. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
        <p className="text-muted-foreground">Fill in the details below to create a new event and see it live.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Kiri: Form Detail Event */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Basic information about your event.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="E.g. Tech Conference 2026" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <RichTextEditor value={description} onChange={setDescription} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input 
                      id="startDate" 
                      name="startDate" 
                      type="datetime-local" 
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input 
                      id="endDate" 
                      name="endDate" 
                      type="datetime-local" 
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      placeholder="E.g. JCC Senayan or Zoom Link" 
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Input 
                      id="capacity" 
                      name="capacity" 
                      type="number" 
                      min="1" 
                      placeholder="E.g. 500" 
                      value={capacity}
                      onChange={e => setCapacity(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="banner">Event Banner (Optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                      <Input id="banner" name="banner" type="file" accept="image/*" className="hidden" />
                      <Label htmlFor="banner" className="cursor-pointer flex flex-col items-center">
                         <span className="text-sm font-medium text-foreground">Click to upload banner</span>
                         <span className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 5MB)</span>
                      </Label>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-dashed">
                    <div>
                       <Label className="text-base font-semibold">Custom Questions (Optional)</Label>
                       <p className="text-sm text-muted-foreground mb-4">Add custom fields for attendees to fill during registration.</p>
                    </div>
                    <CustomFieldBuilder fields={customFields} onChange={setCustomFields} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4 bg-muted/20">
                 <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                 <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Draft"}</Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Kanan: Live Preview Loket Style */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-between">
               Live Preview
               <Badge className="bg-primary/10 text-primary shadow-none border-0 hover:bg-primary/20 scale-90">Draft</Badge>
            </h3>
            <div className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl bg-slate-50 flex flex-col scale-[0.95] origin-top">
               
               {/* Mini Banner Header */}
               <div className="bg-slate-900 text-white relative flex flex-col p-5">
                  <div className="absolute inset-0 bg-primary/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  
                  <div className="w-full aspect-[21/9] bg-slate-800 rounded-xl relative z-10 border border-white/10 mb-4 overflow-hidden flex items-center justify-center">
                     <ImageIcon className="w-6 h-6 opacity-20" />
                  </div>
                  
                  <div className="relative z-10 space-y-3">
                     <h3 className="font-bold text-lg leading-tight line-clamp-2">
                       {name || "Event Title Preview"}
                     </h3>
                     <div className="space-y-1.5 text-slate-300">
                        <div className="flex items-start gap-2 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 shrink-0 text-primary-300" />
                          <span className="line-clamp-1">{startDate ? new Date(startDate).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }) : "Date missing"}</span>
                        </div>
                        <div className="flex items-start gap-2 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-primary-300" />
                          <span className="line-clamp-1">{location || "Location undefined"}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Mini Body */}
               <div className="p-5 flex flex-col gap-4">
                  
                  {/* Mini Tabs */}
                  <div className="flex gap-4 border-b border-slate-200 pb-2">
                     <div className="text-[10px] font-bold text-primary border-b-2 border-primary pb-2 -mb-[9px]">Deskripsi</div>
                     <div className="text-[10px] font-semibold text-slate-400">Tiket</div>
                  </div>

                  {/* Mini Deskripsi */}
                  <div className="space-y-2">
                     <div className="h-2 w-full bg-slate-200 rounded-full" />
                     <div className="h-2 w-5/6 bg-slate-200 rounded-full" />
                     <div className="h-2 w-4/6 bg-slate-200 rounded-full" />
                  </div>

                  {/* Mini Tiket Row */}
                  <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col gap-2 mt-2">
                     <div className="flex justify-between items-center">
                        <div className="font-bold text-slate-900 text-xs">Preview Tiket</div>
                        <div className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold uppercase">{capacity || 0} left</div>
                     </div>
                     <div className="flex justify-between items-end mt-1 border-t border-slate-50 pt-2">
                        <div className="font-bold text-slate-900 text-sm">Gratis</div>
                        <div className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1.5 rounded-lg border border-primary/20">Beli Tiket</div>
                     </div>
                  </div>

               </div>
               
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
