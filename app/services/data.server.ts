import { pool_offline_data } from '@prisma/client';
import db from "./db.server";

export type Pool = {
    name: string;
    ticker: string;
    homepage: string;
    description: string;
}

export async function fetch(): Promise<Pool[]> {
    const pools = await db.pool_offline_data.findMany();
    return pools.map((x: pool_offline_data) => (x.json as Pool));
}