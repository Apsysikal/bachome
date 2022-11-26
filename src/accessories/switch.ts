/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Service,
  PlatformAccessory,
  CharacteristicValue,
  CharacteristicSetCallback,
  CharacteristicGetCallback,
} from "homebridge";

import { BachomeHomebridgePlatform } from "../platform";
import { objectStringParser } from "../bacnet/parser";
import {
  readBinaryInput,
  readBinaryOutput,
  readBinaryValue,
  writeBinaryInput,
  writeBinaryOutput,
  writeBinaryValue,
} from "../bacnet/bacnet";
import { SwitchContext } from "../types/switch";

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class BachomeSwitchAccessory {
  private service: Service;

  private internalState = {
    On: false,
  };

  private stateObjects = {
    On: {},
  };

  private ipAddress = "";

  constructor(
    private readonly platform: BachomeHomebridgePlatform,
    private readonly accessory: PlatformAccessory<SwitchContext>
  ) {
    const Service = platform.Service;
    const Characteristic = platform.Characteristic;
    const Log = platform.log;

    const { device } = accessory.context;
    const { manufacturer, model, serial } = device;

    // set accessory information
    accessory
      .getService(Service.AccessoryInformation)
      ?.setCharacteristic(Characteristic.Manufacturer, manufacturer)
      ?.setCharacteristic(Characteristic.Model, model)
      ?.setCharacteristic(Characteristic.SerialNumber, serial);

    this.service =
      this.accessory.getService(this.platform.Service.Switch) ||
      this.accessory.addService(this.platform.Service.Switch);

    // To avoid "Cannot add a Service with the same UUID another Service without also defining a unique 'subtype' property." error,
    // when creating multiple services of the same type, you need to use the following syntax to specify a name and subtype id:
    // this.accessory.getService('NAME') ?? this.accessory.addService(this.platform.Service.Lightbulb, 'NAME', 'USER_DEFINED_SUBTYPE');

    // Read the service name form the accessory context (config file passed via platform)
    this.service.setCharacteristic(Characteristic.Name, device.name);

    this.stateObjects["On"] = objectStringParser(device.stateObject);
    this.ipAddress = accessory.context.device.ipAddress;

    Log.debug(String(this.stateObjects.On["type"]));
    Log.debug(String(this.stateObjects.On["instance"]));

    // register handlers for the On/Off Characteristic
    this.service
      .getCharacteristic(Characteristic.On)
      .on("set", this.setOn.bind(this))
      .on("get", this.getOn.bind(this));
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  async setOn(
    value: CharacteristicValue,
    callback: CharacteristicSetCallback
  ): Promise<void> {
    const displayName = this.accessory.displayName;
    const functionName = arguments.callee.name;
    const log = this.platform.log;

    log.debug(`${displayName}:${functionName}:${value}`);

    this.internalState.On = Boolean(value);

    // you must call the callback function
    callback(null);

    let bacnetFunctionName = "";
    let returnedValue = false;

    const ipAddress = this.ipAddress;
    const instance = this.stateObjects.On["instance"];
    const propertyId = 85;

    try {
      switch (this.stateObjects.On["typeText"]) {
        case "BI": {
          bacnetFunctionName = writeBinaryInput.name;

          returnedValue = await writeBinaryInput(
            ipAddress,
            instance,
            propertyId,
            Boolean(value)
          );

          break;
        }

        case "BO": {
          bacnetFunctionName = writeBinaryOutput.name;

          returnedValue = await writeBinaryOutput(
            ipAddress,
            instance,
            propertyId,
            Boolean(value)
          );

          break;
        }

        case "BV": {
          bacnetFunctionName = writeBinaryValue.name;

          returnedValue = await writeBinaryValue(
            ipAddress,
            instance,
            propertyId,
            Boolean(value)
          );

          break;
        }

        default:
          return;
      }

      // @ts-ignore
      returnedValue = returnedValue["values"][0]["value"];

      log.debug(`
        ${displayName}:
        ${functionName}:
        ${bacnetFunctionName}:
        ${String(returnedValue)}
      `);

      this.internalState.On = Boolean(returnedValue);
    } catch (error) {
      log.debug(String(error));
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
  async getOn(callback: CharacteristicGetCallback): Promise<void> {
    // implement your own code to check if the device is on
    const isOn = this.internalState.On;

    this.platform.log.debug("Get Characteristic On ->", isOn);

    // you must call the callback function
    // the first argument should be null if there were no errors
    // the second argument should be the value to return
    callback(null, isOn);

    try {
      switch (this.stateObjects.On["typeText"]) {
        case "BI": {
          let value = await readBinaryInput(
            this.ipAddress,
            this.stateObjects.On["instance"],
            85
          );
          // @ts-ignore
          value = value["values"][0]["value"];
          this.platform.log.debug(`Read value from BI: ${String(value)}`);
          this.internalState.On = Boolean(value);
          this.service
            .getCharacteristic(this.platform.Characteristic.On)
            .updateValue(Boolean(value));
          break;
        }

        case "BO": {
          let value = await readBinaryOutput(
            this.ipAddress,
            this.stateObjects.On["instance"],
            85
          );
          // @ts-ignore
          value = value["values"][0]["value"];
          this.platform.log.debug(`Read value from BO: ${String(value)}`);
          this.internalState.On = Boolean(value);
          this.service
            .getCharacteristic(this.platform.Characteristic.On)
            .updateValue(Boolean(value));
          break;
        }

        case "BV": {
          const readProperty = await readBinaryValue(
            this.ipAddress,
            this.stateObjects.On["instance"],
            85
          );
          // @ts-ignore
          const value = readProperty["values"][0]["value"];
          this.platform.log.debug(`Read value from BV: ${String(value)}`);
          this.internalState.On = Boolean(value);
          this.service
            .getCharacteristic(this.platform.Characteristic.On)
            .updateValue(Boolean(value));
          break;
        }

        default:
          break;
      }
    } catch (error) {
      this.platform.log.debug(String(error));
    }
  }
}
