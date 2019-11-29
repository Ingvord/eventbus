import {EventBus} from "../src/eventbus.js";

it('EventBus.subscribe by function', (done) => {
    const bus = new EventBus();

    bus.subscribe("test1", (event) => {
        expect(event.data).toBe('peanut butter');
        done();
    })


    bus.publish("test1", {
        data: "peanut butter"
    })
});

it('EventBus.subscribe by object', (done) => {
    const bus = new EventBus();

    const subscriber = new class {
        "test1 subscription"(event) {
            expect(event.data).toBe('peanut butter');
            done();
        }
    }

    bus.subscribe("test1", subscriber);


    bus.publish("test1", {
        data: "peanut butter"
    })
});