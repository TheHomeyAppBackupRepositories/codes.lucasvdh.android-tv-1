"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const remote_1 = require("../../remote");
const client_1 = __importStar(require("./client"));
/**
 * @property {RemoteDriver} driver
 */
class RemoteDevice extends remote_1.Remote {
    client;
    keyCapabilities = [
        'key_stop',
        'key_play',
        'key_pause',
        // 'key_play_pause',
        // 'key_online',
        // 'key_record',
        'key_rewind',
        'key_fast_forward',
        // 'key_toggle_ambilight',
        'key_source',
        // 'key_toggle_subtitles',
        // 'key_teletext',
        // 'key_viewmode',
        'key_watch_tv',
        'key_confirm',
        'key_previous',
        'key_next',
        // 'key_adjust',
        'key_cursor_left',
        'key_cursor_up',
        'key_cursor_right',
        'key_cursor_down',
        'key_channel_up',
        'key_channel_down',
        // 'key_info',
        // 'key_digit_1',
        // 'key_digit_2',
        // 'key_digit_3',
        // 'key_digit_4',
        // 'key_digit_5',
        // 'key_digit_6',
        // 'key_digit_7',
        // 'key_digit_8',
        // 'key_digit_9',
        // 'key_digit_0',
        // 'key_dot',
        'key_options',
        'key_back',
        'key_home',
        // 'key_find',
        // 'key_red',
        // 'key_green',
        // 'key_yellow',
        // 'key_blue'
    ];
    CAPABILITIES_SET_DEBOUNCE = 100;
    async initializeClient() {
        try {
            const store = this.getStore();
            const settings = this.getSettings();
            this.client = new client_1.default(settings.ip, store.cert);
            this.client.on('error', async (error) => {
                this.log('client.on(error)', error);
            });
            await this.client.start();
            this.client.on('ready', () => {
                this.log("Client has been initialized");
                this.setAvailable();
            });
            this.client.on('close', ({ hasError, error }) => {
                this.log("Client has been closed");
                this.setUnavailable();
            });
            await this.registerClientListeners();
            this.log('Client listeners have been registered');
            await this.registerCapabilityListeners();
            this.log('Capability listeners have been registered');
            this.fixCapabilities();
        }
        catch (error) {
            this.error(error);
            console.log(error);
        }
    }
    async onUninit() {
        this.client?.stop();
    }
    async registerClientListeners() {
        if (!this.client) {
            throw new Error('Client not initialized');
        }
        this.client.on('powered', async (powered) => {
            await this.setCapabilityValue('onoff', powered);
        });
        this.client.on('volume', async (volume) => {
            this.log('volume', volume);
            this.log("Volume : " + volume.level + '/' + volume.maximum + " | Muted : " + volume.muted);
            // await this.setCapabilityValue('volume_mute', volume.muted);
            // await this.setCapabilityValue('volume', volume.level);
            await this.setCapabilityValue('volume_mute', volume.muted);
            await this.setCapabilityValue('measure_volume', Math.round(volume.level / (volume.maximum / 100)));
        });
        this.client.on('current_app', (current_app) => {
            // @ts-ignore
            return this.driver.triggerApplicationOpenedTrigger(this, {
                app: current_app
            }).catch(this.error);
        });
        this.client.on('unpaired', async (error) => {
            await this.setUnavailable(this.homey.__('error.unpaired'));
        });
        this.client.on('secret', async () => {
            await this.setUnavailable(this.homey.__('error.unpaired'));
        });
        this.client.on('error', async (error) => {
            this.log('client.on(error)', error);
            // TODO: is this necessary?
            await this.reloadClient(60);
        });
    }
    async registerCapabilityListeners() {
        this.registerMultipleCapabilityListener(this.keyCapabilities, async (capabilityValues, capabilityOptions) => {
            return this.onCapabilitiesKeySet(capabilityValues, capabilityOptions);
        }, this.CAPABILITIES_SET_DEBOUNCE);
        this.registerCapabilityListener('onoff', value => {
            return this.onCapabilityOnOffSet(value);
        });
        this.registerCapabilityListener('volume_up', value => {
            return this.client?.volumeUp();
        });
        this.registerCapabilityListener('volume_down', value => {
            return this.client?.volumeDown();
        });
        this.registerCapabilityListener('volume_mute', value => {
            return this.client?.mute();
        });
        // this.registerCapabilityListener('key', value => {
        //     return this._onCapabilityAmbilightModeSet(value)
        // })
    }
    async onCapabilitiesKeySet(capability, options) {
        if (typeof capability.key_stop !== 'undefined') {
            return this.client?.sendKeyMediaStop();
        }
        else if (typeof capability.key_play !== 'undefined') {
            return this.client?.sendKeyMediaPlay();
        }
        else if (typeof capability.key_back !== 'undefined') {
            return this.client?.sendKeyBack();
        }
        else if (typeof capability.key_pause !== 'undefined') {
            return this.client?.sendKeyMediaPause();
        }
        // else if (typeof capability.key_online !== 'undefined') {
        //     return this.sendKey('Online')
        // } else if (typeof capability.key_record !== 'undefined') {
        //     return this.sendKey('Record')
        // }
        else if (typeof capability.key_rewind !== 'undefined') {
            return this.client?.sendKeyMediaRewind();
        }
        else if (typeof capability.key_fast_forward !== 'undefined') {
            return this.client?.sendKeyMediaFastForward();
        }
        // else if (typeof capability.key_toggle_ambilight !== 'undefined') {
        //     return this.sendKey('AmbilightOnOff')
        // } else if (typeof capability.key_source !== 'undefined') {
        //     return this.sendKey('Source')
        // } else if (typeof capability.key_toggle_subtitles !== 'undefined') {
        //     return this.sendKey('SubtitlesOnOff')
        // } else if (typeof capability.key_teletext !== 'undefined') {
        //     return this.sendKey('Teletext')
        // } else if (typeof capability.key_viewmode !== 'undefined') {
        //     return this.sendKey('Viewmode')
        // }
        else if (typeof capability.key_watch_tv !== 'undefined') {
            return this.client?.sendKeyTv();
        }
        else if (typeof capability.key_confirm !== 'undefined') {
            return this.client?.sendKeyDpadCenter();
        }
        else if (typeof capability.key_previous !== 'undefined') {
            return this.client?.sendKeyMediaPrevious();
        }
        else if (typeof capability.key_next !== 'undefined') {
            return this.client?.sendKeyMediaNext();
        }
        else if (typeof capability.key_channel_up !== 'undefined') {
            return this.client?.sendKeyChannelUp();
        }
        else if (typeof capability.key_channel_down !== 'undefined') {
            return this.client?.sendKeyChannelDown();
        }
        // else if (typeof capability.key_adjust !== 'undefined') {
        //     return this.sendKey('Adjust')
        // }
        else if (typeof capability.key_cursor_left !== 'undefined') {
            return this.client?.sendKeyDpadLeft();
        }
        else if (typeof capability.key_cursor_up !== 'undefined') {
            return this.client?.sendKeyDpadUp();
        }
        else if (typeof capability.key_cursor_right !== 'undefined') {
            return this.client?.sendKeyDpadRight();
        }
        else if (typeof capability.key_cursor_down !== 'undefined') {
            return this.client?.sendKeyDpadDown();
        }
        // else if (typeof capability.key_info !== 'undefined') {
        //     return this.sendKey('Info')
        // } else if (typeof capability.key_digit_0 !== 'undefined') {
        //     return this.sendKey('Digit0')
        // } else if (typeof capability.key_digit_1 !== 'undefined') {
        //     return this.sendKey('Digit1')
        // } else if (typeof capability.key_digit_2 !== 'undefined') {
        //     return this.sendKey('Digit2')
        // } else if (typeof capability.key_digit_3 !== 'undefined') {
        //     return this.sendKey('Digit3')
        // } else if (typeof capability.key_digit_4 !== 'undefined') {
        //     return this.sendKey('Digit4')
        // } else if (typeof capability.key_digit_5 !== 'undefined') {
        //     return this.sendKey('Digit5')
        // } else if (typeof capability.key_digit_6 !== 'undefined') {
        //     return this.sendKey('Digit6')
        // } else if (typeof capability.key_digit_7 !== 'undefined') {
        //     return this.sendKey('Digit7')
        // } else if (typeof capability.key_digit_8 !== 'undefined') {
        //     return this.sendKey('Digit8')
        // } else if (typeof capability.key_digit_9 !== 'undefined') {
        //     return this.sendKey('Digit9')
        // } else if (typeof capability.key_dot !== 'undefined') {
        //     return this.sendKey('Dot')
        // }
        else if (typeof capability.key_options !== 'undefined') {
            return this.client?.sendKeyMenu();
        }
        else if (typeof capability.key_back !== 'undefined') {
            return this.client?.sendKeyBack();
        }
        else if (typeof capability.key_home !== 'undefined') {
            return this.client?.sendKeyHome();
        }
        // else if (typeof capability.key_find !== 'undefined') {
        //     return this.sendKey('Find')
        // } else if (typeof capability.key_red !== 'undefined') {
        //     return this.sendKey('RedColour')
        // } else if (typeof capability.key_yellow !== 'undefined') {
        //     return this.sendKey('YellowColour')
        // } else if (typeof capability.key_green !== 'undefined') {
        //     return this.sendKey('GreenColour')
        // } else if (typeof capability.key_blue !== 'undefined') {
        //     return this.sendKey('BlueColour')
        // }
    }
    fixCapabilities() {
        let oldCapabilities = [
            'volume'
        ];
        let newCapabilities = [
            "onoff",
            "measure_volume",
            "volume_up",
            "volume_down",
            "volume_mute",
            "key_play",
            "key_pause",
            "key_stop",
            "key_cursor_up",
            "key_cursor_right",
            "key_cursor_down",
            "key_cursor_left",
            "key_channel_up",
            "key_channel_down",
            "key_back",
            "key_home",
            "key_confirm",
            "key_previous",
            "key_next",
            "key_watch_tv"
        ];
        for (let i in oldCapabilities) {
            let oldCapability = oldCapabilities[i];
            if (this.hasCapability(oldCapability)) {
                this.log('Removing old capability: ' + oldCapability);
                this.removeCapability(oldCapability)
                    .catch(error => {
                    this.log(error);
                });
            }
        }
        for (let i in newCapabilities) {
            let newCapability = newCapabilities[i];
            if (!this.hasCapability(newCapability)) {
                this.log('Adding new capability: ' + newCapability);
                this.addCapability(newCapability)
                    .catch(error => {
                    this.log(error);
                });
            }
        }
    }
    async onCapabilityOnOffSet(value) {
        this.log(`Powering ${value ? 'on' : 'off'} device`);
        if (value !== this.getCapabilityValue('onoff')) {
            this.client?.sendPower();
        }
    }
    async onSettings({ newSettings, changedKeys }) {
        if (changedKeys.includes("ip")) {
            await this.reloadClient();
        }
    }
    async reloadClient(timeoutInSeconds = null) {
        try {
            this.client?.stop();
        }
        finally {
            if (timeoutInSeconds !== null) {
                await this.homey.setTimeout(this.initializeClient.bind(this), timeoutInSeconds * 1000);
            }
            else {
                await this.initializeClient();
            }
        }
    }
    async pressKey(key, direction = null) {
        if (key === 'key_stop') {
            this.client?.sendKeyMediaStop(direction);
        }
        else if (key === 'key_play') {
            this.client?.sendKeyMediaPlay(direction);
        }
        else if (key === 'key_pause') {
            this.client?.sendKeyMediaPause(direction);
        }
        else if (key === 'key_rewind') {
            this.client?.sendKeyMediaRewind(direction);
        }
        else if (key === 'key_fast_forward') {
            this.client?.sendKeyMediaFastForward(direction);
        }
        else if (key === 'key_source') {
            this.client?.sendKeySource(direction);
        }
        else if (key === 'key_watch_tv') {
            this.client?.sendKeyTv(direction);
        }
        else if (key === 'key_confirm') {
            this.client?.sendKeyDpadCenter(direction);
        }
        else if (key === 'key_previous') {
            this.client?.sendKeyMediaStop(direction);
        }
        else if (key === 'key_next') {
            this.client?.sendKeyMediaNext(direction);
        }
        else if (key === 'key_channel_up') {
            this.client?.sendKeyChannelUp(direction);
        }
        else if (key === 'key_channel_down') {
            this.client?.sendKeyChannelDown(direction);
        }
        else if (key === 'key_cursor_left') {
            this.client?.sendKeyDpadLeft(direction);
        }
        else if (key === 'key_cursor_up') {
            this.client?.sendKeyDpadUp(direction);
        }
        else if (key === 'key_cursor_right') {
            this.client?.sendKeyDpadRight(direction);
        }
        else if (key === 'key_cursor_down') {
            this.client?.sendKeyDpadDown(direction);
        }
        else if (key === 'key_options') {
            this.client?.sendKeyMenu(direction);
        }
        else if (key === 'key_back') {
            this.client?.sendKeyBack(direction);
        }
        else if (key === 'key_home') {
            this.client?.sendKeyHome(direction);
        }
    }
    async openApplication(appLink) {
        this.client?.openApplication(appLink);
    }
    async selectSource(source) {
        if (source === 'HDMI1') {
            this.client?.setInput(client_1.Input.HDMI1);
        }
        else if (source === 'HDMI2') {
            this.client?.setInput(client_1.Input.HDMI2);
        }
        else if (source === 'HDMI3') {
            this.client?.setInput(client_1.Input.HDMI3);
        }
        else if (source === 'HDMI4') {
            this.client?.setInput(client_1.Input.HDMI4);
        }
        else if (source === 'VGA') {
            this.client?.setInput(client_1.Input.VGA);
        }
        else if (source === 'COMPONENT1') {
            this.client?.setInput(client_1.Input.COMPONENT1);
        }
        else if (source === 'COMPONENT2') {
            this.client?.setInput(client_1.Input.COMPONENT2);
        }
        else if (source === 'COMPOSITE1') {
            this.client?.setInput(client_1.Input.COMPOSITE1);
        }
        else if (source === 'COMPOSITE2') {
            this.client?.setInput(client_1.Input.COMPOSITE2);
        }
        else {
            throw new Error(`Unknown source: ${source}`);
        }
    }
    async getKeys() {
        return [
            {
                key: 'key_stop',
                name: this.homey.__(`key.stop`)
            },
            {
                key: 'key_play',
                name: this.homey.__(`key.play`)
            },
            {
                key: 'key_pause',
                name: this.homey.__(`key.pause`)
            },
            {
                key: 'key_rewind',
                name: this.homey.__(`key.rewind`)
            },
            {
                key: 'key_fast_forward',
                name: this.homey.__(`key.fast_forward`)
            },
            {
                key: 'key_source',
                name: this.homey.__(`key.source`)
            },
            {
                key: 'key_watch_tv',
                name: this.homey.__(`key.watch_tv`)
            },
            {
                key: 'key_confirm',
                name: this.homey.__(`key.confirm`)
            },
            {
                key: 'key_previous',
                name: this.homey.__(`key.previous`)
            },
            {
                key: 'key_next',
                name: this.homey.__(`key.next`)
            },
            {
                key: 'key_cursor_left',
                name: this.homey.__(`key.cursor_left`)
            },
            {
                key: 'key_cursor_up',
                name: this.homey.__(`key.cursor_up`)
            },
            {
                key: 'key_cursor_right',
                name: this.homey.__(`key.cursor_right`)
            },
            {
                key: 'key_cursor_down',
                name: this.homey.__(`key.cursor_down`)
            },
            {
                key: 'key_channel_up',
                name: this.homey.__(`key.channel_up`)
            },
            {
                key: 'key_channel_down',
                name: this.homey.__(`key.channel_down`)
            },
            {
                key: 'key_options',
                name: this.homey.__(`key.options`)
            },
            {
                key: 'key_back',
                name: this.homey.__(`key.back`)
            },
            {
                key: 'key_home',
                name: this.homey.__(`key.home`)
            },
        ];
    }
}
module.exports = RemoteDevice;
exports.default = RemoteDevice;
//# sourceMappingURL=device.js.map