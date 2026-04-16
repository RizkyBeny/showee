"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import { EventData } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Ticket, Loader2, Globe, MessageCircle, Link as LinkIcon, Building2 } from "lucide-react";

export default function PublicEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<EventData | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await api.getEventById(eventId);
      if (data && data.status !== 'archived') {
        setEvent(data);
      }
      setIsLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  if (isLoading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
           <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium">Loading event spaces...</p>
           </div>
        </div>
     );
  }

  if (!event) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
           <Card className="max-w-md w-full text-center border-none shadow-stripe p-8 pb-12">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                 <Ticket className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Event Unavailable</h2>
              <p className="text-muted-foreground mb-8">This event does not exist, has been closed, or is not published yet.</p>
              <Button onClick={() => router.push('/')}>Return Home</Button>
           </Card>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/20">
      
      {/* Loket-Style Header / Hero */}
      <div className="bg-slate-900 text-white relative overflow-hidden border-b border-white/10">
         {/* Background Blur Effect */}
         <div className="absolute inset-0 bg-primary/20" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
         
         <div className="max-w-6xl mx-auto px-6 lg:px-12 py-10 lg:py-16 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-end">
               
               {/* Left Content */}
               <div className="flex-1 space-y-6 w-full">
                  <Badge className="bg-primary/20 text-primary-200 border-primary/30 hover:bg-primary/30 px-3 py-1 font-semibold">
                     Official Registration
                  </Badge>
                  <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.2] text-white">
                     {event.name}
                  </h1>
                  
                  <div className="space-y-4 pt-4 text-slate-200">
                     <div className="flex items-start gap-4">
                        <Calendar className="w-5 h-5 mt-0.5 text-primary-300" />
                        <div>
                           <p className="font-semibold">{new Date(event.startDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                           <p className="text-sm text-slate-400 mt-1">{new Date(event.startDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} &mdash; Selesai</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 mt-0.5 text-primary-300" />
                        <div>
                           <p className="font-semibold leading-relaxed max-w-xl">{event.location}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Anchor Banner (Placeholder Image) */}
               <div className="w-full lg:w-[480px] shrink-0 aspect-[16/9] lg:aspect-[4/3] rounded-3xl bg-slate-800 border border-white/10 overflow-hidden relative shadow-2xl">
                  {/* Decorative Banner Mockup */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                  <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-8">
                     <Ticket className="w-16 h-16 text-white/20 mb-4" />
                     <h2 className="text-2xl font-black tracking-widest text-white/40 uppercase">{event.name}</h2>
                     <p className="text-white/30 font-medium tracking-widest mt-2 uppercase text-sm">Official Event</p>
                  </div>
               </div>

            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-12">
               
               {/* Sticky Anchor Tabs */}
               <div className="flex gap-6 sm:gap-10 border-b border-slate-200 bg-slate-50/80 backdrop-blur-xl sticky top-0 z-20 pt-4 -mx-6 px-6 sm:mx-0 sm:px-0">
                  <a href="#deskripsi" className="pb-4 font-bold text-primary border-b-2 border-primary text-sm sm:text-base whitespace-nowrap">Deskripsi</a>
                  <a href="#tiket" className="pb-4 font-semibold text-slate-500 hover:text-slate-800 transition-colors text-sm sm:text-base whitespace-nowrap">Tiket</a>
                  <a href="#syarat" className="pb-4 font-semibold text-slate-500 hover:text-slate-800 transition-colors hidden sm:block text-sm sm:text-base whitespace-nowrap">Syarat dan Ketentuan</a>
               </div>

               {/* Deskripsi Section */}
               <section id="deskripsi" className="scroll-mt-24">
                 <h2 className="text-2xl font-black mb-6 text-slate-900 tracking-tight">
                   Deskripsi Event
                 </h2>
                 <div 
                   className="prose prose-slate max-w-none text-slate-600 prose-headings:text-slate-900 prose-p:leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: event.description || "<p>Tidak ada deskripsi yang diberikan oleh penyelenggara.</p>" }}
                 />
               </section>

               {/* Tiket Section (Loket Style Inline) */}
               <section id="tiket" className="scroll-mt-24 space-y-6">
                 <h2 className="text-2xl font-black mb-6 text-slate-900 tracking-tight flex items-center gap-3">
                   <Ticket className="w-6 h-6 text-primary" />
                   Tiket
                 </h2>
                 
                 <div className="space-y-4">
                    {event.tickets.length === 0 ? (
                       <Card className="p-12 text-center border-dashed border-2 shadow-none bg-transparent">
                          <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                          <h3 className="font-bold text-slate-900 mb-1">Tiket Belum Tersedia</h3>
                          <p className="text-slate-500 text-sm">Penyelenggara belum membuka penjualan tiket untuk acara ini.</p>
                       </Card>
                    ) : event.tickets.map(tk => {
                       const isSoldOut = tk.sold >= tk.quota;
                       
                       return (
                          <div 
                             key={tk.id} 
                             className={`bg-white rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 ${isSoldOut ? 'border-slate-200 opacity-60' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}
                          >
                             <div className="flex-1 space-y-3">
                                <div>
                                   <div className="flex items-center gap-3 mb-1">
                                      <h4 className="text-xl font-bold text-slate-900">{tk.name}</h4>
                                      {tk.coverImage ? (
                                         <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 shadow-none text-xs">Special</Badge>
                                      ) : null}
                                   </div>
                                   <p className="text-sm text-slate-500 font-medium">Berakhir pada {new Date(tk.endDate).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</p>
                                </div>
                                <div className="text-xs bg-slate-100 px-2.5 py-1 rounded inline-block text-slate-600 font-semibold uppercase tracking-widest">
                                   TERJUAL {tk.sold} DARI {tk.quota}
                                </div>
                             </div>

                             <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-3 border-t sm:border-t-0 pt-4 sm:pt-0">
                                <div className="font-black text-2xl text-slate-900 tracking-tight">
                                   {tk.price === 0 ? 'Gratis' : `Rp ${tk.price.toLocaleString('id-ID')}`}
                                </div>
                                <Button 
                                   disabled={isSoldOut}
                                   onClick={() => router.push(`/event/${eventId}/checkout?ticketId=${tk.id}`)}
                                   className={`w-full sm:w-auto font-bold px-8 shadow-none ${isSoldOut ? '' : 'bg-primary hover:bg-primary/90'}`}
                                >
                                   {isSoldOut ? 'Habis Terjual' : 'Beli Tiket'}
                                </Button>
                             </div>
                          </div>
                       );
                    })}
                 </div>
               </section>

               {/* Syarat & Ketentuan Placeholder */}
               <section id="syarat" className="scroll-mt-24 pt-8">
                 <h2 className="text-xl font-black mb-4 text-slate-900 tracking-tight">
                   Syarat dan Ketentuan
                 </h2>
                 <div className="prose prose-slate prose-sm text-slate-500 max-w-none">
                    <ul>
                       <li>Tiket yang sudah dibeli tidak dapat dikembalikan.</li>
                       <li>Pembeli wajib mengisi data diri yang sesuai.</li>
                       <li>E-Ticket akan dikirimkan ke email yang terdaftar.</li>
                    </ul>
                 </div>
               </section>
            </div>

            {/* Right Sidebar (Organizer & Share) */}
            <div className="lg:col-span-4 relative">
               <div className="lg:sticky lg:top-24 space-y-6">
                  
                  {/* Organizer Card */}
                  <Card className="rounded-2xl shadow-sm border-slate-200 bg-white overflow-hidden">
                     <div className="p-1 bg-slate-100/50 border-b">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-2 text-center">Diselenggarakan Oleh</p>
                     </div>
                     <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-slate-100 border flex items-center justify-center shrink-0 text-slate-400">
                              <Building2 className="w-6 h-6" />
                           </div>
                           <div>
                              <h3 className="font-bold text-slate-900 line-clamp-1">EMS Organizer Team</h3>
                              <p className="text-xs text-primary font-semibold hover:underline cursor-pointer mt-0.5">Follow Organizer</p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Share Card */}
                  <div className="px-1 text-center sm:text-left">
                     <p className="text-sm font-semibold text-slate-500 mb-3">Bagikan Event</p>
                     <div className="flex items-center justify-center sm:justify-start gap-3">
                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
                           <Globe className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 text-slate-400 hover:text-sky-500 hover:border-sky-200 hover:bg-sky-50">
                           <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 text-slate-400 hover:text-green-600 hover:border-green-200 hover:bg-green-50" onClick={() => {
                           navigator.clipboard.writeText(window.location.href);
                           alert("Link copied!");
                        }}>
                           <LinkIcon className="w-4 h-4" />
                        </Button>
                     </div>
                  </div>

               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
