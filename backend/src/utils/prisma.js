import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Grab the URL from your .env
const connectionString = process.env.DATABASE_URL;

// 2. Initialize the Postgres driver adapter
const adapter = new PrismaPg({ connectionString });

// 3. Pass the adapter into Prisma
const prisma = new PrismaClient({ adapter });

export default prisma;