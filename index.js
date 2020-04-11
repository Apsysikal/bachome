const myThermostat = require("./accessories/thermostat");
const mySwitch = require("./accessories/switch");
const myCooler = require("./accessories/cooler");

module.exports = function (homebridge) {
    const thermostatService = myThermostat(homebridge);
    const switchService = mySwitch(homebridge);
    const coolerService = myCooler(homebridge);

    homebridge.registerAccessory("bachome", "bachome-thermostat", thermostatService);
    homebridge.registerAccessory("bachome", "bachome-switch", switchService);
    homebridge.registerAccessory("bachome", "bachome-cooler", coolerService);
};