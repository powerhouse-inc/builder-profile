/**
 * Factory methods for creating BuilderProfileDocument instances
 */
import type { PHAuthState, PHDocumentState, PHBaseState } from "document-model";
import { createBaseState, defaultBaseState } from "document-model/core";
import type {
  BuilderProfileDocument,
  BuilderProfileLocalState,
  BuilderProfileGlobalState,
  BuilderProfilePHState,
} from "./types.js";
import { createDocument } from "./utils.js";

export function defaultGlobalState(): BuilderProfileGlobalState {
  return {
    id: null,
    slug: null,
    name: null,
    icon: null,
    description: null,
  };
}

export function defaultLocalState(): BuilderProfileLocalState {
  return {};
}

export function defaultPHState(): BuilderProfilePHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<BuilderProfileGlobalState>,
): BuilderProfileGlobalState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as BuilderProfileGlobalState;
}

export function createLocalState(
  state?: Partial<BuilderProfileLocalState>,
): BuilderProfileLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as BuilderProfileLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<BuilderProfileGlobalState>,
  localState?: Partial<BuilderProfileLocalState>,
): BuilderProfilePHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a BuilderProfileDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createBuilderProfileDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<BuilderProfileGlobalState>;
    local?: Partial<BuilderProfileLocalState>;
  }>,
): BuilderProfileDocument {
  const document = createDocument(
    state
      ? createState(
          createBaseState(state.auth, state.document),
          state.global,
          state.local,
        )
      : undefined,
  );

  return document;
}
