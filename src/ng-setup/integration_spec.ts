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

  it('should configure Vitest as the test runner in angular.json', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    const angularJson = tree.readJson('angular.json') as any;
    const project = angularJson.projects['integration-test-app'];

    expect(project.architect.test.builder).toBe('@angular/build:unit-test');
    expect(project.architect.test.options.runner).toBe('vitest');
    expect(project.architect.test.options.buildTarget).toBe('integration-test-app::development');
  });

  it('should add vitest and jsdom dependencies to package.json', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    const packageJson = tree.readJson('package.json') as any;
    expect(packageJson.devDependencies['vitest']).toBeDefined();
    expect(packageJson.devDependencies['jsdom']).toBeDefined();
  });

  it('should remove Karma and Jasmine dependencies from package.json', async () => {
    appTree.overwrite('package.json', JSON.stringify({
      name: 'test-app',
      version: '0.0.0',
      devDependencies: {
        'karma': '^6.0.0',
        'karma-chrome-launcher': '^3.0.0',
        'karma-coverage': '^2.0.0',
        'karma-jasmine': '^5.0.0',
        'karma-jasmine-html-reporter': '^2.0.0',
        'jasmine-core': '^5.0.0',
        '@types/jasmine': '^5.0.0'
      }
    }, null, 2));

    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    const packageJson = tree.readJson('package.json') as any;
    expect(packageJson.devDependencies['karma']).toBeUndefined();
    expect(packageJson.devDependencies['karma-chrome-launcher']).toBeUndefined();
    expect(packageJson.devDependencies['karma-coverage']).toBeUndefined();
    expect(packageJson.devDependencies['karma-jasmine']).toBeUndefined();
    expect(packageJson.devDependencies['karma-jasmine-html-reporter']).toBeUndefined();
    expect(packageJson.devDependencies['jasmine-core']).toBeUndefined();
    expect(packageJson.devDependencies['@types/jasmine']).toBeUndefined();
  });

  it('should remove karma.conf.js if it exists', async () => {
    appTree.create('karma.conf.js', 'module.exports = function(config) {}');

    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    expect(tree.exists('karma.conf.js')).toBe(false);
  });

  it('should preserve tsConfig option from existing test configuration', async () => {
    const options: Schema = {
      project: 'integration-test-app'
    };

    const tree = await runner.runSchematic('ng-setup', options, appTree);

    const angularJson = tree.readJson('angular.json') as any;
    const project = angularJson.projects['integration-test-app'];

    expect(project.architect.test.options.tsConfig).toBeDefined();
    expect(project.architect.test.options.tsConfig).toContain('tsconfig.spec.json');
  });
});

