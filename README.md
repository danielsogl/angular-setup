# Angular Setup Schematic

[![CI](https://github.com/danielsogl/angular-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/danielsogl/angular-setup/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/@danielsogl%2Fangular-setup.svg)](https://www.npmjs.com/package/@danielsogl/angular-setup)

An Angular schematic that sets up your project with essential development tools and configurations.

## Features

This schematic provides interactive prompts to selectively install and configure:

- **ESLint** - Code linting with Angular-specific rules
- **Prettier** - Code formatting with custom configuration
- **Lefthook** - Fast Git hooks manager for running checks on commit
- **Vitest** - Modern test runner replacing Karma

## Installation

```bash
npm install -D @danielsogl/angular-setup
```

## Usage

Run the schematic in your Angular project:

```bash
ng generate @danielsogl/angular-setup:ng-setup
```

### Interactive Mode

The schematic will prompt you for each tool:

```
? Would you like to add ESLint configuration? (Y/n)
? Would you like to add Prettier configuration? (Y/n)
? Would you like to add Lefthook git hooks? (Y/n)
? Would you like to configure Vitest as test runner and remove Karma? (Y/n)
```

### Non-Interactive Mode

You can skip prompts by providing options directly:

```bash
ng generate @danielsogl/angular-setup:ng-setup --eslint=true --prettier=true --lefthook=false --vitest=true
```

## What Gets Installed

### ESLint

- Installs `@angular-eslint/schematics`
- Configures ESLint with Angular-specific rules
- Adds lint scripts to `package.json`

### Prettier

- Installs Prettier
- Adds `.prettierrc.json` with configuration
- Adds `.prettierignore`
- Adds format scripts to `package.json`

### Lefthook

- Installs Lefthook
- Creates `lefthook.yml` configuration
- Sets up pre-commit hooks for:
  - Prettier formatting
  - ESLint checks
  - Type checking

### Vitest

- Installs Vitest and related dependencies
- Configures Vitest in `angular.json`
- Removes Karma configuration
- Updates test scripts in `package.json`

## Requirements

- Angular CLI 20.x or higher
- Node.js 18.x or higher

## Development

### Setup

```bash
npm install
npm run build
npm test
```

### Publishing

This project uses [release-please](https://github.com/googleapis/release-please) for automated releases. When changes are merged to `main`:

1. Release Please creates/updates a release PR
2. When the release PR is merged, it automatically:
   - Creates a GitHub release
   - Publishes to npm
   - Updates the changelog

Use [Conventional Commits](https://www.conventionalcommits.org/) for your commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `chore:` for maintenance tasks

## License

MIT

## Author

Daniel Sogl
