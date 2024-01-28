import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema, validateEmail } from '@/utils/validators/common-rules';

// form zod validation schema
export const ticketFormSchema = z.object({
  type: z.string().min(1, { message: 'Ticket Type is required' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  seller: z.string().min(1, { message: 'Seller is required' }),
});

// generate form types from zod validation schema
export type TicketFormTypes = z.infer<typeof ticketFormSchema>;
