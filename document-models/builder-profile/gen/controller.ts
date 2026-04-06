import { PHDocumentController } from "document-model";
import { BuilderProfile } from "../module.js";
import type { BuilderProfileAction, BuilderProfilePHState } from "./types.js";

export const BuilderProfileController = PHDocumentController.forDocumentModel<
  BuilderProfilePHState,
  BuilderProfileAction
>(BuilderProfile);
