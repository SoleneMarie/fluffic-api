import { MigrationInterface, QueryRunner } from "typeorm";

export class AnimalsImages1795190486345 implements MigrationInterface {
    name = 'AnimalsImages1795190486345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animals" ADD "images" jsonb NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "images"`);
    }

}
