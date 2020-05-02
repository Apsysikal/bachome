"use strict";

const PropertyIds = require("bacstack").enum.PropertyIds;
const bacnet = require("../bacnet/bacnet");
const bacnetWatcher = require("../bacnet/watcher");

let Service, Characteristic, UUID;

function mySwitch(log, config) {
  this.log = log;

  this.manufacturer = "My manufacturer";
  this.model = "My model";
  this.name = config["name"] || "My Switch";
  this.serial = "123-456-789";

  this.state = false;
  this.battery = {
    level: 67,
    chargingState: 2,
    lowBattery: 0,
  };
}

mySwitch.prototype.getServices = function () {
  let infoService = new Service.AccessoryInformation()
    .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
    .setCharacteristic(Characteristic.Model, this.model)
    .setCharacteristic(Characteristic.SerialNumber, this.serial);

  let switchService = new Service.Switch(this.name);

  switchService
    .getCharacteristic(Characteristic.On)
    .on("get", this.getStatus.bind(this))
    .on("set", this.setStatus.bind(this));

  let batteryService = new Service.BatteryService()
    .setCharacteristic(Characteristic.BatteryLevel, this.battery.level)
    .setCharacteristic(Characteristic.ChargingState, this.battery.chargingState) // 2 = Not Chargeable
    .setCharacteristic(
      Characteristic.StatusLowBattery,
      this.battery.lowBattery
    );

  batteryService
    .getCharacteristic(Characteristic.BatteryLevel)
    .on("get", (callback) => {
      return callback(null, this.battery.level);
    });

  batteryService
    .getCharacteristic(Characteristic.ChargingState)
    .on("get", (callback) => {
      return callback(null, this.battery.chargingState);
    });

  batteryService
    .getCharacteristic(Characteristic.StatusLowBattery)
    .on("get", (callback) => {
      return callback(null, this.battery.StatusLowBattery);
    });

  this.informationService = infoService;
  this.switchService = switchService;
  this.batteryService = batteryService;

  return [this.informationService, this.switchService, this.batteryService];
};

mySwitch.prototype.getStatus = function (callback) {
  return callback(null, this.state);
};

mySwitch.prototype.setStatus = function (state, callback) {
  this.state = state;
  this.switchService.getCharacteristic(Characteristic.On).updateValue(state);
  callback(null);
};

mySwitch.prototype.updateValue = function (value) {
  this.state = value;
  this.switchService.getCharacteristic(Characteristic.On).updateValue(value);
};

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUID = homebridge.hap.uuid;
  return mySwitch;
};
