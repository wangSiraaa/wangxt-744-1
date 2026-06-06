import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CampSite, WeatherTag, ReservationDraft, WeatherSnapshot, OperationError, CompareCandidate } from '../types';
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
  compareCandidates: CompareCandidate[];
  operationErrors: OperationError[];

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
  saveDraft: (draft: Omit<ReservationDraft, 'id' | 'createdAt'>) => boolean;
  removeDraft: (id: string) => void;
  setOffline: (offline: boolean) => void;
  saveSnapshot: () => void;
  getWeatherTagById: (id: string) => WeatherTag | undefined;
  getSiteById: (id: string) => CampSite | undefined;
  filteredSites: () => CampSite[];
  hasHighRisk: () => boolean;
  hasCriticalRisk: () => boolean;
  addCompareCandidate: (siteId: string) => boolean;
  removeCompareCandidate: (siteId: string) => void;
  clearCompareCandidates: () => void;
  isCompareCandidate: (siteId: string) => boolean;
  addOperationError: (message: string, type?: 'warning' | 'error' | 'info') => void;
  removeOperationError: (id: string) => void;
  clearOperationErrors: () => void;
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
      compareCandidates: [],
      operationErrors: [],

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

      saveDraft: (draft) => {
        const state = get();
        const site = state.getSiteById(draft.siteId);
        if (!site) {
          state.addOperationError('营位不存在，无法保存草稿', 'error');
          return false;
        }
        const tag = state.getWeatherTagById(site.weatherTagId);
        if (tag?.isStrongWind) {
          state.addOperationError('该营位当前处于强风状态，不可预约', 'error');
          return false;
        }
        if (!draft.guestName.trim()) {
          state.addOperationError('请输入姓名', 'warning');
          return false;
        }
        if (!draft.date) {
          state.addOperationError('请选择预约日期', 'warning');
          return false;
        }
        set((s) => ({
          drafts: [
            ...s.drafts,
            { ...draft, id: `draft-${Date.now()}`, createdAt: Date.now() },
          ],
          operationErrors: [],
        }));
        return true;
      },
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

      addCompareCandidate: (siteId) => {
        const state = get();
        if (state.compareCandidates.length >= 4) {
          state.addOperationError('最多只能对比 4 个营位', 'warning');
          return false;
        }
        if (state.isCompareCandidate(siteId)) {
          state.addOperationError('该营位已在对比列表中', 'info');
          return false;
        }
        set((s) => ({
          compareCandidates: [...s.compareCandidates, { siteId, addedAt: Date.now() }],
        }));
        return true;
      },
      removeCompareCandidate: (siteId) =>
        set((s) => ({
          compareCandidates: s.compareCandidates.filter((c) => c.siteId !== siteId),
        })),
      clearCompareCandidates: () => set({ compareCandidates: [] }),
      isCompareCandidate: (siteId) =>
        get().compareCandidates.some((c) => c.siteId === siteId),

      addOperationError: (message, type = 'error') =>
        set((s) => ({
          operationErrors: [
            ...s.operationErrors,
            { id: `err-${Date.now()}`, message, type, timestamp: Date.now() },
          ],
        })),
      removeOperationError: (id) =>
        set((s) => ({
          operationErrors: s.operationErrors.filter((e) => e.id !== id),
        })),
      clearOperationErrors: () => set({ operationErrors: [] }),
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
