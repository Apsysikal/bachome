/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Service,
  PlatformAccessory,
  CharacteristicGetCallback,
  CharacteristicValue,
  CharacteristicSetCallback,
} from "homebridge";

import { BachomeHomebridgePlatform } from "../platform";
import { objectStringParser } from "../bacnet/parser";
import {
  readAnalogInput,
  readAnalogValue,
  writeAnalogValue,
} from "../bacnet/bacnet";

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
  };

  private stateObjects = {
    currentHeatingCoolingState: {},
    targetHeatingCoolingState: {},
    currentTemperature: {},
    targetTemperature: {},
  };

  private ipAddress = "";

  constructor(
    private readonly platform: BachomeHomebridgePlatform,
    private readonly accessory: PlatformAccessory
  ) {
    // set accessory information
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      this.accessory.getService(this.platform.Service.Thermostat) ||
      this.accessory.addService(this.platform.Service.Thermostat);

    // To avoid "Cannot add a Service with the same UUID another Service without also defining a unique 'subtype' property." error,
    // when creating multiple services of the same type, you need to use the following syntax to specify a name and subtype id:
    // this.accessory.getService('NAME') ?? this.accessory.addService(this.platform.Service.Lightbulb, 'NAME', 'USER_DEFINED_SUBTYPE');

    // Read the service name form the accessory context (config file passed via platform)
    this.service.setCharacteristic(
      this.platform.Characteristic.Name,
      accessory.context.device.name
    );

    this.stateObjects["currentHeatingCoolingState"] = objectStringParser(
      accessory.context.device.currentHeatingCoolingState
    );
    this.stateObjects["targetHeatingCoolingState"] = objectStringParser(
      accessory.context.device.targetHeatingCoolingState
    );
    this.stateObjects["currentTemperature"] = objectStringParser(
      accessory.context.device.currentTemperature
    );
    this.stateObjects["targetTemperature"] = objectStringParser(
      accessory.context.device.targetTemperature
    );

    this.ipAddress = accessory.context.device.ipAddress;

    // register handlers for mandatory characteristics
    this.service
      .getCharacteristic(
        this.platform.Characteristic.CurrentHeatingCoolingState
      )
      .on("get", this.getCurrentHeatingCoolingState.bind(this));

    this.service
      .getCharacteristic(this.platform.Characteristic.TargetHeatingCoolingState)
      .on("set", this.setTargetHeatingCoolingState.bind(this))
      .on("get", this.getTargetHeatingCoolingState.bind(this));

    this.service
      .getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .on("get", this.getCurrentTemperature.bind(this));

    this.service
      .getCharacteristic(this.platform.Characteristic.TargetTemperature)
      .on("set", this.setTargetTemperature.bind(this))
      .on("get", this.getTargetTemperature.bind(this));

    this.service
      .getCharacteristic(this.platform.Characteristic.TemperatureDisplayUnits)
      .on("set", this.setTemperatureDisplayUnits.bind(this))
      .on("get", this.getTemperatureDisplayUnits.bind(this));
  }

  /**
   * Reads the current heating / cooling state from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getCurrentHeatingCoolingState(
    callback: CharacteristicGetCallback
  ): Promise<void> {
    this.platform.log.debug("GET CurrentHeatingCoolingState");

    const readProperty = await readAnalogInput(
      this.ipAddress,
      this.stateObjects.currentHeatingCoolingState["instance"],
      85
    );
    // @ts-ignore
    const value = readProperty["values"][0]["value"];
    this.platform.log.debug(`Read value from AI: ${String(value)}`);
    this.internalStates.currentHeatingCoolingState = value;

    callback(null, this.internalStates.currentHeatingCoolingState);
  }

  /**
   * Reads the target heating / cooling state from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getTargetHeatingCoolingState(
    callback: CharacteristicGetCallback
  ): Promise<void> {
    this.platform.log.debug("GET TargetHeatingCoolingState");

    const readProperty = await readAnalogValue(
      this.ipAddress,
      this.stateObjects.targetHeatingCoolingState["instance"],
      85
    );
    // @ts-ignore
    const value = readProperty["values"][0]["value"];
    this.platform.log.debug(`Read value from AV: ${String(value)}`);
    this.internalStates.targetHeatingCoolingState = value;

    callback(null, this.internalStates.targetHeatingCoolingState);
  }

  /**
   * Writes the value passed from homebridge to the
   * configured BACnet object and updates the
   * internal state.
   * @param value Value passed from homebridge
   * @param callback Callback from homebridge
   */
  async setTargetHeatingCoolingState(
    value: CharacteristicValue,
    callback: CharacteristicSetCallback
  ): Promise<void> {
    this.platform.log.debug("SET TargetHeatingCoolingState");

    this.internalStates.targetHeatingCoolingState = Number(value);

    callback(null);

    const returnedValue = await writeAnalogValue(
      this.ipAddress,
      this.stateObjects.targetHeatingCoolingState["instance"],
      85,
      value
    );

    this.platform.log.debug(`Written value to AV: ${String(returnedValue)}`);
    this.internalStates.targetHeatingCoolingState = Number(value);
  }

  /**
   * Reads the current temperature from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getCurrentTemperature(
    callback: CharacteristicGetCallback
  ): Promise<void> {
    this.platform.log.debug("GET CurrentTemperature");

    const readProperty = await readAnalogInput(
      this.ipAddress,
      this.stateObjects.currentTemperature["instance"],
      85
    );
    // @ts-ignore
    const value = readProperty["values"][0]["value"];
    this.platform.log.debug(`Read value from AI: ${String(value)}`);
    this.internalStates.currentTemperature = value;

    callback(null, this.internalStates.currentTemperature);
  }

  /**
   * Reads the target temperature from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getTargetTemperature(
    callback: CharacteristicGetCallback
  ): Promise<void> {
    this.platform.log.debug("GET TargetTemperature");

    const readProperty = await readAnalogValue(
      this.ipAddress,
      this.stateObjects.targetTemperature["instance"],
      85
    );
    // @ts-ignore
    const value = readProperty["values"][0]["value"];
    this.platform.log.debug(`Read value from AV: ${String(value)}`);
    this.internalStates.targetTemperature = value;

    callback(null, this.internalStates.targetTemperature);
  }

  /**
   * Writes the value passed from homebridge to the
   * configured BACnet object and updates the
   * internal state.
   * @param value Value passed from homebridge
   * @param callback Callback from homebridge
   */
  async setTargetTemperature(
    value: CharacteristicValue,
    callback: CharacteristicSetCallback
  ): Promise<void> {
    this.platform.log.debug("SET TargetTemperature");

    this.internalStates.targetTemperature = Number(value);

    callback(null);

    const returnedValue = await writeAnalogValue(
      this.ipAddress,
      this.stateObjects.targetTemperature["instance"],
      85,
      value
    );

    this.platform.log.debug(`Written value to AV: ${String(returnedValue)}`);
    this.internalStates.targetTemperature = Number(value);
  }

  /**
   * Reads the display units from the
   * internal state.
   * @param callback Callback from homebridge
   */
  getTemperatureDisplayUnits(callback: CharacteristicGetCallback): void {
    this.platform.log.debug("GET TemperatureDisplayUnits");

    callback(null, this.internalStates.temperatureDisplayUnits);
  }

  /**
   * Writes the value passed from homebridge to the
   * internal state.
   * @param value Value passed from homebridge
   * @param callback Callback from homebridge
   */
  setTemperatureDisplayUnits(
    value: CharacteristicValue,
    callback: CharacteristicSetCallback
  ): void {
    this.platform.log.debug("SET TemperatureDisplayUnits");

    this.internalStates.temperatureDisplayUnits = Number(value);

    callback(null);
  }
}
