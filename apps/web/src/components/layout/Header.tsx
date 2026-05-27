'use client';

import Link from 'next/link';
import { usePlayer } from '@/hooks/usePlayer';
import { PlayerAvatar } from '@/components/player/PlayerAvatar';
import { CoinDisplay } from '@/components/player/CoinDisplay';
import { XPBar } from '@/components/player/XPBar';

export function Header() {
  const { player, xpProgress } = usePlayer();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🌟</span>
          <span className="font-display font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:inline">
            Mundo do Lukinha
          </span>
        </Link>

        {player && (
          <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-md justify-end">
            <div className="hidden sm:block flex-1 max-w-[180px]">
              <XPBar current={xpProgress.current} needed={xpProgress.needed} level={player.level} />
            </div>
            <CoinDisplay coins={player.coins} size="sm" />
            <Link href="/perfil">
              <PlayerAvatar emoji={player.avatarEmoji} level={player.level} size="sm" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