describe('ng-setup real project validation', () => {
  it('should create real project, install dependencies, and verify tools are executable', async () => {
    const { execSync } = await import('child_process');
    const fs = await import('fs');
    const os = await import('os');

    const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ng-real-test-'));
    const projectName = 'validation-app';
    const projectPath = path.join(testDir, projectName);

    try {
      console.log(`Creating real Angular project in ${testDir}...`);
      execSync(`npx -y @angular/cli@latest new ${projectName} --routing=false --style=css --skip-git=true --package-manager=npm`, {
        cwd: testDir,
        stdio: 'pipe',
        timeout: 180000,
      });

      const schematicPath = path.resolve(__dirname, '../../');
      console.log(`Linking schematic from ${schematicPath}...`);

      execSync(`npm link "${schematicPath}"`, {
        cwd: projectPath,
        stdio: 'pipe',
        timeout: 60000,
      });

      console.log('Running ng-setup schematic...');
      execSync(`npx ng g @danielsogl/angular-setup:ng-setup --project=${projectName}`, {
        cwd: projectPath,
        stdio: 'pipe',
        timeout: 120000,
      });

      console.log('Verifying configuration files...');
      expect(fs.existsSync(path.join(projectPath, '.prettierrc.json'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, '.prettierignore'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'lefthook.yml'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'eslint.config.js'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'karma.conf.js'))).toBe(false);

      console.log('Verifying package.json modifications...');
      let packageJson = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8'));

      expect(packageJson.devDependencies['prettier']).toBeDefined();
      expect(packageJson.devDependencies['prettier-eslint']).toBeDefined();
      expect(packageJson.devDependencies['lefthook']).toBeDefined();
      expect(packageJson.devDependencies['vitest']).toBeDefined();
      expect(packageJson.devDependencies['jsdom']).toBeDefined();

      const hasESLintDeps = packageJson.devDependencies['@angular-eslint/eslint-plugin'] ||
                            packageJson.devDependencies['@angular-eslint/builder'] ||
                            packageJson.devDependencies['eslint'];
      expect(hasESLintDeps).toBeDefined();

      expect(packageJson.devDependencies['karma']).toBeUndefined();
      expect(packageJson.devDependencies['karma-chrome-launcher']).toBeUndefined();
      expect(packageJson.devDependencies['karma-coverage']).toBeUndefined();
      expect(packageJson.devDependencies['karma-jasmine']).toBeUndefined();

      expect(packageJson.scripts['prepare']).toBe('lefthook install');

      console.log('Verifying angular.json configuration...');
      const angularJson = JSON.parse(fs.readFileSync(path.join(projectPath, 'angular.json'), 'utf-8'));
      const testConfig = angularJson.projects[projectName].architect.test;
      expect(testConfig.builder).toBe('@angular/build:unit-test');
      expect(testConfig.options.runner).toBe('vitest');

      console.log('Removing prepare script temporarily...');
      packageJson = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8'));
      const prepareScript = packageJson.scripts['prepare'];
      delete packageJson.scripts['prepare'];
      fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

      console.log('Installing all dependencies...');
      execSync('npm install', {
        cwd: projectPath,
        stdio: 'pipe',
        timeout: 300000,
      });

      console.log('Initializing git repository...');
      execSync('git init', {
        cwd: projectPath,
        stdio: 'pipe',
      });

      console.log('Running lefthook install...');
      execSync('npx lefthook install', {
        cwd: projectPath,
        stdio: 'pipe',
      });

      packageJson.scripts['prepare'] = prepareScript;
      fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

      console.log('Verifying Prettier is executable...');
      const prettierVersion = execSync('npx prettier --version', {
        cwd: projectPath,
        encoding: 'utf-8',
        timeout: 10000,
      });
      expect(prettierVersion.trim()).toBeTruthy();
      console.log(`✓ Prettier version: ${prettierVersion.trim()}`);

      console.log('Verifying ESLint is executable...');
      const eslintVersion = execSync('npx eslint --version', {
        cwd: projectPath,
        encoding: 'utf-8',
        timeout: 10000,
      });
      expect(eslintVersion.trim()).toBeTruthy();
      console.log(`✓ ESLint version: ${eslintVersion.trim()}`);

      console.log('Verifying Lefthook is executable...');
      const lefthookVersion = execSync('npx lefthook version', {
        cwd: projectPath,
        encoding: 'utf-8',
        timeout: 10000,
      });
      expect(lefthookVersion.trim()).toBeTruthy();
      console.log(`✓ Lefthook version: ${lefthookVersion.trim()}`);

      console.log('Verifying Vitest is executable...');
      const vitestVersion = execSync('npx vitest --version', {
        cwd: projectPath,
        encoding: 'utf-8',
        timeout: 10000,
      });
      expect(vitestVersion.trim()).toBeTruthy();
      console.log(`✓ Vitest version: ${vitestVersion.trim()}`);

      console.log('Formatting project files with Prettier...');
      execSync('npx prettier --write "src/**/*.{ts,html,css}"', {
        cwd: projectPath,
        stdio: 'pipe',
        timeout: 30000,
      });
      console.log('✓ Prettier formatting completed');

      console.log('Running ESLint on project files...');
      execSync('npx eslint .', {
        cwd: projectPath,
        stdio: 'pipe',
        timeout: 30000,
      });
      console.log('✓ ESLint check passed');

      console.log('✅ All validations passed successfully!');
    } finally {
      if (fs.existsSync(testDir)) {
        console.log(`Cleaning up test directory: ${testDir}`);
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    }
  }, 600000);
});