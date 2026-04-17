"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Calendar as CalendarIcon, MapPin, Users, MoreVertical } from "lucide-react";
import { api } from "@/services/api";
import { EventData } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await api.getEvents();
      setEvents(data.filter(e => e.status !== 'archived'));
      setIsLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Manage your events and track performance.</p>
        </div>
        <Link href="/dashboard/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <Badge variant="secondary" className="cursor-pointer">All</Badge>
        <Badge variant="outline" className="cursor-pointer">Published</Badge>
        <Badge variant="outline" className="cursor-pointer">Draft</Badge>
        <Badge variant="outline" className="cursor-pointer">Closed</Badge>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
             <Card key={i} className="animate-pulse h-64 bg-muted/50" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <CalendarIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">You haven&apos;t created any events yet. Get started by creating your first event.</p>
          <Link href="/dashboard/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create First Event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
             const statusColor = event.status === 'published' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 
                               event.status === 'draft' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
             
             return (
              <Card key={event.id} className="flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className={`capitalize ${statusColor} border-0`}>
                      {event.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="relative -top-2 -right-2 p-2 hover:bg-muted rounded-md flex items-center justify-center">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="p-0">
                             <Link href={`/dashboard/${event.id}`} className="w-full px-2 py-1.5 flex items-center">
                                View details
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="p-0">
                             <Link href={`/dashboard/${event.id}?tab=tickets`} className="w-full px-2 py-1.5 flex items-center">
                                Manage tickets
                             </Link>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="text-destructive">Close event</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="line-clamp-2 mt-2 leading-tight">{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Capacity: {event.capacity}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t">
                  <Link href={`/dashboard/${event.id}`} className="w-full block">
                    <Button variant="outline" className="w-full">Manage</Button>
                  </Link>
                </CardFooter>
              </Card>
             );
          })}
        </div>
      )}
    </div>
  );
}
