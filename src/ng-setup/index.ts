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

function addLefthookConfiguration(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding Lefthook configuration...');

    tree.create('lefthook.yml',
`pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,ts,jsx,tsx,json,css,scss,html}"
      run: npx eslint {staged_files} --fix
      stage_fixed: true
    format:
      glob: "*.{js,ts,jsx,tsx,json,css,scss,html,md}"
      run: npx prettier --write {staged_files}
      stage_fixed: true

pre-push:
  commands:
    test:
      run: npm test
    build:
      run: npm run build
`);

    return tree;
  };
}

function installDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Installing dependencies...');

    const packageJson = tree.read('package.json');
    if (packageJson) {
      const json = JSON.parse(packageJson.toString());
      if (!json.devDependencies) {
        json.devDependencies = {};
      }

      json.devDependencies['prettier'] = 'latest';
      json.devDependencies['prettier-eslint'] = 'latest';
      json.devDependencies['lefthook'] = 'latest';

      if (!json.scripts) {
        json.scripts = {};
      }
      json.scripts['prepare'] = 'lefthook install';

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
      addLefthookConfiguration(),
      installDependencies()
    ]);
  };
}