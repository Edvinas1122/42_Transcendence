import React from 'react';
import RootUI, {AppData} from '@/app/Routes';
import dynamic from 'next/dynamic';
import { AppProps } from 'next/app';

/*
	Declare the Root component as client-side only.
*/
const DynamicComponent = dynamic(
	() => import('@/app/Routes'),
	{ ssr: false }
);

function Home({ Component, pageProps }: AppProps) {
	return <DynamicComponent {...pageProps} />;
}

export default Home;