import React from 'react';
import { Skeleton } from '../ui/skeleton';
const TicketsLoadingPage = () => {
  return (
    <table className="w-full border-collapse border-r-8">
      <thead>
        <tr>
          <th className="border p-2">TYPE</th>
          <th className="border p-2">SUBJECT</th>
          <th className="border p-2">DESCRIPTION</th>
          <th className="border p-2">CREATED AT</th>
          <th className="border p-2">STATUS</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: 5 }, (_, colIndex) => (
              <td key={colIndex} className="border p-2">
                {
                  <div className="">
                    <div className="space-y-2">
                      <Skeleton
                        className="h-6 w-[150px]"
                        style={{ display: 'block', margin: 'auto' }}
                      />
                    </div>
                  </div>
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TicketsLoadingPage;
