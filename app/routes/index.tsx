
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { fetch, Pool } from "../services/data.server";
import Highlighter from 'react-highlight-words';

export const loader: LoaderFunction = async ({ request, params }) => {
    const pools = await fetch();
    return json<Pool[]>(pools);
};

const PoolItem = (props: { value: string, searchText: string }) => {
    return (
        <Highlighter
            highlightClassName="bg-txpink"
            searchWords={props.searchText?.length > 2 ? [props.searchText] : []}
            autoEscape={true}
            textToHighlight={props.value}
        />
    )
}

const PoolCard = (props: { data: Pool, searchText: string }) => {
    return (
        <a href={props.data.homepage} target="_blank" rel="noreferrer" className="flex flex-col p-6 rounded-md bg-gray-900 transition-all shadow-lg cursor-pointer rounded-md">
            <h5 className="text-2xl font-light tracking-wide text-ellipsis overflow-hidden">
                <PoolItem value={props.data.name} searchText={props.searchText} />
            </h5>
            <h6 className="mb-2 text-lg tracking-tight text-txblue">
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
        <div className="w-screen h-full">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl p-16 text-white">

                <header>
                    <div className="flex">
                        <img src="/logo.svg" className="mr-4 w-5 h-5" alt="TxPipe Logo" />
                        <p className="text-sm">Starter Kit provided by TxPipe</p>
                    </div>

                    <h1 className="text-4xl font-light mt-2">Pool Index Starter Kit</h1>

                    <div className="rounded-md bg-gray-600 bg-opacity-10 p-6 mt-4">
                        <p>
                            This starter kit shows how you can query a db-sync instance for showing a front-end application with a list of Stake Pools.
                        </p>
                    </div>
                </header>

                <div className="mt-8">
                    <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Search</label>
                    <input type="text" id="base-input" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div className="text-white text-xs text-right mt-2">
                    {items?.length || 0} {items?.length === 1 ? 'item' : 'items'}
                </div>

                <div className="grid grid-cols-6 gap-6 pb-8 mt-16">
                    <div className="col-span-6">
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                            {items?.map((item, key) => <PoolCard key={key} data={item} searchText={searchValue} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
