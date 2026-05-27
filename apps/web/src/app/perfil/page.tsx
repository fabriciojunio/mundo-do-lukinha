'use client';

import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { PlayerAvatar } from '@/components/player/PlayerAvatar';
import { XPBar } from '@/components/player/XPBar';
import { CoinDisplay } from '@/components/player/CoinDisplay';
import { LevelBadge } from '@/components/player/LevelBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePlayer } from '@/hooks/usePlayer';
import { AGE_GROUP_CONFIGS } from '@/types/age-group';
import { AVATAR_OPTIONS } from '@/lib/constants';

export default function PerfilPage() {
  const { player, xpProgress, levelName, gameHistory, setAvatar, resetPlayer } = usePlayer();

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-text-light">Crie um perfil primeiro na página inicial!</p>
      </div>
    );
  }

  const ageConfig = AGE_GROUP_CONFIGS[player.ageGroup];
  const recentGames = gameHistory.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-3xl mx-auto">
            <Card padding="lg" className="mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <PlayerAvatar emoji={player.avatarEmoji} level={player.level} size="lg" />
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="font-display font-bold text-2xl text-text-main">{player.name}</h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    <LevelBadge level={player.level} />
                    <span className="text-sm font-body text-text-light">
                      {ageConfig.emoji} {ageConfig.labelPt} ({player.age} anos)
                    </span>
                  </div>
                  <div className="mt-3 max-w-xs">
                    <XPBar current={xpProgress.current} needed={xpProgress.needed} level={player.level} />
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <Card padding="sm" className="text-center">
                <p className="text-2xl font-display font-bold text-primary">{player.xp}</p>
                <p className="text-xs font-body text-text-light">XP Total</p>
              </Card>
              <Card padding="sm" className="text-center">
                <CoinDisplay coins={player.coins} />
                <p className="text-xs font-body text-text-light mt-1">Moedas</p>
              </Card>
              <Card padding="sm" className="text-center">
                <p className="text-2xl font-display font-bold text-accent">{player.gamesPlayed}</p>
                <p className="text-xs font-body text-text-light">Jogos</p>
              </Card>
              <Card padding="sm" className="text-center">
                <p className="text-2xl font-display font-bold text-nature">🔥 {player.streak}</p>
                <p className="text-xs font-body text-text-light">Sequência</p>
              </Card>
            </div>

            <Card padding="md" className="mb-6">
              <h2 className="font-display font-bold text-lg text-text-main mb-3">Trocar Avatar</h2>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setAvatar(emoji)}
                    className={`text-2xl p-2 rounded-xl transition-all ${
                      player.avatarEmoji === emoji
                        ? 'bg-primary/20 ring-2 ring-primary scale-110'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </Card>

            {recentGames.length > 0 && (
              <Card padding="md" className="mb-6">
                <h2 className="font-display font-bold text-lg text-text-main mb-3">Últimos Jogos</h2>
                <div className="flex flex-col gap-2">
                  {recentGames.map((g, i) => (
                    <div
                      key={`${g.gameId}-${i}`}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="font-body text-sm text-text-main">{g.gameId}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-body text-text-light">
                          {'⭐'.repeat(g.stars)}
                        </span>
                        <span className="text-xs font-body font-semibold text-secondary">
                          +{g.xpEarned} XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div className="text-center">
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (window.confirm('Tem certeza? Isso vai apagar todo o progresso!')) {
                    resetPlayer();
                  }
                }}
              >
                Recomeçar do Zero
              </Button>
            </div>
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
}
