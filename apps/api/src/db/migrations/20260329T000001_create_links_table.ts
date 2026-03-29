import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("links")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("user_id", "integer", (col) =>
      col.references("users.id").onDelete("cascade").notNull(),
    )
    .addColumn("title", "varchar(255)", (col) => col.notNull())
    .addColumn("url", "text", (col) => col.notNull())
    .addColumn("icon", "varchar(255)")
    .addColumn("order_index", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("links").execute();
}
