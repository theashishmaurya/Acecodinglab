'use client';
import { DataTable } from '@/components/ui/data-grid';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getListOfQuestions } from './getQuestions.action';
import { IQuestions } from '../practiceTable';
import { useCreateInterview } from './context/createInterview.context';

const columns: ColumnDef<IQuestions>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => {
          table.toggleAllPageRowsSelected(!!value);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'difficulty',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Difficulty
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('difficulty')}</div>
    ),
  },
  {
    accessorKey: 'tags',
    header: () => <div className="text-right">tage</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">tags</div>;
    },
  },
  {
    accessorKey: 'author',
    header: 'Author',
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('author')}</div>
    ),
  },
];

export default function QuestionTable() {
  const [data, setData] = useState<IQuestions[]>([]);

  const { setTasks } = useCreateInterview();

  useEffect(() => {
    getListOfQuestions().then(data => {
      setData(data as IQuestions[]);
    });
  }, []);

  const handleRowChange = (data: unknown[]) => {
    setTasks(data as IQuestions[]);
  };

  return (
    <div className="container mx-auto flex items-start">
      <DataTable
        data={data}
        columns={columns}
        onCheckChange={handleRowChange}
      />
    </div>
  );
}
