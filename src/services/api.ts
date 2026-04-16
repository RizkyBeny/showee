import { EventData, Attendee, Withdrawal, TicketCategory } from '@/types';

// Initial Mock Data to seed localStorage if empty
const INITIAL_EVENTS: EventData[] = [
  {
    id: 'evt-1',
    name: 'Tech Conference 2026',
    description: 'The biggest regional tech conference.',
    startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 12).toISOString(),
    location: 'Jakarta Convention Center',
    capacity: 1000,
    status: 'published',
    createdAt: new Date().toISOString(),
    tickets: [
      {
        id: 'tk-1',
        name: 'Early Bird',
        price: 500000,
        quota: 200,
        sold: 150,
        startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      },
      {
        id: 'tk-2',
        name: 'Regular',
        price: 800000,
        quota: 800,
        sold: 50,
        startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 10).toISOString(),
      }
    ]
  }
];

const INITIAL_ATTENDEES: Attendee[] = [
  {
    id: 'att-1',
    eventId: 'evt-1',
    name: 'Budi Santoso',
    email: 'budi@example.com',
    ticketId: 'tk-1',
    status: 'paid',
    purchaseDate: new Date(Date.now() - 86400000).toISOString()
  }
];

// Helper to interact with localStorage
const getFromStorage = <T>(key: string, initialData: T): T => {
  if (typeof window === 'undefined') return initialData;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

const saveToStorage = <T>(key: string, data: T) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const api = {
  // EVENTS
  getEvents: async (): Promise<EventData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getFromStorage<EventData[]>('ems_events', INITIAL_EVENTS));
      }, 500); // simulate network delay
    });
  },

  getEventById: async (id: string): Promise<EventData | null> => {
    const events = await api.getEvents();
    return events.find(e => e.id === id) || null;
  },

  createEvent: async (eventData: Omit<EventData, 'id' | 'createdAt' | 'status' | 'tickets'>): Promise<EventData> => {
    const events = await api.getEvents();
    const newEvent: EventData = {
      ...eventData,
      id: `evt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'draft',
      tickets: []
    };
    saveToStorage('ems_events', [newEvent, ...events]);
    return newEvent;
  },
  
  updateEventStatus: async (id: string, status: EventData['status']) => {
     const events = await api.getEvents();
     const updated = events.map(e => e.id === id ? { ...e, status } : e);
     saveToStorage('ems_events', updated);
  },

  updateEvent: async (id: string, eventData: Partial<Omit<EventData, 'id' | 'createdAt' | 'tickets'>>) => {
     const events = await api.getEvents();
     const updated = events.map(e => e.id === id ? { ...e, ...eventData } : e);
     saveToStorage('ems_events', updated);
  },

  // TICKETS
  createTicket: async (eventId: string, ticketData: Omit<TicketCategory, 'id' | 'sold'>): Promise<TicketCategory> => {
     const events = await api.getEvents();
     const newTicket: TicketCategory = {
        ...ticketData,
        id: `tk-${Date.now()}`,
        sold: 0
     };
     const updated = events.map(e => e.id === eventId ? { ...e, tickets: [...e.tickets, newTicket] } : e);
     saveToStorage('ems_events', updated);
     return newTicket;
  },

  updateTicket: async (eventId: string, ticketId: string, ticketData: Partial<Omit<TicketCategory, 'id' | 'sold'>>) => {
     const events = await api.getEvents();
     const updated = events.map(e => {
        if (e.id === eventId) {
            return {
                ...e,
                tickets: e.tickets.map(t => t.id === ticketId ? { ...t, ...ticketData } : t)
            };
        }
        return e;
     });
     saveToStorage('ems_events', updated);
  },

  deleteTicket: async (eventId: string, ticketId: string) => {
     const events = await api.getEvents();
     const updated = events.map(e => {
        if (e.id === eventId) {
            return {
                ...e,
                tickets: e.tickets.filter(t => t.id !== ticketId)
            };
        }
        return e;
     });
     saveToStorage('ems_events', updated);
  },

  // ATTENDEES
  getAttendees: async (eventId: string): Promise<Attendee[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const all = getFromStorage<Attendee[]>('ems_attendees', INITIAL_ATTENDEES);
        resolve(all.filter(a => a.eventId === eventId));
      }, 400);
    });
  },

  simulatePurchase: async (eventId: string, ticketId: string): Promise<Attendee> => {
    const attendees = getFromStorage<Attendee[]>('ems_attendees', INITIAL_ATTENDEES);
    const events = await api.getEvents();
    const event = events.find(e => e.id === eventId);
    
    // Generate dummy answers for custom fields if any exist
    const customAnswers: Record<string, string> = {};
    if (event?.customFields && event.customFields.length > 0) {
       event.customFields.forEach(field => {
          if (field.type === 'text') customAnswers[field.id] = `Dummy Text ${Math.floor(Math.random() * 100)}`;
          else if (field.type === 'number') customAnswers[field.id] = `${Math.floor(Math.random() * 1000)}`;
          else if (field.type === 'select' && field.options && field.options.length > 0) {
             customAnswers[field.id] = field.options[Math.floor(Math.random() * field.options.length)];
          } else {
             customAnswers[field.id] = 'N/A';
          }
       });
    }

    const newAttendee: Attendee = {
       id: `att-${Date.now()}`,
       eventId,
       name: `Simulated User ${Math.floor(Math.random() * 1000)}`,
       email: `simulated${Date.now()}@example.com`,
       ticketId,
       status: 'paid',
       purchaseDate: new Date().toISOString(),
       customAnswers
    };
    saveToStorage('ems_attendees', [newAttendee, ...attendees]);

    // Also update ticket sold count
    const updatedEventList = await api.getEvents();
    const updatedEvents = updatedEventList.map(e => {
        if (e.id === eventId) {
            return {
                ...e,
                tickets: e.tickets.map(t => t.id === ticketId ? { ...t, sold: t.sold + 1 } : t)
            };
        }
        return e;
    });
    saveToStorage('ems_events', updatedEvents);
    
    return newAttendee;
  },

  purchaseTicket: async (eventId: string, ticketId: string, attendeeData: { name: string; email: string; customAnswers: Record<string, string> }): Promise<Attendee> => {
    return new Promise((resolve, reject) => {
       setTimeout(async () => {
          const attendees = getFromStorage<Attendee[]>('ems_attendees', INITIAL_ATTENDEES);
          const events = await api.getEvents();
          const targetEvent = events.find(e => e.id === eventId);
          
          if (!targetEvent) return reject(new Error("Event not found"));
          
          const targetTicket = targetEvent.tickets.find(t => t.id === ticketId);
          if (!targetTicket) return reject(new Error("Ticket not found"));
          if (targetTicket.sold >= targetTicket.quota) return reject(new Error("Ticket sold out"));

          const newAttendee: Attendee = {
             id: `att-${Date.now()}`,
             eventId,
             ticketId,
             status: 'paid',
             purchaseDate: new Date().toISOString(),
             ...attendeeData
          };
          
          saveToStorage('ems_attendees', [newAttendee, ...attendees]);

          const updatedEvents = events.map(e => {
              if (e.id === eventId) {
                  return {
                      ...e,
                      tickets: e.tickets.map(t => t.id === ticketId ? { ...t, sold: t.sold + 1 } : t)
                  };
              }
              return e;
          });
          saveToStorage('ems_events', updatedEvents);
          
          resolve(newAttendee);
       }, 800); // Realistic payment delay simulation
    });
  },

  // WITHDRAWALS
  getWithdrawals: async (): Promise<Withdrawal[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getFromStorage<Withdrawal[]>('ems_withdrawals', []));
      }, 300);
    });
  },

  requestWithdrawal: async (data: { amount: number; bankName: string; accountNumber: string }): Promise<Withdrawal> => {
    const withdrawals = await api.getWithdrawals();
    const newWd: Withdrawal = {
       id: `wd-${Date.now()}`,
       ...data,
       status: 'pending',
       requestedAt: new Date().toISOString()
    };
    saveToStorage('ems_withdrawals', [newWd, ...withdrawals]);
    return newWd;
  }
};
