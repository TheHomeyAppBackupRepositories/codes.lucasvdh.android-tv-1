"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const androidtv_remote_1 = require("androidtv-remote");
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
    constructor(host, cert = {}, client_name = 'androidtv-remote', pairing_port = 6467, remote_port = 6466) {
        this.host = host;
        this.client_name = client_name;
        this.pairing_port = pairing_port;
        this.remote_port = remote_port;
        this.cert = cert;
        this.initClient();
    }
    initClient() {
        this.client = new androidtv_remote_1.AndroidRemote(this.host, this.getOptions());
    }
    on(event, callback) {
        this.client.on(event, callback);
    }
    async start() {
        return await this.client.start();
    }
    async sendCode(code) {
        return await this.client.sendCode(code);
    }
    async getCertificate() {
        return await this.client.getCertificate();
    }
    getOptions() {
        return {
            pairing_port: this.pairing_port,
            remote_port: this.remote_port,
            name: this.client_name,
            cert: this.cert
        };
    }
    mute() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MUTE, androidtv_remote_1.RemoteDirection.SHORT);
    }
    volumeUp() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_VOLUME_UP, androidtv_remote_1.RemoteDirection.SHORT);
    }
    volumeDown() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_VOLUME_DOWN, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeySelect() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_BUTTON_SELECT, androidtv_remote_1.RemoteDirection.SHORT);
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
    sendKeyTv() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeySource() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_TV_INPUT, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaPlay() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_PLAY, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaPause() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_PAUSE, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaStop() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_STOP, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaNext() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_NEXT, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaPrevious() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_PREVIOUS, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaRewind() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_REWIND, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMediaFastForward() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MEDIA_FAST_FORWARD, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyDpadUp() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_DPAD_UP, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyDpadDown() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_DPAD_DOWN, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyDpadLeft() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_DPAD_LEFT, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyDpadRight() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_DPAD_RIGHT, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyDpadCenter() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_DPAD_CENTER, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyHome() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_HOME, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyBack() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_BACK, androidtv_remote_1.RemoteDirection.SHORT);
    }
    sendKeyMenu() {
        this.client.sendKey(androidtv_remote_1.RemoteKeyCode.KEYCODE_MENU, androidtv_remote_1.RemoteDirection.SHORT);
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