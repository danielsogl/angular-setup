# Changelog

## [1.2.0](https://github.com/danielsogl/angular-setup/compare/v1.1.1...v1.2.0) (2025-09-28)


### Features

* add __filename and __dirname globals to ESLint config; optimize version retrieval in ng-add utility ([b955e60](https://github.com/danielsogl/angular-setup/commit/b955e600da7aab68235ded51fd6d9bae3e35d3de))
* add is-ci package to manage CI environments and update prepare script accordingly ([9e9fc0a](https://github.com/danielsogl/angular-setup/commit/9e9fc0a17562fa0ac449d236204d66b557bc702f))
* add MIT License file to the project ([8272b7d](https://github.com/danielsogl/angular-setup/commit/8272b7dd1958146a14f844d3299c25d501fedc04))
* add Prettier formatting scripts to package.json during ngAdd ([334ecd3](https://github.com/danielsogl/angular-setup/commit/334ecd3aee8dea46cd98dfbd0fa40d616728ea6c))
* enhance ng-add schematic with validation checks and improved file operations ([43d7b7b](https://github.com/danielsogl/angular-setup/commit/43d7b7bb90743b94a2debc6eeb5b9f74a83588a8))
* integrate package-manager-detector to dynamically identify package manager during dependency installation in ng-add ([141582f](https://github.com/danielsogl/angular-setup/commit/141582feac17ec344a36a50492e46e087fc7bcfc))
* move @danielsogl/angular-setup to devDependencies in package.json during ngAdd ([e1ef573](https://github.com/danielsogl/angular-setup/commit/e1ef573a243d81e97b471126e15876fc53559020))
* update Vitest configuration to target Node.js 20 ([a701020](https://github.com/danielsogl/angular-setup/commit/a7010204fcdca6eb270fd1a2be9d2d5703546097))

## [1.1.1](https://github.com/danielsogl/angular-setup/compare/v1.1.0...v1.1.1) (2025-09-28)


### Bug Fixes

* update package.json to move @angular-eslint/schematics to dependencies ([9c34d64](https://github.com/danielsogl/angular-setup/commit/9c34d64a2e46a2439e8106f041464dd6a4ff9cbc))

## [1.1.0](https://github.com/danielsogl/angular-setup/compare/v1.0.0...v1.1.0) (2025-09-27)


### Features

* update Angular setup schematic to replace ng-setup with ng-add, add ESLint, Prettier, Lefthook, and Vitest configuration options ([63f86b2](https://github.com/danielsogl/angular-setup/commit/63f86b216ec0c2646001e9261a484b162f3fbfde))

## 1.0.0 (2025-09-27)


### Features

* add angular-eslint ([ca8f2af](https://github.com/danielsogl/angular-setup/commit/ca8f2afa07294eed617f3f6ebfa402ec4d6e3097))
* add Lefthook configuration and dependencies to ng-setup schematic ([46e88d9](https://github.com/danielsogl/angular-setup/commit/46e88d9e2cdc77888c0ab9cfbef77a723184c900))
* add migration support with new migrations.json and README for ng update ([00f76dd](https://github.com/danielsogl/angular-setup/commit/00f76dd553ce12f12643caef3738286af64cd1cb))
* add Prettier configuration and dependencies to ng-setup schematic ([bf35dae](https://github.com/danielsogl/angular-setup/commit/bf35daedcfaab8235c1d02d44b8c3e794aa790fd))
* add prompts for ESLint, Prettier, Lefthook, and Vitest configuration options in ng-setup schematic ([3528771](https://github.com/danielsogl/angular-setup/commit/35287710d2cc37e5834008aa039594af39cb4714))
* add real project validation tests for ng-setup schematic ([c46ffa1](https://github.com/danielsogl/angular-setup/commit/c46ffa1bcbd2fb97a29530ddd38e595b6f16a36b))
* configure Vitest as the test runner and remove Karma dependencies in ng-setup schematic ([66f03f2](https://github.com/danielsogl/angular-setup/commit/66f03f22135ce9b1a38c67b86bb1557f1f2fbec9))
* enhance ng-setup schematic with selective tool installation and configuration options ([4c51c23](https://github.com/danielsogl/angular-setup/commit/4c51c23b199faf59e824689c61979be9971697d9))
