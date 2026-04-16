export type EventStatus = 'draft' | 'published' | 'closed' | 'archived';

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select';
  required: boolean;
  options?: string[]; // Used when type is 'select'
}

export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  quota: number;
  sold: number;
  startDate: string; // ISO String
  endDate: string; // ISO String
  coverImage?: string;
}

export interface EventData {
  id: string;
  name: string;
  description: string;
  startDate: string; // ISO String
  endDate: string; // ISO String
  location: string;
  capacity: number;
  bannerUrl?: string;
  status: EventStatus;
  tickets: TicketCategory[];
  customFields?: CustomField[];
  createdAt: string; // ISO String
}

export interface Attendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  ticketId: string;
  status: 'paid' | 'pending';
  purchaseDate: string; // ISO String
  customAnswers?: Record<string, string>;
}

export interface Withdrawal {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  status: 'pending' | 'completed' | 'failed';
  requestedAt: string; // ISO String
}
