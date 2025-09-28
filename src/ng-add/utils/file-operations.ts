import { SchematicContext, Tree } from '@angular-devkit/schematics';

export function createFileIfNotExists(
  tree: Tree,
  context: SchematicContext,
  filePath: string,
  content: string,
  overwrite = false
): void {
  if (tree.exists(filePath)) {
    if (overwrite) {
      tree.overwrite(filePath, content);
      context.logger.info(`Overwritten ${filePath}`);
    } else {
      context.logger.warn(`${filePath} already exists. Skipping creation.`);
    }
  } else {
    tree.create(filePath, content);
    context.logger.info(`Created ${filePath}`);
  }
}

export function deleteFileIfExists(tree: Tree, context: SchematicContext, filePath: string): void {
  if (tree.exists(filePath)) {
    tree.delete(filePath);
    context.logger.info(`Deleted ${filePath}`);
  }
}

export function readJson<T>(tree: Tree, filePath: string): T | null {
  const buffer = tree.read(filePath);
  if (!buffer) {
    return null;
  }
  return JSON.parse(buffer.toString()) as T;
}

export function writeJson<T>(
  tree: Tree,
  context: SchematicContext,
  filePath: string,
  content: T
): void {
  tree.overwrite(filePath, JSON.stringify(content, null, 2) + '\n');
  context.logger.debug(`Updated ${filePath}`);
}
