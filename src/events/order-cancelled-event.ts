import { Subjects } from "./subjects";

export interface OrderCancelledEvent {
  // The subject property is used by the NATS Streaming Server to route events to the correct subscriber.
  // It is a string value that must be one of the values from the Subjects enum.
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}
