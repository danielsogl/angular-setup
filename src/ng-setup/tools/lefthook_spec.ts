import { Tree } from '@angular-devkit/schematics';
import { describe, it, expect, beforeEach } from 'vitest';
import { addLefthookConfiguration, addLefthookDependencies } from './lefthook';

describe('Lefthook Tool', () => {
  let tree: Tree;
  const mockContext = {
    logger: {
      info: () => {},
      warn: () => {},
      error: () => {},
    },
  };

  beforeEach(() => {
    tree = Tree.empty();
    tree.create('package.json', JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2));
  });

  describe('addLefthookConfiguration', () => {
    it('should create lefthook.yml file', async () => {
      const rule = addLefthookConfiguration();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      expect(resultTree.exists('lefthook.yml')).toBe(true);
    });

    it('should configure pre-commit hook with lint and format commands', async () => {
      const rule = addLefthookConfiguration();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const config = resultTree.readText('lefthook.yml');
      expect(config).toContain('pre-commit:');
      expect(config).toContain('parallel: true');
      expect(config).toContain('lint:');
      expect(config).toContain('npx eslint {staged_files} --fix');
      expect(config).toContain('format:');
      expect(config).toContain('npx prettier --write {staged_files}');
      expect(config).toContain('stage_fixed: true');
    });

    it('should configure pre-push hook with test and build commands', async () => {
      const rule = addLefthookConfiguration();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const config = resultTree.readText('lefthook.yml');
      expect(config).toContain('pre-push:');
      expect(config).toContain('test:');
      expect(config).toContain('npm test');
      expect(config).toContain('build:');
      expect(config).toContain('npm run build');
    });

    it('should use glob patterns for staged files', async () => {
      const rule = addLefthookConfiguration();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const config = resultTree.readText('lefthook.yml');
      expect(config).toContain('glob:');
      expect(config).toContain('{staged_files}');
    });
  });

  describe('addLefthookDependencies', () => {
    it('should add lefthook to devDependencies', async () => {
      const rule = addLefthookDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies['lefthook']).toBe('latest');
    });

    it('should add prepare script to package.json', async () => {
      const rule = addLefthookDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.scripts['prepare']).toBe('lefthook install');
    });

    it('should create devDependencies if it does not exist', async () => {
      tree.overwrite('package.json', JSON.stringify({ name: 'test' }, null, 2));

      const rule = addLefthookDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies).toBeDefined();
      expect(packageJson.devDependencies['lefthook']).toBe('latest');
    });

    it('should create scripts if it does not exist', async () => {
      tree.overwrite('package.json', JSON.stringify({ name: 'test' }, null, 2));

      const rule = addLefthookDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts['prepare']).toBe('lefthook install');
    });
  });
});
