import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
  var db: PrismaClient | undefined;
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!global.db) {
    global.db = new PrismaClient();
    global.db.$connect();
  }

  db = global.db;
}

export default db;
