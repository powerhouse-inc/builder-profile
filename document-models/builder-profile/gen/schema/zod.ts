import { z } from "zod";
import type {
  AddContributorInput,
  AddLinkInput,
  AddScopeInput,
  AddSkillInput,
  BuilderLink,
  BuilderProfileState,
  BuilderScope,
  BuilderScopeInput,
  BuilderSkill,
  BuilderSkillInput,
  BuilderStatus,
  BuilderStatusInput,
  EditLinkInput,
  RemoveContributorInput,
  RemoveLinkInput,
  RemoveScopeInput,
  RemoveSkillInput,
  UpdateProfileInput,
  TeamType,
  TeamTypeInput,
} from "./types.js";

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export const BuilderScopeSchema = z.enum([
  "ACC",
  "GOVERNANCE_SCOPE",
  "PROTOCOL_SCOPE",
  "STA",
  "STABILITY_SCOPE",
  "SUP",
  "SUPPORT_SCOPE",
]);

export const BuilderScopeInputSchema = z.enum([
  "ACC",
  "GOVERNANCE_SCOPE",
  "PROTOCOL_SCOPE",
  "STA",
  "STABILITY_SCOPE",
  "SUP",
  "SUPPORT_SCOPE",
]);

export const BuilderSkillSchema = z.enum([
  "BACKEND_DEVELOPMENT",
  "DATA_ENGINEERING",
  "DEVOPS_ENGINEERING",
  "FRONTEND_DEVELOPMENT",
  "FULL_STACK_DEVELOPMENT",
  "QA_TESTING",
  "SECURITY_ENGINEERING",
  "SMART_CONTRACT_DEVELOPMENT",
  "TECHNICAL_WRITING",
  "UI_UX_DESIGN",
]);

export const BuilderSkillInputSchema = z.enum([
  "BACKEND_DEVELOPMENT",
  "DATA_ENGINEERING",
  "DEVOPS_ENGINEERING",
  "FRONTEND_DEVELOPMENT",
  "FULL_STACK_DEVELOPMENT",
  "QA_TESTING",
  "SECURITY_ENGINEERING",
  "SMART_CONTRACT_DEVELOPMENT",
  "TECHNICAL_WRITING",
  "UI_UX_DESIGN",
]);

export const BuilderStatusSchema = z.enum([
  "ACTIVE",
  "ARCHIVED",
  "COMPLETED",
  "INACTIVE",
  "ON_HOLD",
]);

export const BuilderStatusInputSchema = z.enum([
  "ACTIVE",
  "ARCHIVED",
  "COMPLETED",
  "INACTIVE",
  "ON_HOLD",
]);

export const TeamTypeSchema = z.enum(["INDIVIDUAL", "TEAM"]);

export const TeamTypeInputSchema = z.enum(["INDIVIDUAL", "TEAM"]);

export function AddContributorInputSchema(): z.ZodObject<
  Properties<AddContributorInput>
> {
  return z.object({
    contributorPHID: z.string(),
  });
}

export function AddLinkInputSchema(): z.ZodObject<Properties<AddLinkInput>> {
  return z.object({
    id: z.string(),
    label: z.string().nullish(),
    url: z.string().url(),
  });
}

export function AddScopeInputSchema(): z.ZodObject<Properties<AddScopeInput>> {
  return z.object({
    scope: z.lazy(() => BuilderScopeInputSchema.nullish()),
  });
}

export function AddSkillInputSchema(): z.ZodObject<Properties<AddSkillInput>> {
  return z.object({
    skill: z.lazy(() => BuilderSkillInputSchema.nullish()),
  });
}

export function BuilderLinkSchema(): z.ZodObject<Properties<BuilderLink>> {
  return z.object({
    __typename: z.literal("BuilderLink").optional(),
    id: z.string(),
    label: z.string().nullable(),
    url: z.string().url(),
  });
}

export function BuilderProfileStateSchema(): z.ZodObject<
  Properties<BuilderProfileState>
> {
  return z.object({
    __typename: z.literal("BuilderProfileState").optional(),
    code: z.string().nullable(),
    contributors: z.array(z.string()),
    description: z.string().nullable(),
    icon: z.string().url().nullable(),
    id: z.string().nullable(),
    lastModified: z.string().datetime().nullable(),
    links: z.array(BuilderLinkSchema()),
    name: z.string().nullable(),
    scopes: z.array(BuilderScopeSchema),
    skils: z.array(BuilderSkillSchema),
    slug: z.string().nullable(),
    status: BuilderStatusSchema.nullable(),
    type: TeamTypeSchema,
  });
}

export function EditLinkInputSchema(): z.ZodObject<Properties<EditLinkInput>> {
  return z.object({
    id: z.string(),
    label: z.string().nullish(),
    url: z.string().url(),
  });
}

export function RemoveContributorInputSchema(): z.ZodObject<
  Properties<RemoveContributorInput>
> {
  return z.object({
    contributorPHID: z.string(),
  });
}

export function RemoveLinkInputSchema(): z.ZodObject<
  Properties<RemoveLinkInput>
> {
  return z.object({
    id: z.string(),
  });
}

export function RemoveScopeInputSchema(): z.ZodObject<
  Properties<RemoveScopeInput>
> {
  return z.object({
    scope: z.lazy(() => BuilderScopeInputSchema.nullish()),
  });
}

export function RemoveSkillInputSchema(): z.ZodObject<
  Properties<RemoveSkillInput>
> {
  return z.object({
    skill: z.lazy(() => BuilderSkillInputSchema.nullish()),
  });
}

export function UpdateProfileInputSchema(): z.ZodObject<
  Properties<UpdateProfileInput>
> {
  return z.object({
    code: z.string().nullish(),
    description: z.string().nullish(),
    icon: z.string().url().nullish(),
    id: z.string().nullish(),
    name: z.string().nullish(),
    slug: z.string().nullish(),
    status: z.lazy(() => BuilderStatusInputSchema.nullish()),
    type: z.lazy(() => TeamTypeInputSchema.nullish()),
  });
}
