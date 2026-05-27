'use client';

import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/Card';
import { usePlayer } from '@/hooks/usePlayer';
import { ACHIEVEMENTS, getUnlockedAchievements, getLockedAchievements } from '@/types/achievement';

export default function ConquistasPage() {
  const { player } = usePlayer();
  const unlockedIds = player?.achievements ?? [];
  const unlocked = getUnlockedAchievements(unlockedIds);
  const locked = getLockedAchievements(unlockedIds);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-text-main mb-2">
              🏆 Conquistas
            </h1>
            <p className="font-body text-text-light mb-6">
              {unlocked.length}/{ACHIEVEMENTS.length} desbloqueadas
            </p>

            {unlocked.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display font-bold text-lg text-success mb-3">
                  ✅ Desbloqueadas ({unlocked.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {unlocked.map((a) => (
                    <Card key={a.id} padding="md" className="border-success/30">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{a.icon}</span>
                        <div>
                          <h3 className="font-display font-bold text-text-main">{a.name}</h3>
                          <p className="text-sm font-body text-text-light">{a.description}</p>
                          <p className="text-xs font-body text-secondary mt-1">
                            +{a.xpReward} XP | +{a.coinReward} 🪙
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="font-display font-bold text-lg text-text-light mb-3">
                🔒 Travadas ({locked.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {locked.map((a) => (
                  <Card key={a.id} padding="md" className="opacity-60">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl grayscale">{a.icon}</span>
                      <div>
                        <h3 className="font-display font-bold text-text-main">{a.name}</h3>
                        <p className="text-sm font-body text-text-light">{a.description}</p>
                        <p className="text-xs font-body text-text-light mt-1">
                          +{a.xpReward} XP | +{a.coinReward} 🪙
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
}
