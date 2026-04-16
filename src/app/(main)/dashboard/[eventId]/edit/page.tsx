"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/forms/RichTextEditor";
import { CustomFieldBuilder } from "@/components/forms/CustomFieldBuilder";
import { toast } from "sonner";
import { api } from "@/services/api";
import { EventData, CustomField } from "@/types";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const [description, setDescription] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await api.getEventById(eventId);
      if (data) {
        setEvent(data);
        setDescription(data.description);
        setCustomFields(data.customFields || []);
      }
      setIsFetching(false);
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const location = fd.get("location") as string;
    const startDateRaw = fd.get("startDate") as string;
    const endDateRaw = fd.get("endDate") as string;
    const capacity = parseInt(fd.get("capacity") as string) || 0;
    
    if (!name || !location || !startDateRaw || !endDateRaw || capacity < 1) {
       toast.error("Please fill in all mandatory fields correctly.");
       setIsLoading(false);
       return;
    }

    const start = new Date(startDateRaw);
    const end = new Date(endDateRaw);
    
    if (start >= end) {
       toast.error("End Date must be after Start Date.");
       setIsLoading(false);
       return;
    }
    
    try {
        await api.updateEvent(eventId, {
          name,
          location,
          description,
          startDate: new Date(startDateRaw).toISOString(),
          endDate: new Date(endDateRaw).toISOString(),
          capacity,
          customFields
        });
        toast.success("Event updated successfully!");
        router.push(`/dashboard/${eventId}`);
    } catch {
        toast.error("Failed to update event");
    } finally {
        setIsLoading(false);
    }
  };

  if (isFetching) return <div className="p-8 text-center text-muted-foreground">Loading event data...</div>;
  if (!event) return <div className="p-8 text-center text-destructive">Event not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
        <p className="text-muted-foreground">Update your event details.</p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Modify the information about your event.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input id="name" name="name" defaultValue={event.name} required />
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor value={description} onChange={setDescription} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input id="startDate" name="startDate" type="datetime-local" defaultValue={event.startDate.slice(0, 16)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input id="endDate" name="endDate" type="datetime-local" defaultValue={event.endDate.slice(0, 16)} required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" name="location" defaultValue={event.location} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input id="capacity" name="capacity" type="number" min="1" defaultValue={event.capacity} required />
              </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="banner">Event Banner (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                  <Input id="banner" name="banner" type="file" accept="image/*" className="hidden" />
                  <Label htmlFor="banner" className="cursor-pointer flex flex-col items-center">
                     <span className="text-sm font-medium text-foreground">Click to upload new banner</span>
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
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
             <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
             <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
