import { Rule, externalSchematic } from '@angular-devkit/schematics';
import { Schema } from '../schema';

export function addESLint(options: Schema): Rule {
  return externalSchematic('@angular-eslint/schematics', 'ng-add', {
    project: options.project
  });
}