"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const androidtv_remote_1 = require("../../androidtv-remote");
var Input;
(function (Input) {
    Input[Input["HDMI1"] = 0] = "HDMI1";
    Input[Input["HDMI2"] = 1] = "HDMI2";
    Input[Input["HDMI3"] = 2] = "HDMI3";
    Input[Input["HDMI4"] = 3] = "HDMI4";
    Input[Input["VGA"] = 4] = "VGA";
    Input[Input["COMPONENT1"] = 5] = "COMPONENT1";
    Input[Input["COMPONENT2"] = 6] = "COMPONENT2";
    Input[Input["COMPOSITE1"] = 7] = "COMPOSITE1";
    Input[Input["COMPOSITE2"] = 8] = "COMPOSITE2";
})(Input = exports.Input || (exports.Input = {}));
class AndroidTVRemoteClient {
    client;
    host;
    pairing_port;
    remote_port;
    client_name;
    cert;
    constructor(host, cert = { key: undefined, cert: undefined }, client_name = 'androidtv-remote', pairing_port = 6467, remote_port = 6466, debug = false) {
        this.host = host;
        this.client_name = client_name;
        this.pairing_port = pairing_port;
        this.remote_port = remote_port;
        this.cert = cert;
        this.client = new androidtv_remote_1.AndroidRemote(this.host, this.getOptions());
        this.client.on('error', (error) => {
            console.log('REMOTE CLIENT ERROR', error);
        });
        if (debug) {
            this.client.on('log', (...args) => console.log('log', ...args));
            this.client.on('log.debug', (...args) => console.log('debug', ...args));
            this.client.on('log.info', (...args) => console.log('info', ...args));
            this.client.on('log.error', (...args) => console.log('error', ...args));
        }
    }
    on(event, callback) {
        this.client.on(event, callback);
    }
    async start() {
        return await this.client.start();
    }
    async sendCode(code) {
        return this.client.sendCode(code);
    }
    async getCertificate() {
        return this.client.getCertificate();
    }
    getOptions() {
        return {
            pairing_port: this.pairing_port,
            remote_port: this.remote_port,
            service_name: this.client_name,
            cert: this.cert,
            timeout: 1000 * 60
        };
    }
    mute() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MUTE, androidtv_remote_1.RemoteDirection.SHORT);
    }
    volumeUp(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_VOLUME_UP, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    volumeDown(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_VOLUME_DOWN, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeySelect(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_BUTTON_SELECT, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    setInput(input) {
        if (input === Input.HDMI1) {
            this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV_INPUT_HDMI_1, androidtv_remote_1.RemoteDirection.SHORT);
        }
        else if (input === Input.HDMI2) {
            this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV_INPUT_HDMI_2, androidtv_remote_1.RemoteDirection.SHORT);
        }
        else if (input === Input.HDMI3) {
            this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV_INPUT_HDMI_3, androidtv_remote_1.RemoteDirection.SHORT);
        }
        else if (input === Input.HDMI4) {
            this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV_INPUT_HDMI_4, androidtv_remote_1.RemoteDirection.SHORT);
        }
        else if (input === Input.VGA) {
            this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV_INPUT_VGA_1, androidtv_remote_1.RemoteDirection.SHORT);
        }
        else if (input === Input.COMPONENT1) {
            this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV_INPUT_COMPONENT_1, androidtv_remote_1.RemoteDirection.SHORT);
        }
        else if (input === Input.COMPONENT2) {
            this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV_INPUT_COMPONENT_2, androidtv_remote_1.RemoteDirection.SHORT);
        }
        else if (input === Input.COMPOSITE1) {
            this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV_INPUT_COMPOSITE_1, androidtv_remote_1.RemoteDirection.SHORT);
        }
        else if (input === Input.COMPOSITE2) {
            this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV_INPUT_COMPOSITE_2, androidtv_remote_1.RemoteDirection.SHORT);
        }
        else {
            throw new Error('Invalid HDMI input');
        }
    }
    sendKeyTv(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeySource(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV_INPUT, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaPlay(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_PLAY, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaPause(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_PAUSE, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaStop(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_STOP, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaNext(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_NEXT, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyChannelUp(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_CHANNEL_UP, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyChannelDown(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_CHANNEL_DOWN, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaPrevious(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_PREVIOUS, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaRewind(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_REWIND, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaFastForward(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_FAST_FORWARD, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyDpadUp(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_DPAD_UP, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyDpadDown(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_DPAD_DOWN, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyDpadLeft(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_DPAD_LEFT, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyDpadRight(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_DPAD_RIGHT, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyDpadCenter(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_DPAD_CENTER, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyHome(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_HOME, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyBack(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_BACK, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMenu(direction = null) {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MENU, direction || androidtv_remote_1.RemoteDirection.SHORT);
    }
    openApplication(application) {
        this.client.sendAppLink(application);
    }
    sendPower() {
        this.client.sendPower();
    }
    stop() {
        this.client.stop();
    }
}
exports.default = AndroidTVRemoteClient;
//# sourceMappingURL=client.js.map