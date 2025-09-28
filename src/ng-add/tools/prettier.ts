import { Rule, SchematicContext, Tree, url, apply, mergeWith } from '@angular-devkit/schematics';
import { addDevDependencies, addScripts } from '../utils/package-json';
import { DEPENDENCY_VERSIONS } from '../utils/versions';

export function addPrettierConfiguration(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding Prettier configuration...');

    const templateSource = apply(url('./templates/prettier'), []);

    return mergeWith(templateSource)(tree, context);
  };
}

export function addPrettierDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding Prettier dependencies...');

    addDevDependencies(tree, context, {
      prettier: DEPENDENCY_VERSIONS.prettier,
    });

    addScripts(tree, context, {
      format: 'prettier --write .',
      'format:check': 'prettier --check .',
    });

    return tree;
  };
}
