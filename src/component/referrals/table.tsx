'use client';
import { getColumns } from './columns';
import BasicTableWidget from '@/component/controlled-table/basic-table-widget';
export default function ReferralTable({
  data,
  onDeleteItem,
  updateOnboard,
  updatePaid,
}: {
  data: any[];
  onDeleteItem: any;
  updateOnboard: any;
  updatePaid: any;
}) {
  return (
    <>
      <BasicTableWidget
        title="Referrals"
        variant="minimal"
        data={data}
        key={Math.random()}
        // @ts-ignore
        getColumns={(columns: any) =>
          getColumns({
            ...columns,
            onDeleteItem: onDeleteItem,
            updatePaid: updatePaid,
            updateOnboard: updateOnboard,
          })
        }
        searchPlaceholder="Search Referrals..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
