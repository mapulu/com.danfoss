'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://www.vesternet.com/downloads/dl/file/id/196/product/1128/z_wave_danfoss_lc_13_living_connect_radiator_thermostat_manual.pdf

module.exports = new ZwaveDriver(path.basename(__dirname), {
	capabilities: {
		measure_battery: {
			command_class: 'COMMAND_CLASS_BATTERY',
			command_get: 'BATTERY_GET',
			command_report: 'BATTERY_REPORT',
			command_report_parser: report => {
				if (report['Battery Level'] === "battery low warning") return 1;
				return report['Battery Level (Raw)'][0];
			}
		},
		target_temperature: {
			command_class: 'COMMAND_CLASS_THERMOSTAT_SETPOINT',
			command_get: 'THERMOSTAT_SETPOINT_GET',
			command_get_parser: function () {
				return new Buffer([1]);
			},
			command_set: 'THERMOSTAT_SETPOINT_SET',
			command_set_parser: function (value) {

				// This should work in theory (due to 16bit signed int) but it doesn't, wrong values are sent to thermostat
				// return new Buffer([1, 34, (Math.round(value * 2) / 2 * 10).toFixed(0)]); // Precision = 1, Scale = 0, Size = 2

				// This only works with values smaller than 127 and greater than -128 (8bit signed int)
				// return new Buffer([1, 33, (Math.round(value * 2) / 2 * 10).toFixed(0)]); // Precision = 1, Scale = 0, Size = 1

				// Create buffers
				let a = new Buffer([1, 34]); // Precision = 1, Scale = 0, Size = 2

				// Write temperature value to 2 byte buffer
				let b = new Buffer(2);
				b.writeUInt16BE((Math.round(value * 2) / 2 * 10).toFixed(0));

				// Concat the buffers and return
				return Buffer.concat([a,b]);
			},
			command_report: 'THERMOSTAT_SETPOINT_REPORT',
			command_report_parser: report => {
				if (report.hasOwnProperty('Level2')
					&& report.Level2.hasOwnProperty('Scale')
					&& report.Level2['Scale'] === 0
					&& typeof report['Value'].readUIntBE(0, 2) !== 'undefined') {
					return report['Value'].readUIntBE(0, 2) / 100;
				}
				return null;
			},
		},
	},
	settings: {

	}
});
