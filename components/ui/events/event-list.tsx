'use client';
import React from 'react';

export default function EventList() {
  const [selected, setSelected] = React.useState('upcoming');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Events</h2>
        <div>
          <div className="bg-white/[.08]">
            <button>Upcoming</button>
            <button>Upcoming</button>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
}
