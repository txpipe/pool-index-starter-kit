import { Prisma, PrismaClient } from '@prisma/client';

export async function fetchRecords(): Promise<Prisma.JsonValue[]> {
    const prisma = new PrismaClient()
    const pools = await prisma.pool_offline_data.findMany();
    return pools.map(x => (x.json));
}