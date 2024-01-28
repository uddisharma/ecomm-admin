import React from 'react';
import { Skeleton } from '../ui/skeleton';
const ProductLoadingPage = () => {
  return (
    <table className="w-full border-collapse border-r-8">
      <thead>
        <tr>
          <th className="border p-2">PRODUCT</th>
          <th className="border p-2">STOCK</th>
          <th className="border p-2">PRICE</th>
          <th className="border p-2">MRP</th>
          <th className="border p-2">CREATED AT</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: 5 }, (_, colIndex) => (
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

export default ProductLoadingPage;
