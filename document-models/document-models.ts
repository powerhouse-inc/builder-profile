import type { DocumentModelModule } from "document-model";
import { BuilderProfile as BuilderProfileV1 } from "./builder-profile/v1/module.js";

export const documentModels: DocumentModelModule<any>[] = [BuilderProfileV1];
