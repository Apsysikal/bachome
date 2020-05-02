"use strict";

let Service, Characteristic, UUID;

function myThermostat(log, config) {
  this.log = log;

  this.manufacturer = "My manufacturer";
  this.model = "My model";
  this.name = config["name"] || "My Thermostat";
  this.serial = "123-456-789";

  this.currentHeatingCoolingState = 0; // 0 = OFF, 1 = HEAT, 2 = COOL
  this.targetHeatingCoolingState = 3; // 0 = OFF, 1 = HEAT, 2 = COOL, 3 = AUTO
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
  switch (value) {
    case 0:
      this.targetHeatingCoolingState = 0;
      this.currentHeatingCoolingState = 0;

      break;

    case 1:
      this.targetHeatingCoolingState = 1;

      if (this.targetTempearture > this.currentTemperature) {
        this.currentHeatingCoolingState = 1;
      } else {
        this.currentHeatingCoolingState = 0;
      }

      break;

    case 2:
      this.targetHeatingCoolingState = 2;

      if (this.targetTempearture < this.currentTemperature) {
        this.currentHeatingCoolingState = 2;
      } else {
        this.currentHeatingCoolingState = 0;
      }

      break;

    case 3:
      this.targetHeatingCoolingState = 3;

      if (this.targetTempearture > this.currentTemperature) {
        this.currentHeatingCoolingState = 1;
      } else if (this.targetTempearture < this.currentTemperature) {
        this.currentHeatingCoolingState = 2;
      } else {
        this.currentHeatingCoolingState = 0;
      }

      break;

    default:
      break;
  }

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
  return callback(null);
};

myThermostat.prototype.getTargetTemperature = function (callback) {
  return callback(null, this.targetTempearture);
};

myThermostat.prototype.setTargetTemperature = function (value, callback) {
  this.targetTempearture = value;

  if (this.targetHeatingCoolingState === 1) {
    if (this.targetTempearture > this.currentTemperature) {
      this.currentHeatingCoolingState = 1;
    } else {
      this.currentHeatingCoolingState = 0;
    }
  } else if (this.targetHeatingCoolingState === 2) {
    if (this.targetTempearture < this.currentTemperature) {
      this.currentHeatingCoolingState = 2;
    } else {
      this.currentHeatingCoolingState = 0;
    }
  } else if (this.targetHeatingCoolingState === 3) {
    if (this.targetTempearture > this.currentTemperature) {
      this.currentHeatingCoolingState = 1;
    } else if (this.targetTempearture < this.currentTemperature) {
      this.currentHeatingCoolingState = 2;
    } else {
      this.currentHeatingCoolingState = 0;
    }
  }

  this.thermostatService
    .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
    .updateValue(this.currentHeatingCoolingState);

  return callback(null);
};

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUID = homebridge.hap.uuid;
  return myThermostat;
};
