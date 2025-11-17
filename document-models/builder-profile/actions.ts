import { baseActions } from "document-model";
import { builderActions } from "./gen/creators.js";

/** Actions for the BuilderProfile document model */
export const actions = { ...baseActions, ...builderActions };
