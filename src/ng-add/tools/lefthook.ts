import { Rule, SchematicContext, Tree, url, apply, mergeWith } from '@angular-devkit/schematics';
import { addDevDependencies, addScripts } from '../utils/package-json';
import { DEPENDENCY_VERSIONS } from '../utils/versions';

export function addLefthookConfiguration(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding Lefthook configuration...');

    const templateSource = apply(url('./templates/lefthook'), []);

    return mergeWith(templateSource)(tree, context);
  };
}

export function addLefthookDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding Lefthook dependencies...');

    addDevDependencies(tree, context, {
      lefthook: DEPENDENCY_VERSIONS.lefthook,
    });

    addScripts(tree, context, {
      prepare: 'lefthook install',
    });

    return tree;
  };
}
