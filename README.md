# Angular Setup Schematic

[![CI](https://github.com/danielsogl/angular-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/danielsogl/angular-setup/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/@danielsogl%2Fangular-setup.svg)](https://www.npmjs.com/package/@danielsogl/angular-setup)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> An Angular schematic that automates the setup of essential development tools and configurations for your Angular projects.

## ✨ Features

Interactively configure your Angular project with modern development tools:

- **ESLint** - Static code analysis with Angular-specific rules
- **Prettier** - Opinionated code formatting
- **Lefthook** - Lightning-fast Git hooks for pre-commit quality checks
- **Vitest** - Next-generation testing framework (replaces Karma)

## 📦 Installation

```bash
npm install -D @danielsogl/angular-setup
```

Or use your preferred package manager:

```bash
yarn add -D @danielsogl/angular-setup
pnpm add -D @danielsogl/angular-setup
```

## 🚀 Usage

Add the schematic to your Angular project:

```bash
ng add @danielsogl/angular-setup
```

This command will install the package and automatically run the setup.

### Interactive Mode

You'll be prompted to choose which tools to install:

```
? Would you like to add ESLint configuration? (Y/n)
? Would you like to add Prettier configuration? (Y/n)
? Would you like to add Lefthook git hooks? (Y/n)
? Would you like to configure Vitest as test runner and remove Karma? (Y/n)
```

### Non-Interactive Mode

Skip prompts by providing options:

```bash
ng add @danielsogl/angular-setup --eslint --prettier --lefthook --vitest
```

Or selectively disable features:

```bash
ng add @danielsogl/angular-setup --eslint --prettier --no-lefthook --no-vitest
```

## 🔧 What Gets Configured

### ESLint

- Installs and configures `@angular-eslint/schematics`
- Sets up Angular-specific linting rules
- Adds `lint` and `lint:fix` scripts to `package.json`

### Prettier

- Installs Prettier with sensible defaults
- Creates `.prettierrc.json` configuration
- Adds `.prettierignore` file
- Includes `format` and `format:check` scripts in `package.json`

### Lefthook

- Installs Lefthook for fast Git hooks
- Creates `lefthook.yml` with pre-commit hooks:
  - Code formatting (Prettier)
  - Linting (ESLint)
  - Type checking (TypeScript)

### Vitest

- Installs Vitest and required dependencies
- Updates `angular.json` with Vitest builder configuration
- Removes Karma and Jasmine dependencies
- Updates test scripts in `package.json`

## 📋 Requirements

- Angular CLI 20.x or higher
- Node.js 18.x or higher

## 🤝 Contributing

Contributions are welcome! This project uses:

- **Conventional Commits** for commit messages
- **Automated releases** via [release-please](https://github.com/googleapis/release-please)

### Development Setup

```bash
npm install
npm run build
npm test
```

### Commit Message Format

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks

## 📄 License

[MIT](LICENSE) © [Daniel Sogl](https://github.com/danielsogl)

## 🐛 Issues & Support

Found a bug or have a feature request? [Open an issue](https://github.com/danielsogl/angular-setup/issues) on GitHub.
