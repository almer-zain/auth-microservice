import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSetup1781622946540 implements MigrationInterface {
  name = 'InitialSetup1781622946540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "username" character varying(100) NOT NULL, "displayName" character varying(255) NOT NULL, "password" character varying NOT NULL, "isTwoFactorEnabled" boolean NOT NULL DEFAULT false, "twoFactorSecret" character varying, "passwordResetCode" character varying, "passwordResetExpires" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "account_devices" ("id" SERIAL NOT NULL, "accountId" integer NOT NULL, "accountType" character varying NOT NULL, "ipAddress" character varying NOT NULL, "browser" character varying NOT NULL, "os" character varying NOT NULL, "country" character varying, "city" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLoginAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_19286b4d50cac9db850e3895cf4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "username" character varying(100) NOT NULL, "displayName" character varying(255) NOT NULL, "password" character varying NOT NULL, "isTwoFactorEnabled" boolean NOT NULL DEFAULT false, "twoFactorSecret" character varying, "passwordResetCode" character varying, "passwordResetExpires" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "UQ_5e568e001f9d1b91f67815c580f" UNIQUE ("username"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles_permissions_permissions" ("rolesId" integer NOT NULL, "permissionsId" integer NOT NULL, CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842" PRIMARY KEY ("rolesId", "permissionsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc2b9d46195bb3ed28abbf7c9e" ON "roles_permissions_permissions" ("rolesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd4d5d4c7f7ff16c57549b72c6" ON "roles_permissions_permissions" ("permissionsId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users_roles_roles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_6c1a055682c229f5a865f2080c1" PRIMARY KEY ("usersId", "rolesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df951a64f09865171d2d7a502b" ON "users_roles_roles" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2f0366aa9349789527e0c36d9" ON "users_roles_roles" ("rolesId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "admin_roles_roles" ("adminId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_a07dbd66ec7ae7e1b472427181a" PRIMARY KEY ("adminId", "rolesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_49121fba025eda59e9b4e2da12" ON "admin_roles_roles" ("adminId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_09fef64b978eb007cc6ddb1b64" ON "admin_roles_roles" ("rolesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permissions_permissions" ADD CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permissions_permissions" ADD CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles_roles" ADD CONSTRAINT "FK_df951a64f09865171d2d7a502b1" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles_roles" ADD CONSTRAINT "FK_b2f0366aa9349789527e0c36d97" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_roles_roles" ADD CONSTRAINT "FK_49121fba025eda59e9b4e2da124" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_roles_roles" ADD CONSTRAINT "FK_09fef64b978eb007cc6ddb1b64e" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_roles_roles" DROP CONSTRAINT "FK_09fef64b978eb007cc6ddb1b64e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_roles_roles" DROP CONSTRAINT "FK_49121fba025eda59e9b4e2da124"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles_roles" DROP CONSTRAINT "FK_b2f0366aa9349789527e0c36d97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles_roles" DROP CONSTRAINT "FK_df951a64f09865171d2d7a502b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permissions_permissions" DROP CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permissions_permissions" DROP CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_09fef64b978eb007cc6ddb1b64"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_49121fba025eda59e9b4e2da12"`,
    );
    await queryRunner.query(`DROP TABLE "admin_roles_roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b2f0366aa9349789527e0c36d9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_df951a64f09865171d2d7a502b"`,
    );
    await queryRunner.query(`DROP TABLE "users_roles_roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd4d5d4c7f7ff16c57549b72c6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dc2b9d46195bb3ed28abbf7c9e"`,
    );
    await queryRunner.query(`DROP TABLE "roles_permissions_permissions"`);
    await queryRunner.query(`DROP TABLE "admin"`);
    await queryRunner.query(`DROP TABLE "account_devices"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
