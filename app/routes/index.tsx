
import { Prisma } from '@prisma/client';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fetchRecords} from "./data.server";

export const loader: LoaderFunction = async ({ request, params }) => {
    console.log('LOADER');
    const r = await fetchRecords();
    return json<Prisma.JsonValue[]>(r);
};

type Pool = {
  name: string;
  ticker: string;
  homepage: string;
  description: string;
}

const PoolCard = (props: { data: Pool }) => {
    return (
        <div className="flex flex-col justify-between p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{props.data.name} - {props.data.ticker}</h5>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">{props.data.description}</p>
            <a href={props.data.homepage} target="_blank" rel="noreferrer" className="inline-flex items-center text-blue-600 hover:underline self-end">
                Open website
                <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
            </a>
        </div>
    )
}

const SearchInput = (props: {val: string, onChange: Dispatch<SetStateAction<string>>}) => {
    console.log('searchInput')
    const onChange = (e: any,) => {
        console.log({e})
        props.onChange(e.target.value);
    }
    return (
        <div className="mb-6">
            <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Search</label>
            <input type="text" id="base-input" value={props.val} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
    )
}


const CardsWrapper = (props: { data: Pool[] }) => {
    const [items, setItems] = useState(props.data);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if (!searchValue) {
            setItems(props.data);
        } else {
            if (searchValue.length > 2) {
                const lcValue = searchValue.toLowerCase();
                const result = props.data.filter(item => item.name.toLowerCase().includes(lcValue) || item.description.toLowerCase().includes(lcValue) || item.ticker.toLowerCase().includes(lcValue))
                setItems(result);
            }
        }
    }, [searchValue, props.data])
    
    return (
        <div className="p-8 container max-w-6xl overflow-auto">
            <header className="mb-3 py-6 w-full flex flex-col justify-between">
                <h3 className="text-3xl dark:text-white text-gray-700 font-extrabold">Pool Index Starter Kit</h3>
            </header>
            <SearchInput val={searchValue} onChange={setSearchValue} />
            <div className="text-white text-xs text-right mb-2">
              {items?.length || 0} {items?.length === 1 ? 'item' : 'items'}
            </div>
            <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                        {items?.map((item, key) => <PoolCard key={key} data={item} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Index() {
  const data = useLoaderData();

  return (
      <CardsWrapper data={data as Pool[]} />
    );
}
