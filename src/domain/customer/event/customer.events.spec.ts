import Customer from "../../customer/entity/customer";
import Address from "../../customer/value-object/address";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log-2.handler";
import EnviaConsoleLogHandler from "../../customer/event/handler/envia-console-log.handler";
import EventDispatcher from "../../@shared/event/event-dispatcher";

describe("Customer domain events", () => {
    it("should register the event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerLog1 = new EnviaConsoleLog1Handler();
        const eventHandlerLog2 = new EnviaConsoleLogHandler();
        const eventHandlerAdd = new EnviaConsoleLogHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog2);
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandlerAdd);
        //CustomerCreatedEvent
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
            2
        );
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandlerLog1);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(eventHandlerLog2);
        //CustomerAddressChangedEvent
        expect(
            eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(
            1
        );
        expect(
            eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
        ).toMatchObject(eventHandlerAdd);
    });

    it("should unregister specific handler", () => {
        const dispatcher = Customer.eventDispatcher;

        const h1 = new EnviaConsoleLog1Handler();
        const h2 = new EnviaConsoleLog2Handler();
        const hAddr = new EnviaConsoleLogHandler();

        dispatcher.register("CustomerCreatedEvent", h1);
        dispatcher.register("CustomerCreatedEvent", h2);
        dispatcher.register("CustomerAddressChangedEvent", hAddr);

        expect(
            dispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(h1);
        expect(
            dispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(h2);
        expect(
            dispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
        ).toMatchObject(hAddr);

        dispatcher.unregister("CustomerCreatedEvent", h1);
        dispatcher.unregister("CustomerCreatedEvent", h2);
        dispatcher.unregister("CustomerAddressChangedEvent", hAddr);

        expect(
            dispatcher.getEventHandlers["CustomerCreatedEvent"]
        ).toBeDefined();
        expect(
            dispatcher.getEventHandlers["CustomerAddressChangedEvent"]
        ).toBeDefined();
        expect(dispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
            0
        );
        expect(dispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(
            0
        );
    });

    it("should unregister all handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerLog1 = new EnviaConsoleLog1Handler();
        const eventHandlerLog2 = new EnviaConsoleLogHandler();
        const eventHandlerAdd = new EnviaConsoleLogHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog2);
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandlerAdd);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandlerLog1);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(eventHandlerLog2);

        expect(
            eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
        ).toMatchObject(eventHandlerAdd);

        eventDispatcher.unregisterAll();

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
        ).toBeUndefined();

        expect(
            eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]
        ).toBeUndefined();
    });

    it("should dispatch CustomerAddressChangedEvent on changeAddress", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerAdd = new EnviaConsoleLogHandler();
        const spyEventHandler = jest.spyOn(eventHandlerAdd, "handle");

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandlerAdd);

        expect(
            eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
        ).toMatchObject(eventHandlerAdd);

        const customerAddressChangedEvent = new CustomerAddressChangedEvent("1", "Address", new Address("Street 1", 123, "12345-678", "City"));

        eventDispatcher.notify(customerAddressChangedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should dispatch CustomerCreatedEvent on createCustomer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerLog1 = new EnviaConsoleLog1Handler();
        const eventHandlerLog2 = new EnviaConsoleLog2Handler();
        const spyEventHandler1 = jest.spyOn(eventHandlerLog1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandlerLog2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog2);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandlerLog1);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(eventHandlerLog2);

        const customerAddressChangedEvent = new CustomerCreatedEvent("1", "Customer");

        eventDispatcher.notify(customerAddressChangedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });
});
