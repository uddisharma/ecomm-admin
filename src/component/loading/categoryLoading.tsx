import React from 'react';
import { Skeleton } from '../ui/skeleton';
const CategoryLoadingPage = () => {
  return (
    <table className="w-full border-collapse border-r-8">
      <thead>
        <tr>
          <th className="border p-2">IMAGE</th>
          <th className="border p-2">CATEGORY</th>
          <th className="border p-2">PARENT CATEGORY</th>
          <th className="border p-2">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: 4 }, (_, colIndex) => (
              <td key={colIndex} className="border p-2">
                {
                  <div className="flex items-center space-x-4">
                    {/* <Skeleton className="h-8 w-8 rounded-full" /> */}
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-[150px]" />
                      <Skeleton className="h-4 w-[120px]" />
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

export default CategoryLoadingPage;
