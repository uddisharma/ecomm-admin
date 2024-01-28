'use client';
import * as XLSX from 'xlsx';
import { PiArrowLineUpBold } from 'react-icons/pi';
import { Button } from '@/component/ui/button';
import cn from '@/utils/class-names';
import Papa from 'papaparse';
import { exportToCSV } from '@/utils/export-to-csv';

type ExportButtonProps = {
  data: unknown[];
  header: string;
  fileName: string;
  className?: string;
};

export default function ExportButton({
  data,
  header,
  fileName,
  className,
}: ExportButtonProps) {
  const exportToExcel = (data: any, filename: any) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename + '.xlsx');
  };

  const downloadCSV = (data: any, filename: any) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.target = '_blank';
    link.download = `${filename}.csv`;
    link.click();
  };

  return (
    <Button
      variant="outline"
      onClick={() => exportToExcel(data, fileName)}
      className={cn('w-full @lg:w-auto', className)}
    >
      <PiArrowLineUpBold className="me-1.5 h-[17px] w-[17px]" />
      Export
    </Button>
  );
}
