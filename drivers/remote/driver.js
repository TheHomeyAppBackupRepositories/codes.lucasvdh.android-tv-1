"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = require("homey");
const client_1 = __importDefault(require("./client"));
class RemoteDriver extends homey_1.Driver {
    applicationOpenedTrigger;
    async onInit() {
        this.log("Driver has been initialised");
        await this.registerFlowCards();
        this.log('Flow cards have been initialized');
    }
    async onPair(session) {
        let devices = [];
        let existingDevices = this.getDevices();
        let pairingDevice = null;
        let pairingClient = null;
        const discoveryStrategy = this.getDiscoveryStrategy();
        session.setHandler('showView', async (view) => {
            this.log('Show view', view);
            if (view === 'discover') {
                let discoveredDevices = this.getDiscoveredDevices(discoveryStrategy);
                let hasDiscoveredDevices = false;
                devices = discoveredDevices.filter(item => {
                    if (item === null) {
                        return false;
                    }
                    hasDiscoveredDevices = true;
                    return existingDevices.filter(existingDevice => {
                        return item.data.id === existingDevice.getData().id;
                    }).length === 0;
                });
                if (devices.length > 0) {
                    await session.showView('list_devices');
                }
                else {
                    await session.showView('add_by_ip');
                    if (hasDiscoveredDevices) {
                        await session.emit('add_by_ip_hint', this.homey.__('pair.add_by_ip.no_new_devices_hint'));
                    }
                }
            }
            if (view === "authenticate") {
                if (pairingDevice === null) {
                    await session.showView('list_devices');
                    this.error('Pairing device not set');
                    return;
                }
                pairingClient = this.getPairingClientByDevice(pairingDevice);
                await pairingClient.start();
            }
        });
        session.setHandler('list_devices', async () => {
            return devices;
        });
        session.setHandler('list_devices_selection', async (devices) => {
            let device = devices.pop();
            if (device !== undefined) {
                pairingDevice = device;
            }
        });
        session.setHandler('pincode', async (code) => {
            if (pairingClient === null) {
                this.error('Pairing client should not be null');
                return;
            }
            if (pairingDevice === null) {
                this.error('Pairing device should not be null');
                return;
            }
            this.log('Pincode submitted', code.join(''));
            const pairingResult = await pairingClient.sendCode(code.join(''));
            if (pairingResult) {
                pairingDevice.store.cert = await pairingClient.getCertificate();
                session.showView('add_device');
            }
            else {
                session.showView('discover');
            }
            return pairingResult;
        });
        session.setHandler('getDevice', async () => {
            if (pairingDevice === null) {
                throw new Error('Pairing device not set');
            }
            return pairingDevice;
        });
    }
    async onRepair(session, repairingDevice) {
        // Argument session is a PairSocket, similar to Driver.onPair
        // Argument device is a Homey.Device that's being repaired
        this.log('Repairing device', repairingDevice.getName());
        const pairingClient = this.getPairingClientByDevice({
            name: repairingDevice.getName(),
            data: repairingDevice.getData(),
            store: {},
            settings: repairingDevice.getSettings()
        });
        session.setHandler('showView', async (view) => {
            this.log('Show view', view);
            if (view === 'start_repair') {
                console.log('START PAIRING');
                pairingClient.on('secret', () => {
                    this.log('Pairing client started, show authenticate view');
                    session.showView('authenticate');
                });
                await pairingClient.start();
            }
        });
        session.setHandler('pincode', async (code) => {
            if (pairingClient === null) {
                this.error('Pairing client should not be null');
                return;
            }
            if (repairingDevice === null) {
                this.error('Pairing device should not be null');
                return;
            }
            this.log('Pincode submitted', code.join(''));
            const pairingResult = await pairingClient.sendCode(code.join(''));
            if (pairingResult) {
                await repairingDevice.setStoreValue('cert', await pairingClient.getCertificate());
                session.done();
            }
            else {
                session.showView('authenticate');
            }
            return pairingResult;
        });
        session.setHandler("disconnect", async () => {
            // Cleanup
        });
    }
    getPairingClientByDevice(device) {
        return new client_1.default(device.settings.ip, device.store.cert);
    }
    getDeviceByDiscoveryResult(discoveryResult) {
        return {
            name: this.getNameByMDNSDiscoveryResult(discoveryResult),
            data: {
                id: discoveryResult.id,
            },
            store: {
                cert: {
                    key: undefined,
                    cert: undefined,
                }
            },
            settings: {
                ip: discoveryResult.address
            },
        };
    }
    getNameByMDNSDiscoveryResult(discoveryResult) {
        let name = '';
        let txtKeys = Object.keys(discoveryResult.txt);
        let txtValues = Object.values(discoveryResult.txt);
        if (txtKeys.indexOf('fn')) {
            name = txtValues[txtKeys.indexOf('fn')];
        }
        return name;
    }
    getDiscoveredDevices(discoveryStrategy) {
        const discoveryResults = discoveryStrategy.getDiscoveryResults();
        return Object.values(discoveryResults)
            .map(discoveryResult => {
            if (discoveryResult instanceof homey_1.DiscoveryResultSSDP || discoveryResult instanceof homey_1.DiscoveryResultMAC) {
                this.log('Incorrect discovery result type received.');
                return null;
            }
            return this.getDeviceByDiscoveryResult(discoveryResult);
        })
            .filter(device => device !== null)
            .map(discoveryResult => discoveryResult);
    }
    async registerFlowCards() {
        this.applicationOpenedTrigger = this.homey.flow.getDeviceTriggerCard('application_opened');
    }
    triggerApplicationOpenedTrigger(device, args) {
        return this.applicationOpenedTrigger?.trigger(device, args);
    }
}
module.exports = RemoteDriver;
//# sourceMappingURL=driver.js.map