import React from 'react';
import { Skeleton } from '../ui/skeleton';
const TransactionLoadingPage = () => {
  return (
    <table className="w-full border-collapse border-r-8">
      <thead>
        <tr>
          <th className="border p-2">TRANSACTION ID</th>
          <th className="border p-2">AMOUNT</th>
          <th className="border p-2">FROM DATE</th>
          <th className="border p-2">TO DATE</th>
          <th className="border p-2">CREATED AT</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: 5 }, (_, colIndex) => (
              <td key={colIndex} className="border p-2">
                {
                  <div className="">
                    {/* <Skeleton className="h-8 w-8 rounded-full" /> */}
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-[150px]" />
                      {/* <Skeleton className="h-4 w-[120px]" /> */}
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

export default TransactionLoadingPage;
