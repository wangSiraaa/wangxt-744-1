import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CampSite, WeatherTag, ReservationDraft, WeatherSnapshot } from '../types';
import { DEFAULT_WEATHER_TAGS, DEFAULT_CAMPSITES } from '../data/mockData';

interface CampStore {
  sites: CampSite[];
  weatherTags: WeatherTag[];
  drafts: ReservationDraft[];
  snapshots: WeatherSnapshot[];
  selectedSiteId: string | null;
  selectedWeatherFilters: string[];
  isOffline: boolean;
  snapshotTimestamp: number | null;

  setSites: (sites: CampSite[]) => void;
  addSite: (site: CampSite) => void;
  updateSite: (id: string, updates: Partial<CampSite>) => void;
  removeSite: (id: string) => void;
  setWeatherTags: (tags: WeatherTag[]) => void;
  addWeatherTag: (tag: WeatherTag) => void;
  updateWeatherTag: (id: string, updates: Partial<WeatherTag>) => void;
  removeWeatherTag: (id: string) => void;
  assignWeather: (siteId: string, tagId: string) => void;
  selectSite: (id: string | null) => void;
  toggleWeatherFilter: (tagId: string) => void;
  clearWeatherFilters: () => void;
  saveDraft: (draft: Omit<ReservationDraft, 'id' | 'createdAt'>) => void;
  removeDraft: (id: string) => void;
  setOffline: (offline: boolean) => void;
  saveSnapshot: () => void;
  getWeatherTagById: (id: string) => WeatherTag | undefined;
  getSiteById: (id: string) => CampSite | undefined;
  filteredSites: () => CampSite[];
  hasHighRisk: () => boolean;
  hasCriticalRisk: () => boolean;
}

export const useCampStore = create<CampStore>()(
  persist(
    (set, get) => ({
      sites: DEFAULT_CAMPSITES,
      weatherTags: DEFAULT_WEATHER_TAGS,
      drafts: [],
      snapshots: [],
      selectedSiteId: null,
      selectedWeatherFilters: [],
      isOffline: false,
      snapshotTimestamp: null,

      setSites: (sites) => set({ sites }),
      addSite: (site) => set((s) => ({ sites: [...s.sites, site] })),
      updateSite: (id, updates) =>
        set((s) => ({
          sites: s.sites.map((si) => (si.id === id ? { ...si, ...updates } : si)),
        })),
      removeSite: (id) => set((s) => ({ sites: s.sites.filter((si) => si.id !== id) })),

      setWeatherTags: (tags) => set({ weatherTags: tags }),
      addWeatherTag: (tag) => set((s) => ({ weatherTags: [...s.weatherTags, tag] })),
      updateWeatherTag: (id, updates) =>
        set((s) => ({
          weatherTags: s.weatherTags.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      removeWeatherTag: (id) => set((s) => ({ weatherTags: s.weatherTags.filter((t) => t.id !== id) })),

      assignWeather: (siteId, tagId) =>
        set((s) => ({
          sites: s.sites.map((si) => (si.id === siteId ? { ...si, weatherTagId: tagId } : si)),
        })),

      selectSite: (id) => set({ selectedSiteId: id }),
      toggleWeatherFilter: (tagId) =>
        set((s) => {
          const filters = s.selectedWeatherFilters.includes(tagId)
            ? s.selectedWeatherFilters.filter((f) => f !== tagId)
            : [...s.selectedWeatherFilters, tagId];
          return { selectedWeatherFilters: filters };
        }),
      clearWeatherFilters: () => set({ selectedWeatherFilters: [] }),

      saveDraft: (draft) =>
        set((s) => ({
          drafts: [
            ...s.drafts,
            { ...draft, id: `draft-${Date.now()}`, createdAt: Date.now() },
          ],
        })),
      removeDraft: (id) => set((s) => ({ drafts: s.drafts.filter((d) => d.id !== id) })),

      setOffline: (offline) => set({ isOffline: offline }),
      saveSnapshot: () => {
        const state = get();
        const now = Date.now();
        const snapshots = state.sites.map((site) => {
          const tag = state.weatherTags.find((t) => t.id === site.weatherTagId);
          return {
            siteId: site.id,
            weatherTagId: site.weatherTagId,
            timestamp: now,
            riskLevel: tag?.riskLevel ?? 0,
          };
        });
        set({ snapshots, snapshotTimestamp: now });
      },

      getWeatherTagById: (id) => get().weatherTags.find((t) => t.id === id),
      getSiteById: (id) => get().sites.find((s) => s.id === id),

      filteredSites: () => {
        const state = get();
        if (state.selectedWeatherFilters.length === 0) return state.sites;
        return state.sites.filter((s) =>
          state.selectedWeatherFilters.includes(s.weatherTagId)
        );
      },

      hasHighRisk: () => {
        const state = get();
        return state.sites.some((s) => {
          const tag = state.weatherTags.find((t) => t.id === s.weatherTagId);
          return tag && tag.riskLevel >= 2;
        });
      },

      hasCriticalRisk: () => {
        const state = get();
        return state.sites.some((s) => {
          const tag = state.weatherTags.find((t) => t.id === s.weatherTagId);
          return tag && tag.riskLevel >= 3;
        });
      },
    }),
    {
      name: 'camp-weather-storage',
      partialize: (state) => ({
        sites: state.sites,
        weatherTags: state.weatherTags,
        drafts: state.drafts,
        snapshots: state.snapshots,
        snapshotTimestamp: state.snapshotTimestamp,
      }),
    }
  )
);
