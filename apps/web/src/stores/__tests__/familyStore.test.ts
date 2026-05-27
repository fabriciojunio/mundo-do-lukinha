import { describe, it, expect, beforeEach } from 'vitest';
import { useFamilyStore } from '../familyStore';

describe('familyStore', () => {
  beforeEach(() => { useFamilyStore.getState().deleteAllData(); });

  it('starts empty', () => { expect(useFamilyStore.getState().profiles.length).toBe(0); expect(useFamilyStore.getState().activeProfileId).toBeNull(); });

  it('adds profile', () => {
    useFamilyStore.getState().addProfile('Lukinha', 7, '🦊');
    expect(useFamilyStore.getState().profiles.length).toBe(1);
    expect(useFamilyStore.getState().profiles[0]?.player.name).toBe('Lukinha');
    expect(useFamilyStore.getState().activeProfileId).not.toBeNull();
  });

  it('adds multiple profiles', () => {
    useFamilyStore.getState().addProfile('Lukinha', 7, '🦊');
    useFamilyStore.getState().addProfile('Maria', 10, '🐱');
    expect(useFamilyStore.getState().profiles.length).toBe(2);
  });

  it('removes profile', () => {
    useFamilyStore.getState().addProfile('Test', 7, '🦊');
    const id = useFamilyStore.getState().profiles[0]?.player.id ?? '';
    useFamilyStore.getState().removeProfile(id);
    expect(useFamilyStore.getState().profiles.length).toBe(0);
  });

  it('switches active profile', () => {
    useFamilyStore.getState().addProfile('A', 7, '🦊');
    useFamilyStore.getState().addProfile('B', 10, '🐱');
    const idB = useFamilyStore.getState().profiles[1]?.player.id ?? '';
    useFamilyStore.getState().setActiveProfile(idB);
    expect(useFamilyStore.getState().activeProfileId).toBe(idB);
  });

  it('getActiveProfile returns correct profile', () => {
    useFamilyStore.getState().addProfile('Lukinha', 7, '🦊');
    const active = useFamilyStore.getState().getActiveProfile();
    expect(active?.player.name).toBe('Lukinha');
  });

  it('updates profile age', () => {
    useFamilyStore.getState().addProfile('Test', 7, '🦊');
    const id = useFamilyStore.getState().profiles[0]?.player.id ?? '';
    useFamilyStore.getState().updateProfileAge(id, 12);
    expect(useFamilyStore.getState().profiles[0]?.player.age).toBe(12);
    expect(useFamilyStore.getState().profiles[0]?.player.ageGroup).toBe('master');
  });

  it('adds game result to active profile', () => {
    useFamilyStore.getState().addProfile('Test', 7, '🦊');
    useFamilyStore.getState().addGameResult('math-battle', { score: 80, maxScore: 100, timeSpent: 30, accuracy: 0.8, xpEarned: 30, coinsEarned: 15, achievements: [], stars: 2 });
    const active = useFamilyStore.getState().getActiveProfile();
    expect(active?.player.xp).toBe(30);
    expect(active?.player.coins).toBe(15);
    expect(active?.gameHistory.length).toBe(1);
  });

  it('PIN set and verify', () => {
    useFamilyStore.getState().setParentPin('123456');
    expect(useFamilyStore.getState().parentPinSet).toBe(true);
    expect(useFamilyStore.getState().verifyParentPin('123456')).toBe(true);
    expect(useFamilyStore.getState().verifyParentPin('000000')).toBe(false);
  });

  it('time limit', () => {
    useFamilyStore.getState().setTimeLimit(90);
    expect(useFamilyStore.getState().timeLimitMinutes).toBe(90);
  });

  it('export data returns JSON', () => {
    useFamilyStore.getState().addProfile('Test', 7, '🦊');
    const data = useFamilyStore.getState().exportAllData();
    const parsed = JSON.parse(data);
    expect(parsed.profiles.length).toBe(1);
    expect(parsed.exportedAt).toBeDefined();
  });

  it('delete all data clears everything', () => {
    useFamilyStore.getState().addProfile('Test', 7, '🦊');
    useFamilyStore.getState().setParentPin('123456');
    useFamilyStore.getState().deleteAllData();
    expect(useFamilyStore.getState().profiles.length).toBe(0);
    expect(useFamilyStore.getState().parentPin).toBeNull();
  });
});
