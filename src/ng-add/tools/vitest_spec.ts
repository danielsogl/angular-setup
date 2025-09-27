import { Tree } from '@angular-devkit/schematics';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  configureVitest,
  removeKarmaConfig,
  addVitestDependencies,
  removeKarmaDependencies,
} from './vitest';
import { Schema } from '../schema';

describe('Vitest Tool', () => {
  let tree: Tree;
  const options: Schema = { project: 'test-app' };
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
    tree.create(
      'angular.json',
      JSON.stringify(
        {
          projects: {
            'test-app': {
              architect: {
                test: {
                  builder: '@angular-devkit/build-angular:karma',
                  options: {
                    tsConfig: 'tsconfig.spec.json',
                  },
                },
              },
            },
          },
        },
        null,
        2
      )
    );
  });

  describe('configureVitest', () => {
    it('should update angular.json test configuration', async () => {
      const rule = configureVitest(options);
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const angularJson = JSON.parse(resultTree.readText('angular.json'));
      const testConfig = angularJson.projects['test-app'].architect.test;

      expect(testConfig.builder).toBe('@angular/build:unit-test');
      expect(testConfig.options.runner).toBe('vitest');
    });

    it('should set buildTarget correctly', async () => {
      const rule = configureVitest(options);
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const angularJson = JSON.parse(resultTree.readText('angular.json'));
      const testConfig = angularJson.projects['test-app'].architect.test;

      expect(testConfig.options.buildTarget).toBe('test-app::development');
    });

    it('should preserve existing tsConfig', async () => {
      const rule = configureVitest(options);
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const angularJson = JSON.parse(resultTree.readText('angular.json'));
      const testConfig = angularJson.projects['test-app'].architect.test;

      expect(testConfig.options.tsConfig).toBe('tsconfig.spec.json');
    });
  });

  describe('removeKarmaConfig', () => {
    it('should delete karma.conf.js if it exists', async () => {
      tree.create('karma.conf.js', 'module.exports = function(config) {}');

      const rule = removeKarmaConfig();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      expect(resultTree.exists('karma.conf.js')).toBe(false);
    });

    it('should not fail if karma.conf.js does not exist', async () => {
      const rule = removeKarmaConfig();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      expect(resultTree.exists('karma.conf.js')).toBe(false);
    });
  });

  describe('addVitestDependencies', () => {
    it('should add vitest to devDependencies', async () => {
      const rule = addVitestDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies['vitest']).toBe('latest');
    });

    it('should add jsdom to devDependencies', async () => {
      const rule = addVitestDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies['jsdom']).toBe('latest');
    });
  });

  describe('removeKarmaDependencies', () => {
    beforeEach(() => {
      tree.overwrite(
        'package.json',
        JSON.stringify(
          {
            name: 'test',
            version: '1.0.0',
            devDependencies: {
              karma: '^6.0.0',
              'karma-chrome-launcher': '^3.0.0',
              'karma-coverage': '^2.0.0',
              'karma-jasmine': '^5.0.0',
              'karma-jasmine-html-reporter': '^2.0.0',
              'jasmine-core': '^5.0.0',
              '@types/jasmine': '^5.0.0',
              typescript: '^5.0.0',
            },
          },
          null,
          2
        )
      );
    });

    it('should remove karma dependencies', async () => {
      const rule = removeKarmaDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies['karma']).toBeUndefined();
      expect(packageJson.devDependencies['karma-chrome-launcher']).toBeUndefined();
      expect(packageJson.devDependencies['karma-coverage']).toBeUndefined();
      expect(packageJson.devDependencies['karma-jasmine']).toBeUndefined();
      expect(packageJson.devDependencies['karma-jasmine-html-reporter']).toBeUndefined();
    });

    it('should remove jasmine dependencies', async () => {
      const rule = removeKarmaDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies['jasmine-core']).toBeUndefined();
      expect(packageJson.devDependencies['@types/jasmine']).toBeUndefined();
    });

    it('should preserve other dependencies', async () => {
      const rule = removeKarmaDependencies();
      const resultTree = (await rule(tree, mockContext as any)) as Tree;

      const packageJson = JSON.parse(resultTree.readText('package.json'));
      expect(packageJson.devDependencies['typescript']).toBe('^5.0.0');
    });
  });
});
