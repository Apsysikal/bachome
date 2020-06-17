/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Service, PlatformAccessory } from 'homebridge';

import { ExampleHomebridgePlatform } from '../platform';
import { objectStringParser } from '../bacnet/parser';
import { readAnalogInput, readAnalogValue, writeAnalogValue } from '../bacnet/bacnet';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class BachomeThermostatAccessory {
  private service: Service;

  private internalStates = {
    currentHeatingCoolingState: 0,
    targetHeatingCoolingState: 0,
    currentTemperature: 20.5,
    targetTemperature: 22.5,
    temperatureDisplayUnits: 0,
  }

  private stateObjects = {
    currentHeatingCoolingState: {},
    targetHeatingCoolingState: {},
    currentTemperature: {},
    targetTemperature: {},
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

    this.stateObjects['currentHeatingCoolingState'] = objectStringParser(accessory.context.device.currentHeatingCoolingState);
    this.stateObjects['targetHeatingCoolingState'] = objectStringParser(accessory.context.device.targetHeatingCoolingState);
    this.stateObjects['currentTemperature'] = objectStringParser(accessory.context.device.currentTemperature);
    this.stateObjects['targetTemperature'] = objectStringParser(accessory.context.device.targetTemperature);

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

  async getCurrentHeatingCoolingState(callback) {
    this.platform.log.debug('GET CurrentHeatingCoolingState');

    const readProperty = await readAnalogInput('192.168.1.147', this.stateObjects.currentHeatingCoolingState['instance'], 85);
    // @ts-ignore
    const value = readProperty['values'][0]['value'];
    this.platform.log.debug(`Read value from AI: ${String(value)}`);
    this.internalStates.currentHeatingCoolingState = value;

    callback(null, this.internalStates.currentHeatingCoolingState);
  }

  async getTargetHeatingCoolingState(callback) {
    this.platform.log.debug('GET TargetHeatingCoolingState');

    const readProperty = await readAnalogValue('192.168.1.147', this.stateObjects.targetHeatingCoolingState['instance'], 85);
    // @ts-ignore
    const value = readProperty['values'][0]['value'];
    this.platform.log.debug(`Read value from AV: ${String(value)}`);
    this.internalStates.targetHeatingCoolingState = value;

    callback(null, this.internalStates.targetHeatingCoolingState);
  }

  async setTargetHeatingCoolingState(value, callback) {
    this.platform.log.debug('SET TargetHeatingCoolingState');

    this.internalStates.targetHeatingCoolingState = value;

    callback(null);

    const returnedValue = await writeAnalogValue('192.168.1.147', this.stateObjects.targetHeatingCoolingState['instance'], 85, value);

    this.platform.log.debug(`Written value to AV: ${String(returnedValue)}`);
    this.internalStates.targetHeatingCoolingState = value;
  }

  async getCurrentTemperature(callback) {
    this.platform.log.debug('GET CurrentTemperature');

    const readProperty = await readAnalogInput('192.168.1.147', this.stateObjects.currentTemperature['instance'], 85);
    // @ts-ignore
    const value = readProperty['values'][0]['value'];
    this.platform.log.debug(`Read value from AI: ${String(value)}`);
    this.internalStates.currentTemperature = value;

    callback(null, this.internalStates.currentTemperature);
  }

  async getTargetTemperature(callback) {
    this.platform.log.debug('GET TargetTemperature');

    const readProperty = await readAnalogValue('192.168.1.147', this.stateObjects.targetTemperature['instance'], 85);
    // @ts-ignore
    const value = readProperty['values'][0]['value'];
    this.platform.log.debug(`Read value from AV: ${String(value)}`);
    this.internalStates.targetTemperature = value;

    callback(null, this.internalStates.targetTemperature);
  }

  async setTargetTemperature(value, callback) {
    this.platform.log.debug('SET TargetTemperature');

    this.internalStates.targetTemperature = value;

    callback(null);

    const returnedValue = await writeAnalogValue('192.168.1.147', this.stateObjects.targetTemperature['instance'], 85, value);

    this.platform.log.debug(`Written value to AV: ${String(returnedValue)}`);
    this.internalStates.targetTemperature = value;
  }

  getTemperatureDisplayUnits(callback) {
    this.platform.log.debug('GET TemperatureDisplayUnits');

    callback(null, this.internalStates.temperatureDisplayUnits);
  }

  setTemperatureDisplayUnits(value, callback) {
    this.platform.log.debug('SET TemperatureDisplayUnits');

    this.internalStates.temperatureDisplayUnits = value;

    callback(null);
  }
}
