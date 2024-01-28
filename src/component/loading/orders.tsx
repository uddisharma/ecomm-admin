import React from 'react';
import { Skeleton } from '../ui/skeleton';
const OrderLoading = () => {

  return (
    <table className="w-full border-collapse border-r-8">
      <thead>
        <tr>
          <th className="border p-2">ORDER ID</th>
          <th className="border p-2">CUSTOMER</th>
          <th className="border p-2">SHIP TO</th>
          <th className="border p-2">ITEMS</th>
          <th className="border p-2">AMOUNT </th>
          <th className="border p-2">CREATED AT</th>
          <th className="border p-2">STATUS</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: 7 }, (_, colIndex) => (
              <td key={colIndex} className="border p-2">
                {
                  <div className="flex items-center space-x-4">
                    {/* <Skeleton className="h-8 w-8 rounded-full" /> */}
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-[130px]" />
                      <Skeleton className="h-4 w-[100px]" />
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

export default OrderLoading;
