import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  id: "powerhouse/builder-profile",
  name: "BuilderProfile",
  author: {
    name: "Powerhouse",
    website: "https://powerhouse.inc",
  },
  extension: "",
  description: "A builder profile document",
  specifications: [
    {
      state: {
        local: {
          schema: "",
          examples: [],
          initialValue: "",
        },
        global: {
          schema:
            "type BuilderProfileState {\n  id: PHID\n  code: String\n  slug: String\n  name: String\n  icon: URL\n  description: String\n  about: String\n  lastModified: DateTime\n  isOperator: Boolean!\n  operationalHubMember: OpHubMember!\n  contributors: [PHID!]!\n  status: BuilderStatus\n  skills: [BuilderSkill!]!\n  scopes: [BuilderScope!]!\n  links: [BuilderLink!]!\n}\n\nenum BuilderStatus {\n  ACTIVE\n  INACTIVE\n  ON_HOLD\n  COMPLETED\n  ARCHIVED\n}\n\nenum BuilderSkill {\n  FRONTEND_DEVELOPMENT\n  BACKEND_DEVELOPMENT\n  FULL_STACK_DEVELOPMENT\n  DEVOPS_ENGINEERING\n  SMART_CONTRACT_DEVELOPMENT\n  UI_UX_DESIGN\n  TECHNICAL_WRITING\n  QA_TESTING\n  DATA_ENGINEERING\n  SECURITY_ENGINEERING\n}\n\nenum BuilderScope {\n  ACC\n  STA\n  SUP\n  STABILITY_SCOPE\n  SUPPORT_SCOPE\n  PROTOCOL_SCOPE\n  GOVERNANCE_SCOPE\n}\n\ntype BuilderLink {\n  id: OID!\n  url: URL!\n  label: String\n}\n\ntype OpHubMember {\n  name: String\n  phid: PHID\n}\n\nenum BuilderSkillInput {\n  FRONTEND_DEVELOPMENT\n  BACKEND_DEVELOPMENT\n  FULL_STACK_DEVELOPMENT\n  DEVOPS_ENGINEERING\n  SMART_CONTRACT_DEVELOPMENT\n  UI_UX_DESIGN\n  TECHNICAL_WRITING\n  QA_TESTING\n  DATA_ENGINEERING\n  SECURITY_ENGINEERING\n}",
          examples: [],
          initialValue:
            '{\n  "id": null,\n  "code": null,\n  "slug": null,\n  "name": null,\n  "icon": null,\n  "description": null,\n  "about": null,\n  "lastModified": null,\n  "isOperator": false,\n  "operationalHubMember": {\n    "name": null,\n    "phid": null\n  },\n  "contributors": [],\n  "status": null,\n  "skills": [],\n  "scopes": [],\n  "links": []\n}',
        },
      },
      modules: [
        {
          id: "builders-module",
          name: "builders",
          operations: [
            {
              id: "update-profile",
              name: "UPDATE_PROFILE",
              scope: "global",
              errors: [],
              schema:
                "input UpdateProfileInput {\n  id: PHID\n  code: String\n  slug: String\n  name: String\n  icon: URL\n  description: String\n  about: String\n  status: BuilderStatusInput\n}\n\nenum BuilderStatusInput {\n  ACTIVE\n  INACTIVE\n  ON_HOLD\n  COMPLETED\n  ARCHIVED\n}",
              reducer:
                "if (action.input.id) state.id = action.input.id;\nif (action.input.code) state.code = action.input.code;\nif (action.input.slug) state.slug = action.input.slug;\nif (action.input.name) state.name = action.input.name;\nif (action.input.icon) state.icon = action.input.icon;\nif (action.input.description) {\n  if (action.input.description.length > 350) {\n    throw new Error(\n      `Description exceeds maximum length of 350 characters (${action.input.description.length} provided)`,\n    );\n  }\n  state.description = action.input.description;\n}\nif (action.input.about) state.about = action.input.about;\nif (action.input.status) state.status = action.input.status;\nstate.lastModified = new Date(action.timestampUtcMs).toISOString();",
              examples: [],
              template: "Updates the builder profile fields",
              description: "Updates the builder profile fields",
            },
            {
              id: "add-skill",
              name: "ADD_SKILL",
              scope: "global",
              errors: [],
              schema:
                "input AddSkillInput {\n  skill: BuilderSkillInput\n}\n\n",
              reducer:
                "if (action.input.skill) {\n  if (!state.skills.includes(action.input.skill)) {\n    state.skills.push(action.input.skill);\n  }\n}\nstate.lastModified = new Date(action.timestampUtcMs).toISOString();",
              examples: [],
              template: "Adds a skill to the builder profile",
              description: "Adds a skill to the builder profile",
            },
            {
              id: "remove-skill",
              name: "REMOVE_SKILL",
              scope: "global",
              errors: [],
              schema:
                "input RemoveSkillInput {\n  skill: BuilderSkillInput\n}\n",
              reducer:
                "if (action.input.skill) {\n  const index = state.skills.indexOf(action.input.skill);\n  if (index !== -1) {\n    state.skills.splice(index, 1);\n  }\n}\nstate.lastModified = new Date(action.timestampUtcMs).toISOString();",
              examples: [],
              template: "Removes a skill from the builder profile",
              description: "Removes a skill from the builder profile",
            },
            {
              id: "add-scope",
              name: "ADD_SCOPE",
              scope: "global",
              errors: [],
              schema:
                "input AddScopeInput {\n  scope: BuilderScopeInput\n}\n\nenum BuilderScopeInput {\n  ACC\n  STA\n  SUP\n  STABILITY_SCOPE\n  SUPPORT_SCOPE\n  PROTOCOL_SCOPE\n  GOVERNANCE_SCOPE\n}",
              reducer:
                "if (action.input.scope) {\n  if (!state.scopes.includes(action.input.scope)) {\n    state.scopes.push(action.input.scope);\n  }\n}\nstate.lastModified = new Date(action.timestampUtcMs).toISOString();",
              examples: [],
              template: "Adds a scope to the builder profile",
              description: "Adds a scope to the builder profile",
            },
            {
              id: "remove-scope",
              name: "REMOVE_SCOPE",
              scope: "global",
              errors: [],
              schema:
                "input RemoveScopeInput {\n  scope: BuilderScopeInput\n}\n\n",
              reducer:
                "if (action.input.scope) {\n  const index = state.scopes.indexOf(action.input.scope);\n  if (index !== -1) {\n    state.scopes.splice(index, 1);\n  }\n}\nstate.lastModified = new Date(action.timestampUtcMs).toISOString();",
              examples: [],
              template: "Removes a scope from the builder profile",
              description: "Removes a scope from the builder profile",
            },
            {
              id: "add-link",
              name: "ADD_LINK",
              scope: "global",
              errors: [],
              schema:
                "input AddLinkInput {\n  id: OID!\n  url: URL!\n  label: String\n}",
              reducer:
                "const newLink = {\n  id: action.input.id,\n  url: action.input.url,\n  label: action.input.label || null,\n};\nstate.links.push(newLink);\nstate.lastModified = new Date(action.timestampUtcMs).toISOString();",
              examples: [],
              template: "Adds a link to the builder profile",
              description: "Adds a link to the builder profile",
            },
            {
              id: "edit-link",
              name: "EDIT_LINK",
              scope: "global",
              errors: [],
              schema:
                "input EditLinkInput {\n  id: OID!\n  url: URL!\n  label: String\n}",
              reducer:
                "const linkIndex = state.links.findIndex(\n  (link) => link.id === action.input.id,\n);\nif (linkIndex !== -1) {\n  if (action.input.url) state.links[linkIndex].url = action.input.url;\n  if (action.input.label) state.links[linkIndex].label = action.input.label;\n}\nstate.lastModified = new Date(action.timestampUtcMs).toISOString();",
              examples: [],
              template: "Edits an existing link on the builder profile",
              description: "Edits an existing link on the builder profile",
            },
            {
              id: "remove-link",
              name: "REMOVE_LINK",
              scope: "global",
              errors: [],
              schema: "input RemoveLinkInput {\n  id: OID!\n}",
              reducer:
                "const linkIndex = state.links.findIndex(\n  (link) => link.id === action.input.id,\n);\nif (linkIndex !== -1) {\n  state.links.splice(linkIndex, 1);\n}\nstate.lastModified = new Date(action.timestampUtcMs).toISOString();",
              examples: [],
              template: "Removes a link from the builder profile",
              description: "Removes a link from the builder profile",
            },
            {
              id: "add-contributor",
              name: "ADD_CONTRIBUTOR",
              scope: "global",
              errors: [],
              schema:
                "input AddContributorInput {\n  contributorPHID: PHID!\n}",
              reducer:
                "if (action.input.contributorPHID) {\n  if (!state.contributors.includes(action.input.contributorPHID)) {\n    state.contributors.push(action.input.contributorPHID);\n  }\n}\nstate.lastModified = new Date(action.timestampUtcMs).toISOString();",
              examples: [],
              template: "Adds a contributor to the builder profile",
              description: "Adds a contributor to the builder profile",
            },
            {
              id: "remove-contributor",
              name: "REMOVE_CONTRIBUTOR",
              scope: "global",
              errors: [],
              schema:
                "input RemoveContributorInput {\n  contributorPHID: PHID!\n}",
              reducer:
                "if (action.input.contributorPHID) {\n  const index = state.contributors.indexOf(action.input.contributorPHID);\n  if (index !== -1) {\n    state.contributors.splice(index, 1);\n  }\n}\nstate.lastModified = new Date(action.timestampUtcMs).toISOString();",
              examples: [],
              template: "Removes a contributor from the builder profile",
              description: "Removes a contributor from the builder profile",
            },
            {
              id: "set-operator",
              name: "SET_OPERATOR",
              scope: "global",
              errors: [],
              schema: "input SetOperatorInput {\n  isOperator: Boolean!\n}",
              reducer: "state.isOperator = action.input.isOperator;",
              examples: [],
              template: "Sets the operator status of the builder",
              description: "Sets the operator status of the builder",
            },
            {
              id: "set-op-hub-member",
              name: "SET_OP_HUB_MEMBER",
              scope: "global",
              errors: [],
              schema:
                "input SetOpHubMemberInput {\n  name: String\n  phid: PHID\n}",
              reducer:
                "if (action.input.name)\n  state.operationalHubMember.name = action.input.name;\nif (action.input.phid)\n  state.operationalHubMember.phid = action.input.phid;\nstate.lastModified = new Date(action.timestampUtcMs).toISOString();",
              examples: [],
              template: "Sets the operational hub member details",
              description: "Sets the operational hub member details",
            },
          ],
          description: "Builder profile management operations",
        },
      ],
      version: 1,
      changeLog: [],
    },
  ],
};
