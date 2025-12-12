import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type {
  BuilderProfileGlobalState,
  BuilderProfileLocalState,
} from "./types.js";
import type { BuilderProfilePHState } from "./types.js";
import { reducer } from "./reducer.js";
import { builderProfileDocumentType } from "./document-type.js";
import {
  isBuilderProfileDocument,
  assertIsBuilderProfileDocument,
  isBuilderProfileState,
  assertIsBuilderProfileState,
} from "./document-schema.js";

export const initialGlobalState: BuilderProfileGlobalState = {
  id: null,
  code: null,
  slug: null,
  name: null,
  icon: null,
  description: null,
  lastModified: null,
  type: "INDIVIDUAL",
  contributors: [],
  status: null,
  skils: [],
  scopes: [],
  links: [],
};
export const initialLocalState: BuilderProfileLocalState = {};

export const utils: DocumentModelUtils<BuilderProfilePHState> = {
  fileExtension: "",
  createState(state) {
    return {
      ...defaultBaseState(),
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createDocument(state) {
    const document = baseCreateDocument(utils.createState, state);

    document.header.documentType = builderProfileDocumentType;

    // for backwards compatibility, but this is NOT a valid signed document id
    document.header.id = generateId();

    return document;
  },
  saveToFileHandle(document, input) {
    return baseSaveToFileHandle(document, input);
  },
  loadFromInput(input) {
    return baseLoadFromInput(input, reducer);
  },
  isStateOfType(state) {
    return isBuilderProfileState(state);
  },
  assertIsStateOfType(state) {
    return assertIsBuilderProfileState(state);
  },
  isDocumentOfType(document) {
    return isBuilderProfileDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsBuilderProfileDocument(document);
  },
};

export const createDocument = utils.createDocument;
export const createState = utils.createState;
export const saveToFileHandle = utils.saveToFileHandle;
export const loadFromInput = utils.loadFromInput;
export const isStateOfType = utils.isStateOfType;
export const assertIsStateOfType = utils.assertIsStateOfType;
export const isDocumentOfType = utils.isDocumentOfType;
export const assertIsDocumentOfType = utils.assertIsDocumentOfType;
