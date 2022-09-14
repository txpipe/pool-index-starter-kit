
import { Prisma } from '@prisma/client';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { fetchRecords} from "./data.server";
import Highlighter from 'react-highlight-words';

export const loader: LoaderFunction = async ({ request, params }) => {
    const r = await fetchRecords();
    return json<Prisma.JsonValue[]>(r);
};

type Pool = {
  name: string;
  ticker: string;
  homepage: string;
  description: string;
}

const PoolItem = (props: {value: string, searchText: string}) => {
    return (
        <Highlighter
            highlightClassName="bg-amber-300"
            searchWords={props.searchText?.length > 2 ? [props.searchText] : []}
            autoEscape={true}
            textToHighlight={props.value}
        />
    )
}

const PoolCard = (props: { data: Pool, searchText: string }) => {
    return (
        <a href={props.data.homepage} target="_blank" rel="noreferrer" className="flex flex-col p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white text-ellipsis overflow-hidden">
                <PoolItem value={props.data.name} searchText={props.searchText} />
            </h5>
            <h6 className="mb-2 text-lg font-semibold tracking-tight text-gray-500">
                <PoolItem value={props.data.ticker} searchText={props.searchText} />
            </h6>
            <p className="mb-3 text-base font-normal text-gray-500 dark:text-gray-400">
                <PoolItem value={props.data.description} searchText={props.searchText} />
            </p>
        </a>
    )
}

export default function Index() {
  const data: Pool[] = useLoaderData();
  const [items, setItems] = useState<Pool[]>(data);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
      if (!searchValue) {
          setItems(data);
      } else {
          if (searchValue.length > 2) {
              const lcValue = searchValue.toLowerCase();
              const result = data.filter(item => item.name.toLowerCase().includes(lcValue) || item.description.toLowerCase().includes(lcValue) || item.ticker.toLowerCase().includes(lcValue))
              setItems(result);
          }
      }
  }, [searchValue, data])


  return (
        <div className="p-8 h-screen container max-w-6xl m-auto">
            <div className="dark:bg-gray-800 dark:border-gray-700 rounded-lg border p-6 mb-6">
                <header className="mb-3 py-6 w-full flex flex-col justify-between">
                    <h3 className="text-3xl dark:text-white text-gray-700 font-extrabold">Pool Index Starter Kit</h3>
                </header>
                <div className="mb-2">
                    <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Search</label>
                    <input type="text" id="base-input" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div className="text-white text-xs text-right mb-2">
                    {items?.length || 0} {items?.length === 1 ? 'item' : 'items'}
                </div>
            </div>
            <div className="grid grid-cols-6 gap-6 pb-8">
                <div className="col-span-6">
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                        {items?.map((item, key) => <PoolCard key={key} data={item} searchText={searchValue} />)}
                    </div>
                </div>
            </div>     
        </div>
    );
}
