'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { GameCard } from '@/components/games/GameCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { usePlayer } from '@/hooks/usePlayer';
import { useDailyMissionsStore } from '@/stores/dailyMissionsStore';
import { gameRegistry, getGameById } from '@/games/registry';
import { AVATAR_OPTIONS } from '@/lib/constants';

function CreatePlayerModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, age: number, avatar: string) => void;
}) {
  const [name, setName] = useState('');
  const [age, setAge] = useState(7);
  const [avatar, setAvatar] = useState('🦊');

  const handleSubmit = () => {
    if (name.trim().length === 0) return;
    onCreate(name.trim(), age, avatar);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar Perfil">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-body font-semibold text-text-main mb-1">
            Nome ou apelido
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Lukinha"
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface-2 font-body text-text-main focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            maxLength={20}
          />
        </div>

        <div>
          <label className="block text-sm font-body font-semibold text-text-main mb-1">
            Idade: {age} anos
          </label>
          <input
            type="range"
            min={3}
            max={14}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-text-light font-body">
            <span>3 anos</span>
            <span>14 anos</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-body font-semibold text-text-main mb-1">
            Escolha seu avatar
          </label>
          <div className="flex flex-wrap gap-2">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setAvatar(emoji)}
                className={`text-2xl p-2 rounded-xl transition-all ${
                  avatar === emoji
                    ? 'bg-primary/20 ring-2 ring-primary scale-110'
                    : 'hover:bg-surface-2'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleSubmit} variant="primary" size="lg" fullWidth disabled={name.trim().length === 0}>
          Começar Aventura!
        </Button>
      </div>
    </Modal>
  );
}

export default function HomePage() {
  const { player, isLoggedIn, createPlayer } = usePlayer();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const missions = useDailyMissionsStore((s) => s.missions);
  const streakDays = useDailyMissionsStore((s) => s.streakDays);
  const generateDailyMissions = useDailyMissionsStore((s) => s.generateDailyMissions);

  useEffect(() => {
    generateDailyMissions();
  }, [generateDailyMissions]);

  const featuredGames = gameRegistry.slice(0, 6);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg">
        <div className="text-center max-w-md animate-slide-up">
          <p className="text-6xl mb-4">🌟</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-primary mb-3">
            Mundo do Lukinha
          </h1>
          <p className="font-body text-lg text-text-light mb-8">
            Aprenda brincando! Jogos educativos para crianças de 3 a 14 anos.
          </p>
          <Button onClick={() => setShowCreateModal(true)} variant="primary" size="xl">
            Começar!
          </Button>
          <p className="text-xs font-body text-text-light mt-4">
            Feito com amor para o Lukinha e futuras gerações
          </p>
        </div>

        <CreatePlayerModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={createPlayer}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-text-main">
                Olá, {player?.name}!
              </h1>
              <p className="font-body text-text-light mt-1">
                Pronto para mais uma aventura? Escolha um jogo abaixo.
              </p>
            </div>

            {missions.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-xl text-text-main">Missões do Dia</h2>
                  {streakDays > 1 && (
                    <span className="bg-accent/15 text-accent px-3 py-1 rounded-full text-sm font-body font-bold">
                      {streakDays} dias seguidos!
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {missions.map((mission) => {
                    const gameInfo = getGameById(mission.gameId);
                    return (
                      <div
                        key={mission.id}
                        className={`rounded-2xl p-4 border transition-all ${
                          mission.completed
                            ? 'bg-success/10 border-success/30'
                            : 'bg-surface border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{mission.emoji}</span>
                          <div className="flex-1">
                            <p className="font-display font-bold text-sm text-text-main">{mission.title}</p>
                            <p className="text-xs font-body text-text-light">{mission.description}</p>
                          </div>
                          {mission.completed && <span className="text-success">✓</span>}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-body text-text-light">
                            +{mission.xpReward} XP · {mission.coinReward} moedas
                          </span>
                          {!mission.completed && gameInfo && (
                            <a
                              href={`/jogos/${mission.gameId}`}
                              className="text-xs font-body font-bold text-primary hover:underline"
                            >
                              Jogar
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl text-text-main">Jogos em Destaque</h2>
                <a href="/jogos" className="text-sm font-body font-semibold text-primary hover:underline">
                  Ver todos ({gameRegistry.length})
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredGames.map((game) => (
                  <GameCard key={game.config.id} config={game.config} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      <Navigation />
    </div>
  );
}
