import { baseActions } from "document-model";
import { buildersActions } from "./gen/creators.js";

/** Actions for the BuilderProfile document model */

export const actions = { ...baseActions, ...buildersActions };
