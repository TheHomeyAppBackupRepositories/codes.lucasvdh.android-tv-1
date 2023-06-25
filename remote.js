"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remote = void 0;
const homey_1 = require("homey");
class Remote extends homey_1.Device {
    async onInit() {
        this.log('Device has been initialized');
        await this.setUnavailable();
        // Force immediate production check
        this.initializeClient();
    }
    initializeClient() {
        throw new Error("Not implemented");
    }
}
exports.Remote = Remote;
//# sourceMappingURL=remote.js.map