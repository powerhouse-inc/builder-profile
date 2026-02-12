# [1.0.0-dev.10](https://github.com/powerhouse-inc/builder-profile/compare/v1.0.0-dev.9...v1.0.0-dev.10) (2026-02-12)


### Bug Fixes

* **ci:** skip publish if version already exists on npm ([e54447b](https://github.com/powerhouse-inc/builder-profile/commit/e54447b7bfe607612b69670fc13258ea4eed9cde))

# [1.0.0-dev.9](https://github.com/powerhouse-inc/builder-profile/compare/v1.0.0-dev.8...v1.0.0-dev.9) (2026-02-12)


### Bug Fixes

* **ci:** use always() for notify-downstream to read outputs from always() job ([a071fa6](https://github.com/powerhouse-inc/builder-profile/commit/a071fa69666857b0392a5abf801534aec350eca1))

# [1.0.0-dev.8](https://github.com/powerhouse-inc/builder-profile/compare/v1.0.0-dev.7...v1.0.0-dev.8) (2026-02-12)


### Bug Fixes

* **ci:** use K8S_REPO_PAT org secret for cross-repo dispatch ([e8e9b73](https://github.com/powerhouse-inc/builder-profile/commit/e8e9b7388e30a1a83d72b5efc3d5f1871c3fe133))


### Features

* **ci:** notify bai-powerhouse-env after successful release ([e0e7739](https://github.com/powerhouse-inc/builder-profile/commit/e0e7739a5661c4c87739d07d7c8ade72d2f3ec22))

# [1.0.0-dev.7](https://github.com/powerhouse-inc/builder-profile/compare/v1.0.0-dev.6...v1.0.0-dev.7) (2026-02-12)


### Bug Fixes

* add repository url for npm provenance verification ([b5c08da](https://github.com/powerhouse-inc/builder-profile/commit/b5c08da3ebe57e0be564f7527d039defcac07e68))

# [1.0.0-dev.6](https://github.com/powerhouse-inc/builder-profile/compare/v1.0.0-dev.5...v1.0.0-dev.6) (2026-02-12)


### Bug Fixes

* **ci:** upgrade npm to v11+ for OIDC trusted publishing support ([8e5c0cc](https://github.com/powerhouse-inc/builder-profile/commit/8e5c0cc577394671a8faaff23ae9e72e47daee83))

# [1.0.0-dev.5](https://github.com/powerhouse-inc/builder-profile/compare/v1.0.0-dev.4...v1.0.0-dev.5) (2026-02-12)


### Bug Fixes

* **ci:** clear auth token before publish to use OIDC trusted publishers ([c33ad03](https://github.com/powerhouse-inc/builder-profile/commit/c33ad03ec4e7f593ded1197ddf9d6d35f7036ae7))

# [1.0.0-dev.4](https://github.com/powerhouse-inc/builder-profile/compare/v1.0.0-dev.3...v1.0.0-dev.4) (2026-02-12)


### Bug Fixes

* **ci:** remove NPM_TOKEN to use trusted publishers for npm publish ([cc19244](https://github.com/powerhouse-inc/builder-profile/commit/cc192445f0b7f77d30812d8274e47a71e6161f69))

# [1.0.0-dev.3](https://github.com/powerhouse-inc/builder-profile/compare/v1.0.0-dev.2...v1.0.0-dev.3) (2026-02-12)


### Bug Fixes

* **ci:** override GITHUB_REF so semantic-release uses correct branch ([e215b19](https://github.com/powerhouse-inc/builder-profile/commit/e215b199c5e3255bbc13d3d9ec18431f4206c304))
* correct semantic-release plugin order ([e43a047](https://github.com/powerhouse-inc/builder-profile/commit/e43a0470ea0475be657a379b2ddfed90828b0a8e))

# [1.0.0-dev.2](https://github.com/powerhouse-inc/builder-profile/compare/v1.0.0-dev.1...v1.0.0-dev.2) (2026-02-11)


### Bug Fixes

* trigger release with npm trusted publishers ([e63031d](https://github.com/powerhouse-inc/builder-profile/commit/e63031dca73d1cc62cd3f4f91edc5033676d2fdc))

# 1.0.0-dev.1 (2026-02-11)


### Bug Fixes

* **ci:** list powerhousedao packages explicitly for bun update ([df522ac](https://github.com/powerhouse-inc/builder-profile/commit/df522ac50ada8082a3e4a84cd20ea65df2ffc27d))
* replace pnpm exec with bunx in tailwind script ([6da563c](https://github.com/powerhouse-inc/builder-profile/commit/6da563c59774fc5f1cf968f39d29f2648aae26fc))
