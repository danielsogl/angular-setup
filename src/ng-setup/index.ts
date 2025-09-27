import { Rule, SchematicContext, Tree, chain, externalSchematic } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';

function addPrettierConfiguration(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding Prettier configuration...');

    const prettierConfig = {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      arrowParens: 'always',
      endOfLine: 'lf'
    };

    tree.create('.prettierrc.json', JSON.stringify(prettierConfig, null, 2));

    const prettierIgnore = [
      'node_modules',
      'dist',
      'coverage',
      '.angular',
      'build',
      '*.min.js',
      '*.min.css',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml'
    ].join('\n');

    tree.create('.prettierignore', prettierIgnore);

    return tree;
  };
}

function installPrettierDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Installing Prettier and prettier-eslint...');

    const packageJson = tree.read('package.json');
    if (packageJson) {
      const json = JSON.parse(packageJson.toString());
      if (!json.devDependencies) {
        json.devDependencies = {};
      }

      json.devDependencies['prettier'] = 'latest';
      json.devDependencies['prettier-eslint'] = 'latest';

      tree.overwrite('package.json', JSON.stringify(json, null, 2));

      context.addTask(new NodePackageInstallTask());
    }

    return tree;
  };
}

export function ngSetup(options: Schema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.logger.info('Running ng-setup schematic...');
    context.logger.info(`Project: ${options.project}`);

    context.logger.info('Adding ESLint...');

    return chain([
      externalSchematic('@angular-eslint/schematics', 'ng-add', {
        project: options.project
      }),
      addPrettierConfiguration(),
      installPrettierDependencies()
    ]);
  };
}