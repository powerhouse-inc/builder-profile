import type { PHDocument, PHBaseState } from "document-model";
import type { BuilderProfileAction } from "./actions.js";
import type { BuilderProfileState as BuilderProfileGlobalState } from "./schema/types.js";

type BuilderProfileLocalState = Record<PropertyKey, never>;
type BuilderProfilePHState = PHBaseState & {
  global: BuilderProfileGlobalState;
  local: BuilderProfileLocalState;
};
type BuilderProfileDocument = PHDocument<BuilderProfilePHState>;

export * from "./schema/types.js";

export type {
  BuilderProfileGlobalState,
  BuilderProfileLocalState,
  BuilderProfilePHState,
  BuilderProfileAction,
  BuilderProfileDocument,
};
