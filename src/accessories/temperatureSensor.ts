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
  readAnalogInput,
  readAnalogValue,
  readAnalogOutput,
} from "../bacnet/bacnet";

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class BachomeTemperatureSensorAccessory {
  private service: Service;

  private internalState = {
    CurrentTemperature: 20.0,
  };

  private stateObjects = {
    CurrentTemperature: {},
  };

  private ipAddress = "";

  constructor(
    private readonly platform: BachomeHomebridgePlatform,
    private readonly accessory: PlatformAccessory
  ) {
    // set accessory information
    this.accessory
      .getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(
        this.platform.Characteristic.Manufacturer,
        accessory.context.device.manufacturer
      )
      .setCharacteristic(
        this.platform.Characteristic.Model,
        accessory.context.device.model
      )
      .setCharacteristic(
        this.platform.Characteristic.SerialNumber,
        accessory.context.device.serial
      );

    this.service =
      this.accessory.getService(this.platform.Service.TemperatureSensor) ||
      this.accessory.addService(this.platform.Service.TemperatureSensor);

    // To avoid "Cannot add a Service with the same UUID another Service without also defining a unique 'subtype' property." error,
    // when creating multiple services of the same type, you need to use the following syntax to specify a name and subtype id:
    // this.accessory.getService('NAME') ?? this.accessory.addService(this.platform.Service.Lightbulb, 'NAME', 'USER_DEFINED_SUBTYPE');

    // Read the service name form the accessory context (config file passed via platform)
    this.service.setCharacteristic(
      this.platform.Characteristic.Name,
      accessory.context.device.name
    );

    this.stateObjects["CurrentTemperature"] = objectStringParser(
      accessory.context.device.stateObject
    );

    this.ipAddress = accessory.context.device.ipAddress;

    this.platform.log.debug(
      String(this.stateObjects.CurrentTemperature["type"])
    );
    this.platform.log.debug(
      String(this.stateObjects.CurrentTemperature["instance"])
    );

    // register handlers for the On/Off Characteristic
    this.service
      .getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .on("get", this.getCurrentTemperature.bind(this));
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
  async getCurrentTemperature(callback: CharacteristicGetCallback) {
    // implement your own code to check if the device is on
    const currentTemperature = this.internalState.CurrentTemperature;

    this.platform.log.debug(
      "Get Characteristic CurrentTemperature ->",
      currentTemperature
    );

    // you must call the callback function
    // the first argument should be null if there were no errors
    // the second argument should be the value to return
    callback(null, currentTemperature);

    try {
      switch (this.stateObjects.CurrentTemperature["typeText"]) {
        case "AI": {
          let value = await readAnalogInput(
            this.ipAddress,
            this.stateObjects.CurrentTemperature["instance"],
            85
          );
          // @ts-ignore
          value = value["values"][0]["value"];
          this.platform.log.debug(`Read value from BI: ${String(value)}`);
          this.internalState.CurrentTemperature = Number(value);
          this.service
            .getCharacteristic(this.platform.Characteristic.CurrentTemperature)
            .updateValue(Number(value));
          break;
        }

        case "AO": {
          let value = await readAnalogOutput(
            this.ipAddress,
            this.stateObjects.CurrentTemperature["instance"],
            85
          );
          // @ts-ignore
          value = value["values"][0]["value"];
          this.platform.log.debug(`Read value from BO: ${String(value)}`);
          this.internalState.CurrentTemperature = Number(value);
          this.service
            .getCharacteristic(this.platform.Characteristic.CurrentTemperature)
            .updateValue(Number(value));
          break;
        }

        case "AV": {
          const readProperty = await readAnalogValue(
            this.ipAddress,
            this.stateObjects.CurrentTemperature["instance"],
            85
          );
          // @ts-ignore
          const value = readProperty["values"][0]["value"];
          this.platform.log.debug(`Read value from BV: ${String(value)}`);
          this.internalState.CurrentTemperature = Number(value);
          this.service
            .getCharacteristic(this.platform.Characteristic.CurrentTemperature)
            .updateValue(Number(value));
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
