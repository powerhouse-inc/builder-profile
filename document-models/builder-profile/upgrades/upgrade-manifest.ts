import type { UpgradeManifest } from "document-model";
import { latestVersion, supportedVersions } from "./versions.js";

export const builderProfileUpgradeManifest: UpgradeManifest<
  typeof supportedVersions
> = {
  documentType: "powerhouse/builder-profile",
  latestVersion,
  supportedVersions,
  upgrades: {},
};
