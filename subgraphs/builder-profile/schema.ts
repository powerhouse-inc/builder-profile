import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: BuilderProfile Document
  """
  type BuilderProfileQueries {
    getDocument(docId: PHID!, driveId: PHID): BuilderProfile
    getDocuments(driveId: String!): [BuilderProfile!]
  }

  type Query {
    BuilderProfile: BuilderProfileQueries
  }

  """
  Mutations: BuilderProfile
  """
  type Mutation {
    BuilderProfile_createDocument(name: String!, driveId: String): String

    BuilderProfile_updateProfile(
      driveId: String
      docId: PHID
      input: BuilderProfile_UpdateProfileInput
    ): Int
  }

  """
  Module: Builder
  """
  input BuilderProfile_UpdateProfileInput {
    id: PHID
    slug: String
    name: String
    icon: URL
    description: String
  }
`;
