# Migrations

This directory contains migration schematics for `ng update`.

## Adding a Migration

1. Create a new directory for your migration (e.g., `update-2-0-0`)
2. Create an `index.ts` file with your migration logic
3. Add the migration to `src/migrations.json`

## Example Migration Structure

```typescript
import { Rule, Tree } from '@angular-devkit/schematics';

export function updateTo200(): Rule {
  return (tree: Tree) => {
    // Your migration logic here
    // Example: Update prettier config, vitest config, etc.
    return tree;
  };
}
```

## Example migrations.json Entry

```json
{
  "schematics": {
    "update-2-0-0": {
      "version": "2.0.0-beta.0",
      "description": "Updates @danielsogl/angular-setup to v2.0",
      "factory": "./migrations/update-2-0-0/index#updateTo200"
    }
  }
}
```

## Version Field

The `version` field should be set to the version BEFORE this migration should run. For example, if you want the migration to run when updating from 1.x to 2.0, set `version` to `"2.0.0-beta.0"`.