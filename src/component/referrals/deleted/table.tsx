'use client';
import { getColumns } from './columns';
import BasicTableWidget from '@/component/controlled-table/basic-table-widget';
export default function DeletedReferralTable({
  data,
  onDeleteItem,
  updateOnboard,
  updatePaid,
  permanentlydelete,
}: {
  data: any[];
  onDeleteItem: any;
  updateOnboard: any;
  updatePaid: any;
  permanentlydelete: any;
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
            permanentlydelete: permanentlydelete,
          })
        }
        searchPlaceholder="Search Referrals..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
