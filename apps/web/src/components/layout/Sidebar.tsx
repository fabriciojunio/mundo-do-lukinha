'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, User, Trophy, Shield } from 'lucide-react';
import { GAME_CATEGORIES, CATEGORY_LABELS, CATEGORY_EMOJIS, type GameCategory } from '@/types/game';

const MAIN_NAV = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/jogos', label: 'Jogos', icon: Gamepad2 },
  { href: '/conquistas', label: 'Conquistas', icon: Trophy },
  { href: '/perfil', label: 'Perfil', icon: User },
  { href: '/pais', label: 'Área dos Pais', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-gray-100 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto py-4 px-3">
      <div className="flex flex-col gap-1 mb-6">
        {MAIN_NAV.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-body font-semibold text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-light hover:bg-gray-50 hover:text-text-main'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="px-3 text-xs font-body font-bold text-text-light uppercase tracking-wider mb-2">
          Categorias
        </p>
        <div className="flex flex-col gap-0.5">
          {GAME_CATEGORIES.map((cat: GameCategory) => (
            <Link
              key={cat}
              href={`/jogos?categoria=${cat}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body text-text-light hover:bg-gray-50 hover:text-text-main transition-colors"
            >
              <span>{CATEGORY_EMOJIS[cat]}</span>
              <span>{CATEGORY_LABELS[cat]}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
