import * as fs from 'fs';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class TypeOrmMigrationFromFile implements MigrationInterface {
  private readonly pathToFileUp: string;
  private readonly pathToFileDown: string;
  constructor(pathToFileUp: string, pathToFileDown: string) {
    this.pathToFileUp = pathToFileUp;
    this.pathToFileDown = pathToFileDown;
  }

  async up(queryRunner: QueryRunner): Promise<any> {
    const query = await new Promise<string>((res, rej) =>
      fs.readFile(this.pathToFileUp, (err, data) => {
        if (err) rej(err);
        else res(data.toString());
      }),
    );
    const queries: string[] = [];
    query.split(';').forEach((q) => {
      const cleanQuery = q.replace(/\r?\n|\r/g, ' ').trim();
      if (cleanQuery !== '') queries.push(cleanQuery);
    });
    queries.forEach(async (q) => await queryRunner.query(q));
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    const query = await new Promise<string>((res, rej) =>
      fs.readFile(this.pathToFileDown, (err, data) => {
        if (err) rej(err);
        else res(data.toString());
      }),
    );
    await queryRunner.query(query.replace(/\r?\n|\r/g, ' '));
  }
}
