import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Powerhouse",
    website: "https://powerhouse.inc",
  },
  description: "A builder profile document.",
  extension: "",
  id: "powerhouse/builder-profile",
  name: "BuilderProfile",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          description: "",
          id: "681bff7b-9b42-485a-8a08-9a3e808fe4e8",
          name: "builders",
          operations: [
            {
              description: "",
              errors: [],
              examples: [],
              id: "e9e1b348-aecc-4765-ae9f-21aca2d159c5",
              name: "UPDATE_PROFILE",
              reducer: "",
              schema:
                "input UpdateProfileInput {\n  id: PHID\n  code: String\n  slug: String\n  name: String\n  icon: URL\n  description: String\n  about: String\n  status: BuilderStatusInput\n}\n\n\n",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "0ba36e88-eb6a-4fc9-9954-8b3c9c3f08da",
              name: "ADD_SKILL",
              reducer: "",
              schema:
                "input AddSkillInput {\n  skill: BuilderSkillInput\n}\n\n",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "08e82f23-de6a-428c-bb3b-ad6e8f4b09b7",
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
              id: "82edbf4f-58b1-4dbc-8c12-654cedb0f7eb",
              name: "ADD_SCOPE",
              reducer: "",
              schema:
                "input AddScopeInput {\n  scope: BuilderScopeInput\n}\n\n",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "09648729-e6d6-42d0-a829-197676eeabaf",
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
              id: "1cf80c7d-0c3c-4309-8aec-ca7e6f55ec77",
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
              id: "a7d0efc0-9c04-4c26-b756-596fa976a21c",
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
              id: "bd84497f-9055-4585-89cd-613e8cacbc80",
              name: "REMOVE_LINK",
              reducer: "",
              schema: "input RemoveLinkInput {\n  id: OID!  \n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "4d1dd9e9-9693-4fad-bd3f-422d3508be6a",
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
              id: "66edd68d-a693-4033-be98-4d9d42eb7d88",
              name: "REMOVE_CONTRIBUTOR",
              reducer: "",
              schema:
                "input RemoveContributorInput {\n  contributorPHID: PHID!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "eb2442c3-1c36-4d4b-a991-a3f5664ffc6d",
              name: "SET_OPERATOR",
              reducer: "",
              schema: "input SetOperatorInput {\n  isOperator: Boolean!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "508d850d-a7ee-4e05-986b-be0db2dc22df",
              name: "SET_OP_HUB_MEMBER",
              reducer: "",
              schema:
                "input SetOpHubMemberInput {\n  name: String\n  phid: PHID\n}",
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
            '{\n  "id": null,\n  "code": null,\n  "slug": null,\n  "name": null,\n  "icon": null,\n  "description": null,\n  "about": null,\n  "lastModified": null,\n  "isOperator": false,\n  "operationalHubMember": {\n    "name": null,\n    "phid": null\n  },\n  "contributors": [],\n  "status": null,\n  "skills": [],\n  "scopes": [],\n  "links": []\n}',
          schema:
            "type BuilderProfileState {\n  id: PHID\n  code: String\n  slug: String\n  name: String\n  icon: URL\n  description: String\n  about: String\n  lastModified: DateTime\n  isOperator: Boolean!\n  operationalHubMember: OpHubMember!\n  contributors: [PHID!]!\n  status: BuilderStatus\n  skills: [BuilderSkill!]!\n  scopes: [BuilderScope!]!\n  links: [BuilderLink!]!\n}\n\n\nenum BuilderStatus {\n  ACTIVE\n  INACTIVE\n  ON_HOLD\n  COMPLETED\n  ARCHIVED\n}\n\nenum BuilderSkill {\n  FRONTEND_DEVELOPMENT\n  BACKEND_DEVELOPMENT\n  FULL_STACK_DEVELOPMENT\n  DEVOPS_ENGINEERING\n  SMART_CONTRACT_DEVELOPMENT\n  UI_UX_DESIGN\n  TECHNICAL_WRITING\n  QA_TESTING\n  DATA_ENGINEERING\n  SECURITY_ENGINEERING\n}\n\nenum BuilderScope {\n  ACC\n  STA\n  SUP\n  STABILITY_SCOPE\n  SUPPORT_SCOPE\n  PROTOCOL_SCOPE\n  GOVERNANCE_SCOPE\n}\n\ntype BuilderLink {\n  id: OID!\n  url: URL!\n  label: String\n}\n\nenum BuilderStatusInput {\n  ACTIVE\n  INACTIVE\n  ON_HOLD\n  COMPLETED\n  ARCHIVED\n}\n\nenum BuilderSkillInput {\n  FRONTEND_DEVELOPMENT\n  BACKEND_DEVELOPMENT\n  FULL_STACK_DEVELOPMENT\n  DEVOPS_ENGINEERING\n  SMART_CONTRACT_DEVELOPMENT\n  UI_UX_DESIGN\n  TECHNICAL_WRITING\n  QA_TESTING\n  DATA_ENGINEERING\n  SECURITY_ENGINEERING\n}\n\nenum BuilderScopeInput {\n  ACC\n  STA\n  SUP\n  STABILITY_SCOPE\n  SUPPORT_SCOPE\n  PROTOCOL_SCOPE\n  GOVERNANCE_SCOPE\n}\n\ntype OpHubMember {\n  name: String\n  phid: PHID\n}",
        },
        local: {
          examples: [],
          initialValue: "",
          schema: "",
        },
      },
      version: 1,
    },
  ],
};
