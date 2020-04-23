/// <reference path="./node_modules/bacstack/index.js" />
/// <reference path="./node_modules/bacstack/lib/client.js" />
/// <reference path="./node_modules/bacstack/lib/enum.js" />

const bacnet = require("bacstack");
const EventEmitter = require("events");

const client = new bacnet();

client.on("iAm", (device) => {
    console.log('address: ', device.address, ' - deviceId: ', device.deviceId, ' - maxAdpu: ', device.maxAdpu, ' - segmentation: ', device.segmentation, ' - vendorId: ', device.vendorId);
});

client.whoIs();

let obj = {
    type: bacnet.enum.ObjectTypes.OBJECT_ANALOG_INPUT,
    instance: 0
};

client.readProperty("192.168.1.147", obj, bacnet.enum.PropertyIds.PROP_PRESENT_VALUE, (err, value) => {
    if (err) {
        console.error(err);
    }

    console.log(value);
});

function readBinaryInput(ipAddress, instance, propertyId) {
    return new Promise((resolve, reject) => {
        const propertyObject = {
            type: bacnet.enum.ObjectTypes.OBJECT_BINARY_INPUT,
            instance: instance
        };

        client.readProperty(ipAddress, propertyObject, propertyId, (error, value) => {
            if (error) {
                return reject(error);
            }

            return resolve(value);
        });
    });
}

function readBinaryValue(ipAddress, instance, propertyId) {
    return new Promise((resolve, reject) => {
        const propertyObject = {
            type: bacnet.enum.ObjectTypes.OBJECT_BINARY_VALUE,
            instance: instance
        };

        client.readProperty(ipAddress, propertyObject, propertyId, (error, value) => {
            if (error) {
                return reject(error);
            }

            return resolve(value);
        });
    });
}

function readBinaryOutput(ipAddress, instance, propertyId) {
    return new Promise((resolve, reject) => {
        const propertyObject = {
            type: bacnet.enum.ObjectTypes.OBJECT_BINARY_OUTPUT,
            instance: instance
        };

        client.readProperty(ipAddress, propertyObject, propertyId, (error, value) => {
            if (error) {
                return reject(error);
            }

            return resolve(value);
        });
    });
}

function readAnalogInput(ipAddress, instance, propertyId) {
    return new Promise((resolve, reject) => {
        const propertyObject = {
            type: bacnet.enum.ObjectTypes.OBJECT_ANALOG_INPUT,
            instance: instance
        };

        client.readProperty(ipAddress, propertyObject, propertyId, (error, value) => {
            if (error) {
                return reject(error);
            }

            return resolve(value);
        });
    });
}

function readAnalogValue(ipAddress, instance, propertyId) {
    return new Promise((resolve, reject) => {
        const propertyObject = {
            type: bacnet.enum.ObjectTypes.OBJECT_ANALOG_VALUE,
            instance: instance
        };

        client.readProperty(ipAddress, propertyObject, propertyId, (error, value) => {
            if (error) {
                return reject(error);
            }

            return resolve(value);
        });
    });
}

function readAnalogOutput(ipAddress, instance, propertyId) {
    return new Promise((resolve, reject) => {
        const propertyObject = {
            type: bacnet.enum.ObjectTypes.OBJECT_ANALOG_OUTPUT,
            instance: instance
        };

        client.readProperty(ipAddress, propertyObject, propertyId, (error, value) => {
            if (error) {
                return reject(error);
            }

            return resolve(value);
        });
    });
}