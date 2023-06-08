import React from 'react';
// import Sidebar from '../components/Sidebar';

export const Sidebar = () => {
	  return (
	<div>
	  <h1>Sidebar</h1>
	</div>
  );
}

export default function View({ Component, pageProps }) {
  return (
    <div>
      <Sidebar />
      <Component {...pageProps} />
    </div>
  );
}