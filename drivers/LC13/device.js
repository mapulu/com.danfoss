'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class DanfossLC extends ZwaveDevice {
	onMeshInit() {
		this.registerCapability('target_temperature', 'THERMOSTAT_SETPOINT');
		this.registerCapability('alarm_battery', 'BATTERY');
		this.registerCapability('measure_battery', 'BATTERY');
	}
}

module.exports = DanfossLC;
