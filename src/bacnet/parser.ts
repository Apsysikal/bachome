import bacnet from "bacstack";

export interface BacnetObject {
  typeText: string;
  type: number;
  instance: number;
}

/**
 * Parses shorthand notations of BACnet objects and instances and returns
 * a BacnetObject
 * @param objectString Shorthand BACnet object notation string e.g. 'BV:6'
 */
export function objectStringParser(objectString: string): BacnetObject {
  const parsedObject: BacnetObject = {
    typeText: "",
    type: 0,
    instance: 0,
  };

  // Parses a string looking like BV:16
  const stringSplit = objectString.split(":");

  parsedObject.typeText = stringSplit[0];

  switch (stringSplit[0]) {
    case "AI":
      parsedObject.type = bacnet.enum.ObjectTypes.OBJECT_ANALOG_INPUT;
      break;

    case "AO":
      parsedObject.type = bacnet.enum.ObjectTypes.OBJECT_ANALOG_OUTPUT;
      break;

    case "AV":
      parsedObject.type = bacnet.enum.ObjectTypes.OBJECT_ANALOG_VALUE;
      break;

    case "BI":
      parsedObject.type = bacnet.enum.ObjectTypes.OBJECT_BINARY_INPUT;
      break;

    case "BO":
      parsedObject.type = bacnet.enum.ObjectTypes.OBJECT_BINARY_OUTPUT;
      break;

    case "BV":
      parsedObject.type = bacnet.enum.ObjectTypes.OBJECT_BINARY_VALUE;
      break;

    default:
      break;
  }

  parsedObject.instance = Number(stringSplit[1]);

  return parsedObject;
}
