import { readFileSync } from 'fs';
import { join } from 'path';

function getVersionFromPackageJson(packageName: string): string {
  try {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.devDependencies?.[packageName] || 'latest';
  } catch {
    return 'latest';
  }
}

export const DEPENDENCY_VERSIONS = {
  get prettier() {
    return getVersionFromPackageJson('prettier');
  },
  get lefthook() {
    return getVersionFromPackageJson('lefthook');
  },
  get vitest() {
    return getVersionFromPackageJson('vitest');
  },
  get jsdom() {
    return getVersionFromPackageJson('jsdom');
  },
};
