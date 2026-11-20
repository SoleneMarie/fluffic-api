import { MigrationInterface, QueryRunner } from "typeorm";

export class PostalCodeRequired1795018360446 implements MigrationInterface {
    name = 'PostalCodeRequired1795018360446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animals" ALTER COLUMN "locationPostalcode" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animals" ALTER COLUMN "locationPostalcode" DROP NOT NULL`);
    }

}
