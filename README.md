
<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>

![Build and Lint](https://github.com/Caserage/bachome/workflows/Build%20and%20Lint/badge.svg)

# BAChome

This is a project for my diploma. It converts BACnet objects into HomeKit accessories. To create the HomeKit accessories this project works as a Homebridge plugin.

Contributions are welcome after the 30th of August 2020 are welcome. Until then pull requests won't be processed until then.

## Configuring the plugin

This plugin supports visual configuration using the `Homebridge Config UI X` web interface.

If you want to create the configuration manually, you have to register the platform and accessories in your `config.json` file. An example may look like this:

```json
{
    "platforms": [
        {
            "name": "BAChome Dynamic Platform",
            "switch": [
                {
                    "name": "Bedroom",
                    "manufacturer": "Caserage",
                    "model": "Caserage's switch",
                    "serial": "ABC"
                }
            ],
            "thermostat": [
                {
                    "name": "Kitchen",
                    "manufacturer": "Caserage",
                    "model": "Caserage's thermostat",
                    "serial": "DEF"
                }
            ],
            "cooler": [
                {
                    "name": "Living room",
                    "manufacturer": "Caserage",
                    "model": "Caserage's cooler",
                    "serial": "GHI"
                }
            ],
            "platform": "bachome"
        }
    ]
}
```

## Install Development Dependencies

Using a terminal, navigate to the project folder and run this command to install the development dependencies:

```
npm install
```

## Build Plugin

TypeScript needs to be compiled into JavaScript before it can run. The following command will compile the contents of your [`src`](./src) directory and put the resulting code into the `dist` folder.

```
npm run build
```

## Link To Homebridge

Run this command so your global install of Homebridge can discover the plugin in your development environment:

```
npm link
```

You can now start Homebridge, use the `-D` flag so you can see debug log messages in your plugin:

```
homebridge -D
```

## Watch For Changes and Build Automatically

If you want to have your code compile automatically as you make changes, and restart Homebridge automatically between changes you can run:

```
npm run watch
```

This will launch an instance of Homebridge in debug mode which will restart every time you make a change to the source code. It will the config stored in the default location under `~/.homebridge`. You may need to stop other running instances of Homebridge while using this command to prevent conflicts. You can adjust the Homebridge startup command in the [`nodemon.json`](./nodemon.json) file.