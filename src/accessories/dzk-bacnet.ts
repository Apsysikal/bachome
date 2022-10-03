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
    asyncReadPresentValue,
    asyncWritePresentValue
} from "../bacnet/bacnet";

function dzk_to_hap_heatcool_state(dzk) {
    /*
    TargetHeatingCoolingState.OFF = 0;
    TargetHeatingCoolingState.HEAT = 1;
    TargetHeatingCoolingState.COOL = 2;
    TargetHeatingCoolingState.AUTO = 3;
    */
}
function hap_to_dzk_heatcool_state(hap) {
}

/*
 * farenheit to celsius and back
 *   these are used when the device is configured to send farenheit
 *   values instead of celsius.  The config parameter 'deviceUnits' controls
 *   whether or not the conversion happens.
 */
function f2c(ff) {
    var cc = (ff - 32) * 5/9;
    return cc;
}

function c2f(cc) {
    var ff = (cc * 9/5) + 32;
    return ff;
}

/*
 * https://www.daikinac.com/content/assets/DOC/QuickGuides/QG-DZK-BACNET-3_A4_EN_200.pdf
 * organized by global and zone settings
 */

/*
 *
 * Global Characteristics:
 *   CurrentFanState
 *
 */

/*
  * Per-Zone Characteristics:
  *   CurrentRelativeHumidity
  *     read direct from bacnet object
  *   CurrentTemperature
  *     read direct from bacnet object
  *   TargetTemperature
  *     read from one of two bacnet objects, depending on global heat/cool state
  *   CurrentHeatingCoolingState
  *     read from global objecrt
  *   TargetHeatingCoolingState (only off or auto)
  *     is global state
  *
  */

/*
 * 
 * Zone ON/OFF
 *   0 off
 *   1 on
 */

/*
 * DZK Operation Mode:
 *     auto: 1
 *     cool: 2
 *     heat: 3
 *      dry: 4
 */
