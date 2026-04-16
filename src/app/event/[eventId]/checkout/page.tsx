"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/services/api";
import { EventData, TicketCategory } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CreditCard, Lock, Loader2, ShieldCheck, Mail, User, ArrowLeft, Calendar, Ticket } from "lucide-react";

function CheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const eventId = params?.eventId as string;
  const ticketId = searchParams?.get("ticketId");

  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const [ticket, setTicket] = useState<TicketCategory | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [cardNumber, setCardNumber] = useState("");

  useEffect(() => {
    const fetchContext = async () => {
      if (!eventId || !ticketId) {
         setIsLoading(false);
         return;
      }
      const data = await api.getEventById(eventId);
      if (data && data.status !== 'archived') {
        const selectedTk = data.tickets.find(t => t.id === ticketId);
        if (selectedTk) {
            setEvent(data);
            setTicket(selectedTk);
        }
      }
      setIsLoading(false);
    };
    fetchContext();
  }, [eventId, ticketId]);

  const handleCustomAnswerChange = (fieldId: string, val: string) => {
     setCustomAnswers(prev => ({ ...prev, [fieldId]: val }));
  };

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     if (!ticket || !event) return;
     if (!name || !email) return toast.error("Please fill in your contact details");
     if (ticket.price > 0 && cardNumber.length < 15) return toast.error("Invalid mock credit card number");

     if (event.customFields) {
        for (const field of event.customFields) {
           if (field.required && !customAnswers[field.id]) {
               return toast.error(`Please answer: ${field.label}`);
           }
        }
     }

     setIsProcessing(true);
     
     try {
        const attendee = await api.purchaseTicket(eventId, ticket.id, {
           name,
           email,
           customAnswers
        });
        
        toast.success("Payment successful!");
        router.push(`/event/${eventId}/success?attId=${attendee.id}`);
     } catch (err) {
        toast.error(err instanceof Error ? err.message : "Payment failed.");
        setIsProcessing(false);
     }
  };

  if (isLoading) {
     return (
        <div className="flex flex-col flex-1 items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Preparing checkout session...</p>
        </div>
     )
  }

  if (!event || !ticket) {
     return (
        <div className="flex flex-col flex-1 items-center justify-center p-12 text-center max-w-md mx-auto">
            <Card className="w-full text-center border-none shadow-stripe p-8 pb-12">
               <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-muted-foreground opacity-50" />
               </div>
               <h2 className="text-xl font-bold mb-2">Checkout Session Invalid</h2>
               <p className="text-muted-foreground mb-6">We could not find the ticket you selected. The ticket may have sold out or the session expired.</p>
               <Button onClick={() => router.push(`/event/${eventId}`)}>Go Back</Button>
            </Card>
        </div>
     );
  }

  const isFree = ticket.price === 0;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="mb-8">
         <Button variant="ghost" onClick={() => router.push(`/event/${eventId}`)} className="-ml-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Event
         </Button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Kanan / Atas di mobile: Summary Section (Stripe Style UI) */}
          <div className="lg:col-span-5 lg:order-last">
             <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border space-y-6 lg:sticky lg:top-8">
                <div className="flex items-start gap-4 pb-6 border-b border-dashed">
                   <div className="bg-primary/10 p-3 rounded-2xl shrink-0">
                      <Ticket className="w-6 h-6 text-primary" />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900 text-lg">{event.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                         <Calendar className="w-3.5 h-3.5" />
                         {new Date(event.startDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                   </div>
                </div>

                <div>
                   <h4 className="font-semibold text-slate-400 mb-4 uppercase tracking-widest text-xs">Order Summary</h4>
                   <div className="flex justify-between items-center mb-4">
                      <span className="font-medium text-slate-700">{ticket.name} <span className="text-slate-400 ml-1">x1</span></span>
                      <span className="font-semibold text-slate-900">Rp {ticket.price.toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between items-center mb-4">
                      <span className="font-medium text-slate-500 text-sm">Platform Fee</span>
                      <span className="font-medium text-slate-500 text-sm">Free (Covered)</span>
                   </div>
                   <div className="h-px w-full bg-slate-100 my-4" />
                   <div className="flex justify-between items-center">
                      <span className="font-bold text-xl text-slate-900">Total</span>
                      <span className="font-black text-2xl text-primary">Rp {ticket.price.toLocaleString('id-ID')}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Kiri / Bawah di mobile: Checkout Form */}
          <div className="lg:col-span-7">
             <form onSubmit={handleCheckout} className="space-y-10">
                 
                 <div className="space-y-6">
                    <div>
                       <h2 className="text-2xl font-bold tracking-tight mb-2">Registration Details</h2>
                       <p className="text-slate-500">Provide your best email. Your mock e-ticket will be generated for this contact.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 sm:p-8 rounded-3xl border shadow-sm">
                       <div className="space-y-2.5 sm:col-span-2">
                         <Label className="text-slate-700">Full Name</Label>
                         <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input className="pl-11 h-12 bg-slate-50" placeholder="Jane Doe" required value={name} onChange={e => setName(e.target.value)} />
                         </div>
                       </div>
                       <div className="space-y-2.5 sm:col-span-2">
                         <Label className="text-slate-700">Email Address</Label>
                         <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input className="pl-11 h-12 bg-slate-50" type="email" placeholder="jane@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                         </div>
                       </div>
                    </div>
                 </div>

                 {event.customFields && event.customFields.length > 0 && (
                    <div className="space-y-6">
                      <div>
                         <h3 className="text-xl font-bold mb-1">Additional Details</h3>
                         <p className="text-sm text-slate-500">Required by the event organizer.</p>
                      </div>
                      
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
                         {event.customFields.map(field => (
                            <div key={field.id} className="space-y-2.5">
                               <Label className="text-slate-700">{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                               
                               {field.type === 'text' && (
                                  <Input 
                                     placeholder="Type your answer" 
                                     required={field.required}
                                     value={customAnswers[field.id] || ''}
                                     onChange={e => handleCustomAnswerChange(field.id, e.target.value)}
                                     className="bg-slate-50 h-10"
                                  />
                               )}

                               {field.type === 'number' && (
                                  <Input 
                                     type="number"
                                     placeholder="e.g. 25" 
                                     required={field.required}
                                     value={customAnswers[field.id] || ''}
                                     onChange={e => handleCustomAnswerChange(field.id, e.target.value)}
                                     className="bg-slate-50 h-10"
                                  />
                               )}

                               {field.type === 'select' && field.options && (
                                  <Select 
                                     required={field.required}
                                     value={customAnswers[field.id] || ''}
                                     onValueChange={(val) => handleCustomAnswerChange(field.id, val || '')}
                                  >
                                     <SelectTrigger className="bg-slate-50 h-10">
                                        <SelectValue placeholder="Select an option" />
                                     </SelectTrigger>
                                     <SelectContent>
                                        {field.options.map((opt, i) => (
                                           <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                        ))}
                                     </SelectContent>
                                  </Select>
                               )}
                            </div>
                         ))}
                      </div>
                    </div>
                 )}

                 {!isFree && (
                    <div className="space-y-6">
                      <div>
                         <h3 className="text-xl font-bold mb-1">Payment Details</h3>
                         <p className="text-sm text-slate-500">All transactions are simulated and secure.</p>
                      </div>
                      
                      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border shadow-stripe overflow-hidden relative">
                         <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
                            <Lock className="w-48 h-48" />
                         </div>
                         
                         <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center mb-2">
                               <div className="flex items-center gap-2">
                                  <CreditCard className="w-5 h-5 text-indigo-400" />
                                  <span className="font-semibold tracking-wide text-slate-100">Credit Card Mock</span>
                               </div>
                               <div className="flex gap-1.5 opacity-40">
                                  <div className="w-10 h-6 bg-white/20 rounded disabled cursor-not-allowed" />
                                  <div className="w-10 h-6 bg-white/20 rounded disabled cursor-not-allowed" />
                               </div>
                            </div>
                            
                            <div className="space-y-2">
                               <Label className="text-slate-400 text-xs uppercase tracking-wider">Card Number</Label>
                               <div className="relative">
                                  <Input 
                                     className="bg-white/10 border-white/10 text-white placeholder:text-white/30 h-14 font-mono text-lg tracking-widest pl-4 pr-12 focus-visible:ring-indigo-500" 
                                     placeholder="4242 4242 4242 4242" 
                                     maxLength={19}
                                     required
                                     value={cardNumber}
                                     onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))}
                                  />
                                  {cardNumber.length >= 15 && <ShieldCheck className="w-5 h-5 text-emerald-400 absolute right-4 top-1/2 -translate-y-1/2" />}
                               </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <Label className="text-slate-400 text-xs uppercase tracking-wider">Expiry Date</Label>
                                  <Input className="bg-white/10 border-white/10 text-white placeholder:text-white/30 h-14" placeholder="MM/YY" required />
                               </div>
                               <div className="space-y-2">
                                  <Label className="text-slate-400 text-xs uppercase tracking-wider">Security Code</Label>
                                  <Input className="bg-white/10 border-white/10 text-white placeholder:text-white/30 h-14" placeholder="CVC" required type="password" maxLength={4} />
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                 )}

                 <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-14 text-lg rounded-2xl shadow-stripe bg-primary hover:bg-primary/90 transition-all font-bold"
                    disabled={isProcessing}
                 >
                    {isProcessing ? (
                       <>
                         <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                         Processing Securely...
                       </>
                    ) : (
                       <>
                         {isFree ? "Confirm Registration" : `Pay Rp ${ticket.price.toLocaleString('id-ID')}`}
                       </>
                    )}
                 </Button>
                 
                 <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-2 mt-4">
                    <ShieldCheck className="w-4 h-4" /> Transactions are simulated for demonstration purposes.
                 </p>

              </form>
          </div>
       </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col px-6 py-12 sm:py-20 md:px-12 max-w-6xl mx-auto">
      <Suspense fallback={
         <div className="flex flex-col flex-1 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
         </div>
      }>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
