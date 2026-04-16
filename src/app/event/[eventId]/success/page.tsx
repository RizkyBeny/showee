"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { api } from "@/services/api";
import { Attendee, EventData } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Ticket, Calendar, MapPin, Download, Loader2, PartyPopper } from "lucide-react";

function SuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params?.eventId as string;
  const attId = searchParams?.get("attId");

  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const [attendee, setAttendee] = useState<Attendee | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId || !attId) return setIsLoading(false);
      
      const evt = await api.getEventById(eventId);
      if (evt) setEvent(evt);

      const attendeesInfo = await api.getAttendees(eventId);
      const att = attendeesInfo.find(a => a.id === attId);
      if (att) setAttendee(att);

      setIsLoading(false);
    };
    fetchData();
  }, [eventId, attId]);

  if (isLoading) {
     return (
        <div className="flex flex-col flex-1 items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Verifying your ticket...</p>
        </div>
     )
  }

  if (!event || !attendee) {
     return (
        <div className="flex flex-col flex-1 items-center justify-center p-12 text-center max-w-md mx-auto">
            <Ticket className="w-16 h-16 text-slate-300 mb-4" />
            <h2 className="text-xl font-bold mb-2">Receipt Not Found</h2>
            <p className="text-muted-foreground mb-6">We could not find the ticket you are looking for. It may be an invalid link.</p>
            <Button onClick={() => window.location.href = '/'}>Return Home</Button>
        </div>
     );
  }

  const ticketCategory = event.tickets.find(t => t.id === attendee.ticketId);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-200">
             <PartyPopper className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">You&apos;re going!</h1>
          <p className="text-lg text-slate-500 max-w-md mx-auto">Your mock payment was processed successfully. We&apos;ve sent a detailed receipt to <strong className="text-slate-800">{attendee.email}</strong>.</p>
       </div>

       <div className="bg-slate-900 rounded-[2.5rem] p-4 sm:p-6 shadow-stripe relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full mix-blend-screen filter blur-[80px] opacity-40 -translate-x-1/2 translate-y-1/2" />
          
          <div className="bg-white rounded-[2rem] overflow-hidden relative z-10 shadow-inner flex flex-col sm:flex-row">
             
             {/* Kiri: Ticket Details */}
             <div className="flex-1 p-8 sm:p-10 flex flex-col justify-between relative">
                <div className="absolute top-0 right-0 w-8 h-8 bg-slate-900 rounded-bl-3xl sm:hidden" />
                
                <div className="space-y-6">
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" /> Paid
                   </div>

                   <div>
                      <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Event</p>
                      <h3 className="text-2xl font-black text-slate-900 leading-tight">{event.name}</h3>
                   </div>
                   
                   <div className="space-y-4 pt-6 border-t border-dashed">
                      <div className="flex items-start gap-4">
                         <div className="bg-slate-100 p-2.5 rounded-xl shrink-0 text-slate-500">
                            <Calendar className="w-5 h-5" />
                         </div>
                         <div className="mt-0.5">
                            <p className="font-semibold text-slate-900">{new Date(event.startDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p className="text-sm text-slate-500 mt-0.5">{new Date(event.startDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="bg-slate-100 p-2.5 rounded-xl shrink-0 text-slate-500">
                            <MapPin className="w-5 h-5" />
                         </div>
                         <div className="mt-0.5">
                            <p className="font-semibold text-slate-900 max-w-[200px] truncate">{event.location}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-10">
                   <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Attendee Information</p>
                   <p className="text-lg font-bold text-slate-900">{attendee.name}</p>
                   <p className="text-slate-500">{attendee.email}</p>
                </div>
             </div>

             {/* Kanan / Bawah: Perforation and Ticket Code */}
             <div className="w-full sm:w-64 bg-slate-50 border-t sm:border-t-0 sm:border-l-2 border-dashed border-slate-200 p-8 sm:p-10 flex flex-col items-center justify-center relative">
                {/* Perforation holes for desktop */}
                <div className="hidden sm:block absolute top-0 -left-3 w-6 h-6 bg-slate-900 rounded-full -translate-y-1/2" />
                <div className="hidden sm:block absolute bottom-0 -left-3 w-6 h-6 bg-slate-900 rounded-full translate-y-1/2" />
                
                {/* Perforation holes for mobile */}
                <div className="sm:hidden absolute top-0 -left-3 w-6 h-6 bg-slate-900 rounded-full -translate-y-1/2 translate-x-12" />
                <div className="sm:hidden absolute top-0 -right-3 w-6 h-6 bg-slate-900 rounded-full -translate-y-1/2 -translate-x-12" />

                <div className="text-center w-full">
                   <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Ticket Type</p>
                   <div className="font-black text-xl text-primary">{ticketCategory?.name || "General"}</div>
                   
                   <div className="mt-8 mb-6 p-4 bg-white border-2 border-slate-200 rounded-2xl w-32 h-32 mx-auto flex items-center justify-center">
                      <div className="opacity-20 flex flex-wrap gap-1">
                         {Array.from({length: 16}).map((_, i) => (
                           <div key={i} className={`h-2 ${i % 2 === 0 ? 'w-4 bg-slate-800' : 'w-2 bg-slate-400'}`} />
                         ))}
                      </div>
                   </div>

                   <p className="font-mono text-xs text-slate-400 tracking-[0.2em] uppercase">
                      ID: {attendee.id.split('-')[1]}
                   </p>
                </div>
             </div>

          </div>
       </div>

       <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button variant="outline" size="lg" className="h-12 shadow-sm rounded-xl px-8" onClick={() => window.print()}>
             <Download className="w-4 h-4 mr-2" /> Download PDF Receipt
          </Button>
          <Button size="lg" className="h-12 rounded-xl px-12 shadow-stripe" onClick={() => window.location.href = '/'}>
             Done
          </Button>
       </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col px-6 py-12 sm:py-20">
      <Suspense fallback={
         <div className="flex flex-col flex-1 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
         </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
