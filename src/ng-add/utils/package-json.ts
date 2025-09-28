import { SchematicContext, Tree } from '@angular-devkit/schematics';

export interface PackageJson {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

export function readPackageJson(tree: Tree): PackageJson | null {
  const buffer = tree.read('package.json');
  if (!buffer) {
    return null;
  }
  return JSON.parse(buffer.toString()) as PackageJson;
}

export function writePackageJson(
  tree: Tree,
  packageJson: PackageJson,
  context: SchematicContext
): void {
  tree.overwrite('package.json', JSON.stringify(packageJson, null, 2) + '\n');
  context.logger.debug('Updated package.json');
}

export function addDevDependencies(
  tree: Tree,
  context: SchematicContext,
  dependencies: Record<string, string>
): void {
  const packageJson = readPackageJson(tree);
  if (!packageJson) {
    throw new Error('package.json not found');
  }

  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
  }

  Object.entries(dependencies).forEach(([pkg, version]) => {
    packageJson.devDependencies![pkg] = version;
    context.logger.info(`Added ${pkg}@${version} to devDependencies`);
  });

  writePackageJson(tree, packageJson, context);
}

export function removeDevDependencies(
  tree: Tree,
  context: SchematicContext,
  packages: string[]
): void {
  const packageJson = readPackageJson(tree);
  if (!packageJson || !packageJson.devDependencies) {
    return;
  }

  packages.forEach((pkg) => {
    if (packageJson.devDependencies![pkg]) {
      delete packageJson.devDependencies![pkg];
      context.logger.info(`Removed ${pkg} from devDependencies`);
    }
  });

  writePackageJson(tree, packageJson, context);
}

export function addScripts(
  tree: Tree,
  context: SchematicContext,
  scripts: Record<string, string>
): void {
  const packageJson = readPackageJson(tree);
  if (!packageJson) {
    throw new Error('package.json not found');
  }

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  Object.entries(scripts).forEach(([name, command]) => {
    packageJson.scripts![name] = command;
    context.logger.info(`Added script: ${name}`);
  });

  writePackageJson(tree, packageJson, context);
}

export function moveDependencyToDevDependencies(
  tree: Tree,
  context: SchematicContext,
  packageName: string
): void {
  const packageJson = readPackageJson(tree);
  if (!packageJson) {
    throw new Error('package.json not found');
  }

  if (packageJson.dependencies && packageJson.dependencies[packageName]) {
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }
    packageJson.devDependencies[packageName] = packageJson.dependencies[packageName];
    delete packageJson.dependencies[packageName];

    writePackageJson(tree, packageJson, context);
    context.logger.info(`Moved ${packageName} to devDependencies`);
  }
}
