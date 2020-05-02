const bacnet = require("bacstack");
const util = require("util");

const client = new bacnet();

const values = [
  {
    objectId: { type: 0, instance: 1 },
    values: [
      {
        property: {
          id: bacnet.enum.PropertyIds.PROP_OUT_OF_SERVICE,
          index: 4294967295,
        },
        value: [
          {
            type: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_BOOLEAN,
            value: true,
          },
        ],
        priority: 8,
      },
      {
        property: {
          id: bacnet.enum.PropertyIds.PROP_PRESENT_VALUE,
          index: 4294967295,
        },
        value: [
          {
            type: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_REAL,
            value: 60.1,
          },
        ],
        priority: 8,
      },
    ],
  },
];

client.writePropertyMultiple("192.168.1.147", values, (err, value) => {
  console.log("value: ", value);
});
