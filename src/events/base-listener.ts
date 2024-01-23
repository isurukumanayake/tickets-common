import { Stan, Message } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  protected client: Stan;
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  protected ackWait = 5 * 1000; // 5 seconds

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // get all the events that have been emitted in the past
      .setManualAckMode(true)
      .setAckWait(this.ackWait) // set the amount of time that the NATS server will wait to receive an acknowledgement from the listener
      .setDurableName(this.queueGroupName); // make sure that we keep track of all the different events that have gone to the subscription or queue group even if it goes offline for a while
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName, // make sure we don't accidently dump the durable name even if all the services restart for a brief period of time and to make sure all the emmited events only go of to one instance of the services even if we are running multiple instances
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
