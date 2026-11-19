import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAnimalSchema1795017919269 implements MigrationInterface {
  name = 'UpdateAnimalSchema1795017919269';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "animals"
      RENAME COLUMN "specie" TO "species"
    `);

    await queryRunner.query(`
      ALTER TYPE "public"."animals_specie_enum"
      RENAME TO "animals_species_enum"
    `);

    await queryRunner.query(`
      ALTER TABLE "animals"
      ADD "tags" jsonb NOT NULL DEFAULT '[]'
    `);

    await queryRunner.query(`
      ALTER TABLE "animals"
      ADD "vaccinated" boolean NOT NULL DEFAULT false
    `);

    await queryRunner.query(`
      ALTER TABLE "animals"
      ADD "sterilized" boolean NOT NULL DEFAULT false
    `);

    await queryRunner.query(`
      ALTER TABLE "animals"
      ADD "adoptionFee" integer NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "animals" DROP COLUMN "adoptionFee"
    `);

    await queryRunner.query(`
      ALTER TABLE "animals" DROP COLUMN "sterilized"
    `);

    await queryRunner.query(`
      ALTER TABLE "animals" DROP COLUMN "vaccinated"
    `);

    await queryRunner.query(`
      ALTER TABLE "animals" DROP COLUMN "tags"
    `);

    await queryRunner.query(`
      ALTER TABLE "animals"
      RENAME COLUMN "species" TO "specie"
    `);

    await queryRunner.query(`
      ALTER TYPE "public"."animals_species_enum"
      RENAME TO "animals_specie_enum"
    `);
  }
}
