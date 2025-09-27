import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function addLefthookConfiguration(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding Lefthook configuration...');

    tree.create('lefthook.yml',
`pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,ts,jsx,tsx,json,css,scss,html}"
      run: npx eslint {staged_files} --fix
      stage_fixed: true
    format:
      glob: "*.{js,ts,jsx,tsx,json,css,scss,html,md}"
      run: npx prettier --write {staged_files}
      stage_fixed: true

pre-push:
  commands:
    test:
      run: npm test
    build:
      run: npm run build
`);

    return tree;
  };
}

export function addLefthookDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding Lefthook dependencies...');

    const packageJson = tree.read('package.json');
    if (packageJson) {
      const json = JSON.parse(packageJson.toString());
      if (!json.devDependencies) {
        json.devDependencies = {};
      }

      json.devDependencies['lefthook'] = 'latest';

      if (!json.scripts) {
        json.scripts = {};
      }
      json.scripts['prepare'] = 'lefthook install';

      tree.overwrite('package.json', JSON.stringify(json, null, 2));
    }

    return tree;
  };
}