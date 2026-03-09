import type { UpgradeManifest } from "document-model";
import { builderProfileUpgradeManifest } from "./builder-profile/upgrades/upgrade-manifest.js";

export const upgradeManifests: UpgradeManifest<readonly number[]>[] = [
  builderProfileUpgradeManifest,
];
