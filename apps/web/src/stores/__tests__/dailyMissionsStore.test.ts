import { describe, it, expect, beforeEach } from 'vitest';
import { useDailyMissionsStore } from '../dailyMissionsStore';

describe('dailyMissionsStore', () => {
  beforeEach(() => {
    useDailyMissionsStore.setState({ missions: [], lastGeneratedDate: null, completedToday: 0, streakDays: 0, lastStreakDate: null });
  });

  it('generates 3 daily missions', () => {
    useDailyMissionsStore.getState().generateDailyMissions();
    expect(useDailyMissionsStore.getState().missions.length).toBe(3);
  });

  it('missions have required fields', () => {
    useDailyMissionsStore.getState().generateDailyMissions();
    const missions = useDailyMissionsStore.getState().missions;
    missions.forEach((m) => {
      expect(m.id.length).toBeGreaterThan(0);
      expect(m.gameId.length).toBeGreaterThan(0);
      expect(m.title.length).toBeGreaterThan(0);
      expect(m.xpReward).toBeGreaterThan(0);
      expect(m.completed).toBe(false);
    });
  });

  it('does not regenerate same day', () => {
    useDailyMissionsStore.getState().generateDailyMissions();
    const first = useDailyMissionsStore.getState().missions.map((m) => m.id);
    useDailyMissionsStore.getState().generateDailyMissions();
    const second = useDailyMissionsStore.getState().missions.map((m) => m.id);
    expect(first).toEqual(second);
  });

  it('completes a mission', () => {
    useDailyMissionsStore.getState().generateDailyMissions();
    const missionId = useDailyMissionsStore.getState().missions[0]?.id ?? '';
    const reward = useDailyMissionsStore.getState().completeMission(missionId);
    expect(reward).not.toBeNull();
    expect(reward?.xpReward).toBeGreaterThan(0);
    expect(useDailyMissionsStore.getState().missions[0]?.completed).toBe(true);
    expect(useDailyMissionsStore.getState().completedToday).toBe(1);
  });

  it('cannot complete same mission twice', () => {
    useDailyMissionsStore.getState().generateDailyMissions();
    const missionId = useDailyMissionsStore.getState().missions[0]?.id ?? '';
    useDailyMissionsStore.getState().completeMission(missionId);
    const secondAttempt = useDailyMissionsStore.getState().completeMission(missionId);
    expect(secondAttempt).toBeNull();
  });

  it('getMissions auto-generates', () => {
    const missions = useDailyMissionsStore.getState().getMissions();
    expect(missions.length).toBe(3);
  });

  it('streak bonus increases with days', () => {
    useDailyMissionsStore.setState({ streakDays: 5 });
    expect(useDailyMissionsStore.getState().getStreakBonus()).toBe(50);
  });
});
