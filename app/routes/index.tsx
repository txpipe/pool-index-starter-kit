
import { pool_offline_data } from '@prisma/client';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { fetchRecords} from "./data.server";

export const loader: LoaderFunction = async ({ request, params }) => {
    const r = await fetchRecords();
    return json<object[]>(r);
};


export default function Index() {
  const data = useLoaderData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
            {JSON.stringify(data)}
    </div>
  );
}
