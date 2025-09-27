import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Schema } from './schema';

const collectionPath = path.join(__dirname, '../../dist/collection.json');

describe('ng-setup', () => {
  let runner: SchematicTestRunner;
  let tree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', collectionPath);
    tree = await runner.runExternalSchematic('@schematics/angular', 'workspace', {
      name: 'workspace',
      version: '20.0.0',
      newProjectRoot: 'projects',
    });

    tree = await runner.runExternalSchematic(
      '@schematics/angular',
      'application',
      {
        name: 'test-app',
        projectRoot: '',
        standalone: true,
      },
      tree
    );
  });

  it('should call externalSchematic for angular-eslint', async () => {
    const options: Schema = {
      project: 'test-app',
    };

    const spy = vi.spyOn(runner.engine, 'createCollection');
    const resultTree = await runner.runSchematic('ng-setup', options, tree);

    expect(spy).toHaveBeenCalledWith('@angular-eslint/schematics', expect.anything());
    expect(resultTree).toBeDefined();
  });

  it('should execute the schematic successfully', async () => {
    const options: Schema = {
      project: 'test-app',
    };

    const resultTree = await runner.runSchematic('ng-setup', options, tree);

    expect(resultTree).toBeDefined();
    expect(resultTree.files.length).toBeGreaterThan(0);
  });
});
