import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema } from '../schema';

export function configureVitest(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Configuring Vitest...');

    const angularJson = tree.read('angular.json');
    if (angularJson) {
      const json = JSON.parse(angularJson.toString());
      const project = json.projects[options.project];

      if (project && project.architect && project.architect.test) {
        project.architect.test = {
          builder: '@angular/build:unit-test',
          options: {
            tsConfig: project.architect.test.options?.tsConfig || 'tsconfig.spec.json',
            runner: 'vitest',
            buildTarget: `${options.project}::development`
          }
        };

        tree.overwrite('angular.json', JSON.stringify(json, null, 2));
      }
    }

    return tree;
  };
}

export function removeKarmaConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Removing Karma configuration...');

    if (tree.exists('karma.conf.js')) {
      tree.delete('karma.conf.js');
    }

    return tree;
  };
}

export function addVitestDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding Vitest dependencies...');

    const packageJson = tree.read('package.json');
    if (packageJson) {
      const json = JSON.parse(packageJson.toString());
      if (!json.devDependencies) {
        json.devDependencies = {};
      }

      json.devDependencies['vitest'] = 'latest';
      json.devDependencies['jsdom'] = 'latest';

      tree.overwrite('package.json', JSON.stringify(json, null, 2));
    }

    return tree;
  };
}

export function removeKarmaDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Removing Karma and Jasmine dependencies...');

    const packageJson = tree.read('package.json');
    if (packageJson) {
      const json = JSON.parse(packageJson.toString());

      if (json.devDependencies) {
        const karmaPackages = [
          'karma',
          'karma-chrome-launcher',
          'karma-coverage',
          'karma-jasmine',
          'karma-jasmine-html-reporter',
          'jasmine-core',
          '@types/jasmine'
        ];

        karmaPackages.forEach(pkg => {
          if (json.devDependencies[pkg]) {
            delete json.devDependencies[pkg];
          }
        });

        tree.overwrite('package.json', JSON.stringify(json, null, 2));
      }
    }

    return tree;
  };
}