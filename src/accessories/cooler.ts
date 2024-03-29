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
  readBinaryValue,
  writeBinaryValue,
  readAnalogInput,
  readAnalogValue,
  writeAnalogValue,
} from "../bacnet/bacnet";

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
  };

  private stateObjects = {
    active: {},
    currentHeaterCoolerState: {},
    targetHeaterCoolerState: {},
    currentTemperature: {},
    coolingThresholdTemperature: {},
    heatingThresholdTemperature: {},
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
      this.accessory.getService(this.platform.Service.HeaterCooler) ||
      this.accessory.addService(this.platform.Service.HeaterCooler);

    // To avoid "Cannot add a Service with the same UUID another Service without also defining a unique 'subtype' property." error,
    // when creating multiple services of the same type, you need to use the following syntax to specify a name and subtype id:
    // this.accessory.getService('NAME') ?? this.accessory.addService(this.platform.Service.Lightbulb, 'NAME', 'USER_DEFINED_SUBTYPE');

    // Read the service name form the accessory context (config file passed via platform)
    this.service.setCharacteristic(
      this.platform.Characteristic.Name,
      accessory.context.device.name
    );

    this.stateObjects["active"] = objectStringParser(
      accessory.context.device.active
    );
    this.stateObjects["currentHeaterCoolerState"] = objectStringParser(
      accessory.context.device.currentHeaterCoolerState
    );
    this.stateObjects["targetHeaterCoolerState"] = objectStringParser(
      accessory.context.device.targetHeaterCoolerState
    );
    this.stateObjects["currentTemperature"] = objectStringParser(
      accessory.context.device.currentTemperature
    );
    this.stateObjects["coolingThresholdTemperature"] = objectStringParser(
      accessory.context.device.coolingThresholdTemperature
    );
    this.stateObjects["heatingThresholdTemperature"] = objectStringParser(
      accessory.context.device.heatingThresholdTemperature
    );

    this.ipAddress = accessory.context.device.ipAddress;

    this.service
      .getCharacteristic(this.platform.Characteristic.Active)
      .on("set", this.setActive.bind(this))
      .on("get", this.getActive.bind(this));

    this.service
      .getCharacteristic(this.platform.Characteristic.CurrentHeaterCoolerState)
      .on("get", this.getCurrentHeaterCoolerState.bind(this));

    this.service
      .getCharacteristic(this.platform.Characteristic.TargetHeaterCoolerState)
      .on("set", this.setTargetHeaterCoolerState.bind(this))
      .on("get", this.getTargetHeaterCoolerState.bind(this));

    this.service
      .getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .on("get", this.getCurrentTemperature.bind(this));

    this.service
      .getCharacteristic(
        this.platform.Characteristic.CoolingThresholdTemperature
      )
      .on("set", this.setCoolingThresholdTemperature.bind(this))
      .on("get", this.getCoolingThresholdTemperature.bind(this));

    this.service
      .getCharacteristic(
        this.platform.Characteristic.HeatingThresholdTemperature
      )
      .on("set", this.setHeatingThresholdTemperature.bind(this))
      .on("get", this.getHeatingThresholdTemperature.bind(this));
  }

  /**
   * Reads the active state from the configured BACnet object
   * and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getActive(callback: CharacteristicGetCallback): Promise<void> {
    this.platform.log.debug("GET Active");

    callback(null, this.internalStates.active);

    const readProperty = await readBinaryValue(
      this.ipAddress,
      this.stateObjects.active["instance"],
      85
    );
    // @ts-ignore
    const value = readProperty["values"][0]["value"];
    this.platform.log.debug(`Read value from BV: ${String(value)}`);
    this.internalStates.active = Boolean(value);
  }

  /**
   * Writes the value passed from homebridge to the
   * configured BACnet object and updates the
   * internal state.
   * @param value Value passed from homebridge
   * @param callback Callback from homebridge
   */
  async setActive(
    value: CharacteristicValue,
    callback: CharacteristicSetCallback
  ): Promise<void> {
    this.platform.log.debug("SET Active");

    this.platform.log.debug(
      `Trying to write ${this.stateObjects.active["typeText"]}:${this.stateObjects.active["instance"]}`
    );

    callback(null);

    const returnedValue = await writeBinaryValue(
      this.ipAddress,
      this.stateObjects.active["instance"],
      85,
      Boolean(value)
    );
    // @ts-ignore
    this.platform.log.debug(`Written value to BV: ${String(returnedValue)}`);
    this.internalStates.active = Boolean(value);
  }

  /**
   * Reads the current heater / cooler state state from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getCurrentHeaterCoolerState(
    callback: CharacteristicGetCallback
  ): Promise<void> {
    this.platform.log.debug("GET CurrentHeaterCoolerState");

    callback(null, this.internalStates.currentHeaterCoolerState);

    const readProperty = await readAnalogInput(
      this.ipAddress,
      this.stateObjects.currentHeaterCoolerState["instance"],
      85
    );
    // @ts-ignore
    const value = readProperty["values"][0]["value"];
    this.platform.log.debug(`Read value from AI: ${String(value)}`);
    this.internalStates.currentHeaterCoolerState = value;
  }

  /**
   * Reads the target heater / cooler state state from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getTargetHeaterCoolerState(
    callback: CharacteristicGetCallback
  ): Promise<void> {
    this.platform.log.debug("GET TargetHeaterCoolerState");

    callback(null, this.internalStates.targetHeaterCoolerState);

    const readProperty = await readAnalogValue(
      this.ipAddress,
      this.stateObjects.targetHeaterCoolerState["instance"],
      85
    );
    // @ts-ignore
    const value = readProperty["values"][0]["value"];
    this.platform.log.debug(`Read value from AV: ${String(value)}`);
    this.internalStates.targetHeaterCoolerState = value;
  }

  /**
   * Writes the value passed from homebridge to the
   * configured BACnet object and updates the
   * internal state.
   * @param value Value passed from homebridge
   * @param callback Callback from homebridge
   */
  async setTargetHeaterCoolerState(
    value: CharacteristicValue,
    callback: CharacteristicSetCallback
  ): Promise<void> {
    this.platform.log.debug("SET TargetHeaterCoolerState");

    this.internalStates.targetHeaterCoolerState = Number(value);

    callback(null);

    const returnedValue = await writeAnalogValue(
      this.ipAddress,
      this.stateObjects.targetHeaterCoolerState["instance"],
      85,
      Number(value)
    );

    this.platform.log.debug(`Written value to AV: ${String(returnedValue)}`);
    this.internalStates.targetHeaterCoolerState = Number(value);
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

    callback(null, this.internalStates.currentTemperature);

    const readProperty = await readAnalogInput(
      this.ipAddress,
      this.stateObjects.currentTemperature["instance"],
      85
    );
    // @ts-ignore
    const value = readProperty["values"][0]["value"];
    this.platform.log.debug(`Read value from AI: ${String(value)}`);
    this.internalStates.currentTemperature = value;
  }

  /**
   * Reads the cooling threshold temperature from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getCoolingThresholdTemperature(
    callback: CharacteristicGetCallback
  ): Promise<void> {
    this.platform.log.debug("GET CoolingThresholdTemperature");

    callback(null, this.internalStates.coolingThresholdTemperature);

    const readProperty = await readAnalogValue(
      this.ipAddress,
      this.stateObjects.coolingThresholdTemperature["instance"],
      85
    );
    // @ts-ignore
    const value = readProperty["values"][0]["value"];
    this.platform.log.debug(`Read value from AI: ${String(value)}`);
    this.internalStates.coolingThresholdTemperature = value;
  }

  /**
   * Writes the value passed from homebridge to the
   * configured BACnet object and updates the
   * internal state.
   * @param value Value passed from homebridge
   * @param callback Callback from homebridge
   */
  async setCoolingThresholdTemperature(
    value: CharacteristicValue,
    callback: CharacteristicSetCallback
  ): Promise<void> {
    this.platform.log.debug("SET CoolingThresholdTemperature");

    this.internalStates.coolingThresholdTemperature = Number(value);

    callback(null);

    const returnedValue = await writeAnalogValue(
      this.ipAddress,
      this.stateObjects.coolingThresholdTemperature["instance"],
      85,
      Number(value)
    );

    this.platform.log.debug(`Written value to AV: ${String(returnedValue)}`);
    this.internalStates.coolingThresholdTemperature = Number(value);
  }

  /**
   * Reads the heating threshold temperature from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
  async getHeatingThresholdTemperature(
    callback: CharacteristicGetCallback
  ): Promise<void> {
    this.platform.log.debug("GET HeatingThresholdTemperature");

    callback(null, this.internalStates.heatingThresholdTemperature);

    const readProperty = await readAnalogValue(
      this.ipAddress,
      this.stateObjects.heatingThresholdTemperature["instance"],
      85
    );
    // @ts-ignore
    const value = readProperty["values"][0]["value"];
    this.platform.log.debug(`Read value from AI: ${String(value)}`);
    this.internalStates.heatingThresholdTemperature = value;
  }

  /**
   * Writes the value passed from homebridge to the
   * configured BACnet object and updates the
   * internal state.
   * @param value Value passed from homebridge
   * @param callback Callback from homebridge
   */
  async setHeatingThresholdTemperature(
    value: CharacteristicValue,
    callback: CharacteristicSetCallback
  ): Promise<void> {
    this.platform.log.debug("SET HeatingThresholdTemperature");

    this.internalStates.heatingThresholdTemperature = Number(value);

    callback(null);

    const returnedValue = await writeAnalogValue(
      this.ipAddress,
      this.stateObjects.heatingThresholdTemperature["instance"],
      85,
      Number(value)
    );

    this.platform.log.debug(`Written value to AV: ${String(returnedValue)}`);
    this.internalStates.heatingThresholdTemperature = Number(value);
  }
}
