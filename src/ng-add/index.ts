import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';
import { addESLint } from './tools/eslint';
import { addPrettierConfiguration, addPrettierDependencies } from './tools/prettier';
import { addLefthookConfiguration, addLefthookDependencies } from './tools/lefthook';
import {
  configureVitest,
  removeKarmaConfig,
  addVitestDependencies,
  removeKarmaDependencies,
} from './tools/vitest';

function moveSelfToDevDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJson = tree.read('package.json');
    if (packageJson) {
      const json = JSON.parse(packageJson.toString());

      if (json.dependencies && json.dependencies['@danielsogl/angular-setup']) {
        if (!json.devDependencies) {
          json.devDependencies = {};
        }
        json.devDependencies['@danielsogl/angular-setup'] =
          json.dependencies['@danielsogl/angular-setup'];
        delete json.dependencies['@danielsogl/angular-setup'];

        tree.overwrite('package.json', JSON.stringify(json, null, 2));
        context.logger.info('Moved @danielsogl/angular-setup to devDependencies');
      }
    }
    return tree;
  };
}

function installDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    return tree;
  };
}

export function ngAdd(options: Schema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.logger.info('Running ng-add schematic...');
    context.logger.info(`Project: ${options.project}`);

    const rules: Rule[] = [];

    if (options.eslint !== false) {
      context.logger.info('Adding ESLint...');
      rules.push(addESLint(options));
    }

    if (options.prettier !== false) {
      context.logger.info('Adding Prettier...');
      rules.push(addPrettierConfiguration());
      rules.push(addPrettierDependencies());
    }

    if (options.lefthook !== false) {
      context.logger.info('Adding Lefthook...');
      rules.push(addLefthookConfiguration());
      rules.push(addLefthookDependencies());
    }

    if (options.vitest !== false) {
      context.logger.info('Configuring Vitest...');
      rules.push(configureVitest(options));
      rules.push(removeKarmaConfig());
      rules.push(addVitestDependencies());
      rules.push(removeKarmaDependencies());
    }

    rules.push(moveSelfToDevDependencies());
    rules.push(installDependencies());

    return chain(rules);
  };
}
