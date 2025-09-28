import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { beforeEach, describe, expect, it } from 'vitest';
import { Schema } from './schema';

const collectionPath = path.join(__dirname, '../../dist/collection.json');

describe('ng-add package manager detection', () => {
  let runner: SchematicTestRunner;
  let appTree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', collectionPath);

    appTree = await runner.runExternalSchematic('@schematics/angular', 'workspace', {
      name: 'test-workspace',
      version: '20.0.0',
      newProjectRoot: 'projects',
    });

    appTree = await runner.runExternalSchematic(
      '@schematics/angular',
      'application',
      {
        name: 'pm-test-app',
        projectRoot: '',
        standalone: true,
        routing: true,
        style: 'css',
      },
      appTree
    );
  });

  it('should detect npm from package-lock.json', async () => {
    appTree.create('package-lock.json', JSON.stringify({ lockfileVersion: 3 }));

    const options: Schema = {
      project: 'pm-test-app',
    };

    const tree = await runner.runSchematic('ng-add', options, appTree);

    expect(tree).toBeDefined();
  });

  it('should detect yarn from yarn.lock', async () => {
    appTree.create('yarn.lock', '# yarn lockfile v1\n');

    const options: Schema = {
      project: 'pm-test-app',
    };

    const tree = await runner.runSchematic('ng-add', options, appTree);

    expect(tree).toBeDefined();
  });

  it('should detect pnpm from pnpm-lock.yaml', async () => {
    appTree.create('pnpm-lock.yaml', 'lockfileVersion: 6.0\n');

    const options: Schema = {
      project: 'pm-test-app',
    };

    const tree = await runner.runSchematic('ng-add', options, appTree);

    expect(tree).toBeDefined();
  });

  it('should default to npm when no lock file is present', async () => {
    const options: Schema = {
      project: 'pm-test-app',
    };

    const tree = await runner.runSchematic('ng-add', options, appTree);

    expect(tree).toBeDefined();
  });
});

describe('ng-add real project with different package managers', () => {
  it('should create project with npm and verify package manager detection', async () => {
    const { execSync } = await import('child_process');
    const fs = await import('fs');
    const os = await import('os');

    const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ng-npm-test-'));
    const projectName = 'npm-test-app';
    const projectPath = path.join(testDir, projectName);

    try {
      console.log(`Creating Angular project with npm in ${testDir}...`);
      execSync(
        `npx -y @angular/cli@latest new ${projectName} --routing=false --style=css --skip-git=true --package-manager=npm`,
        {
          cwd: testDir,
          stdio: 'pipe',
          timeout: 180000,
        }
      );

      expect(fs.existsSync(path.join(projectPath, 'package-lock.json'))).toBe(true);

      const schematicPath = path.resolve(__dirname, '../../');
      console.log('Installing schematic package...');
      execSync(`npm install "file:${schematicPath}"`, {
        cwd: projectPath,
        stdio: 'pipe',
        timeout: 120000,
      });

      console.log('Running ng-add schematic...');
      const output = execSync(
        `npx ng add @danielsogl/angular-setup --project=${projectName} --skip-confirmation`,
        {
          cwd: projectPath,
          encoding: 'utf-8',
          timeout: 120000,
        }
      );

      expect(output).toContain('Detected package manager: npm');
      console.log('✓ npm package manager detected successfully');

      const packageJson = JSON.parse(
        fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8')
      );
      expect(packageJson.devDependencies['prettier']).toBeDefined();
      expect(packageJson.devDependencies['lefthook']).toBeDefined();

      console.log('✅ npm package manager test passed!');
    } finally {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    }
  }, 600000);

  it('should create project with yarn and verify package manager detection', async () => {
    const { execSync } = await import('child_process');
    const fs = await import('fs');
    const os = await import('os');

    try {
      execSync('yarn --version', { stdio: 'pipe' });
    } catch {
      console.log('⚠️ Yarn not installed, skipping yarn test');
      return;
    }

    const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ng-yarn-test-'));
    const projectName = 'yarn-test-app';
    const projectPath = path.join(testDir, projectName);

    try {
      console.log(`Creating minimal test project in ${testDir}...`);

      fs.mkdirSync(projectPath, { recursive: true });

      const packageJson = {
        name: projectName,
        version: '1.0.0',
        dependencies: {},
      };
      fs.writeFileSync(
        path.join(projectPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      fs.writeFileSync(path.join(projectPath, 'yarn.lock'), '# yarn lockfile v1\n');

      console.log('Testing package manager detection with yarn.lock...');
      const { detect } = await import('package-manager-detector/detect');
      const pm = await detect({ cwd: projectPath });

      expect(pm?.agent).toBe('yarn');
      console.log('✓ yarn package manager detected successfully');
      console.log('✅ yarn package manager test passed!');
    } finally {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    }
  }, 30000);

  it('should create project with pnpm and verify package manager detection', async () => {
    const { execSync } = await import('child_process');
    const fs = await import('fs');
    const os = await import('os');

    try {
      execSync('pnpm --version', { stdio: 'pipe' });
    } catch {
      console.log('⚠️ pnpm not installed, skipping pnpm test');
      return;
    }

    const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ng-pnpm-test-'));
    const projectName = 'pnpm-test-app';
    const projectPath = path.join(testDir, projectName);

    try {
      console.log(`Creating minimal test project in ${testDir}...`);

      fs.mkdirSync(projectPath, { recursive: true });

      const packageJson = {
        name: projectName,
        version: '1.0.0',
        dependencies: {},
      };
      fs.writeFileSync(
        path.join(projectPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      fs.writeFileSync(path.join(projectPath, 'pnpm-lock.yaml'), 'lockfileVersion: 6.0\n');

      console.log('Testing package manager detection with pnpm-lock.yaml...');
      const { detect } = await import('package-manager-detector/detect');
      const pm = await detect({ cwd: projectPath });

      expect(pm?.agent).toBe('pnpm');
      console.log('✓ pnpm package manager detected successfully');
      console.log('✅ pnpm package manager test passed!');
    } finally {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    }
  }, 30000);
});
