import { createAction } from "document-model/core";
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
  SetOperatorInputSchema,
  SetOpHubMemberInputSchema,
} from "../schema/zod.js";
import type {
  UpdateProfileInput,
  AddSkillInput,
  RemoveSkillInput,
  AddScopeInput,
  RemoveScopeInput,
  AddLinkInput,
  EditLinkInput,
  RemoveLinkInput,
  AddContributorInput,
  RemoveContributorInput,
  SetOperatorInput,
  SetOpHubMemberInput,
} from "../types.js";
import type {
  UpdateProfileAction,
  AddSkillAction,
  RemoveSkillAction,
  AddScopeAction,
  RemoveScopeAction,
  AddLinkAction,
  EditLinkAction,
  RemoveLinkAction,
  AddContributorAction,
  RemoveContributorAction,
  SetOperatorAction,
  SetOpHubMemberAction,
} from "./actions.js";

export const updateProfile = (input: UpdateProfileInput) =>
  createAction<UpdateProfileAction>(
    "UPDATE_PROFILE",
    { ...input },
    undefined,
    UpdateProfileInputSchema,
    "global",
  );

export const addSkill = (input: AddSkillInput) =>
  createAction<AddSkillAction>(
    "ADD_SKILL",
    { ...input },
    undefined,
    AddSkillInputSchema,
    "global",
  );

export const removeSkill = (input: RemoveSkillInput) =>
  createAction<RemoveSkillAction>(
    "REMOVE_SKILL",
    { ...input },
    undefined,
    RemoveSkillInputSchema,
    "global",
  );

export const addScope = (input: AddScopeInput) =>
  createAction<AddScopeAction>(
    "ADD_SCOPE",
    { ...input },
    undefined,
    AddScopeInputSchema,
    "global",
  );

export const removeScope = (input: RemoveScopeInput) =>
  createAction<RemoveScopeAction>(
    "REMOVE_SCOPE",
    { ...input },
    undefined,
    RemoveScopeInputSchema,
    "global",
  );

export const addLink = (input: AddLinkInput) =>
  createAction<AddLinkAction>(
    "ADD_LINK",
    { ...input },
    undefined,
    AddLinkInputSchema,
    "global",
  );

export const editLink = (input: EditLinkInput) =>
  createAction<EditLinkAction>(
    "EDIT_LINK",
    { ...input },
    undefined,
    EditLinkInputSchema,
    "global",
  );

export const removeLink = (input: RemoveLinkInput) =>
  createAction<RemoveLinkAction>(
    "REMOVE_LINK",
    { ...input },
    undefined,
    RemoveLinkInputSchema,
    "global",
  );

export const addContributor = (input: AddContributorInput) =>
  createAction<AddContributorAction>(
    "ADD_CONTRIBUTOR",
    { ...input },
    undefined,
    AddContributorInputSchema,
    "global",
  );

export const removeContributor = (input: RemoveContributorInput) =>
  createAction<RemoveContributorAction>(
    "REMOVE_CONTRIBUTOR",
    { ...input },
    undefined,
    RemoveContributorInputSchema,
    "global",
  );

export const setOperator = (input: SetOperatorInput) =>
  createAction<SetOperatorAction>(
    "SET_OPERATOR",
    { ...input },
    undefined,
    SetOperatorInputSchema,
    "global",
  );

export const setOpHubMember = (input: SetOpHubMemberInput) =>
  createAction<SetOpHubMemberAction>(
    "SET_OP_HUB_MEMBER",
    { ...input },
    undefined,
    SetOpHubMemberInputSchema,
    "global",
  );
