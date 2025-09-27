import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema } from './schema';

export function ngSetup(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Running ng-setup schematic...');
    context.logger.info(`Project: ${options.project}`);

    return tree;
  };
}