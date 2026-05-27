'use client';

import { useState, useCallback } from 'react';
import { useFamilyStore } from '@/stores/familyStore';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { AVATAR_OPTIONS } from '@/lib/constants';

type Tab = 'profiles' | 'progress' | 'settings' | 'lgpd';

export default function PaisPage() {
  const family = useFamilyStore();
  const [authenticated, setAuthenticated] = useState(!family.parentPinSet);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [tab, setTab] = useState<Tab>('profiles');
  const [showSetPin, setShowSetPin] = useState(false);
  const [newPin, setNewPin] = useState('');

  // Add profile form
  const [addName, setAddName] = useState('');
  const [addAge, setAddAge] = useState(7);
  const [addAvatar, setAddAvatar] = useState('🦊');
  const [showAddForm, setShowAddForm] = useState(false);

  const handlePinSubmit = useCallback(() => {
    if (family.verifyParentPin(pinInput)) { setAuthenticated(true); setPinError(false); }
    else { setPinError(true); }
    setPinInput('');
  }, [pinInput, family]);

  const handleSetPin = useCallback(() => {
    if (newPin.length === 6) { family.setParentPin(newPin); setShowSetPin(false); setNewPin(''); }
  }, [newPin, family]);

  const handleAddProfile = useCallback(() => {
    if (addName.trim().length < 1) return;
    family.addProfile(addName.trim(), addAge, addAvatar);
    setAddName(''); setAddAge(7); setAddAvatar('🦊'); setShowAddForm(false);
  }, [addName, addAge, addAvatar, family]);

  const handleExportData = useCallback(() => {
    const data = family.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'mundo-do-lukinha-dados.json'; a.click();
    URL.revokeObjectURL(url);
  }, [family]);

  const handleDeleteAll = useCallback(() => {
    if (confirm('Tem certeza? Isso vai apagar TODOS os dados de TODAS as crianças. Essa ação é irreversível!')) {
      family.deleteAllData();
      setAuthenticated(false);
    }
  }, [family]);

  // PIN Screen
  if (!authenticated && family.parentPinSet) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full text-center">
          <span className="text-5xl block mb-4">🔒</span>
          <h1 className="font-display font-bold text-2xl text-text-main mb-2">Área dos Pais</h1>
          <p className="font-body text-text-light text-sm mb-6">Digite o PIN de 6 dígitos para acessar</p>
          <input type="password" maxLength={6} value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            placeholder="• • • • • •" className="w-full text-center text-2xl tracking-[0.5em] font-mono border-2 border-gray-200 rounded-xl py-3 px-4 mb-4 focus:border-primary outline-none" />
          {pinError && <p className="text-error text-sm font-body mb-3">PIN incorreto! Tente novamente.</p>}
          <Button variant="primary" size="lg" fullWidth onClick={handlePinSubmit} disabled={pinInput.length !== 6}>Entrar</Button>
          <a href="/" className="block mt-4 text-sm text-text-light font-body hover:text-primary">← Voltar para jogos</a>
        </div>
      </div>
    );
  }

  const tabs: Array<{ id: Tab; label: string; emoji: string }> = [
    { id: 'profiles', label: 'Perfis', emoji: '👧' },
    { id: 'progress', label: 'Progresso', emoji: '📊' },
    { id: 'settings', label: 'Configurações', emoji: '⚙️' },
    { id: 'lgpd', label: 'Privacidade', emoji: '🔐' },
  ];

  return (
    <div className="min-h-screen bg-bg-light">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-text-main">👨‍👩‍👧 Área dos Responsáveis</h1>
            <p className="font-body text-text-light text-sm">Acompanhe o progresso e configure a plataforma</p>
          </div>
          <a href="/" className="text-sm font-body text-primary hover:underline">← Voltar aos jogos</a>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl font-body font-semibold text-sm transition-all ${tab === t.id ? 'bg-primary text-white' : 'bg-white text-text-light hover:bg-gray-100'}`}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* PROFILES TAB */}
        {tab === 'profiles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">Perfis das Crianças ({family.profiles.length})</h2>
              <Button variant="primary" size="sm" onClick={() => setShowAddForm(true)}>+ Novo Perfil</Button>
            </div>

            {showAddForm && (
              <Card className="p-5">
                <h3 className="font-display font-bold mb-3">Criar Novo Perfil</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Nome da criança" value={addName} onChange={(e) => setAddName(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl py-2 px-4 font-body focus:border-primary outline-none" />
                  <div><label className="text-sm font-body text-text-light">Idade: {addAge} anos</label>
                    <input type="range" min={3} max={14} value={addAge} onChange={(e) => setAddAge(Number(e.target.value))} className="w-full" /></div>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_OPTIONS.slice(0, 12).map((av) => (
                      <button key={av} onClick={() => setAddAvatar(av)}
                        className={`text-2xl p-1 rounded-lg ${addAvatar === av ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-gray-100'}`}>{av}</button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" size="md" onClick={handleAddProfile}>Criar Perfil</Button>
                    <Button variant="ghost" size="md" onClick={() => setShowAddForm(false)}>Cancelar</Button>
                  </div>
                </div>
              </Card>
            )}

            {family.profiles.length === 0 ? (
              <Card className="p-8 text-center"><p className="text-text-light font-body">Nenhum perfil criado. Clique em &quot;+ Novo Perfil&quot; para começar!</p></Card>
            ) : (
              family.profiles.map((profile) => (
                <Card key={profile.player.id} className={`p-4 ${family.activeProfileId === profile.player.id ? 'ring-2 ring-primary' : ''}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{profile.player.avatarEmoji}</span>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg">{profile.player.name}</h3>
                      <p className="text-sm font-body text-text-light">{profile.player.age} anos | Nível {profile.player.level} | {profile.player.gamesPlayed} jogos</p>
                      <ProgressBar value={profile.player.xp % 100} max={100} color="bg-primary" height="sm" />
                    </div>
                    <div className="flex flex-col gap-1">
                      {family.activeProfileId !== profile.player.id && (
                        <Button variant="ghost" size="sm" onClick={() => family.setActiveProfile(profile.player.id)}>Ativar</Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm(`Remover perfil de ${profile.player.name}?`)) family.removeProfile(profile.player.id); }}
                        className="text-error hover:bg-error/10">Remover</Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* PROGRESS TAB */}
        {tab === 'progress' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg">📊 Progresso dos Perfis</h2>
            {family.profiles.length === 0 ? (
              <Card className="p-8 text-center"><p className="text-text-light">Crie perfis primeiro para ver o progresso.</p></Card>
            ) : (
              family.profiles.map((profile) => {
                const p = profile.player;
                const avgAccuracy = profile.gameHistory.length > 0
                  ? Math.round(profile.gameHistory.reduce((a, g) => a + g.accuracy, 0) / profile.gameHistory.length * 100)
                  : 0;
                const totalStars3 = profile.gameHistory.filter((g) => g.stars === 3).length;
                return (
                  <Card key={p.id} className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{p.avatarEmoji}</span>
                      <div><h3 className="font-display font-bold">{p.name}</h3><p className="text-xs text-text-light">{p.age} anos | {p.ageGroup}</p></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-primary/10 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-primary">{p.level}</p><p className="text-xs text-text-light">Nível</p></div>
                      <div className="bg-accent/10 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-accent">{p.xp}</p><p className="text-xs text-text-light">XP Total</p></div>
                      <div className="bg-sun/10 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-sun">{p.coins}</p><p className="text-xs text-text-light">Moedas</p></div>
                      <div className="bg-nature/10 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-nature">{p.gamesPlayed}</p><p className="text-xs text-text-light">Jogos</p></div>
                      <div className="bg-secondary/10 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-secondary">{avgAccuracy}%</p><p className="text-xs text-text-light">Acurácia Média</p></div>
                      <div className="bg-error/10 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-error">{p.streak}🔥</p><p className="text-xs text-text-light">Streak</p></div>
                      <div className="bg-warning/10 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-warning">{totalStars3}⭐</p><p className="text-xs text-text-light">3 Estrelas</p></div>
                      <div className="bg-gray-100 rounded-xl p-3 text-center"><p className="text-2xl font-bold">{p.achievements.length}</p><p className="text-xs text-text-light">Conquistas</p></div>
                    </div>
                    {profile.gameHistory.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-body text-text-light font-semibold mb-2">Últimos jogos:</p>
                        <div className="space-y-1">{profile.gameHistory.slice(0, 5).map((g, i) => (
                          <div key={i} className="flex justify-between text-xs font-body bg-gray-50 rounded-lg px-3 py-1.5">
                            <span>{g.gameId}</span><span>{'⭐'.repeat(g.stars)} | {Math.round(g.accuracy * 100)}% | +{g.xpEarned}XP</span>
                          </div>
                        ))}</div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === 'settings' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg">⚙️ Configurações</h2>
            <Card className="p-5">
              <h3 className="font-display font-bold mb-3">🔒 PIN Parental</h3>
              <p className="text-sm font-body text-text-light mb-3">Proteja esta área com um PIN de 6 dígitos.</p>
              {family.parentPinSet ? (
                <div className="flex items-center gap-3">
                  <span className="text-success font-body font-semibold text-sm">✅ PIN configurado</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowSetPin(true)}>Alterar PIN</Button>
                </div>
              ) : (
                <Button variant="primary" size="md" onClick={() => setShowSetPin(true)}>Configurar PIN</Button>
              )}
              {showSetPin && (
                <div className="mt-3 flex items-center gap-2">
                  <input type="password" maxLength={6} value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="6 dígitos" className="border-2 border-gray-200 rounded-xl py-2 px-4 font-mono text-center w-40 focus:border-primary outline-none" />
                  <Button variant="primary" size="sm" onClick={handleSetPin} disabled={newPin.length !== 6}>Salvar</Button>
                </div>
              )}
            </Card>
            <Card className="p-5">
              <h3 className="font-display font-bold mb-3">⏰ Limite de Tempo Diário</h3>
              <p className="text-sm font-body text-text-light mb-3">Quanto tempo cada criança pode jogar por dia.</p>
              <div className="flex items-center gap-4">
                <input type="range" min={15} max={180} step={15} value={family.timeLimitMinutes}
                  onChange={(e) => family.setTimeLimit(Number(e.target.value))} className="flex-1" />
                <span className="font-display font-bold text-lg text-primary w-20 text-right">{family.timeLimitMinutes} min</span>
              </div>
            </Card>
          </div>
        )}

        {/* LGPD TAB */}
        {tab === 'lgpd' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg">🔐 Privacidade & LGPD</h2>
            <Card className="p-5">
              <h3 className="font-display font-bold mb-2">📋 Dados que armazenamos</h3>
              <ul className="text-sm font-body text-text-light space-y-1">
                <li>• Nome/apelido da criança (para personalização)</li>
                <li>• Idade (para adaptar conteúdo)</li>
                <li>• Progresso nos jogos (XP, moedas, conquistas)</li>
                <li>• Histórico de jogos (para acompanhamento)</li>
              </ul>
              <p className="text-sm font-body text-text-light mt-3">Todos os dados ficam salvos <strong>apenas neste dispositivo</strong> (localStorage). Não enviamos nada para servidores externos.</p>
            </Card>
            <Card className="p-5">
              <h3 className="font-display font-bold mb-2">📤 Exportar Todos os Dados</h3>
              <p className="text-sm font-body text-text-light mb-3">Baixe um arquivo JSON com todos os dados armazenados (Art. 18 LGPD — Portabilidade).</p>
              <Button variant="secondary" size="md" onClick={handleExportData}>📥 Exportar Dados (JSON)</Button>
            </Card>
            <Card className="p-5 border-2 border-error/20">
              <h3 className="font-display font-bold mb-2 text-error">🗑️ Excluir Todos os Dados</h3>
              <p className="text-sm font-body text-text-light mb-3">Remove permanentemente todos os perfis, progresso e configurações (Art. 18 LGPD — Eliminação).</p>
              <Button variant="ghost" size="md" onClick={handleDeleteAll} className="text-error border border-error hover:bg-error/10">Excluir Tudo Permanentemente</Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
