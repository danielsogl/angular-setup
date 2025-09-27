import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { beforeEach, describe, expect, it } from 'vitest';
import { Schema } from './schema';

const collectionPath = path.join(__dirname, '../../dist/collection.json');

describe('ng-setup integration', () => {
  let runner: SchematicTestRunner;
  let appTree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', collectionPath);

    appTree = await runner.runExternalSchematic('@schematics/angular', 'workspace', {
      name: 'test-workspace',
      version: '20.0.0',
      newProjectRoot: 'projects'
    });

    appTree = await runner.runExternalSchematic('@schematics/angular', 'application', {
      name: 'integration-test-app',
      projectRoot: '',
      standalone: true,
      routing: true,
      style: 'css'
    }, appTree);
  });

  it('should successfully setup a fresh Angular project with ESLint', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    expect(tree.files.length).toBeGreaterThan(0);

    const angularJson = tree.readJson('angular.json') as any;
    expect(angularJson.projects['integration-test-app']).toBeDefined();
  });

  it('should add ESLint configuration files to the project', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    expect(tree.files.some(file => file.includes('eslint'))).toBe(true);
  });

  it('should work with default project from angular.json', async () => {
    const angularJson = appTree.readJson('angular.json') as any;
    angularJson.defaultProject = 'integration-test-app';
    appTree.overwrite('angular.json', JSON.stringify(angularJson, null, 2));

    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    expect(tree).toBeDefined();
    expect(tree.files.length).toBeGreaterThan(0);
  });

  it('should add Prettier configuration file', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    expect(tree.exists('.prettierrc.json')).toBe(true);

    const prettierConfig = tree.readJson('.prettierrc.json') as any;
    expect(prettierConfig).toBeDefined();
    expect(prettierConfig.semi).toBe(true);
    expect(prettierConfig.singleQuote).toBe(true);
    expect(prettierConfig.printWidth).toBe(100);
    expect(prettierConfig.tabWidth).toBe(2);
  });

  it('should add Prettier ignore file', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    expect(tree.exists('.prettierignore')).toBe(true);

    const prettierIgnore = tree.readText('.prettierignore');
    expect(prettierIgnore).toContain('node_modules');
    expect(prettierIgnore).toContain('dist');
    expect(prettierIgnore).toContain('coverage');
    expect(prettierIgnore).toContain('.angular');
  });

  it('should add prettier and prettier-eslint dependencies to package.json', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    const packageJson = tree.readJson('package.json') as any;
    expect(packageJson.devDependencies).toBeDefined();
    expect(packageJson.devDependencies['prettier']).toBeDefined();
    expect(packageJson.devDependencies['prettier-eslint']).toBeDefined();
  });

  it('should configure prettier with correct settings', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    const prettierConfig = tree.readJson('.prettierrc.json') as any;
    expect(prettierConfig.trailingComma).toBe('es5');
    expect(prettierConfig.useTabs).toBe(false);
    expect(prettierConfig.arrowParens).toBe('always');
    expect(prettierConfig.endOfLine).toBe('lf');
  });

  it('should add Lefthook configuration file', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    expect(tree.exists('lefthook.yml')).toBe(true);

    const lefthookConfig = tree.readText('lefthook.yml');
    expect(lefthookConfig).toContain('pre-commit:');
    expect(lefthookConfig).toContain('pre-push:');
  });

  it('should configure pre-commit hook with lint and format commands', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    const lefthookConfig = tree.readText('lefthook.yml');
    expect(lefthookConfig).toContain('parallel: true');
    expect(lefthookConfig).toContain('lint:');
    expect(lefthookConfig).toContain('npx eslint {staged_files} --fix');
    expect(lefthookConfig).toContain('stage_fixed: true');
    expect(lefthookConfig).toContain('format:');
    expect(lefthookConfig).toContain('npx prettier --write {staged_files}');
  });

  it('should configure pre-push hook with test and build commands', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    const lefthookConfig = tree.readText('lefthook.yml');
    expect(lefthookConfig).toContain('test:');
    expect(lefthookConfig).toContain('npm test');
    expect(lefthookConfig).toContain('build:');
    expect(lefthookConfig).toContain('npm run build');
  });

  it('should add lefthook dependency to package.json', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    const packageJson = tree.readJson('package.json') as any;
    expect(packageJson.devDependencies).toBeDefined();
    expect(packageJson.devDependencies['lefthook']).toBeDefined();
  });

  it('should add prepare script to package.json', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    const packageJson = tree.readJson('package.json') as any;
    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts['prepare']).toBe('lefthook install');
  });

  it('should use glob patterns to target staged files only', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    const lefthookConfig = tree.readText('lefthook.yml');
    expect(lefthookConfig).toContain('{staged_files}');
    expect(lefthookConfig).toContain('glob:');
  });
});