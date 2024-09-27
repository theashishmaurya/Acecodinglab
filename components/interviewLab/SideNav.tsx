'use client';
import Link from 'next/link';

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
  return (
    <nav className="grid items-start px-2 text-md font-large lg:px-4">
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            item.active ? 'text-primary' : 'text-muted-foreground'
          } ${item.active ? 'bg-muted' : ''}`}
        >
          <span className="w-6 text-center">{item.number}</span>
          <span className="hidden group-hover:inline overflow-hidden text-ellipsis whitespace-nowrap">
            {item.text}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default SideNav;
