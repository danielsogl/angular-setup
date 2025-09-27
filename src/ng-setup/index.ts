import { Rule, SchematicContext, Tree, chain, externalSchematic } from '@angular-devkit/schematics';
import { Schema } from './schema';

export function ngSetup(options: Schema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.logger.info('Running ng-setup schematic...');
    context.logger.info(`Project: ${options.project}`);

    context.logger.info('Adding ESLint...');

    return chain([
      externalSchematic('@angular-eslint/schematics', 'ng-add', {
        project: options.project
      })
    ]);
  };
}