import React, { useState } from 'react';

export default function Sidebar({ displays }) {
  const [view, setView] = useState(0);
  const { component: DisplayComponent, name, props } = displays[view];

  console.log("in sidebar: " + props);
  return (
    <div>
      <div>
        {displays.map((display, index) => (
          <button key={index} onClick={() => setView(index)}>
            {display.name}
          </button>
        ))}
      </div>
      <DisplayComponent props={props} />
    </div>
  );
}