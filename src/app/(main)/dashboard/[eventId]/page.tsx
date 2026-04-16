"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import { EventData, Attendee } from "@/types";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { ArrowLeft, Ticket, Users, DollarSign, Plus, Download } from "lucide-react";
import { toast } from "sonner";

export default function EventDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [event, setEvent] = useState<EventData | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const defaultTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    const loadData = async () => {
      const eventId = params.eventId as string;
      const [eventData, attendeesData] = await Promise.all([
        api.getEventById(eventId),
        api.getAttendees(eventId)
      ]);
      setEvent(eventData);
      setAttendees(attendeesData);
      setIsLoading(false);
    };
    loadData();
  }, [params.eventId]);

  const handlePublish = async () => {
    if (!event) return;
    await api.updateEventStatus(event.id, 'published');
    setEvent({ ...event, status: 'published' });
    toast.success("Event has been published!");
  };

  if (isLoading) return <div className="p-8 text-center">Loading event details...</div>;
  if (!event) return <div className="p-8 text-center text-destructive">Event not found.</div>;

  const totalRevenue = event.tickets.reduce((acc, tk) => acc + (tk.price * tk.sold), 0);
  const totalSold = event.tickets.reduce((acc, tk) => acc + tk.sold, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
            <Badge variant={event.status === 'published' ? 'default' : 'secondary'} className="capitalize">
              {event.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {new Date(event.startDate).toLocaleDateString()} &mdash; {event.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/event/${event.id}`} target="_blank" rel="noreferrer" className="block">
            <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"><Ticket className="w-4 h-4 mr-2" /> Preview Public Page</Button>
          </a>
          {event.status === 'draft' && (
            <Button onClick={handlePublish}>Publish Event</Button>
          )}
          <Button variant="secondary" onClick={() => router.push(`/dashboard/${event.id}/edit`)}>Edit</Button>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <DollarSign className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                <p className="text-xs text-muted-foreground mt-1">+20.1% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Ticket className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSold} <span className="text-sm font-normal text-muted-foreground">/ {event.capacity}</span></div>
                <p className="text-xs text-muted-foreground mt-1 text-green-600">On track to sell out!</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground mt-1 justify-between flex">
                  Conversion Rate: <span>{(totalSold / 1245 * 100).toFixed(1)}%</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Over Time</CardTitle>
              <CardDescription>Ticket sales revenue over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <div className="flex justify-between items-center">
             <div>
                <h3 className="text-lg font-semibold">Ticket Categories</h3>
                <p className="text-sm text-muted-foreground">Manage your ticket tiers and pricing.</p>
             </div>
             <Button onClick={() => router.push(`/dashboard/${event.id}/tickets/create`)}>
                <Plus className="w-4 h-4 mr-2" /> Add Ticket
             </Button>
          </div>
          
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sold / Quota</TableHead>
                  <TableHead>Sale Period</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No tickets created yet. Add one to start selling.
                    </TableCell>
                  </TableRow>
                ) : event.tickets.map(tk => (
                  <TableRow key={tk.id}>
                    <TableCell className="font-medium">{tk.name}</TableCell>
                    <TableCell>Rp {tk.price.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden max-w-[100px]">
                            <div className="bg-primary h-full" style={{ width: `${(tk.sold/tk.quota)*100}%` }} />
                        </div>
                        <span className="text-xs">{tk.sold}/{tk.quota}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground text-xs">
                      {new Date(tk.startDate).toLocaleDateString()} - {new Date(tk.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/${event.id}/tickets/${tk.id}/edit`)}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={async () => {
                           if(window.confirm('Delete ticket?')) {
                              await api.deleteTicket(event.id, tk.id);
                              setEvent({...event, tickets: event.tickets.filter(t => t.id !== tk.id)});
                           }
                        }}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="attendees" className="space-y-6">
          <div className="flex justify-between items-center">
             <div>
                <h3 className="text-lg font-semibold">Attendees List</h3>
                <p className="text-sm text-muted-foreground">View and manage registered participants.</p>
             </div>
             <div className="flex gap-2 items-center">
                <Button variant="secondary" onClick={async () => {
                    if (event.tickets.length === 0) return toast.error("Create a ticket first!");
                    const tkId = event.tickets[0].id;
                    const newAtt = await api.simulatePurchase(event.id, tkId);
                    setAttendees([newAtt, ...attendees]);
                    toast.success("Simulated user joined!");
                }}>
                   Simulate Registration
                </Button>
                <Input placeholder="Search name or email..." className="w-64" />
                <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
             </div>
          </div>
          
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Purchase Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.length === 0 ? (
                   <TableRow>
                   <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                     No attendees yet.
                   </TableCell>
                 </TableRow>
                ) : attendees.map(att => (
                   <TableRow key={att.id}>
                     <TableCell className="font-medium">{att.name}</TableCell>
                     <TableCell>{att.email}</TableCell>
                     <TableCell>{event.tickets.find(t => t.id === att.ticketId)?.name || att.ticketId}</TableCell>
                     <TableCell>
                       <Badge variant={att.status === 'paid' ? 'default' : 'secondary'} className="bg-green-500/10 text-green-600 hover:bg-green-500/20 shadow-none border-0">
                         {att.status}
                       </Badge>
                     </TableCell>
                     <TableCell className="text-muted-foreground text-sm">{new Date(att.purchaseDate).toLocaleString()}</TableCell>
                   </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
             <CardHeader>
               <CardTitle>Danger Zone</CardTitle>
               <CardDescription>Irreversible actions for your event.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex justify-between items-center border p-4 rounded-lg border-destructive/20 bg-destructive/5">
                 <div>
                   <h4 className="font-semibold text-destructive">Close Event</h4>
                   <p className="text-sm text-muted-foreground">Prevent any further ticket sales. Status will be marked as Closed.</p>
                 </div>
                 <Button variant="destructive" onClick={async () => {
                    if(window.confirm('Close this event?')) {
                      await api.updateEventStatus(event.id, 'closed');
                      setEvent({...event, status: 'closed'});
                    }
                 }}>Close Event</Button>
               </div>
               
               <div className="flex justify-between items-center border p-4 rounded-lg border-destructive/20 bg-destructive/10">
                 <div>
                   <h4 className="font-semibold text-destructive">Archive (Delete) Event</h4>
                   <p className="text-sm text-muted-foreground">Soft delete this event from your active dashboard.</p>
                 </div>
                 <Button variant="destructive" onClick={async () => {
                    if(window.confirm('Are you sure you want to archive this event?')) {
                       await api.updateEventStatus(event.id, 'archived');
                       toast.success('Event archived');
                       router.push('/dashboard');
                    }
                 }}>Archive Event</Button>
               </div>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
