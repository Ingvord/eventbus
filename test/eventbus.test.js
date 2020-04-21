import {EventBus} from "../dist/index.esm.js";

it('EventBus.subscribe by function', (done) => {
    const bus = new EventBus();

    bus.subscribe("test1", (event) => {
        chai.expect(event.data).to.equal('peanut butter');
        done();
    }, "test")


    bus.publish("test1", {
        data: "peanut butter"
    }, "test")
});