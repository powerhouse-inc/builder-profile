// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { BuilderProfilePHState } from "@powerhousedao/builder-profile/document-models/builder-profile";

import { builderProfileBuilderOperations } from "../src/reducers/builder.js";

import { UpdateProfileInputSchema } from "./schema/zod.js";

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
      builderProfileBuilderOperations.updateProfileOperation(
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
