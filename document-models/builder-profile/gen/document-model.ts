import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Powerhouse",
    website: "https://powerhouse.inc",
  },
  description: "A builder profile document",
  extension: "",
  id: "powerhouse/builder-profile",
  name: "Builder Profile",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          description: "",
          id: "9ef097c0-92df-473a-95c6-ae9b6f69e7f7",
          name: "builders",
          operations: [
            {
              description: "",
              errors: [],
              examples: [],
              id: "a729a16c-d961-4df6-91f1-fc114fd4ca35",
              name: "UPDATE_PROFILE",
              reducer: "",
              schema:
                "input UpdateProfileInput {\n  id: PHID\n  code: String\n  slug: String\n  name: String\n  icon: URL\n  description: String\n  status: BuilderStatusInput\n  type: teamTypeInput\n}\n\nenum teamTypeInput {\n  INDIVIDUAL\n  TEAM\n}\n\nenum BuilderStatusInput {\n  ACTIVE\n  INACTIVE\n  ON_HOLD\n  COMPLETED\n  ARCHIVED\n}\n",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "47773491-f8af-4b05-8b39-1bbbd3367566",
              name: "ADD_SKILL",
              reducer: "",
              schema:
                "input AddSkillInput {\n  skill: BuilderSkillInput\n}\n\nenum BuilderSkillInput {\n  FRONTEND_DEVELOPMENT\n  BACKEND_DEVELOPMENT\n  FULL_STACK_DEVELOPMENT\n  DEVOPS_ENGINEERING\n  SMART_CONTRACT_DEVELOPMENT\n  UI_UX_DESIGN\n  TECHNICAL_WRITING\n  QA_TESTING\n  DATA_ENGINEERING\n  SECURITY_ENGINEERING\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "b04c49f3-b8e8-4e5e-bee1-e74d4fc611e0",
              name: "REMOVE_SKILL",
              reducer: "",
              schema:
                "input RemoveSkillInput {\n  skill: BuilderSkillInput\n}\n\n",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "172aee1c-aa73-4d99-bc9c-7d9239624d4c",
              name: "ADD_SCOPE",
              reducer: "",
              schema:
                "input AddScopeInput {\n  scope: BuilderScopeInput\n}\n\nenum BuilderScopeInput {\n  ACC\n  STA\n  SUP\n  STABILITY_SCOPE\n  SUPPORT_SCOPE\n  PROTOCOL_SCOPE\n  GOVERNANCE_SCOPE\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "ff1c8e28-1725-4753-bdf0-f64eca52516a",
              name: "REMOVE_SCOPE",
              reducer: "",
              schema: "input RemoveScopeInput {\n  scope: BuilderScopeInput\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "c1553e89-df14-4e58-87ae-9f130e60a847",
              name: "ADD_LINK",
              reducer: "",
              schema:
                "input AddLinkInput {\n  id: OID!\n  url: URL!\n  label: String\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "610c7549-9631-4921-b840-8344cec388b2",
              name: "EDIT_LINK",
              reducer: "",
              schema:
                "input EditLinkInput {\n  id: OID!\n  url: URL!\n  label: String\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "0b199ad1-47a2-4987-8093-b0267a970d89",
              name: "REMOVE_LINK",
              reducer: "",
              schema: "input RemoveLinkInput {\n  id: OID!  \n}",
              scope: "global",
              template: "",
            },
            {
              description: "Only if team type is INDIVIDUAL",
              errors: [],
              examples: [],
              id: "1a35597e-63e8-43f7-8276-0b486c43d3b9",
              name: "ADD_CONTRIBUTOR",
              reducer: "",
              schema:
                "input AddContributorInput {\n  contributorPHID: PHID!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "107f2274-a2fe-433c-ae59-25d12702e9fa",
              name: "REMOVE_CONTRIBUTOR",
              reducer: "",
              schema:
                "input RemoveContributorInput {\n  contributorPHID: PHID!\n}",
              scope: "global",
              template: "",
            },
          ],
        },
      ],
      state: {
        global: {
          examples: [],
          initialValue:
            '"{\\n  \\"id\\": null,\\n  \\"code\\": null,\\n  \\"slug\\": null,\\n  \\"name\\": null,\\n  \\"icon\\": null,\\n  \\"description\\": null,\\n  \\"lastModified\\": null,\\n  \\"type\\": \\"INDIVIDUAL\\",\\n  \\"contributors\\": [],\\n  \\"status\\": null,\\n  \\"skils\\": [],\\n  \\"scopes\\": [],\\n  \\"links\\": []\\n}"',
          schema:
            "type BuilderProfileState {\n  id: PHID\n  code: String\n  slug: String\n  name: String\n  icon: URL\n  description: String\n  lastModified: DateTime\n  type: teamType!\n  contributors: [PHID!]!\n  status: BuilderStatus\n  skils: [BuilderSkill!]!\n  scopes: [BuilderScope!]!\n  links: [BuilderLink!]!\n}\n\nenum teamType {\n  INDIVIDUAL\n  TEAM\n}\n\nenum BuilderStatus {\n  ACTIVE\n  INACTIVE\n  ON_HOLD\n  COMPLETED\n  ARCHIVED\n}\n\nenum BuilderSkill {\n  FRONTEND_DEVELOPMENT\n  BACKEND_DEVELOPMENT\n  FULL_STACK_DEVELOPMENT\n  DEVOPS_ENGINEERING\n  SMART_CONTRACT_DEVELOPMENT\n  UI_UX_DESIGN\n  TECHNICAL_WRITING\n  QA_TESTING\n  DATA_ENGINEERING\n  SECURITY_ENGINEERING\n}\n\nenum BuilderScope {\n  ACC\n  STA\n  SUP\n  STABILITY_SCOPE\n  SUPPORT_SCOPE\n  PROTOCOL_SCOPE\n  GOVERNANCE_SCOPE\n}\n\ntype BuilderLink {\n  id: OID!\n  url: URL!\n  label: String\n}\n",
        },
        local: {
          examples: [],
          initialValue: '""',
          schema: "",
        },
      },
      version: 1,
    },
  ],
};
