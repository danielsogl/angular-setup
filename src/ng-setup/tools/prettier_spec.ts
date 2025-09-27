import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { describe, it, expect, beforeEach } from 'vitest';
import { addPrettierConfiguration, addPrettierDependencies } from './prettier';

describe('Prettier Tool', () => {
  let tree: Tree;
  const mockContext = {
    logger: {
      info: () => {},
      warn: () => {},
      error: () => {}
    }
  };

  beforeEach(() => {
    tree = Tree.empty();
    tree.create('package.json', JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2));
  });

  describe('addPrettierConfiguration', () => {
    it('should create .prettierrc.json file', async () => {
      const rule = addPrettierConfiguration();
      const resultTree = await rule(tree, mockContext as any) as Tree;

      expect(resultTree.exists('.prettierrc.json')).toBe(true);
    });

    it('should create .prettierrc.json with correct configuration', async () => {
      const rule = addPrettierConfiguration();
      const resultTree = await rule(tree, mockContext as any) as Tree;

      const config = JSON.parse(resultTree.readText('.prettierrc.json'));
      expect(config.semi).toBe(true);
      expect(config.singleQuote).toBe(true);
      expect(config.printWidth).toBe(100);
      expect(config.tabWidth).toBe(2);
      expect(config.useTabs).toBe(false);
      expect(config.trailingComma).toBe('es5');
      expect(config.arrowParens).toBe('always');
      expect(config.endOfLine).toBe('lf');
    });

    it('should create .prettierignore file', async () => {
      const rule = addPrettierConfiguration();
      const resultTree = await rule(tree, mockContext as any) as Tree;

      expect(resultTree.exists('.prettierignore')).toBe(true);
    });

    it('should include common ignore patterns in .prettierignore', async () => {
      const rule = addPrettierConfiguration();
      const resultTree = await rule(tree, mockContext as any) as Tree;

      const ignoreContent = resultTree.readText('.prettierignore');
      expect(ignoreContent).toContain('node_modules');
      expect(ignoreContent).toContain('dist');
      expect(ignoreContent).toContain('coverage');
      expect(ignoreContent).toContain('.angular');
    });
  });

  describe('addPrettierDependencies', () => {
    it('should add prettier to devDependencies', async () => {
      const rule = addPrettierDependencies();
      const resultTree = await rule(tree, mockContext as any) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies['prettier']).toBe('latest');
    });

    it('should add prettier-eslint to devDependencies', async () => {
      const rule = addPrettierDependencies();
      const resultTree = await rule(tree, mockContext as any) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies['prettier-eslint']).toBe('latest');
    });

    it('should create devDependencies if it does not exist', async () => {
      tree.overwrite('package.json', JSON.stringify({ name: 'test' }, null, 2));

      const rule = addPrettierDependencies();
      const resultTree = await rule(tree, mockContext as any) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies).toBeDefined();
      expect(packageJson.devDependencies['prettier']).toBe('latest');
    });
  });
});