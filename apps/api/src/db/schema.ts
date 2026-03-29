export interface UsersTable {
  id: import("kysely").Generated<number>;
  handle: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: import("kysely").ColumnType<Date, string | undefined, never>;
}

export interface LinksTable {
  id: import("kysely").Generated<number>;
  user_id: number;
  title: string;
  url: string;
  icon: string | null;
  order_index: number;
  created_at: import("kysely").ColumnType<Date, string | undefined, never>;
}

export interface Database {
  users: UsersTable;
  links: LinksTable;
}
