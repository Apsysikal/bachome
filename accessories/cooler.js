"use strict";

let Service, Characteristic, UUID;

function myCooler(log, config) {
    this.log = log;

    this.manufacturer = "My manufacturer";
    this.model = "My model";
    this.name = config["name"] || "My Cooler";
    this.serial = "123-456-789";

    this.cooler = {
        active: 1, // 0=Inactive, 1=Active
        currentState: 2, // 0=Inactive, 1=Idle, 2=Heating, 3=Cooling
        targetState: 0, // 0=Auto, 1=Heat, 2=Cool
        currentTemperature: 20.0,
        coolingThreshhold: 26.0,
        heatingThreshhold: 22.0,
        rotationSpeed: 50,
        swingMode: 0,
        lockPhysicalControls: 0
    };
};

myCooler.prototype.getServices = function () {
    let infoService = new Service.AccessoryInformation()
        .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
        .setCharacteristic(Characteristic.Model, this.model)
        .setCharacteristic(Characteristic.SerialNumber, this.serial);

    let coolerService = new Service.HeaterCooler(this.name)
        .setCharacteristic(Characteristic.Active, this.cooler.active)
        .setCharacteristic(Characteristic.CurrentHeaterCoolerState, this.cooler.currentState)
        .setCharacteristic(Characteristic.TargetHeaterCoolerState, this.cooler.targetState)
        .setCharacteristic(Characteristic.CurrentTemperature, this.cooler.currentState)
        .setCharacteristic(Characteristic.CoolingThresholdTemperature, this.cooler.coolingThreshhold)
        .setCharacteristic(Characteristic.HeatingThresholdTemperature, this.cooler.heatingThreshhold)
        .setCharacteristic(Characteristic.RotationSpeed, this.cooler.rotationSpeed)
        .setCharacteristic(Characteristic.SwingMode, this.cooler.swingMode)
        .setCharacteristic(Characteristic.LockPhysicalControls, this.cooler.lockPhysicalControls);

    coolerService
        .getCharacteristic(Characteristic.Active)
        .on("get", this.getCurrentActiveState.bind(this))
        .on("set", this.setCurrentActiveState.bind(this));

    coolerService
        .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
        .on("get", this.getCurrentHeaterCoolerState.bind(this))
        .on("set", this.setCurrentHeaterCoolerState.bind(this));

    coolerService
        .getCharacteristic(Characteristic.TargetHeaterCoolerState)
        .on("get", this.getTargetHeaterCoolerState.bind(this))
        .on("set", this.setTargetHeaterCoolerState.bind(this));

    coolerService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on("get", this.getCurrentTemperature.bind(this));

    coolerService
        .getCharacteristic(Characteristic.CoolingThresholdTemperature)
        .on("get", this.getCoolingThreshholdTemperature.bind(this))
        .on("set", this.setCoolingThreshholdTemperature.bind(this));

    coolerService
        .getCharacteristic(Characteristic.HeatingThresholdTemperature)
        .on("get", this.getHeatingThreshholdTemperature.bind(this))
        .on("set", this.setHeatingThreshholdTemperature.bind(this));

    coolerService
        .getCharacteristic(Characteristic.RotationSpeed)
        .on("get", this.getRotationSpeed.bind(this))
        .on("set", this.setRotationSpeed.bind(this));

    coolerService
        .getCharacteristic(Characteristic.SwingMode)
        .on("get", this.getSwingMode.bind(this))
        .on("set", this.setSwingMode.bind(this));

    coolerService
        .getCharacteristic(Characteristic.LockPhysicalControls)
        .on("get", this.getLockPhysicalControlState.bind(this))
        .on("set", this.setLockPhysicalControlState.bind(this));

    this.informationService = infoService;
    this.coolerService = coolerService;

    return [this.informationService, this.coolerService];
};

myCooler.prototype.getCurrentActiveState = function (callback) {
    return callback(null, this.cooler.active);
}

myCooler.prototype.setCurrentActiveState = function (value, callback) {
    this.cooler.active = value;
    this.coolerService.getCharacteristic(Characteristic.Active).updateValue(value);
    return callback(null);
}

myCooler.prototype.getCurrentHeaterCoolerState = function (callback) {
    return callback(null, this.cooler.currentState);
}

myCooler.prototype.setCurrentHeaterCoolerState = function (value, callback) {
    this.cooler.currentState = value;
    this.coolerService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).updateValue(value);
    return callback(null);
}

myCooler.prototype.getTargetHeaterCoolerState = function (callback) {
    return callback(null, this.cooler.targetState);
}

myCooler.prototype.setTargetHeaterCoolerState = function (value, callback) {
    this.cooler.targetState = value;
    this.coolerService.getCharacteristic(Characteristic.TargetHeaterCoolerState).updateValue(value);
    return callback(null);
}

myCooler.prototype.getCurrentTemperature = function (callback) {
    return callback(null, this.cooler.currentTemperature);
}

myCooler.prototype.getCoolingThreshholdTemperature = function (callback) {
    return callback(null, this.cooler.coolingThreshhold);
}

myCooler.prototype.setCoolingThreshholdTemperature = function (value, callback) {
    this.cooler.coolingThreshhold = value;
    this.coolerService.getCharacteristic(Characteristic.CoolingThresholdTemperature).updateValue(value);
    return callback(null);
}

myCooler.prototype.getHeatingThreshholdTemperature = function (callback) {
    return callback(null, this.cooler.heatingThreshhold);
}

myCooler.prototype.setHeatingThreshholdTemperature = function (value, callback) {
    this.cooler.heatingThreshhold = value;
    this.coolerService.getCharacteristic(Characteristic.HeatingThresholdTemperature).updateValue(value);
    return callback(null);
}

myCooler.prototype.getRotationSpeed = function (callback) {
    return callback(null, this.cooler.rotationSpeed);
}

myCooler.prototype.setRotationSpeed = function (value, callback) {
    this.cooler.rotationSpeed = value;
    this.coolerService.getCharacteristic(Characteristic.RotationSpeed).updateValue(value);
    return callback(null);
}

myCooler.prototype.getSwingMode = function (callback) {
    return callback(null, this.cooler.swingMode);
}

myCooler.prototype.setSwingMode = function (value, callback) {
    this.cooler.swingMode = value;
    this.coolerService.getCharacteristic(Characteristic.SwingMode).updateValue(value)
    return callback(null);
}

myCooler.prototype.getLockPhysicalControlState = function (callback) {
    return callback(null, this.cooler.lockPhysicalControls);
}

myCooler.prototype.setLockPhysicalControlState = function (value, callback) {
    this.cooler.lockPhysicalControls = value;
    this.coolerService.getCharacteristic(Characteristic.LockPhysicalControls).updateValue(value)
    return callback(null);
}

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUID = homebridge.hap.uuid;
    return myCooler;
};