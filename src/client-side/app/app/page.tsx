import React from 'react';
import dynamic from 'next/dynamic';

/*
	Declare the Root component as client-side only.
*/
const DynamicComponent = dynamic(
	() => import('@/app/Routes'),
	{ ssr: false }
);

function Home() {
	return <DynamicComponent />;
}

export default Home;