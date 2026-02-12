# 1.0.0 (2026-02-12)


### Bug Fixes

* add repository url for npm provenance verification ([6c7d5c6](https://github.com/powerhouse-inc/builder-profile/commit/6c7d5c6c68a697ab2a99bbf709ec82edb2aa5745))
* **ci:** clear auth token before publish to use OIDC trusted publishers ([0e3efec](https://github.com/powerhouse-inc/builder-profile/commit/0e3efec115ffaa33a4656dfaa898daac6e7f3ca5))
* **ci:** list powerhousedao packages explicitly for bun update ([2d75848](https://github.com/powerhouse-inc/builder-profile/commit/2d75848176559db6a26c26ecce25bcb3cf1430b8))
* **ci:** override GITHUB_REF so semantic-release uses correct branch ([e99749b](https://github.com/powerhouse-inc/builder-profile/commit/e99749be9be91e6dc0ab35e3d4856c1cea4fe973))
* **ci:** remove NPM_TOKEN to use trusted publishers for npm publish ([17dff17](https://github.com/powerhouse-inc/builder-profile/commit/17dff178c15265bc1418ebf37d0dee6614e22561))
* **ci:** skip publish if version already exists on npm ([6222658](https://github.com/powerhouse-inc/builder-profile/commit/6222658c408157eaa5c8873a7ee5e38de0699cd7))
* **ci:** upgrade npm to v11+ for OIDC trusted publishing support ([5d84597](https://github.com/powerhouse-inc/builder-profile/commit/5d84597000412e85751628bacd3c338436cfb1b8))
* **ci:** use always() for notify-downstream to read outputs from always() job ([9d36721](https://github.com/powerhouse-inc/builder-profile/commit/9d36721fab567564d4d8610740faf8214ad7c6cf))
* **ci:** use K8S_REPO_PAT org secret for cross-repo dispatch ([38ce540](https://github.com/powerhouse-inc/builder-profile/commit/38ce5405edda316a61a5e6526529f748404e99b1))
* replace pnpm exec with bunx in tailwind script ([7d678a0](https://github.com/powerhouse-inc/builder-profile/commit/7d678a0250393573c37578b229d85c84f79fc8a1))


### Features

* **ci:** notify bai-powerhouse-env after successful release ([4f1e353](https://github.com/powerhouse-inc/builder-profile/commit/4f1e3531aeba30c5a97a0c8bfda26762ec1f8376))
