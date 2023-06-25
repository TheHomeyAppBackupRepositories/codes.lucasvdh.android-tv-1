"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const source_map_support_1 = __importDefault(require("source-map-support"));
const homey_1 = __importDefault(require("homey"));
source_map_support_1.default.install();
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
            .registerRunListener(this.onFlowActionOpenApplication)
            .registerArgumentAutocompleteListener('app', this.onFlowApplicationAutocomplete);
        // this.homey.flow.getActionCard('open_google_assistant')
        //     .registerRunListener(this.onFlowActionOpenGoogleAssistant);
        this.homey.flow.getActionCard('select_source')
            .registerRunListener(this.onFlowActionSelectSource);
        this.homey.flow.getActionCard('send_key')
            .registerRunListener(this.onFlowActionSendKey)
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
    async onFlowActionOpenApplication({ device, app }) {
        return device.openApplication(app);
    }
    async onFlowActionSendKey({ device, option }) {
        return device.sendKey(option.key);
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