/* User Mode:
 *   stop: 1
 *   comfort: 2
 *   unoccupied: 3
 *   night-time: 4
 *   eco: 5
 *   vacation: 6
 * 
 */

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class DzkZoneAccessory {
    private service: Service;

    private internalStates = {
	currentHeatingCoolingState: 0,
	targetHeatingCoolingState: 0,
	currentTemperature: 20.5,
	targetTemperature: 22.5,
	currentRelativeHumidity: 42.2,
	temperatureDisplayUnits: 0,
    };

    private ipAddress : String = "";

    private dzkz : DzkZone;
    private zconfig : Object; // config object

    constructor(
	private readonly platform: BachomeHomebridgePlatform,
	public readonly config: Object,
	private readonly accessory: PlatformAccessory
    ) {
	// set accessory information
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	this.accessory
	    .getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(
        this.platform.Characteristic.Manufacturer,
        "Daikin"
      )
      .setCharacteristic(
        this.platform.Characteristic.Model,
        "DZK-BACNET-3"
      )
      .setCharacteristic(
        this.platform.Characteristic.SerialNumber,
        "DZK-BACNET-3-zone-" + accessory.context.device.zone
      );

	this.zconfig = config;
	this.dzkz = new DzkZone(config["zone"]);

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
	    .getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
	    .on("get", this.getCurrentRelativeHumidity.bind(this));

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
	
	callback(null, this.internalStates.currentHeatingCoolingState);

	try {
	    /*
	    const readProperty = await readAnalogInput(
		this.ipAddress,
		this.stateObjects.currentHeatingCoolingState["instance"],
		85
	    );
	    // @ts-ignore
	    const value = readProperty["values"][0]["value"];
	    this.platform.log.debug(`Read value from AI: ${String(value)}`);
	    this.internalStates.currentHeatingCoolingState = value;
	    */
	} catch (error) {
	    this.platform.log.error(`An error occured: ${error}`);
	}
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
	
	callback(null, this.internalStates.targetHeatingCoolingState);

	try {
	    /*
	    const readProperty = await readAnalogValue(
		this.ipAddress,
		this.stateObjects.targetHeatingCoolingState["instance"],
		85
	    );
	    // @ts-ignore
	    const value = readProperty["values"][0]["value"];
	    this.platform.log.debug(`Read value from AV: ${String(value)}`);
	    this.internalStates.targetHeatingCoolingState = value;
	    */
	} catch (error) {
	    this.platform.log.error(`An error occured: ${error}`);
	}
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

	try {
	    /*
	    const returnedValue = await writeAnalogValue(
		this.ipAddress,
		this.stateObjects.targetHeatingCoolingState["instance"],
		85,
		Number(value)
	    );

	    this.platform.log.debug(`Written value to AV: ${String(returnedValue)}`);
	    this.internalStates.targetHeatingCoolingState = Number(value);
	    */
	} catch (error) {
	    this.platform.log.error(`An error occured: ${error}`);
	}
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
	
	try {
	    /*
	    const readProperty = await readAnalogInput(
		this.ipAddress,
		this.stateObjects.currentTemperature["instance"],
		85
	    );
	    // @ts-ignore
	    const value = readProperty["values"][0]["value"];
	    this.platform.log.debug(`Read value from AI: ${String(value)}`);
	    this.internalStates.currentTemperature = value;
	    */
	} catch (error) {
	    this.platform.log.error(`An error occured: ${error}`);
	}
    }

  /**
   * Reads the current relative humidity from the
   * configured BACnet object and updates the internal state.
   * @param callback Callback from homebridge
   */
    async getCurrentRelativeHumidity(
    callback: CharacteristicGetCallback
    ): Promise<void> {
	this.platform.log.debug("GET CurrentRelativeHumidity");
	
	callback(null, this.internalStates.currentRelativeHumidity);
	
	try {
	    /*
	    const readProperty = await readAnalogInput(
		this.ipAddress,
		this.stateObjects.currentTemperature["instance"],
		85
	    );
	    // @ts-ignore
	    const value = readProperty["values"][0]["value"];
	    this.platform.log.debug(`Read value from AI: ${String(value)}`);
	    this.internalStates.currentRelativeHumidity = value;
	    */
	} catch (error) {
	    this.platform.log.error(`An error occured: ${error}`);
	}
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
	
	callback(null, this.internalStates.targetTemperature);
	
	try {
	    /*
	    const readProperty = await readAnalogValue(
		this.ipAddress,
		this.stateObjects.targetTemperature["instance"],
		85
	    );
	    // @ts-ignore
	    const value = readProperty["values"][0]["value"];
	    this.platform.log.debug(`Read value from AV: ${String(value)}`);
	    this.internalStates.targetTemperature = value;
	    */
	} catch (error) {
	    this.platform.log.error(`An error occured: ${error}`);
	}
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
	
	try {
	    /*
	    const returnedValue = await writeAnalogValue(
		this.ipAddress,
		this.stateObjects.targetTemperature["instance"],
		85,
		Number(value)
	    );
	    
	    this.platform.log.debug(`Written value to AV: ${String(returnedValue)}`);
	    this.internalStates.targetTemperature = Number(value);
	    */
	} catch (error) {
	    this.platform.log.error(`An error occured: ${error}`);
	}
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

class DzkZone {
    private static readonly dzk_objects = {
	"global": {
	    "iu-status-onoff": {"n":"BI:0","d":"IU Status ON/OFF","rw":"R"},
	    "dzk-system-input-alarm": {"n":"BI:1","d":"DZK system input alarm","rw":"R"},
	    "dzk-global-fan": {"n":"BV:0","d":"DZK Global Fan","rw":"R"},
	    "dzk-aux-heat1": {"n":"BV:1","d":"DZK Aux Heat1","rw":"R"},
	    "dzk-aux-heat2": {"n":"BV:2","d":"DZK Aux Heat2","rw":"R"},
	    "dzk-bacnet-communication-error": {"n":"BV:27","d":"DZK/BACnet Interface communication error","rw":"R"},
	    "iu-speed": {"n":"MI:0","d":"IU speed","rw":"R"},
	    "iu-errors": {"n":"MI:1","d":"IU errors","rw":"R"},
	    "dzk-error": {"n":"MI:2","d":"DZK error","rw":"R"},
	    "dzk-operation-mode": {"n":"MO:0","d":"DZK operation mode","rw":"R/W"},
	    "dzk-user-mode": {"n":"MO:1","d":"DZK user mode","rw":"R/W"},
	    "iu-set-point": {"n":"AV:0","d":"IU Set Point","rw":" R/W"},
	    "dzk-address": {"n":"AV:13","d":"DZK address (DK AirNet address)","rw":"R"},
	    "dzk-group-address": {"n":"AV:14","d":"DZK group address (DK group address)","rw":"R"},
	},

	"zone1": {
	    "onoff": {"n":"BV:3","d":"Z1 ON/OFF","rw":"R/W"},
	    "local-ventilation": {"n":"BV:4","d":"Z1 Local Ventilation","rw":"R/W"},
	    "vacation-override": {"n":"BV:5","d":"Z1 Vacation override","rw":"R"},
	    "unoccupied-override": {"n":"BV:6","d":"Z1 Unoccupied override","rw":"R"},
	    "room-temperature": {"n":"AI:0","d":"Z1 Room temperature","rw":"R"},
	    "heat-set-point": {"n":"AV:1","d":"Z1 Heat Set Point","rw":"R/W"},
	    "cold-set-point": {"n":"AV:2","d":"Z1 Cold Set Point","rw":"R/W"},
	    "humidity": {"n":"AV:33","d":"Z1 humidity","rw":"R"},
	    "cooling-demand": {"n":"AV:15","d":"Z1 cooling demand (%)","rw":"R"},
	    "heating-demand": {"n":"AV:16","d":"Z1 heating demand (%)","rw":"R"},
	    "aux-heating-demand-(%)": {"n":"AV:17","d":"Z1 aux heating demand (%)","rw":"R"},
	    "opening-step-damper": {"n":"MV:0","d":"Z1 opening step damper","rw":"R"},
	},

	"zone2": {
	    "onoff": {"n":"BV:7","d":"Z2 ON/OFF","rw":"R/W"},
	    "local-ventilation": {"n":"BV:8","d":"Z2 Local ventilation","rw":"R/W"},
	    "vacation-override": {"n":"BV:9","d":"Z2 Vacation override","rw":"R"},
	    "unoccupied-override": {"n":"BV:10","d":"Z2 Unoccupied override","rw":"R"},
	    "room-temperature": {"n":"AI:1","d":"Z2 Room temperature","rw":"R"},
	    "heat-set-point": {"n":"AV:3","d":"Z2 Heat Set Point","rw":"R/W"},
	    "cold-set-point": {"n":"AV:4","d":"Z2 Cold Set Point","rw":"R/W"},
	    "cooling-demand": {"n":"AV:18","d":"Z2 cooling demand (%)","rw":"R"},
	    "heating-demand": {"n":"AV:19","d":"Z2 heating demand (%)","rw":"R"},
	    "aux-heating-demand": {"n":"AV:20","d":"Z2 aux heating demand (%)","rw":"R"},
	    "humidity": {"n":"AV:34","d":"Z2 humidity","rw":"R"},
	    "opening-step-damper": {"n":"MV:1","d":"Z2 opening step damper","rw":"R"},
	},

	"zone3": {
	    "onoff": {"n":"BV:11","d":"Z3 ON/OFF","rw":"R/W"},
	    "local-ventilation": {"n":"BV:12","d":"Z3 Local ventilation","rw":"R/W"},
	    "vacation-override": {"n":"BV:13","d":"Z3 Vacation override","rw":"R"},
	    "unoccupied-override": {"n":"BV:14","d":"Z3 Unoccupied override","rw":"R"},
	    "room-temperature": {"n":"AI:2","d":"Z3 Room temperature","rw":"R"},
	    "heat-set-point": {"n":"AV:5","d":"Z3 Heat Set Point","rw":"R/W"},
	    "cold-set-point": {"n":"AV:6","d":"Z3 Cold Set Point","rw":"R/W"},
	    "cooling-demand": {"n":"AV:21","d":"Z3 cooling demand (%)","rw":"R"},
	    "heating-demand": {"n":"AV:22","d":"Z3 heating demand (%)","rw":"R"},
	    "aux-heating-demand": {"n":"AV:23","d":"Z3 aux heating demand (%)","rw":"R"},
	    "humidity": {"n":"AV:35","d":"Z3 humidity","rw":"R"},
	    "opening-step-damper": {"n":"MV:2","d":"Z3 opening step damper","rw":"R"},
	},

	"zone4": {
	    "onoff": {"n":"BV:15","d":"Z4 ON/OFF","rw":"R/W"},
	    "local-ventilation": {"n":"BV:16","d":"Z4 Local ventilation","rw":"R/W"},
	    "vacation-override": {"n":"BV:17","d":"Z4 Vacation override","rw":"R"},
	    "unoccupied-override": {"n":"BV:18","d":"Z4 Unoccupied override","rw":"R"},
	    "room-temperature": {"n":"AI:3","d":"Z4 Room temperature","rw":"R"},
	    "heat-set-point": {"n":"AV:7","d":"Z4 Heat Set Point","rw":"R/W"},
	    "cold-set-point": {"n":"AV:8","d":"Z4 Cold Set Point","rw":"R/W"},
	    "cooling-demand": {"n":"AV:24","d":"Z4 cooling demand (%)","rw":"R"},
	    "heating-demand": {"n":"AV:25","d":"Z4 heating demand (%)","rw":"R"},
	    "aux-heating-demand": {"n":"AV:26","d":"Z4 aux heating demand (%)","rw":"R"},
	    "humidity": {"n":"AV:36","d":"Z4 humidity","rw":"R"},
	    "opening-step-damper": {"n":"MV:3","d":"Z4 opening step damper","rw":"R"},
	},

	"zone5": {
	    "onoff": {"n":"BV:19","d":"Z5 ON/OFF","rw":"R/W"},
	    "local-ventilation": {"n":"BV:20","d":"Z5 Local ventilation","rw":"R/W"},
	    "vacation-override": {"n":"BV:21","d":"Z5 Vacation override","rw":"R"},
	    "unoccupied-override": {"n":"BV:22","d":"Z5 Unoccupied override","rw":"R"},
	    "room-temperature": {"n":"AI:4","d":"Z5 Room temperature","rw":" R"},
	    "heat-set-point": {"n":"AV:9","d":"Z5 Heat Set Point","rw":"R/W"},
	    "cold-set-point": {"n":"AV:10","d":"Z5 Cold Set Point","rw":"R/W"},
	    "cooling-demand": {"n":"AV:27","d":"Z5 cooling demand (%)","rw":"R"},
	    "heating-demand": {"n":"AV:28","d":"Z5 heating demand (%)","rw":"R"},
	    "aux-heating-demand": {"n":"AV:29","d":"Z5 aux heating demand (%)","rw":"R"},
	    "humidity": {"n":"AV:37","d":"Z5 humidity","rw":"R"},
	    "opening-step-damper": {"n":"MV:4","d":"Z5 opening step damper","rw":"R"},
	},

	"zone6": {
	    "onoff": {"n":"BV:23","d":"Z6 ON/OFF","rw":"R/W"},
	    "local-ventilation": {"n":"BV:24","d":"Z6 Local ventilation","rw":"R/W"},
	    "vacation-override": {"n":"BV:25","d":"Z6 Vacation override","rw":"R"},
	    "unoccupied-override": {"n":"BV:26","d":"Z6 Unoccupied override","rw":"R"},
	    "room-temperature": {"n":"AI:5","d":"Z6 Room temperature","rw":" R"},
	    "heat-set-point": {"n":"AV:11","d":"Z6 Heat Set Point","rw":"R/W"},
	    "cold-set-point": {"n":"AV:12","d":"Z6 Cold Set Point","rw":"R/W"},
	    "cooling-demand": {"n":"AV:30","d":"Z6 cooling demand (%)","rw":"R"},
	    "heating-demand": {"n":"AV:31","d":"Z6 heating demand (%)","rw":"R"},
	    "aux-heating-demand": {"n":"AV:32","d":"Z6 aux heating demand (%)","rw":"R"},
	    "humidity": {"n":"AV:38","d":"Z6 humidity","rw":"R"},
	    "opening-step-damper": {"n":"MV:5","d":"Z6 opening step damper","rw":"R"},
	}
    };

    private ipAddress = "";
    private dzkob : Object = {};
    constructor(private readonly zno : Number) {
	console.log("DzkZone Constructor: zone" + zno);
    }
}
