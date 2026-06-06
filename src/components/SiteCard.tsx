import { useCampStore } from '../store/campStore';
import { WeatherIcon } from './WeatherIcon';
import { RISK_LABELS } from '../types';
import { Tent, Truck, Home, AlertTriangle, Plus, Check } from 'lucide-react';
import { useMemo } from 'react';

const typeIcons = { tent: Tent, rv: Truck, cabin: Home };

export function SiteCard({ siteId }: { siteId: string }) {
  const sites = useCampStore((s) => s.sites);
  const weatherTags = useCampStore((s) => s.weatherTags);
  const selectSite = useCampStore((s) => s.selectSite);
  const selectedSiteId = useCampStore((s) => s.selectedSiteId);
  const isCompareCandidate = useCampStore((s) => s.isCompareCandidate);
  const addCompareCandidate = useCampStore((s) => s.addCompareCandidate);
  const removeCompareCandidate = useCampStore((s) => s.removeCompareCandidate);

  const site = useMemo(() => sites.find((s) => s.id === siteId)!, [sites, siteId]);
  const weatherTag = useMemo(() => weatherTags.find((t) => t.id === site.weatherTagId)!, [weatherTags, site.weatherTagId]);

  const isSelected = selectedSiteId === site.id;
  const isCandidate = isCompareCandidate(site.id);
  const isStrongWind = weatherTag.isStrongWind;
  const TypeIcon = typeIcons[site.type];

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCandidate) {
      removeCompareCandidate(site.id);
    } else {
      addCompareCandidate(site.id);
    }
  };

  return (
    <div
      className={`
        relative group rounded-xl text-left transition-all duration-300
        border-2 hover:scale-[1.03] hover:shadow-lg
        ${isSelected ? 'ring-2 ring-offset-2 ring-[#2D5016] shadow-lg' : ''}
        ${isStrongWind ? 'border-red-400 bg-red-50' : 'border-transparent bg-white shadow-md'}
      `}
      style={{
        borderBottom: `4px solid ${weatherTag.color}`,
      }}
    >
      <button
        onClick={() => selectSite(isSelected ? null : site.id)}
        className="w-full p-4 text-left cursor-pointer"
      >
        {isStrongWind && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 animate-pulse z-10">
            <AlertTriangle size={14} />
          </div>
        )}

        {isCandidate && (
          <div className="absolute -top-2 -left-2 bg-[#2D5016] text-white rounded-full p-1 z-10">
            <Check size={14} />
          </div>
        )}

        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TypeIcon size={14} className="text-[#2D5016]/60" />
            <span className="text-sm font-semibold text-[#1a1a1a]">{site.name}</span>
          </div>
          <WeatherIcon name={weatherTag.icon} size={22} className="opacity-70" />
        </div>

        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${weatherTag.color}20`,
              color: weatherTag.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: weatherTag.color }}
            />
            {weatherTag.label}
          </span>
          <span
            className="text-[10px] font-bold tracking-wide uppercase"
            style={{ color: weatherTag.color }}
          >
            {RISK_LABELS[weatherTag.riskLevel]}
          </span>
        </div>

        {isStrongWind && (
          <div className="mt-2 text-[10px] text-red-600 font-medium bg-red-100 rounded px-2 py-1 text-center">
            不可预约 · 强风天气
          </div>
        )}
      </button>

      <button
        onClick={handleToggleCompare}
        className={`
          absolute bottom-2 right-2 p-1.5 rounded-lg transition-all cursor-pointer
          ${isCandidate
            ? 'bg-[#2D5016] text-white'
            : 'bg-gray-100 text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-gray-200'
          }
        `}
        title={isCandidate ? '移出对比' : '加入对比'}
      >
        {isCandidate ? <Check size={12} /> : <Plus size={12} />}
      </button>
    </div>
  );
}
