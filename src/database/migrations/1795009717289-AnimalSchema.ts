import { MigrationInterface, QueryRunner } from "typeorm";

export class AnimalSchema1795009717289 implements MigrationInterface {
    name = 'AnimalSchema1795009717289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animals" ADD "locationCity" character varying(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "locationPostalcode" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "locationLat" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "locationLon" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "profileLifestyle" smallint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "profileEnergy" smallint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "profileEnvironment" smallint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "profileLivingspace" smallint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "profileBudget" smallint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "profileTimecommitment" smallint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "profileGoodwithchildren" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "profileIncompatiblespecies" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."animals_specie_enum" RENAME TO "animals_specie_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."animals_specie_enum" AS ENUM('dog', 'cat', 'rabbit', 'guinea_pig', 'ferret', 'mouse', 'rat', 'horse', 'goat', 'sheep', 'bird', 'fish')`);
        await queryRunner.query(`ALTER TABLE "animals" ALTER COLUMN "specie" TYPE "public"."animals_specie_enum" USING "specie"::"text"::"public"."animals_specie_enum"`);
        await queryRunner.query(`DROP TYPE "public"."animals_specie_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."animals_specie_enum_old" AS ENUM('chien', 'chat', 'lapin', 'cochon d''Inde', 'furet', 'souris', 'rat', 'cheval', 'chèvre', 'mouton', 'oiseau', 'poisson')`);
        await queryRunner.query(`ALTER TABLE "animals" ALTER COLUMN "specie" TYPE "public"."animals_specie_enum_old" USING "specie"::"text"::"public"."animals_specie_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."animals_specie_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."animals_specie_enum_old" RENAME TO "animals_specie_enum"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "profileIncompatiblespecies"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "profileGoodwithchildren"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "profileTimecommitment"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "profileBudget"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "profileLivingspace"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "profileEnvironment"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "profileEnergy"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "profileLifestyle"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "locationLon"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "locationLat"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "locationPostalcode"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "locationCity"`);
    }

}
