// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { BuilderProfilePHState } from "@powerhousedao/builder-profile/document-models/builder-profile";

import { builderProfileBuildersOperations } from "../src/reducers/builders.js";

import {
  UpdateProfileInputSchema,
  AddSkillInputSchema,
  RemoveSkillInputSchema,
  AddScopeInputSchema,
  RemoveScopeInputSchema,
  AddLinkInputSchema,
  EditLinkInputSchema,
  RemoveLinkInputSchema,
  AddContributorInputSchema,
  RemoveContributorInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<BuilderProfilePHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "UPDATE_PROFILE":
      UpdateProfileInputSchema().parse(action.input);
      builderProfileBuildersOperations.updateProfileOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_SKILL":
      AddSkillInputSchema().parse(action.input);
      builderProfileBuildersOperations.addSkillOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_SKILL":
      RemoveSkillInputSchema().parse(action.input);
      builderProfileBuildersOperations.removeSkillOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_SCOPE":
      AddScopeInputSchema().parse(action.input);
      builderProfileBuildersOperations.addScopeOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_SCOPE":
      RemoveScopeInputSchema().parse(action.input);
      builderProfileBuildersOperations.removeScopeOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_LINK":
      AddLinkInputSchema().parse(action.input);
      builderProfileBuildersOperations.addLinkOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_LINK":
      EditLinkInputSchema().parse(action.input);
      builderProfileBuildersOperations.editLinkOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_LINK":
      RemoveLinkInputSchema().parse(action.input);
      builderProfileBuildersOperations.removeLinkOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_CONTRIBUTOR":
      AddContributorInputSchema().parse(action.input);
      builderProfileBuildersOperations.addContributorOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_CONTRIBUTOR":
      RemoveContributorInputSchema().parse(action.input);
      builderProfileBuildersOperations.removeContributorOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<BuilderProfilePHState>(stateReducer);
