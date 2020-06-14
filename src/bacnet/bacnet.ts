import bacnet from 'bacstack';

const client = new bacnet();

export function readBinaryInput(ipAddress: string, instance: number, propertyId: number) {
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
      },
    );
  });
}
 
export function readBinaryValue(ipAddress: string, instance: number, propertyId: number) {
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
      },
    );
  });
}
 
export function readBinaryOutput(ipAddress: string, instance: number, propertyId: number) {
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
      },
    );
  });
}
 
export function readAnalogInput(ipAddress: string, instance: number, propertyId: number) {
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
      },
    );
  });
}
 
export function readAnalogValue(ipAddress: string, instance: number, propertyId: number) {
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
      },
    );
  });
}
 
export function readAnalogOutput(ipAddress: string, instance: number, propertyId: number) {
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
      },
    );
  });
}
 
export function writeBinaryInput(ipAddress: string, instance: number, propertyId: number, value) {
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
      },
    );
  });
}
 
export function writeBinaryValue(ipAddress: string, instance: number, propertyId: number, value) {
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
      },
    );
  });
}
 
export function writeBinaryOutput(ipAddress: string, instance: number, propertyId: number, value) {
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
      },
    );
  });
}
 
export function writeAnalogInput(ipAddress: string, instance: number, propertyId: number, value) {
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
      },
    );
  });
}
 
export function writeAnalogValue(ipAddress: string, instance: number, propertyId: number, value) {
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
      },
    );
  });
}
 
export function writeAnalogOutput(ipAddress: string, instance: number, propertyId: number, value) {
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
      },
    );
  });
}
 
export function generateValueObjectFromValue(value) {
  const valueObject: unknown[] = [];
 
  switch (typeof value) {
    case 'number':
      valueObject[0] = {
        tag: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_REAL,
        value: value,
      };
      break;
 
    case 'boolean':
      valueObject[0] = {
        tag: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_BOOLEAN,
        // Bacnet uses 0 and 1 instead of false and true
        value: Number(value),
      };
      break;
 
    case 'string':
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