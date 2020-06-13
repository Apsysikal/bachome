import { Service, PlatformAccessory } from 'homebridge';

import { ExampleHomebridgePlatform } from '../platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class BachomeThermostatAccessory {
  private service: Service;

  private exampleStates = {
    currentHeatingCoolingState: 0,
    targetHeatingCoolingState: 0,
    currentTemperature: 20.5,
    targetTemperature: 22.5,
    temperatureDisplayUnits: 0,
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

    this.service = this.accessory.getService(this.platform.Service.Thermostat)
      || this.accessory.addService(this.platform.Service.Thermostat);

    // To avoid "Cannot add a Service with the same UUID another Service without also defining a unique 'subtype' property." error,
    // when creating multiple services of the same type, you need to use the following syntax to specify a name and subtype id:
    // this.accessory.getService('NAME') ?? this.accessory.addService(this.platform.Service.Lightbulb, 'NAME', 'USER_DEFINED_SUBTYPE');

    // Read the service name form the accessory context (config file passed via platform)
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.name);

    // register handlers for mandatory characteristics
    this.service.getCharacteristic(this.platform.Characteristic.CurrentHeatingCoolingState)
      .on('get', this.getCurrentHeatingCoolingState.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TargetHeatingCoolingState)
      .on('set', this.setTargetHeatingCoolingState.bind(this))
      .on('get', this.getTargetHeatingCoolingState.bind(this));
    
    this.service.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .on('get', this.getCurrentTemperature.bind(this));
    
    this.service.getCharacteristic(this.platform.Characteristic.TargetTemperature)
      .on('set', this.setTargetTemperature.bind(this))
      .on('get', this.getTargetTemperature.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TemperatureDisplayUnits)
      .on('set', this.setTemperatureDisplayUnits.bind(this))
      .on('get', this.getTemperatureDisplayUnits.bind(this));
  }

  getCurrentHeatingCoolingState(callback) {
    this.platform.log.debug('GET CurrentHeatingCoolingState');

    callback(null, this.exampleStates.currentHeatingCoolingState);
  }

  getTargetHeatingCoolingState(callback) {
    this.platform.log.debug('GET TargetHeatingCoolingState');

    callback(null, this.exampleStates.targetHeatingCoolingState);
  }

  setTargetHeatingCoolingState(value, callback) {
    this.platform.log.debug('SET TargetHeatingCoolingState');

    this.exampleStates.targetHeatingCoolingState = value;

    callback(null);
  }

  getCurrentTemperature(callback) {
    this.platform.log.debug('GET CurrentTemperature');

    callback(null, this.exampleStates.currentTemperature);
  }

  getTargetTemperature(callback) {
    this.platform.log.debug('GET TargetTemperature');

    callback(null, this.exampleStates.targetTemperature);
  }

  setTargetTemperature(value, callback) {
    this.platform.log.debug('SET TargetTemperature');

    this.exampleStates.targetTemperature = value;

    callback(null);
  }

  getTemperatureDisplayUnits(callback) {
    this.platform.log.debug('GET TemperatureDisplayUnits');

    callback(null, this.exampleStates.temperatureDisplayUnits);
  }

  setTemperatureDisplayUnits(value, callback) {
    this.platform.log.debug('SET TemperatureDisplayUnits');

    this.exampleStates.temperatureDisplayUnits = value;

    callback(null);
  }
}
