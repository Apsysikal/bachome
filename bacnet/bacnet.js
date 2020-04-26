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

function writeBinaryInput(ipAddress, instance, propertyId, value) {
  return new Promise((resolve, reject) => {
    const propertyObject = {
      type: bacnet.enum.ObjectTypes.OBJECT_BINARY_INPUT,
      instance: instance,
    };

    const valueObject = generateValueObjectFromValue(value);

    client.writeProperty(
      ipAddress,
      propertyObject,
      propertyId,
      valueObject,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

function writeBinaryValue(ipAddress, instance, propertyId, value) {
  return new Promise((resolve, reject) => {
    const propertyObject = {
      type: bacnet.enum.ObjectTypes.OBJECT_BINARY_VALUE,
      instance: instance,
    };

    const valueObject = generateValueObjectFromValue(value);

    client.writeProperty(
      ipAddress,
      propertyObject,
      propertyId,
      valueObject,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

function writeBinaryOutput(ipAddress, instance, propertyId, value) {
  return new Promise((resolve, reject) => {
    const propertyObject = {
      type: bacnet.enum.ObjectTypes.OBJECT_BINARY_OUTPUT,
      instance: instance,
    };

    const valueObject = generateValueObjectFromValue(value);

    client.writeProperty(
      ipAddress,
      propertyObject,
      propertyId,
      valueObject,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

function writeAnalogInput(ipAddress, instance, propertyId, value) {
  return new Promise((resolve, reject) => {
    const propertyObject = {
      type: bacnet.enum.ObjectTypes.OBJECT_ANALOG_INPUT,
      instance: instance,
    };

    const valueObject = generateValueObjectFromValue(value);

    client.writeProperty(
      ipAddress,
      propertyObject,
      propertyId,
      valueObject,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

function writeAnalogValue(ipAddress, instance, propertyId, value) {
  return new Promise((resolve, reject) => {
    const propertyObject = {
      type: bacnet.enum.ObjectTypes.OBJECT_ANALOG_VALUE,
      instance: instance,
    };

    const valueObject = generateValueObjectFromValue(value);

    client.writeProperty(
      ipAddress,
      propertyObject,
      propertyId,
      valueObject,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

function writeAnalogOutput(ipAddress, instance, propertyId, value) {
  return new Promise((resolve, reject) => {
    const propertyObject = {
      type: bacnet.enum.ObjectTypes.OBJECT_ANALOG_OUTPUT,
      instance: instance,
    };

    const valueObject = generateValueObjectFromValue(value);

    client.writeProperty(
      ipAddress,
      propertyObject,
      propertyId,
      valueObject,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

function generateValueObjectFromValue(value) {
  let valueObject = [];

  switch (typeof value) {
    case "number":
      valueObject[0] = {
        tag: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_REAL,
        value: value,
      };
      break;

    case "boolean":
      valueObject[0] = {
        tag: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_BOOLEAN,
        // Bacnet uses 0 and 1 instead of false and true
        value: Number(value),
      };
      break;

    case "string":
      valueObject[0] = {
        tag:
          bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_CHARACTER_STRING,
        value: value,
      };
      break;

    default:
      break;
  }

  return valueObject;
}

module.exports = {
  readAnalogInput: readAnalogInput,
  readAnalogOutput: readAnalogOutput,
  readAnalogValue: readAnalogValue,
  readBinaryInput: readBinaryInput,
  readBinaryOutput: readBinaryOutput,
  readBinaryValue: readBinaryValue,
  writeAnalogInput: writeAnalogInput,
  writeAnalogOutput: writeAnalogOutput,
  writeAnalogValue: writeAnalogValue,
  writeBinaryInput: writeBinaryInput,
  writeBinaryOutput: writeBinaryOutput,
  writeBinaryValue: writeBinaryValue,
};
