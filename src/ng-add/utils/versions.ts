import { readFileSync } from 'fs';
import { join, dirname } from 'path';

function getVersionFromPackageJson(packageName: string): string {
  try {
    const currentDir = dirname(__filename);
    const packageJsonPath = join(currentDir, '..', '..', '..', 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.devDependencies?.[packageName] || 'latest';
  } catch {
    return 'latest';
  }
}

let cachedVersions: Record<string, string> | null = null;

function getCachedVersion(packageName: string): string {
  cachedVersions ??= {
    prettier: getVersionFromPackageJson('prettier'),
    lefthook: getVersionFromPackageJson('lefthook'),
    vitest: getVersionFromPackageJson('vitest'),
    jsdom: getVersionFromPackageJson('jsdom'),
  };
  return cachedVersions[packageName] || 'latest';
}

export const DEPENDENCY_VERSIONS = {
  get prettier() {
    return getCachedVersion('prettier');
  },
  get lefthook() {
    return getCachedVersion('lefthook');
  },
  get vitest() {
    return getCachedVersion('vitest');
  },
  get jsdom() {
    return getCachedVersion('jsdom');
  },
};
