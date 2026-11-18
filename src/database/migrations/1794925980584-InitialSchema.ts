import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1794925980584 implements MigrationInterface {
    name = 'InitialSchema1794925980584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organizations" ("id" SERIAL NOT NULL, "name" character varying(160) NOT NULL, CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."animals_specie_enum" AS ENUM('chien', 'chat', 'lapin', 'cochon d''Inde', 'furet', 'souris', 'rat', 'cheval', 'chèvre', 'mouton', 'oiseau', 'poisson')`);
        await queryRunner.query(`CREATE TYPE "public"."animals_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TABLE "animals" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "description" text NOT NULL, "specie" "public"."animals_specie_enum" NOT NULL, "gender" "public"."animals_gender_enum" NOT NULL, "dateOfBirth" date NOT NULL, "adopted" boolean NOT NULL DEFAULT false, "deleted" boolean NOT NULL DEFAULT false, "organization_id" integer NOT NULL, CONSTRAINT "PK_6154c334bbb19186788468bce5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "animals" ADD CONSTRAINT "FK_e63f8f35bdb5569b09a652982d0" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animals" DROP CONSTRAINT "FK_e63f8f35bdb5569b09a652982d0"`);
        await queryRunner.query(`DROP TABLE "animals"`);
        await queryRunner.query(`DROP TYPE "public"."animals_gender_enum"`);
        await queryRunner.query(`DROP TYPE "public"."animals_specie_enum"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
    }

}
