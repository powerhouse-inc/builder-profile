
import type { EditorModule } from "document-model";
import { lazy } from "react";

/** Document editor module for the "["powerhouse/builder-profile"]" document type */
export const BuilderProfile: EditorModule = {
    Component: lazy(() => import("./editor.js")),
    documentTypes: ["powerhouse/builder-profile"],
    config: {
        id: "builder-profile",
        name: "builder-profile",
    },
};
