"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __importDefault(require("homey"));
const androidtv_remote_1 = require("./androidtv-remote");
class AndroidTV extends homey_1.default.App {
    /**
     * onInit is called when the app is initialized.
     */
    async onInit() {
        this.log("App has been initialized");
        await this.registerFlowCardListeners();
        this.log('Flow card listeners have been registered');
    }
    async registerFlowCardListeners() {
        this.homey.flow.getActionCard('open_application')
            .registerRunListener(this.onFlowActionOpenApplication);
        // .registerArgumentAutocompleteListener('app', this.onFlowApplicationAutocomplete)
        // this.homey.flow.getActionCard('open_google_assistant')
        //     .registerRunListener(this.onFlowActionOpenGoogleAssistant);
        this.homey.flow.getActionCard('select_source')
            .registerRunListener(this.onFlowActionSelectSource);
        this.homey.flow.getActionCard('press_key')
            .registerRunListener(this.onFlowActionPressKey)
            .registerArgumentAutocompleteListener('option', this.onFlowKeyAutocomplete.bind(this));
        this.homey.flow.getActionCard('long_press_key')
            .registerRunListener(this.onFlowActionLongPressKey)
            .registerArgumentAutocompleteListener('option', this.onFlowKeyAutocomplete.bind(this));
        // this.homey.flow.getActionCard('send_key')
        //     .registerRunListener(this.onFlowActionSendKey)
        //     .registerArgumentAutocompleteListener('option', this.onFlowKeyAutocomplete.bind(this))
        //
        // this.homey.flow.getActionCard('set_ambihue')
        //     .registerRunListener(this.onFlowActionSetAmbiHue)
        //
        // this.homey.flow.getActionCard('set_ambilight')
        //     .registerRunListener(this.onFlowActionSetAmbilight)
        //
        // this.homey.flow.getActionCard('set_ambilight_mode')
        //     .registerRunListener(this.onFlowActionSetAmbilightMode)
        this.log('Initialized flow');
    }
    async onFlowActionOpenApplication({ device, app_link, app_name }) {
        console.log('Open application link', app_link);
        try {
            return device.openApplication(app_link);
        }
        catch (e) {
            console.log(e);
        }
    }
    async onFlowActionPressKey({ device, option }) {
        return device.pressKey(option.key);
    }
    async onFlowActionLongPressKey({ device, option, seconds }) {
        await device.pressKey(option.key, androidtv_remote_1.RemoteDirection.START_LONG);
        await new Promise(((resolve, reject) => {
            setTimeout(resolve, seconds * 1000);
        }));
        await device.pressKey(option.key, androidtv_remote_1.RemoteDirection.END_LONG);
    }
    async onFlowKeyAutocomplete(query, { device }) {
        return (await device.getKeys())
            .map(key => {
            return {
                'id': key.key,
                'key': key.key,
                'name': key.name
            };
        }).filter(result => {
            return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
    }
    async onFlowApplicationAutocomplete(query, { device }) {
        return [
            {
                name: 'Test'
            }
        ];
        // return device.getApplications().then(applications => {
        //   return applications.filter(result => {
        //     return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1
        //   })
        // })
    }
    async onFlowActionSelectSource({ device, source }) {
        return device.selectSource(source);
    }
}
module.exports = AndroidTV;
//# sourceMappingURL=app.js.map