import { baseActions } from "document-model";
import { builderProfileBuildersActions } from "./gen/creators.js";

/** Actions for the BuilderProfile document model */

export const actions = { ...baseActions, ...builderProfileBuildersActions };
