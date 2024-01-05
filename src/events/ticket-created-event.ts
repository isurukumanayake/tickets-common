import { Subjects } from "./subjects";

// This interface is used to describe the data that will be sent along with the event
// The data property is an object that can contain any number of properties
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
