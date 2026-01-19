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
    BuilderProfile_addSkill(
      driveId: String
      docId: PHID
      input: BuilderProfile_AddSkillInput
    ): Int
    BuilderProfile_removeSkill(
      driveId: String
      docId: PHID
      input: BuilderProfile_RemoveSkillInput
    ): Int
    BuilderProfile_addScope(
      driveId: String
      docId: PHID
      input: BuilderProfile_AddScopeInput
    ): Int
    BuilderProfile_removeScope(
      driveId: String
      docId: PHID
      input: BuilderProfile_RemoveScopeInput
    ): Int
    BuilderProfile_addLink(
      driveId: String
      docId: PHID
      input: BuilderProfile_AddLinkInput
    ): Int
    BuilderProfile_editLink(
      driveId: String
      docId: PHID
      input: BuilderProfile_EditLinkInput
    ): Int
    BuilderProfile_removeLink(
      driveId: String
      docId: PHID
      input: BuilderProfile_RemoveLinkInput
    ): Int
    BuilderProfile_addContributor(
      driveId: String
      docId: PHID
      input: BuilderProfile_AddContributorInput
    ): Int
    BuilderProfile_removeContributor(
      driveId: String
      docId: PHID
      input: BuilderProfile_RemoveContributorInput
    ): Int
    BuilderProfile_setOperator(
      driveId: String
      docId: PHID
      input: BuilderProfile_SetOperatorInput
    ): Int
  }

  """
  Module: Builders
  """
  input BuilderProfile_UpdateProfileInput {
    id: PHID
    code: String
    slug: String
    name: String
    icon: URL
    description: String
    about: String
    status: BuilderProfile_BuilderStatusInput
    type: BuilderProfile_teamTypeInput
  }

  input BuilderProfile_AddSkillInput {
    skill: BuilderProfile_BuilderSkillInput
  }

  input BuilderProfile_RemoveSkillInput {
    skill: BuilderProfile_BuilderSkillInput
  }

  input BuilderProfile_AddScopeInput {
    scope: BuilderProfile_BuilderScopeInput
  }

  input BuilderProfile_RemoveScopeInput {
    scope: BuilderProfile_BuilderScopeInput
  }
  input BuilderProfile_AddLinkInput {
    id: OID!
    url: URL!
    label: String
  }
  input BuilderProfile_EditLinkInput {
    id: OID!
    url: URL!
    label: String
  }
  input BuilderProfile_RemoveLinkInput {
    id: OID!
  }
  input BuilderProfile_AddContributorInput {
    contributorPHID: PHID!
  }
  input BuilderProfile_RemoveContributorInput {
    contributorPHID: PHID!
  }
  input BuilderProfile_SetOperatorInput {
    isOperator: Boolean!
  }
`;
