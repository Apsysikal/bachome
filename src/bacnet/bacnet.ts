import bacnet from "bacstack";

const client = new bacnet();

/**
 * Reads the current value of an object from the remote device.
 * Returns a promise which resolves with the read content on
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param propertyId Property ID of the property, which will be read
 */
export function asyncReadPresentValue(
  ipAddress: string,
  propertyObject: object
): Promise<number> {
  return new Promise((resolve, reject) => {
    client.readProperty(
      ipAddress,
      propertyObject,
      bacnet.enum.PropertyIds.PROP_PRESENT_VALUE,
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

/**
 * Writes a present value to the remote device with the provided value.
 * Returns a promise which resolves with the written content
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param propertyObject
 * @param value Value to be written to the selected property
 */
export function asyncWritePresentValue(
  ipAddress: string,
  propertyObject: object,
  value: number
): Promise<number> {
  return new Promise((resolve, reject) => {

    const valueObject = generateValueObjectFromValue(value);

    client.writeProperty(
      ipAddress,
      propertyObject,
      bacnet.enum.PropertyIds.PROP_PRESENT_VALUE,
      valueObject,
      { priority: 8 },
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

/**
 * Reads a binary input object from the remote device.
 * Returns a promise which resolves with the read content on
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param instance Instance number of the binary input object
 * @param propertyId Property ID of the property, which will be read
 */
export function readBinaryInput(
  ipAddress: string,
  instance: number,
  propertyId: number
): Promise<boolean> {
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

/**
 * Reads a binary value object from the remote device.
 * Returns a promise which resolves with the read content on
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param instance Instance number of the binary value object
 * @param propertyId Property ID of the property, which will be read
 */
export function readBinaryValue(
  ipAddress: string,
  instance: number,
  propertyId: number
): Promise<boolean> {
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

/**
 * Reads a binary output object from the remote device.
 * Returns a promise which resolves with the read content on
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param instance Instance number of the binary output object
 * @param propertyId Property ID of the property, which will be read
 */
export function readBinaryOutput(
  ipAddress: string,
  instance: number,
  propertyId: number
): Promise<boolean> {
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

/**
 * Reads a analog input object from the remote device.
 * Returns a promise which resolves with the read content on
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param instance Instance number of the analog input object
 * @param propertyId Property ID of the property, which will be read
 */
export function readAnalogInput(
  ipAddress: string,
  instance: number,
  propertyId: number
): Promise<number> {
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

/**
 * Reads a analog value object from the remote device.
 * Returns a promise which resolves with the read content on
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param instance Instance number of the analog vlaue object
 * @param propertyId Property ID of the property, which will be read
 */
export function readAnalogValue(
  ipAddress: string,
  instance: number,
  propertyId: number
): Promise<number> {
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

/**
 * Reads a analog output object from the remote device.
 * Returns a promise which resolves with the read content on
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param instance Instance number of the analog output object
 * @param propertyId Property ID of the property, which will be read
 */
export function readAnalogOutput(
  ipAddress: string,
  instance: number,
  propertyId: number
): Promise<number> {
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

/**
 * Writes a binary input on the remote device with the provided value.
 * Returns a promise which resolves with the written content
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param instance Instance number of the binary input
 * @param propertyId Property ID of the property, which will be written
 * @param value Value to be written to the selected property
 */
export function writeBinaryInput(
  ipAddress: string,
  instance: number,
  propertyId: number,
  value: boolean
): Promise<boolean> {
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
      { priority: 8 },
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

/**
 * Writes a binary value on the remote device with the provided value.
 * Returns a promise which resolves with the written content
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param instance Instance number of the binary value
 * @param propertyId Property ID of the property, which will be written
 * @param value Value to be written to the selected property
 */
export function writeBinaryValue(
  ipAddress: string,
  instance: number,
  propertyId: number,
  value: boolean
): Promise<boolean> {
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
      { priority: 8 },
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

/**
 * Writes a binary output on the remote device with the provided value.
 * Returns a promise which resolves with the written content
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param instance Instance number of the binary output
 * @param propertyId Property ID of the property, which will be written
 * @param value Value to be written to the selected property
 */
export function writeBinaryOutput(
  ipAddress: string,
  instance: number,
  propertyId: number,
  value: boolean
): Promise<boolean> {
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
      { priority: 8 },
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

/**
 * Writes a analog input on the remote device with the provided value.
 * Returns a promise which resolves with the written content
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param instance Instance number of the analog input
 * @param propertyId Property ID of the property, which will be written
 * @param value Value to be written to the selected property
 */
export function writeAnalogInput(
  ipAddress: string,
  instance: number,
  propertyId: number,
  value: number
): Promise<number> {
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
      { priority: 8 },
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

/**
 * Writes a analog value on the remote device with the provided value.
 * Returns a promise which resolves with the written content
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param instance Instance number of the analog value
 * @param propertyId Property ID of the property, which will be written
 * @param value Value to be written to the selected property
 */
export function writeAnalogValue(
  ipAddress: string,
  instance: number,
  propertyId: number,
  value: number
): Promise<number> {
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
      { priority: 8 },
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

/**
 * Writes a analog output on the remote device with the provided value.
 * Returns a promise which resolves with the written content
 * successful operation and rejects on failure.
 * @param ipAddress IP address of the device
 * @param instance Instance number of the analog output
 * @param propertyId Property ID of the property, which will be written
 * @param value Value to be written to the selected property
 */
export function writeAnalogOutput(
  ipAddress: string,
  instance: number,
  propertyId: number,
  value: number
): Promise<number> {
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
      { priority: 8 },
      (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      }
    );
  });
}

/**
 * Takes the value passed into the function and converts it into a
 * valueObject, which then can be used in other functions to read
 * and write to external BACnet objects
 * @param value Value which will be converted to a valueObject
 */
export function generateValueObjectFromValue(
  value: number | boolean | string
): unknown[] {
  const valueObject: unknown[] = [];

  switch (typeof value) {
    case "number":
      valueObject[0] = {
        type: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_REAL,
        value: value,
      };
      break;

    case "boolean":
      valueObject[0] = {
        type: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_ENUMERATED,
        // Bacnet uses 0 and 1 instead of false and true
        value: value,
      };
      break;

    case "string":
      valueObject[0] = {
        type: bacnet.enum.ApplicationTags
          .BACNET_APPLICATION_TAG_CHARACTER_STRING,
        value: value,
      };
      break;

    default:
      break;
  }

  return valueObject;
}
