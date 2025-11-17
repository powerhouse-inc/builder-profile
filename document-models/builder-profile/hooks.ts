import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  BuilderProfileDocument,
  BuilderProfileAction,
} from "@powerhousedao/builder-profile/document-models/builder-profile";
import { isBuilderProfileDocument } from "./gen/document-schema.js";

/** Hook to get a BuilderProfile document by its id */
export function useBuilderProfileDocumentById(
  documentId: string | null | undefined,
):
  | [BuilderProfileDocument, DocumentDispatch<BuilderProfileAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isBuilderProfileDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected BuilderProfile document */
export function useSelectedBuilderProfileDocument():
  | [BuilderProfileDocument, DocumentDispatch<BuilderProfileAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isBuilderProfileDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all BuilderProfile documents in the selected drive */
export function useBuilderProfileDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isBuilderProfileDocument);
}

/** Hook to get all BuilderProfile documents in the selected folder */
export function useBuilderProfileDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isBuilderProfileDocument);
}
