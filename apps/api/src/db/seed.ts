import { db } from "./database.js";

async function seed() {
  console.log("Inserting dummy data...");

  const user = await db
    .insertInto("users")
    .values({
      handle: "linksta",
      display_name: "Linksta Demo",
      bio: "This is a demo Linksta page.",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linksta",
    })
    .returningAll()
    .executeTakeFirst();

  if (user) {
    await db
      .insertInto("links")
      .values([
        { user_id: user.id, title: "My Portfolio", url: "https://example.com", order_index: 1 },
        { user_id: user.id, title: "GitHub", url: "https://github.com", order_index: 2 },
        { user_id: user.id, title: "Twitter", url: "https://twitter.com", order_index: 3 },
      ])
      .execute();
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
