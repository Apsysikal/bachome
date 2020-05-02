"use strict";

let Service, Characteristic, UUID;

const HeatingCoolingState = {
  "OFF": 0,
  "HEATING": 1,
  "COOLING": 2,
  "AUTO": 3
};

function myThermostat(log, config) {
  this.log = log;

  this.manufacturer = "My manufacturer";
  this.model = "My model";
  this.name = config["name"] || "My Thermostat";
  this.serial = "123-456-789";

  this.currentHeatingCoolingState = HeatingCoolingState.OFF; // 0 = OFF, 1 = HEAT, 2 = COOL
  this.targetHeatingCoolingState = HeatingCoolingState.OFF; // 0 = OFF, 1 = HEAT, 2 = COOL, 3 = AUTO
  this.currentTemperature = 20.0;
  this.targetTempearture = 25.0;
  this.temperatureDisplayUnits = 0; // 0 = CELSIUS, 1 = FAHRENHEIT
}

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

myThermostat.prototype.setCurrentHeatingCoolingState = function (
  value,
  callback
) {
  this.currentHeatingCoolingState = value;

  this.thermostatService
    .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
    .updateValue(this.currentHeatingCoolingState);

  return callback(null);
};

myThermostat.prototype.getTargetHeatingCoolingState = function (callback) {
  return callback(null, this.TargetHeatingCoolingState);
};

myThermostat.prototype.setTargetHeatingCoolingState = function (
  value,
  callback
) {
  this.targetHeatingCoolingState = value;

  this.recalculateCurrentHeatingCoolingState();

  this.thermostatService
    .getCharacteristic(Characteristic.TargetHeatingCoolingState)
    .updateValue(this.targetHeatingCoolingState);

  this.thermostatService
    .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
    .updateValue(this.currentHeatingCoolingState);

  return callback(null);
};

myThermostat.prototype.getCurrentTemperature = function (callback) {
  console.log(this.currentTemperature);
  return callback(null, this.currentTemperature);
};

myThermostat.prototype.setCurrentTemperature = function (value, callback) {
  this.currentTemperature = value;

  this.recalculateCurrentHeatingCoolingState();

  this.thermostatService
    .getCharacteristic(Characteristic.CurrentTemperature)
    .updateValue(this.currentTemperature);

  this.thermostatService
    .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
    .updateValue(this.currentHeatingCoolingState);

  return callback(null);
};

myThermostat.prototype.getTargetTemperature = function (callback) {
  return callback(null, this.targetTempearture);
};

myThermostat.prototype.setTargetTemperature = function (value, callback) {
  this.targetTempearture = value;

  this.recalculateCurrentHeatingCoolingState();

  this.thermostatService
    .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
    .updateValue(this.currentHeatingCoolingState);

  this.thermostatService
    .getCharacteristic(Characteristic.TargetTemperature)
    .updateValue(this.targetTempearture);

  return callback(null);
};

myThermostat.prototype.recalculateCurrentHeatingCoolingState = function () {
  switch (this.targetHeatingCoolingState) {
    case HeatingCoolingState.OFF:
      this.currentHeatingCoolingState = HeatingCoolingState.OFF;
      break;

    case HeatingCoolingState.HEATING:
      if (this.targetTempearture > this.currentTemperature) {
        this.currentHeatingCoolingState = HeatingCoolingState.HEATING;
        break;
      } else {
        this.currentHeatingCoolingState = HeatingCoolingState.OFF;
        break;
      }

    case HeatingCoolingState.COOLING:
      if (this.targetTempearture < this.currentTemperature) {
        this.currentHeatingCoolingState = HeatingCoolingState.COOLING;
        break;
      } else {
        this.currentHeatingCoolingState = HeatingCoolingState.OFF;
        break;
      }

    case HeatingCoolingState.AUTO:
      if (this.targetTempearture > this.currentTemperature) {
        this.currentHeatingCoolingState = HeatingCoolingState.HEATING;
        break;
      } else if (this.targetTempearture < this.currentTemperature) {
        this.currentHeatingCoolingState = HeatingCoolingState.COOLING;
        break;
      } else {
        this.currentHeatingCoolingState = HeatingCoolingState.OFF;
        break;
      }

    default:
      break;
  }
};

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUID = homebridge.hap.uuid;
  return myThermostat;
};