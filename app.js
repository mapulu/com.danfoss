'use strict';

const Homey = require('homey');
const Log = require('homey-log');

class DanfossZwave extends Homey.App {

	onInit() {
		this.log('Danfoss Z-wave app is running...');
	}
}

module.exports = DanfossZwave;
