import React from 'react';
import { Skeleton } from '../ui/skeleton';
const CouponLoadingPage = () => {
  return (
    <table className="w-full border-collapse border-r-8">
      <thead>
        <tr>
          <th className="border p-2">COUPON CODE</th>
          <th className="border p-2">DISCOUNT TYPE</th>
          <th className="border p-2">DICOUNT</th>
          <th className="border p-2">CREATED AT</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: 4 }, (_, colIndex) => (
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

export default CouponLoadingPage;
