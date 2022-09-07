import path from 'path';
import { TypeOrmMigrationFromFile } from '@utils/dbMigrations/TypeOrmMigrationFromFile';

export class CreateDefaultUsers1656294272333 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'));
  }
}
