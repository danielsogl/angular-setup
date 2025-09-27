import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function addPrettierConfiguration(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding Prettier configuration...');

    const prettierConfig = {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      arrowParens: 'always',
      endOfLine: 'lf',
    };

    tree.create('.prettierrc.json', JSON.stringify(prettierConfig, null, 2));

    const prettierIgnore = [
      'node_modules',
      'dist',
      'coverage',
      '.angular',
      'build',
      '*.min.js',
      '*.min.css',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ].join('\n');

    tree.create('.prettierignore', prettierIgnore);

    return tree;
  };
}

export function addPrettierDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding Prettier dependencies...');

    const packageJson = tree.read('package.json');
    if (packageJson) {
      const json = JSON.parse(packageJson.toString());
      if (!json.devDependencies) {
        json.devDependencies = {};
      }

      json.devDependencies['prettier'] = 'latest';
      json.devDependencies['prettier-eslint'] = 'latest';

      tree.overwrite('package.json', JSON.stringify(json, null, 2));
    }

    return tree;
  };
}
