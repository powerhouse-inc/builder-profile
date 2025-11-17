import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  id: "powerhouse/builder-profile",
  name: "Builder Profile",
  extension: ".phdm",
  description: "A builder profile document",
  author: {
    name: "Powerhouse",
    website: "https://powerhouse.inc/",
  },
  specifications: [
    {
      version: 1,
      changeLog: [],
      state: {
        global: {
          schema:
            "type BuilderProfileState {\n  id: PHID\n  slug: String\n  name: String\n  icon: URL\n  description: String\n}",
          initialValue:
            '"{\\n  \\"id\\": null,\\n  \\"slug\\": null,\\n  \\"name\\": null,\\n  \\"icon\\": null,\\n  \\"description\\": null\\n}"',
          examples: [],
        },
        local: {
          schema: "",
          initialValue: '""',
          examples: [],
        },
      },
      modules: [
        {
          id: "09f6c21b-cd1a-4218-8f2f-448c947c79bd",
          name: "builder",
          description: "",
          operations: [
            {
              id: "ee51a588-dd04-4819-beeb-a0cbdd598c81",
              name: "UPDATE_PROFILE",
              description: "",
              schema:
                "input UpdateProfileInput {\n  id: PHID\n  slug: String\n  name: String\n  icon: URL\n  description: String\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
      ],
    },
  ],
};
