import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import { useSelectedDocumentSafe } from "@powerhousedao/reactor-browser";
import type { BuilderProfileAction, BuilderProfileDocument } from "document-models/builder-profile";
import { isBuilderProfileDocument } from "document-models/builder-profile";

export function useSelectedBuilderProfileDocumentSafe(): [
  BuilderProfileDocument | undefined,
  DocumentDispatch<BuilderProfileAction> | undefined,
] {
  const [document, dispatch] = useSelectedDocumentSafe();
  if (!isBuilderProfileDocument(document)) return [undefined, undefined];
  return [document, dispatch as DocumentDispatch<BuilderProfileAction>];
}
