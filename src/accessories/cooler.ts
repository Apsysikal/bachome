import { Service, PlatformAccessory } from 'homebridge';

import { ExampleHomebridgePlatform } from '../platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class BachomeHeaterCoolerAccessory {
  private service: Service;

  private exampleStates = {
    active: 0,
    currentHeaterCoolerState: 0,
    targetHeaterCoolerState: 0,
    currentTemperature: 20.5,
    coolingThresholdTemperature: 26.0,
    heatingThresholdTemperature: 22.0,
  }

  constructor(
    private readonly platform: ExampleHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, accessory.context.device.manufacturer)
      .setCharacteristic(this.platform.Characteristic.Model, accessory.context.device.model)
      .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.context.device.serial);

    this.service = this.accessory.getService(this.platform.Service.HeaterCooler)
      || this.accessory.addService(this.platform.Service.HeaterCooler);

    // To avoid "Cannot add a Service with the same UUID another Service without also defining a unique 'subtype' property." error,
    // when creating multiple services of the same type, you need to use the following syntax to specify a name and subtype id:
    // this.accessory.getService('NAME') ?? this.accessory.addService(this.platform.Service.Lightbulb, 'NAME', 'USER_DEFINED_SUBTYPE');

    // Read the service name form the accessory context (config file passed via platform)
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.name);

    // register handlers for mandatory characteristics
    this.service.getCharacteristic(this.platform.Characteristic.Active)
      .on('set', this.setActive.bind(this))
      .on('get', this.getActive.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.CurrentHeaterCoolerState)
      .on('get', this.getCurrentHeaterCoolerState.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TargetHeaterCoolerState)
      .on('set', this.setTargetHeaterCoolerState.bind(this))
      .on('get', this.getTargetHeaterCoolerState.bind(this));
    
    this.service.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .on('get', this.getCurrentTemperature.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.CoolingThresholdTemperature)
      .on('set', this.setCoolingThresholdTemperature.bind(this))
      .on('get', this.getCoolingThresholdTemperature.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.HeatingThresholdTemperature)
      .on('set', this.setHeatingThresholdTemperature.bind(this))
      .on('get', this.getHeatingThresholdTemperature.bind(this));

    
  }

  getActive(callback) {
    this.platform.log.debug('GET Active');

    callback(null, this.exampleStates.active);
  }

  setActive(value, callback) {
    this.platform.log.debug('SET Active');

    this.exampleStates.active = value;

    callback(null);
  }

  getCurrentHeaterCoolerState(callback) {
    this.platform.log.debug('GET CurrentHeaterCoolerState');

    callback(null, this.exampleStates.currentHeaterCoolerState);
  }

  getTargetHeaterCoolerState(callback) {
    this.platform.log.debug('GET TargetHeaterCoolerState');

    callback(null, this.exampleStates.targetHeaterCoolerState);
  }

  setTargetHeaterCoolerState(value, callback) {
    this.platform.log.debug('SET TargetHeaterCoolerState');

    this.exampleStates.targetHeaterCoolerState = value;

    callback(null);
  }

  getCurrentTemperature(callback) {
    this.platform.log.debug('GET CurrentTemperature');

    callback(null, this.exampleStates.currentTemperature);
  }

  getCoolingThresholdTemperature(callback) {
    this.platform.log.debug('GET CoolingThresholdTemperature');

    callback(null, this.exampleStates.coolingThresholdTemperature);
  }

  setCoolingThresholdTemperature(value, callback) {
    this.platform.log.debug('SET CoolingThresholdTemperature');

    this.exampleStates.coolingThresholdTemperature = value;

    callback(null);
  }

  getHeatingThresholdTemperature(callback) {
    this.platform.log.debug('GET HeatingThresholdTemperature');

    callback(null, this.exampleStates.heatingThresholdTemperature);
  }

  setHeatingThresholdTemperature(value, callback) {
    this.platform.log.debug('SET HeatingThresholdTemperature');

    this.exampleStates.heatingThresholdTemperature = value;

    callback(null);
  }
}
