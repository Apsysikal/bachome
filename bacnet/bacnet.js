/// <reference path="../node_modules/bacstack/index.js" />
/// <reference path="../node_modules/bacstack/lib/client.js" />
/// <reference path="../node_modules/bacstack/lib/enum.js" />

const bacnet = require("bacstack");

const client = new bacnet();

function readBinaryInput(ipAddress, instance, propertyId) {
  return new Promise((resolve, reject) => {
    const propertyObject = {
      type: bacnet.enum.ObjectTypes.OBJECT_BINARY_INPUT,
      instance: instance,
    };

    client.readProperty(
      ipAddress,
      propertyObject,
      propertyId,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

function readBinaryValue(ipAddress, instance, propertyId) {
  return new Promise((resolve, reject) => {
    const propertyObject = {
      type: bacnet.enum.ObjectTypes.OBJECT_BINARY_VALUE,
      instance: instance,
    };

    client.readProperty(
      ipAddress,
      propertyObject,
      propertyId,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

function readBinaryOutput(ipAddress, instance, propertyId) {
  return new Promise((resolve, reject) => {
    const propertyObject = {
      type: bacnet.enum.ObjectTypes.OBJECT_BINARY_OUTPUT,
      instance: instance,
    };

    client.readProperty(
      ipAddress,
      propertyObject,
      propertyId,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

function readAnalogInput(ipAddress, instance, propertyId) {
  return new Promise((resolve, reject) => {
    const propertyObject = {
      type: bacnet.enum.ObjectTypes.OBJECT_ANALOG_INPUT,
      instance: instance,
    };

    client.readProperty(
      ipAddress,
      propertyObject,
      propertyId,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

function readAnalogValue(ipAddress, instance, propertyId) {
  return new Promise((resolve, reject) => {
    const propertyObject = {
      type: bacnet.enum.ObjectTypes.OBJECT_ANALOG_VALUE,
      instance: instance,
    };

    client.readProperty(
      ipAddress,
      propertyObject,
      propertyId,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

function readAnalogOutput(ipAddress, instance, propertyId) {
  return new Promise((resolve, reject) => {
    const propertyObject = {
      type: bacnet.enum.ObjectTypes.OBJECT_ANALOG_OUTPUT,
      instance: instance,
    };

    client.readProperty(
      ipAddress,
      propertyObject,
      propertyId,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

module.exports = {
  readAnalogInput: readAnalogInput,
  readAnalogOutput: readAnalogOutput,
  readAnalogValue: readAnalogValue,
  readBinaryInput: readBinaryInput,
  readBinaryOutput: readBinaryOutput,
  readBinaryValue: readBinaryValue,
};
