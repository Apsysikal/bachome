import { API } from "homebridge";

import { PLATFORM_NAME } from "./settings";
import { BachomeHomebridgePlatform } from "./platform";

/**
 * This method registers the platform with Homebridge
 */
export = (api: API): void => {
  api.registerPlatform(PLATFORM_NAME, BachomeHomebridgePlatform);
};
