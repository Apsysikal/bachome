/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Service, PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback } from 'homebridge';

import { ExampleHomebridgePlatform } from '../platform';
import { objectStringParser } from '../bacnet/parser';
import { readBinaryInput, readBinaryOutput, readBinaryValue, writeBinaryInput, writeBinaryOutput, writeBinaryValue } from '../bacnet/bacnet';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class BachomeSwitchAccessory {
  private service: Service;

  private internalState = {
    On: false,
  }

  private stateObjects = {
    On: {},
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

    this.service = this.accessory.getService(this.platform.Service.Switch) || this.accessory.addService(this.platform.Service.Switch);

    // To avoid "Cannot add a Service with the same UUID another Service without also defining a unique 'subtype' property." error,
    // when creating multiple services of the same type, you need to use the following syntax to specify a name and subtype id:
    // this.accessory.getService('NAME') ?? this.accessory.addService(this.platform.Service.Lightbulb, 'NAME', 'USER_DEFINED_SUBTYPE');

    // Read the service name form the accessory context (config file passed via platform)
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.name);

    this.stateObjects['On'] = objectStringParser(accessory.context.device.stateObject);

    this.ipAddress = accessory.context.device.ipAddress;
    
    this.platform.log.debug(String(this.stateObjects.On['type']));
    this.platform.log.debug(String(this.stateObjects.On['instance']));

    // register handlers for the On/Off Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.On)
      .on('set', this.setOn.bind(this))
      .on('get', this.getOn.bind(this));
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  async setOn(value: CharacteristicValue, callback: CharacteristicSetCallback) {

    // implement your own code to turn your device on/off
    this.internalState.On = value as boolean;

    this.platform.log.debug('Set Characteristic On ->', value);

    // you must call the callback function
    callback(null);

    try {
      switch (this.stateObjects.On['typeText']) {
        case 'BI': {
          let returnedValue = await writeBinaryInput(this.ipAddress, this.stateObjects.On['instance'], 85, value);
          // @ts-ignore
          returnedValue = returnedValue['values'][0]['value'];
          this.platform.log.debug(`Written value to BI: ${String(returnedValue)}`);
          this.internalState.On = Boolean(value);
          break;
        }

        case 'BO': {
          let returnedValue = await writeBinaryOutput(this.ipAddress, this.stateObjects.On['instance'], 85, value);
          // @ts-ignore
          returnedValue = returnedValue['values'][0]['value'];
          this.platform.log.debug(`Written value to BO: ${String(returnedValue)}`);
          this.internalState.On = Boolean(value);
          break;
        }

        case 'BV': {
          this.platform.log.debug(`Trying to write ${this.stateObjects.On['typeText']}:${this.stateObjects.On['instance']}`);
          const returnedValue = await writeBinaryValue(this.ipAddress, this.stateObjects.On['instance'], 85, Boolean(value));
          // @ts-ignore
          this.platform.log.debug(`Written value to BV: ${String(returnedValue)}`);
          this.internalState.On = Boolean(value);
          break;
        }

        default:
          break;
      }
    } catch (error) {
      this.platform.log.debug(String(error));
    }
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   * 
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   * 
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */
  async getOn(callback: CharacteristicGetCallback) {

    // implement your own code to check if the device is on
    const isOn = this.internalState.On;

    this.platform.log.debug('Get Characteristic On ->', isOn);

    // you must call the callback function
    // the first argument should be null if there were no errors
    // the second argument should be the value to return

    try {
      switch (this.stateObjects.On['typeText']) {
        case 'BI': {
          let value = await readBinaryInput(this.ipAddress, this.stateObjects.On['instance'], 85);
          // @ts-ignore
          value = value['values'][0]['value'];
          this.platform.log.debug(`Read value from BI: ${String(value)}`);
          this.internalState.On = Boolean(value);
          break;
        }

        case 'BO': {
          let value = await readBinaryOutput(this.ipAddress, this.stateObjects.On['instance'], 85);
          // @ts-ignore
          value = value['values'][0]['value'];
          this.platform.log.debug(`Read value from BO: ${String(value)}`);
          this.internalState.On = Boolean(value);
          break;
        }

        case 'BV': {
          const readProperty = await readBinaryValue(this.ipAddress, this.stateObjects.On['instance'], 85);
          // @ts-ignore
          const value = readProperty['values'][0]['value'];
          this.platform.log.debug(`Read value from BV: ${String(value)}`);
          this.internalState.On = Boolean(value);
          break;
        }

        default:
          break;
      }

      callback(null, isOn);
    } catch (error) {
      this.platform.log.debug(String(error));
    }
  }
}
