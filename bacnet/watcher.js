const EventEmitter = require("events");
const PropertyIds = require("bacstack").enum.PropertyIds;
const bacnetHelper = require("./bacnet");

class Watcher extends EventEmitter {
  constructor(ipAddress, objects) {
    super();

    this.deviceIpAddress = ipAddress;
    this.objects = objects;

    setInterval(this.updateValues.bind(this), 1000 * 15);
  }

  updateValues() {
    this.objects.forEach((object) => {
      const eventName = object["eventName"];
      const type = object["type"];
      const instance = object["instance"];
      const propertyId = object["propertyId"];

      switch (type) {
        case "AI":
          bacnetHelper
            .readAnalogInput(this.deviceIpAddress, instance, propertyId)
            .then((valueObject) => {
              const value = valueObject["values"][0]["value"];
              this.emit(eventName, value);
            });
          break;

        case "AO":
          bacnetHelper
            .readAnalogOutput(this.deviceIpAddress, instance, propertyId)
            .then((valueObject) => {
              const value = valueObject["values"][0]["value"];
              this.emit(eventName, value);
            });
          break;

        case "AV":
          bacnetHelper
            .readAnalogValue(this.deviceIpAddress, instance, propertyId)
            .then((valueObject) => {
              const value = valueObject["values"][0]["value"];
              this.emit(eventName, value);
            });
          break;

        case "BI":
          bacnetHelper
            .readBinaryInput(this.deviceIpAddress, instance, propertyId)
            .then((valueObject) => {
              const value = valueObject["values"][0]["value"];
              this.emit(eventName, value);
            });
          break;

        case "BO":
          bacnetHelper
            .readBinaryOutput(this.deviceIpAddress, instance, propertyId)
            .then((valueObject) => {
              const value = valueObject["values"][0]["value"];
              console.log(value);
              this.emit(eventName, value);
            });
          break;

        case "BV":
          bacnetHelper
            .readBinaryValue(this.deviceIpAddress, instance, propertyId)
            .then((valueObject) => {
              const value = valueObject["values"][0]["value"];
              this.emit(eventName, value);
            });
          break;

        default:
          break;
      }
    });
  }
}

module.exports = Watcher;
