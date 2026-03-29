import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("handle", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("display_name", "varchar(255)", (col) => col.notNull())
    .addColumn("bio", "text")
    .addColumn("avatar_url", "varchar(255)")
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users").execute();
}
