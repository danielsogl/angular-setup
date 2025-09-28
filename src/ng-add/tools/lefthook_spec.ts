import { Tree } from '@angular-devkit/schematics';
import { describe, it, expect, beforeEach } from 'vitest';
import { addLefthookConfiguration, addLefthookDependencies } from './lefthook';
import { DEPENDENCY_VERSIONS } from '../utils/versions';

describe('Lefthook Tool', () => {
  let tree: Tree;
  const mockContext = {
    logger: {
      info: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
    },
  };

  beforeEach(() => {
    tree = Tree.empty();
    tree.create('package.json', JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2));
  });

  describe('addLefthookConfiguration', () => {
    it('should create lefthook configuration from template', async () => {
      const rule = addLefthookConfiguration();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      expect(resultTree).toBeDefined();
    });
  });

  describe('addLefthookDependencies', () => {
    it('should add lefthook to devDependencies', async () => {
      const rule = addLefthookDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies['lefthook']).toBe(DEPENDENCY_VERSIONS.lefthook);
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
      expect(packageJson.devDependencies['lefthook']).toBe('^1.13.4');
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
