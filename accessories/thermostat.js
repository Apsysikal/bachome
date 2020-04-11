"use strict";

let Service, Characteristic, UUID;

function myThermostat(log, config) {
    this.log = log;

    this.manufacturer = "My manufacturer";
    this.model = "My model";
    this.name = config["name"] || "My Thermostat";
    this.serial = UUID.generate(this.name)

    this.currentHeatingCoolingState = 0; // 0 = OFF, 1 = HEAT, 2 = COOL
    this.targetHeatingCoolingState = 0; // 0 = OFF, 1 = HEAT, 2 = COOL, 3 = AUTO
    this.currentTemperature = 20.0;
    this.targetTempearture = 25.0;
    this.temperatureDisplayUnits = 0; // 0 = CELSIUS, 1 = FAHRENHEIT
};

myThermostat.prototype.getServices = function () {
    let infoService = new Service.AccessoryInformation()
        .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
        .setCharacteristic(Characteristic.Model, this.model)
        .setCharacteristic(Characteristic.SerialNumber, this.serial);

    let thermostatService = new Service.Thermostat(this.name);

    thermostatService
        .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
        .on("get", this.getCurrentHeatingCoolingState.bind(this))
        .on("set", this.setCurrentHeatingCoolingState.bind(this));

    thermostatService
        .getCharacteristic(Characteristic.TargetHeatingCoolingState)
        .on("get", this.getTargetHeatingCoolingState.bind(this))
        .on("set", this.setTargetHeatingCoolingState.bind(this));

    thermostatService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on("get", this.getCurrentTemperature.bind(this))
        .on("set", this.setCurrentTemperature.bind(this));

    thermostatService
        .getCharacteristic(Characteristic.TargetTemperature)
        .on("get", this.getTargetTemperature.bind(this))
        .on("set", this.setTargetTemperature.bind(this));

    this.informationService = infoService;
    this.thermostatService = thermostatService;

    return [this.informationService, this.thermostatService];
};

myThermostat.prototype.getCurrentHeatingCoolingState = function (callback) {
    return callback(null, this.currentHeatingCoolingState);
};

myThermostat.prototype.setCurrentHeatingCoolingState = function (value, callback) {
    this.currentHeatingCoolingState = value;
    this.thermostatService.getCharacteristic(Characteristic.CurrentHeatingCoolingState).updateValue(value);
    return callback(null);
};

myThermostat.prototype.getTargetHeatingCoolingState = function (callback) {
    console.log(`GET Target heating/cooling state: ${this.targetHeatingCoolingState}`);
    return callback(null, this.TargetHeatingCoolingState);
};

myThermostat.prototype.setTargetHeatingCoolingState = function (value, callback) {
    this.targetHeatingCoolingState = value;
    this.thermostatService.getCharacteristic(Characteristic.TargetHeatingCoolingState).updateValue(value);

    switch (this.targetHeatingCoolingState) {
        case 0:
            this.setCurrentHeatingCoolingState(0, () => { });
            break;

        case 1:
            this.setCurrentHeatingCoolingState(1, () => { });
            break;

        case 2:
            this.setCurrentHeatingCoolingState(2, () => { });
            break;

        case 3:
            if (this.targetTempearture > this.currentTemperature) {
                this.setCurrentHeatingCoolingState(1, () => { });
            } else if (this.targetTempearture < this.currentTemperature) {
                this.setCurrentHeatingCoolingState(2, () => { });
            } else {
                this.setCurrentHeatingCoolingState(0, () => { });
            }
            break;

        default:
            break;
    }

    console.log(`SET Target heating/cooling state: ${this.targetHeatingCoolingState}`);
    console.log(`Current heating/cooling state: ${this.currentHeatingCoolingState}`);
    return callback(null);
};

myThermostat.prototype.getCurrentTemperature = function (callback) {
    console.log(`GET Current temperature: ${this.currentTemperature}`);
    return callback(null, this.currentTemperature);
};

myThermostat.prototype.setCurrentTemperature = function (value, callback) {
    this.currentTemperature = value;
    console.log(`GET Current temperature: ${this.currentTemperature}`);
    return callback(null);
};

myThermostat.prototype.getTargetTemperature = function (callback) {
    console.log(`GET Target temperature: ${this.targetTempearture}`);
    return callback(null, this.targetTempearture);
};

myThermostat.prototype.setTargetTemperature = function (value, callback) {
    this.targetTempearture = value;
    console.log(`SET Target temperature: ${this.targetTempearture}`);
    console.log(`Target heating/cooling state: ${this.targetHeatingCoolingState}`);
    console.log(`Current heating/cooling state: ${this.currentHeatingCoolingState}`);

    if (this.targetTempearture > this.currentTemperature && this.targetHeatingCoolingState == 3) {
        this.setCurrentHeatingCoolingState(1, () => { });
    } else if (this.targetTempearture < this.currentTemperature && this.targetHeatingCoolingState == 3) {
        this.setCurrentHeatingCoolingState(2, () => { });
    } else if (this.targetHeatingCoolingState == 3) {
        this.setCurrentHeatingCoolingState(0, () => { });
    }

    return callback(null);
};

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUID = homebridge.hap.uuid;
    return myThermostat;
};