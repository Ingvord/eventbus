import {EventBus} from "./src/eventbus.js";

const bus = new EventBus();

bus.subscribe("test", (event) => {
    debugger
})

setInterval(() => {
    bus.publish("test", {
        detail: {
            data: "Hello!"
        }
    })
}, 3000)