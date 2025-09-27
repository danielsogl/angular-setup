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
});