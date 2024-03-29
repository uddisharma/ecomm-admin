import React from 'react';
import { Skeleton } from '../ui/skeleton';
const ReferralLoadingPage = () => {
  return (
    <table className="w-full border-collapse border-r-8">
      <thead>
        <tr>
          <th className="border p-2">SELLER</th>
          <th className="border p-2">USER</th>
          <th className="border p-2">AMOUNT</th>
          <th className="border p-2">ONBOARD STATUS</th>
          <th className="border p-2">PAID STATUS</th>
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
                      <Skeleton className="h-6 w-[150px]" />
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

export default ReferralLoadingPage;
