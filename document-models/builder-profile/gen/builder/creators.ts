import { createAction } from "document-model/core";
import { UpdateProfileInputSchema } from "../schema/zod.js";
import type { UpdateProfileInput } from "../types.js";
import type { UpdateProfileAction } from "./actions.js";

export const updateProfile = (input: UpdateProfileInput) =>
  createAction<UpdateProfileAction>(
    "UPDATE_PROFILE",
    { ...input },
    undefined,
    UpdateProfileInputSchema,
    "global",
  );
