'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, User, Trophy, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/jogos', label: 'Jogos', icon: Gamepad2 },
  { href: '/conquistas', label: 'Conquistas', icon: Trophy },
  { href: '/perfil', label: 'Perfil', icon: User },
  { href: '/pais', label: 'Pais', icon: Shield },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[60px] ${
                isActive ? 'text-primary' : 'text-text-light hover:text-text-main'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-body font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
