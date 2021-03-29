/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Service, PlatformAccessory } from 'homebridge';

import { ExampleHomebridgePlatform } from '../platform';
import { objectStringParser } from '../bacnet/parser';
import { readBinaryValue, writeBinaryValue, readAnalogInput, readAnalogValue, writeAnalogValue } from '../bacnet/bacnet';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class BachomeHeaterCoolerAccessory {
  private service: Service;

  private internalStates = {
    active: false,
    currentHeaterCoolerState: 0,
    targetHeaterCoolerState: 0,
    currentTemperature: 20.5,
    coolingThresholdTemperature: 26.0,
    heatingThresholdTemperature: 22.0,
  }

  private stateObjects = {
    active: {},
    currentHeaterCoolerState: {},
    targetHeaterCoolerState: {},
    currentTemperature: {},
    coolingThresholdTemperature: {},
    heatingThresholdTemperature: {},
  }

  private ipAddress = "";

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

    this.stateObjects['active'] = objectStringParser(accessory.context.device.active);
    this.stateObjects['currentHeaterCoolerState'] = objectStringParser(accessory.context.device.currentHeaterCoolerState);
    this.stateObjects['targetHeaterCoolerState'] = objectStringParser(accessory.context.device.targetHeaterCoolerState);
    this.stateObjects['currentTemperature'] = objectStringParser(accessory.context.device.currentTemperature);
    this.stateObjects['coolingThresholdTemperature'] = objectStringParser(accessory.context.device.coolingThresholdTemperature);
    this.stateObjects['heatingThresholdTemperature'] = objectStringParser(accessory.context.device.heatingThresholdTemperature);
    
    this.ipAddress = accessory.context.device.ipAddress;

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

  /**
   * Reads the active state from the configured BACnet object
   * and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getActive(callback) {
    this.platform.log.debug('GET Active');

    const readProperty = await readBinaryValue(this.ipAddress, this.stateObjects.active['instance'], 85);
    // @ts-ignore
    const value = readProperty['values'][0]['value'];
    this.platform.log.debug(`Read value from BV: ${String(value)}`);
    this.internalStates.active = Boolean(value);

    callback(null, this.internalStates.active);
  }

  /**
   * Writes the value passed from homebridge to the
   * configured BACnet object and updates the
   * internal state.
   * @param value Value passed from homebridge
   * @param callback Callback from homebridge
   */
  async setActive(value, callback) {
    this.platform.log.debug('SET Active');

    this.platform.log.debug(`Trying to write ${this.stateObjects.active['typeText']}:${this.stateObjects.active['instance']}`);
    const returnedValue = await writeBinaryValue(this.ipAddress, this.stateObjects.active['instance'], 85, Boolean(value));
    // @ts-ignore
    this.platform.log.debug(`Written value to BV: ${String(returnedValue)}`);
    this.internalStates.active = Boolean(value);

    this.internalStates.active = value;

    callback(null);
  }

  /**
   * Reads the current heater / cooler state state from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getCurrentHeaterCoolerState(callback) {
    this.platform.log.debug('GET CurrentHeaterCoolerState');

    const readProperty = await readAnalogInput(this.ipAddress, this.stateObjects.currentHeaterCoolerState['instance'], 85);
    // @ts-ignore
    const value = readProperty['values'][0]['value'];
    this.platform.log.debug(`Read value from AI: ${String(value)}`);
    this.internalStates.currentHeaterCoolerState = value;

    callback(null, this.internalStates.currentHeaterCoolerState);
  }

  /**
   * Reads the target heater / cooler state state from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getTargetHeaterCoolerState(callback) {
    this.platform.log.debug('GET TargetHeaterCoolerState');

    const readProperty = await readAnalogValue(this.ipAddress, this.stateObjects.targetHeaterCoolerState['instance'], 85);
    // @ts-ignore
    const value = readProperty['values'][0]['value'];
    this.platform.log.debug(`Read value from AV: ${String(value)}`);
    this.internalStates.targetHeaterCoolerState = value;

    callback(null, this.internalStates.targetHeaterCoolerState);
  }

  /**
   * Writes the value passed from homebridge to the
   * configured BACnet object and updates the
   * internal state.
   * @param value Value passed from homebridge
   * @param callback Callback from homebridge
   */
  async setTargetHeaterCoolerState(value, callback) {
    this.platform.log.debug('SET TargetHeaterCoolerState');

    this.internalStates.targetHeaterCoolerState = value;

    callback(null);

    const returnedValue = await writeAnalogValue(this.ipAddress, this.stateObjects.targetHeaterCoolerState['instance'], 85, value);
    
    this.platform.log.debug(`Written value to AV: ${String(returnedValue)}`);
    this.internalStates.targetHeaterCoolerState = value;
  }

  /**
   * Reads the current temperature from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getCurrentTemperature(callback) {
    this.platform.log.debug('GET CurrentTemperature');

    const readProperty = await readAnalogInput(this.ipAddress, this.stateObjects.currentTemperature['instance'], 85);
    // @ts-ignore
    const value = readProperty['values'][0]['value'];
    this.platform.log.debug(`Read value from AI: ${String(value)}`);
    this.internalStates.currentTemperature = value;

    callback(null, this.internalStates.currentTemperature);
  }

  /**
   * Reads the cooling threshold temperature from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getCoolingThresholdTemperature(callback) {
    this.platform.log.debug('GET CoolingThresholdTemperature');

    const readProperty = await readAnalogValue(this.ipAddress, this.stateObjects.coolingThresholdTemperature['instance'], 85);
    // @ts-ignore
    const value = readProperty['values'][0]['value'];
    this.platform.log.debug(`Read value from AI: ${String(value)}`);
    this.internalStates.coolingThresholdTemperature = value;

    callback(null, this.internalStates.coolingThresholdTemperature);
  }

  /**
   * Writes the value passed from homebridge to the
   * configured BACnet object and updates the
   * internal state.
   * @param value Value passed from homebridge
   * @param callback Callback from homebridge
   */
  async setCoolingThresholdTemperature(value, callback) {
    this.platform.log.debug('SET CoolingThresholdTemperature');

    this.internalStates.coolingThresholdTemperature = value;

    callback(null);

    const returnedValue = await writeAnalogValue(this.ipAddress, this.stateObjects.coolingThresholdTemperature['instance'], 85, value);

    this.platform.log.debug(`Written value to AV: ${String(returnedValue)}`);
    this.internalStates.coolingThresholdTemperature = value;
  }

  /**
   * Reads the heating threshold temperature from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getHeatingThresholdTemperature(callback) {
    this.platform.log.debug('GET HeatingThresholdTemperature');

    const readProperty = await readAnalogValue(this.ipAddress, this.stateObjects.heatingThresholdTemperature['instance'], 85);
    // @ts-ignore
    const value = readProperty['values'][0]['value'];
    this.platform.log.debug(`Read value from AI: ${String(value)}`);
    this.internalStates.heatingThresholdTemperature = value;

    callback(null, this.internalStates.heatingThresholdTemperature);
  }

  /**
   * Writes the value passed from homebridge to the
   * configured BACnet object and updates the
   * internal state.
   * @param value Value passed from homebridge
   * @param callback Callback from homebridge
   */
  async setHeatingThresholdTemperature(value, callback) {
    this.platform.log.debug('SET HeatingThresholdTemperature');

    this.internalStates.heatingThresholdTemperature = value;

    callback(null);

    const returnedValue = await writeAnalogValue(this.ipAddress, this.stateObjects.heatingThresholdTemperature['instance'], 85, value);

    this.platform.log.debug(`Written value to AV: ${String(returnedValue)}`);
    this.internalStates.heatingThresholdTemperature = value;
  }
}
