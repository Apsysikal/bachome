const bacnet = require('bacstack');
const client = new bacnet();

client.readProperty('192.168.1.147', {type: 5, instance: 0}, 85, (err, value) => {
  console.log('value: ', value);
});



// const values = [
//   {objectId: {type: 5, instance: 0}, values: [
//     {property: {id: 85, index: 4294967295}, value: [{type: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_ENUMERATED, value: 0}], priority: 8},
//   ]},
// ];
// client.writePropertyMultiple('192.168.1.147', values, (err, value) => {
//   if (err) {
//     console.error(err);
//   }
//   console.log('value: ', value);
// });

client.writeProperty('192.168.1.147', {type: 5, instance: 0}, 85, [
  {type: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_ENUMERATED, value: 0},
], { priority: 8}, (err, value) => {
  console.log('value: ', value);
});