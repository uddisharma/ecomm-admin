'use client'

import { Badge } from '@/component/ui/badge';
import { useLayout } from '@/hooks/use-layout';
import cn from '@/utils/class-names';

export default function GetStatusBadge(status: string) {
  const { layout } = useLayout();

  switch (status.toLowerCase()) {
    case 'update':
      return (
        <Badge
          color='success'
          variant='flat'
          size='sm'
          className={
            cn('text-xs px-2 py-0.5 font-normal capitalize border border-green tracking-wider font-lexend dark:bg-green dark:bg-opacity-40 dark:text-opacity-90 dark:text-gray-900 dark:backdrop-blur',
              layout === 'helium' ? "bg-green bg-opacity-40 text-opacity-90 text-gray-0 dark:text-gray-900 backdrop-blur group-hover:bg-opacity-100 group-hover:text-opacity-100" : "bg-opacity-50"
            )}>
          {status}
        </Badge>
      );
    default:
      return (
        <Badge
          color='danger'
          variant='flat'
          size='sm'
          className={
            cn('text-xs px-2 py-0.5 font-normal capitalize border border-red tracking-wider font-lexend dark:bg-red dark:bg-opacity-40 dark:text-opacity-90 dark:text-gray-900 dark:backdrop-blur',
              layout === 'helium' ? "bg-red bg-opacity-40 text-opacity-90 text-gray-0 dark:text-gray-900 backdrop-blur group-hover:bg-opacity-100 group-hover:text-opacity-100" : "bg-opacity-50"
            )}>
          {status}
        </Badge>
      );
  }
}