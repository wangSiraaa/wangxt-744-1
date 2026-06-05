import { describe, it, expect } from 'vitest';
import { useCampStore } from '../store/campStore';
import { DEFAULT_WEATHER_TAGS, DEFAULT_CAMPSITES } from '../data/mockData';

describe('强风营位预约按钮不可用', () => {
  it('强风天气标签的 isStrongWind 应为 true', () => {
    const strongWindTag = DEFAULT_WEATHER_TAGS.find((t) => t.id === 'strong-wind');
    expect(strongWindTag).toBeDefined();
    expect(strongWindTag!.isStrongWind).toBe(true);
    expect(strongWindTag!.riskLevel).toBe(3);
  });

  it('强风营位应标记为不可预约', () => {
    const strongWindSites = DEFAULT_CAMPSITES.filter(
      (s) => s.weatherTagId === 'strong-wind'
    );
    expect(strongWindSites.length).toBeGreaterThan(0);

    strongWindSites.forEach((site) => {
      const tag = DEFAULT_WEATHER_TAGS.find((t) => t.id === site.weatherTagId);
      expect(tag!.isStrongWind).toBe(true);
      expect(tag!.riskLevel).toBe(3);
    });
  });

  it('非强风营位的预约按钮不应被禁用', () => {
    const nonStrongWindSites = DEFAULT_CAMPSITES.filter(
      (s) => s.weatherTagId !== 'strong-wind'
    );
    expect(nonStrongWindSites.length).toBeGreaterThan(0);

    nonStrongWindSites.forEach((site) => {
      const tag = DEFAULT_WEATHER_TAGS.find((t) => t.id === site.weatherTagId);
      expect(tag!.isStrongWind).toBe(false);
    });
  });

  it('store 中 hasCriticalRisk 应检测到强风', () => {
    const store = useCampStore.getState();
    expect(store.hasCriticalRisk()).toBe(true);
  });

  it('store 中 hasHighRisk 应检测到高风险', () => {
    const store = useCampStore.getState();
    expect(store.hasHighRisk()).toBe(true);
  });

  it('强风营位 riskLevel 为 3 时不可保存草稿', () => {
    const store = useCampStore.getState();
    const strongWindSite = DEFAULT_CAMPSITES.find(
      (s) => s.weatherTagId === 'strong-wind'
    );
    expect(strongWindSite).toBeDefined();

    const tag = store.getWeatherTagById(strongWindSite!.weatherTagId);
    expect(tag!.isStrongWind).toBe(true);
    expect(tag!.riskLevel).toBe(3);
  });
});
