/// <reference path="./node_modules/bacstack/index.js" />
/// <reference path="./node_modules/bacstack/lib/client.js" />
/// <reference path="./node_modules/bacstack/lib/enum.js" />

const bacnet = require("bacstack");

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