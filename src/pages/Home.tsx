import { useCampStore } from '../store/campStore';
import { SiteCard } from '../components/SiteCard';
import { WeatherFilterBar } from '../components/WeatherFilterBar';
import { EvacuationBanner } from '../components/EvacuationBanner';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { ReservationPanel } from '../components/ReservationPanel';
import { CandidateCompare } from '../components/CandidateCompare';
import { OperationToast } from '../components/OperationToast';
import { useOfflineDetection } from '../hooks/useOfflineDetection';
import { useNavigate } from 'react-router-dom';
import { FileText, Settings, MapPin, GitCompare } from 'lucide-react';
import { useMemo } from 'react';

export default function HomePage() {
  const sites = useCampStore((s) => s.sites);
  const selectedWeatherFilters = useCampStore((s) => s.selectedWeatherFilters);
  const weatherTags = useCampStore((s) => s.weatherTags);
  const selectedSiteId = useCampStore((s) => s.selectedSiteId);
  const compareCandidates = useCampStore((s) => s.compareCandidates);
  const navigate = useNavigate();

  useOfflineDetection();

  const filteredSites = useMemo(() => {
    if (selectedWeatherFilters.length === 0) return sites;
    return sites.filter((s) => selectedWeatherFilters.includes(s.weatherTagId));
  }, [sites, selectedWeatherFilters]);

  const rows = useMemo(() => {
    return [...new Set(filteredSites.map((s) => s.row))].sort((a, b) => a - b);
  }, [filteredSites]);

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col">
      <EvacuationBanner />
      <OperationToast />

      <header className="bg-[#2D5016] text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin size={24} />
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                露营营位天气看板
              </h1>
              <p className="text-[10px] text-green-200 tracking-wider uppercase">Campsite Weather Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <OfflineIndicator />
            {compareCandidates.length > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg text-xs font-medium">
                <GitCompare size={12} />
                对比 {compareCandidates.length}
              </span>
            )}
            <button
              onClick={() => navigate('/drafts')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <FileText size={14} />
              我的草稿
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Settings size={14} />
              管理
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 space-y-6 pb-32">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
          <WeatherFilterBar />
        </div>

        <div className="space-y-4">
          {rows.map((rowIdx) => {
            const rowSites = filteredSites
              .filter((s) => s.row === rowIdx)
              .sort((a, b) => a.col - b.col);
            const rowLabel = ['松林区', '溪谷区', '山顶区', '湖畔区', '草原区', '林间区'][rowIdx] ?? `区域 ${rowIdx + 1}`;

            return (
              <div key={rowIdx}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-[#2D5016] rounded-full" />
                  <span className="text-sm font-bold text-[#2D5016]">{rowLabel}</span>
                  <span className="text-[10px] text-gray-400">{rowSites.length} 个营位</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {rowSites.map((site) => (
                    <SiteCard key={site.id} siteId={site.id} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <CandidateCompare />
      {selectedSiteId && <ReservationPanel />}
    </div>
  );
}
