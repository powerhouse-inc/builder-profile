import { type SignalDispatch } from "document-model";
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
} from "./actions.js";
import type { BuilderProfileState } from "../types.js";

export interface BuilderProfileBuildersOperations {
  updateProfileOperation: (
    state: BuilderProfileState,
    action: UpdateProfileAction,
    dispatch?: SignalDispatch,
  ) => void;
  addSkillOperation: (
    state: BuilderProfileState,
    action: AddSkillAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeSkillOperation: (
    state: BuilderProfileState,
    action: RemoveSkillAction,
    dispatch?: SignalDispatch,
  ) => void;
  addScopeOperation: (
    state: BuilderProfileState,
    action: AddScopeAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeScopeOperation: (
    state: BuilderProfileState,
    action: RemoveScopeAction,
    dispatch?: SignalDispatch,
  ) => void;
  addLinkOperation: (
    state: BuilderProfileState,
    action: AddLinkAction,
    dispatch?: SignalDispatch,
  ) => void;
  editLinkOperation: (
    state: BuilderProfileState,
    action: EditLinkAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeLinkOperation: (
    state: BuilderProfileState,
    action: RemoveLinkAction,
    dispatch?: SignalDispatch,
  ) => void;
  addContributorOperation: (
    state: BuilderProfileState,
    action: AddContributorAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeContributorOperation: (
    state: BuilderProfileState,
    action: RemoveContributorAction,
    dispatch?: SignalDispatch,
  ) => void;
  setOperatorOperation: (
    state: BuilderProfileState,
    action: SetOperatorAction,
    dispatch?: SignalDispatch,
  ) => void;
}
