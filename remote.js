"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remote = void 0;
const homey_1 = require("homey");
class Remote extends homey_1.Device {
    async onInit() {
        this.log('Device has been initialized');
        // Migrate cert to store for older devices
        if (!this.getStoreKeys().includes('cert')) {
            await this.setStoreValue('cert', this.getData().cert);
        }
        // Force immediate production check
        this.initializeClient();
    }
}
exports.Remote = Remote;
//# sourceMappingURL=remote.js.map