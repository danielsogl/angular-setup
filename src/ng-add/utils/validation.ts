import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { readPackageJson } from './package-json';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateWorkspace(tree: Tree, context: SchematicContext): ValidationResult {
  const errors: string[] = [];

  if (!tree.exists('package.json')) {
    errors.push('package.json not found. This must be run in an Angular workspace.');
  }

  if (!tree.exists('angular.json')) {
    errors.push('angular.json not found. This must be run in an Angular workspace.');
  }

  const packageJson = readPackageJson(tree);
  if (packageJson) {
    const angularCore =
      packageJson.dependencies?.['@angular/core'] || packageJson.devDependencies?.['@angular/core'];
    if (!angularCore) {
      errors.push('This does not appear to be an Angular project.');
    }
  }

  if (errors.length > 0) {
    errors.forEach((error) => context.logger.error(error));
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateProject(
  tree: Tree,
  context: SchematicContext,
  projectName: string
): ValidationResult {
  const errors: string[] = [];

  const angularJson = tree.read('angular.json');
  if (angularJson) {
    const json = JSON.parse(angularJson.toString());
    if (!json.projects?.[projectName]) {
      errors.push(`Project "${projectName}" not found in angular.json`);
    }
  }

  if (errors.length > 0) {
    errors.forEach((error) => context.logger.error(error));
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function warnIfConfigExists(
  tree: Tree,
  context: SchematicContext,
  filePath: string,
  toolName: string
): void {
  if (tree.exists(filePath)) {
    context.logger.warn(
      `${filePath} already exists. ${toolName} configuration may be overwritten.`
    );
  }
}
