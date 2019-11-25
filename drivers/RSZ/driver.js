'use strict';

const Homey = require('homey');

class DanfossRS extends Homey.Driver {
    onInit() {
        this.buttonTrigger = new Homey.FlowCardTriggerDevice('DanfossRS_btn_1')
            .register()
            .registerRunListener( (args, state) => {
                return args.device === state.device;
        });
    }
}

module.exports = DanfossRS
