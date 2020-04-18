# bachome

This is a project for my diploma. It converts BACnet points into HomeKit accessories using homebridge. As such it needs to be registered as a homebridge plugin.

Contributions are welcome after the 30th of August 2020 are welcome. Until then pull requests won't be processed until then.

The project is being developed on version 12.x of NodeJS.

## Installation

To install the project you need NodeJS as a prerequisite.
First clone the GitHub repository using:
```bash
git clone https://github.com/Caserage/bachome.git
```
Then install the project dependencies using the following command inside the project root directory:
```bash
npm install
```

As this project functions as a homebridge plugin you need homebridge installed. It's recommended to install homebridge as a global plugin using the following command (admin/superuser access may be required):
```javascript
npm install homebridge -g
```

To have homebridge register your accessories you need to add them to the `config.json` file in the homebridge folder. An example of the the file might look like this:
```json
{
    "bridge": {
        "name": "Homebridge",
        "username": "CC:22:3D:E3:CE:30",
        "port": 51826,
        "pin": "031-45-154"
    },
    "description": "This is an example configuration file with one fake accessory and one fake platform. You can use this as a template for creating your own configuration file containing devices you actually own.",
    "accessories": [
        {
            "accessory": "bachome-thermostat",
            "name": "Mein Thermostat"
        },
        {
            "accessory": "bachome-switch",
            "name": "Mein Schalter"
        },
        {
            "accessory": "bachome-cooler",
            "name": "Mein Kühler"
        }
    ]
}
```
