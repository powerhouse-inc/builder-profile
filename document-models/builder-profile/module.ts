import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { BuilderProfilePHState } from "@powerhousedao/builder-profile/document-models/builder-profile";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/builder-profile/document-models/builder-profile";

/** Document model module for the Todo List document type */
export const BuilderProfile: DocumentModelModule<BuilderProfilePHState> = {
  version: 1,
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
