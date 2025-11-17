import type { BuilderProfileBuilderOperations } from "@powerhousedao/builder-profile/document-models/builder-profile";

export const builderProfileBuilderOperations: BuilderProfileBuilderOperations = {
    updateProfileOperation(state, action) {
        state.id = action.input.id ?? state.id;
        state.slug = action.input.slug ?? state.slug;
        state.name = action.input.name ?? state.name;
        state.icon = action.input.icon ?? state.icon;
        state.description = action.input.description ?? state.description;
    }
};
