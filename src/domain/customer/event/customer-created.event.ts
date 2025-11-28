import EventInterface from "../../@shared/event/event.interface";

export default class CustomerCreatedEvent implements EventInterface {
    dataTimeOccurred: Date;
  eventData: { id: string; name: string };

  constructor(id: string, name: string) {
    this.dataTimeOccurred = new Date();
    this.eventData = { id, name };
  }
}
