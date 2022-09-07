import { db } from '../../db';
import * as fs from 'fs';
import path from 'path';

const createMigration = (migrationName: string, type: string) => {
  const migrationType = `${type}s`;

  const directory = path.resolve(
    ((db.config.migrations as string[])?.find((m) => m.includes(`${migrationType}`)) as string)
      .split(`${migrationType}/`)[0]
      .concat(`${migrationType}`),
    migrationName,
  );

  const migrationFileContent = `import path from "path";
import { TypeOrmMigrationFromFile } from "@utils/dbMigrations/TypeOrmMigrationFromFile";

export class ${migrationName}${Date.now()} extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'))
  }
}`;

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  const migrationFilePath = path.resolve(directory, `${Date.now()}-${migrationName}.ts`);
  const migrationUpFilePath = path.resolve(directory, `up.sql`);
  const migrationDownFilePath = path.resolve(directory, `down.sql`);

  if (!fs.existsSync(migrationFilePath)) {
    fs.writeFileSync(migrationFilePath, migrationFileContent);
  }

  if (!fs.existsSync(migrationUpFilePath)) {
    fs.writeFileSync(migrationUpFilePath, '');
  }

  if (!fs.existsSync(migrationDownFilePath)) {
    fs.writeFileSync(migrationDownFilePath, '');
  }
};

if (require.main === module) {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  if (!args[0] || (args[0] !== 'migration' && args[0] !== 'seed') || !args[1])
    logger.logError(`Invalid params, migration or seed should include 'type' and 'name'.
  Ex: npx ts-node @src/utils/dbMigrations/createMigration.ts <type> <name>
  Args:
    type: possible values 'migrations' or 'seed'
    name: the name of your migration. Ex: 'CreateUserTable'
  `);
  createMigration(args[1], args[0]);
}
