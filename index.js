class BAChomePlatformPlugin {
  constructor(log, config, api) {
    log.debug("Registering platform...");

    this.api = api;
    this.accessories = [];

    /**
     * Platforms should wait until the "didFinishLaunching" event has fired before
     * registering any new accessories.
     */
    api.on("didFinishLaunching", () => {
      const uuid = this.api.hap.uuid.generate("SOMETHING UNIQUE");

      // check the accessory was not restored from cache
      if (!this.accessories.find((accessory) => accessory.UUID === uuid)) {
        const accessory = new this.api.platformAccessory("DISPLAY NAME", uuid);

        console.log(this.api.hap.Service);

        // get the LightBulb service if it exists
        let service = accessory.addService(this.api.hap.Service.Lightbulb);

        // register the accessory
        api.registerPlatformAccessories("DISPLAY NAME", "BAChome", [accessory]);
      }
    });
  }

  configureAccessory(accessory) {
    this.accessories.push(accessory);
  }
}

module.exports = function (homebridge) {
  homebridge.registerPlatform("BAChome", BAChomePlatformPlugin);
};
