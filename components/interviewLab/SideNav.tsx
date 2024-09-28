'use client';
import Link from 'next/link';
import { useCodeEditor } from '../codeEditor/codeEditor.context';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const navItems = [
  { number: '1', text: 'Matrix Multiplication', href: '#', active: false },
  { number: '2', text: 'React toastify', href: '#', active: false },
  {
    number: '3',
    text: 'Implement socket.io',
    href: '#',
    active: true,
  },
];

const SideNav = () => {
  const { tasks, setCurrentTask, currentTask } = useCodeEditor();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav className="grid items-start px-2 text-md font-large lg:px-4">
      {tasks.map((item, index) => (
        <Link
          onClick={() => {
            setCurrentTask(item);
            console.log(pathname, 'pathName');
          }}
          key={index}
          href={`${pathname}?task_id=${item.id}`}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            item.id === currentTask?.id
              ? 'text-primary'
              : 'text-muted-foreground'
          } ${item.id === currentTask?.id ? 'bg-muted' : ''}`}
        >
          <span className="w-6 text-center">{index + 1}</span>
          <span className="hidden group-hover:inline overflow-hidden text-ellipsis whitespace-nowrap">
            {item.template_name}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default SideNav;
