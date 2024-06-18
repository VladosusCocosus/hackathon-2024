import {PlatformNames} from "../../types/platforms";
import {PlatformAdapter} from "./common";
import {CircleCI} from "./circle-ci";

export const platformsAdapters: Record<PlatformNames, typeof PlatformAdapter> = {
  [PlatformNames.circleCI]: CircleCI,
}
