import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema } from '../schema';
import { deleteFileIfExists, readJson, writeJson } from '../utils/file-operations';
import { addDevDependencies, removeDevDependencies } from '../utils/package-json';
import { DEPENDENCY_VERSIONS } from '../utils/versions';

interface AngularJson {
  projects: Record<string, AngularProject>;
}

interface AngularProject {
  architect?: {
    test?: {
      builder?: string;
      options?: {
        tsConfig?: string;
        runner?: string;
        buildTarget?: string;
      };
    };
  };
}

export function configureVitest(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Configuring Vitest...');

    const angularJson = readJson<AngularJson>(tree, 'angular.json');
    if (!angularJson) {
      throw new Error('angular.json not found');
    }

    const project = angularJson.projects[options.project];
    if (!project) {
      throw new Error(`Project "${options.project}" not found in angular.json`);
    }

    if (project.architect?.test) {
      project.architect.test = {
        builder: '@angular/build:unit-test',
        options: {
          tsConfig: project.architect.test.options?.tsConfig || 'tsconfig.spec.json',
          runner: 'vitest',
          buildTarget: `${options.project}::development`,
        },
      };

      writeJson(tree, context, 'angular.json', angularJson);
    }

    return tree;
  };
}

export function removeKarmaConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Removing Karma configuration...');

    deleteFileIfExists(tree, context, 'karma.conf.js');

    return tree;
  };
}

export function addVitestDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding Vitest dependencies...');

    addDevDependencies(tree, context, {
      vitest: DEPENDENCY_VERSIONS.vitest,
      jsdom: DEPENDENCY_VERSIONS.jsdom,
    });

    return tree;
  };
}

export function removeKarmaDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Removing Karma and Jasmine dependencies...');

    const karmaPackages = [
      'karma',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-jasmine',
      'karma-jasmine-html-reporter',
      'jasmine-core',
      '@types/jasmine',
    ];

    removeDevDependencies(tree, context, karmaPackages);

    return tree;
  };
}
