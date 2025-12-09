import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  builderProfileDocumentType,
} from "@powerhousedao/builder-profile/document-models/builder-profile";

import type {
  BuilderProfileDocument,
  UpdateProfileInput,
  AddSkillInput,
  RemoveSkillInput,
  AddScopeInput,
  RemoveScopeInput,
  AddLinkInput,
  EditLinkInput,
  RemoveLinkInput,
  AddContributorInput,
  RemoveContributorInput,
} from "@powerhousedao/builder-profile/document-models/builder-profile";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      BuilderProfile: async () => {
        return {
          getDocument: async (args: { docId: string; driveId: string }) => {
            const { docId, driveId } = args;

            if (!docId) {
              throw new Error("Document id is required");
            }

            if (driveId) {
              const docIds = await reactor.getDocuments(driveId);
              if (!docIds.includes(docId)) {
                throw new Error(
                  `Document with id ${docId} is not part of ${driveId}`,
                );
              }
            }

            const doc =
              await reactor.getDocument<BuilderProfileDocument>(docId);
            return {
              driveId: driveId,
              ...doc,
              ...doc.header,
              created: doc.header.createdAtUtcIso,
              lastModified: doc.header.lastModifiedAtUtcIso,
              state: doc.state.global,
              stateJSON: doc.state.global,
              revision: doc.header?.revision?.global ?? 0,
            };
          },
          getDocuments: async (args: { driveId: string }) => {
            const { driveId } = args;
            const docsIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              docsIds.map(async (docId) => {
                const doc =
                  await reactor.getDocument<BuilderProfileDocument>(docId);
                return {
                  driveId: driveId,
                  ...doc,
                  ...doc.header,
                  created: doc.header.createdAtUtcIso,
                  lastModified: doc.header.lastModifiedAtUtcIso,
                  state: doc.state.global,
                  stateJSON: doc.state.global,
                  revision: doc.header?.revision?.global ?? 0,
                };
              }),
            );

            return docs.filter(
              (doc) => doc.header.documentType === builderProfileDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      BuilderProfile_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(builderProfileDocumentType);

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: builderProfileDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      BuilderProfile_updateProfile: async (
        _: unknown,
        args: { docId: string; input: UpdateProfileInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BuilderProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateProfile(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updateProfile");
        }

        return true;
      },

      BuilderProfile_addSkill: async (
        _: unknown,
        args: { docId: string; input: AddSkillInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BuilderProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.addSkill(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addSkill");
        }

        return true;
      },

      BuilderProfile_removeSkill: async (
        _: unknown,
        args: { docId: string; input: RemoveSkillInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BuilderProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeSkill(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to removeSkill");
        }

        return true;
      },

      BuilderProfile_addScope: async (
        _: unknown,
        args: { docId: string; input: AddScopeInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BuilderProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.addScope(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addScope");
        }

        return true;
      },

      BuilderProfile_removeScope: async (
        _: unknown,
        args: { docId: string; input: RemoveScopeInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BuilderProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeScope(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to removeScope");
        }

        return true;
      },

      BuilderProfile_addLink: async (
        _: unknown,
        args: { docId: string; input: AddLinkInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BuilderProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.addLink(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addLink");
        }

        return true;
      },

      BuilderProfile_editLink: async (
        _: unknown,
        args: { docId: string; input: EditLinkInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BuilderProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.editLink(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editLink");
        }

        return true;
      },

      BuilderProfile_removeLink: async (
        _: unknown,
        args: { docId: string; input: RemoveLinkInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BuilderProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeLink(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to removeLink");
        }

        return true;
      },

      BuilderProfile_addContributor: async (
        _: unknown,
        args: { docId: string; input: AddContributorInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BuilderProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addContributor(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addContributor");
        }

        return true;
      },

      BuilderProfile_removeContributor: async (
        _: unknown,
        args: { docId: string; input: RemoveContributorInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BuilderProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeContributor(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeContributor",
          );
        }

        return true;
      },
    },
  };
};
