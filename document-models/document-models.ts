import type { DocumentModelModule } from "document-model";
import { BuilderProfile } from "./builder-profile/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  BuilderProfile,
];
