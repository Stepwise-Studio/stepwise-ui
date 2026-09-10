import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260910070827 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "prescription" ("id" text not null, "status" text check ("status" in ('pending', 'approved', 'rejected')) not null default 'pending', "file_id" text not null, "file_url" text not null, "customer_id" text null, "cart_id" text null, "order_id" text null, "patient_name" text null, "note" text null, "reviewed_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "prescription_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_prescription_deleted_at" ON "prescription" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "prescription" cascade;`);
  }

}
