import { pool_offline_data, PrismaClient } from '@prisma/client';

export async function fetchRecords(): Promise<object[]> {
    const prisma = new PrismaClient()
    const pools = await prisma.pool_offline_data.findMany();
    return pools.map(x => ({ name: x.ticker_name }));
}