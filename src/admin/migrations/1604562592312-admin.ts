import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class admin1604562592312 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.createTable(
          new Table({
            name: 'admin',
            columns: [
              {
                name: 'id',
                type: 'bigint',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'name',
                type: 'varchar',
              },
              {
                name: 'email',
                isUnique: true,
                type: 'varchar',
              },
              {
                name: 'gender',
                type: 'varchar',
              },
              {
                name: 'resetToken',
                type: 'varchar',
                isUnique: true,
                isNullable: true,
              },
    
              {
                name: 'password',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'status',
                type: 'varchar',
                default: "'ACTIVE'",
              },
              {
                name: 'lastLogin',
                type: 'timestamp',
                isNullable: true,
                default: 'CURRENT_TIMESTAMP',
              },
              {
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                isNullable: false,
              },
              {
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                isNullable: false,
              },
            ],
          }),
          true,
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "admin"`);
      }

}
