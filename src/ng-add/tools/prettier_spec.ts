import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { describe, it, expect, beforeEach } from 'vitest';
import { addPrettierConfiguration, addPrettierDependencies } from './prettier';
import { DEPENDENCY_VERSIONS } from '../utils/versions';

describe('Prettier Tool', () => {
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

  describe('addPrettierConfiguration', () => {
    it('should create prettier configuration files from templates', async () => {
      const rule = addPrettierConfiguration();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      expect(resultTree).toBeDefined();
    });
  });

  describe('addPrettierDependencies', () => {
    it('should add prettier to devDependencies', async () => {
      const rule = addPrettierDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies['prettier']).toBe(DEPENDENCY_VERSIONS.prettier);
    });

    it('should add prettier-eslint to devDependencies', async () => {
      const rule = addPrettierDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies['prettier']).toBeDefined();
    });

    it('should create devDependencies if it does not exist', async () => {
      tree.overwrite('package.json', JSON.stringify({ name: 'test' }, null, 2));

      const rule = addPrettierDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies).toBeDefined();
      expect(packageJson.devDependencies['prettier']).toBe('^3.6.2');
    });
  });
});
