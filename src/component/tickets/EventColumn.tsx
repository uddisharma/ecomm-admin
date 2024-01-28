'use client';

import Link from 'next/link';
import { HeaderCell } from '@/component/ui/table';
import { Badge } from '@/component/ui/badge';
import { Text } from '@/component/ui/text';
import { Tooltip } from '@/component/ui/tooltip';
import { ActionIcon } from '@/component/ui/action-icon';
import EyeIcon from '@/component/icons/eye';
import DateCell from '@/component/ui/date-cell';
import DeletePopover from '../others/delete-popover';
import InfoModal from './InfoModal';
import { CgMailReply } from 'react-icons/cg';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import MarkPopover from '../others/popover';

type Columns = {
  sortConfig?: any;
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  openModal: any;
  onMark: (id: string) => void;
};

function checkLastMessage(data: any) {
  const lastMessage = data.replies[data.replies.length - 1];
  // console.log(lastMessage?.from, data?.seller);
  if (lastMessage.from === data.seller?.id) {
    return '';
  } else {
    return 'Waiting for your response';
  }
}

export const EventsColumn = ({
  sortConfig,
  onDeleteItem,
  onHeaderCellClick,
  openModal,
  onMark,
}: Columns) => [
  {
    title: <HeaderCell title="Type" />,
    dataIndex: 'type',
    key: 'type',
    width: 150,
    render: (value: string) => <Text>{value}</Text>,
  },
  {
    title: <HeaderCell title="Subject" />,
    dataIndex: 'subject',
    key: 'subject',
    width: 150,
    render: (value: string) => <Text>{value}</Text>,
  },
  {
    title: <HeaderCell title="description" />,
    dataIndex: 'description',
    key: 'description',
    width: 220,
    render: (description: string) => (
      <Text>
        <div
          dangerouslySetInnerHTML={{
            __html:
              description?.length <= 50
                ? description
                : `${description?.slice(0, 30)}...`,
          }}
        />
      </Text>
    ),
  },

  {
    title: (
      <HeaderCell
        title="Created"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'
        }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('createdAt'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 150,
    render: (value: Date) => <DateCell date={value} />,
  },

  {
    title: <HeaderCell title="Status" />,
    dataIndex: 'closed',
    key: 'closed',
    width: 100,
    render: (value: Boolean) => (
      <>
        {value == false ? (
          <div className="flex items-center">
            <Badge color="success" renderAsDot />
            <Text className="ms-2 font-medium text-green-dark">Active</Text>
          </div>
        ) : (
          <div className="flex items-center">
            <Badge color="danger" renderAsDot />
            <Text className="ms-2 font-medium text-red-dark">Closed</Text>
          </div>
        )}
      </>
    ),
  },

  {
    title: <HeaderCell title="" />,
    dataIndex: 'last_message',
    key: 'last_message',
    width: 150,
    render: (_: any, row: any) => (
      <Text className="text-red-dark">
        {!row?.closed ? row?.replies?.length > 0 && checkLastMessage(row) : ''}
      </Text>
    ),
  },
  {
    title: <HeaderCell title="Actions" className="opacity-0" />,
    dataIndex: 'action',
    key: 'action',
    width: 130,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Tooltip
          size="sm"
          content={() => 'Reply'}
          placement="top"
          color="invert"
        >
          {row?.closed ? (
            <ActionIcon
              tag="span"
              size="sm"
              disabled={row?.closed}
              variant="outline"
              className="hover:text-gray-700"
            >
              <CgMailReply className="h-4 w-4" />
            </ActionIcon>
          ) : (
            <Link href={`/tickets/reply/${row?.id}`}>
              <ActionIcon
                tag="span"
                size="sm"
                disabled={row?.closed}
                variant="outline"
                className="hover:text-gray-700"
              >
                <CgMailReply className="h-4 w-4" />
              </ActionIcon>
            </Link>
          )}
        </Tooltip>

        <Tooltip
          size="sm"
          content={() => 'View ticket'}
          placement="top"
          color="invert"
        >
          <ActionIcon
            tag="span"
            size="sm"
            variant="outline"
            className="hover:text-gray-700"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              openModal({
                view: (
                  <InfoModal
                    event={{
                      subject: row?.subject,
                      desc: row?.description,
                    }}
                  />
                ),
                customSize: '500px',
              });
            }}
          >
            <EyeIcon className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>

        <Tooltip
          size="sm"
          content={() => 'Marked as Resolved'}
          placement="top"
          color="invert"
        >
          {row?.closed ? (
            <ActionIcon
              tag="span"
              size="sm"
              disabled={row?.closed}
              style={{ cursor: 'not-allowed' }}
              variant="outline"
              className="hover:text-gray-700"
            >
              <IoCheckmarkDoneOutline className="h-4 w-4" />
            </ActionIcon>
          ) : (
            <MarkPopover
              title={`Mark as Resolved`}
              description={`Are you sure you want to mark this ticket? (Not Reversible task)`}
              onDelete={() => onMark(row.id)}
            />
          )}
        </Tooltip>
      </div>
    ),
  },
];
