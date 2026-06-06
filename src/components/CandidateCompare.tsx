import { useCampStore } from '../store/campStore';
import { WeatherIcon } from './WeatherIcon';
import { RISK_LABELS, RISK_COLORS } from '../types';
import { X, ChevronUp, ChevronDown, Tent, Truck, Home, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const typeLabels = { tent: '帐篷位', rv: '房车位', cabin: '木屋' };
const typeIcons = { tent: Tent, rv: Truck, cabin: Home };

export function CandidateCompare() {
  const compareCandidates = useCampStore((s) => s.compareCandidates);
  const sites = useCampStore((s) => s.sites);
  const weatherTags = useCampStore((s) => s.weatherTags);
  const removeCompareCandidate = useCampStore((s) => s.removeCompareCandidate);
  const clearCompareCandidates = useCampStore((s) => s.clearCompareCandidates);
  const selectSite = useCampStore((s) => s.selectSite);

  const [isExpanded, setIsExpanded] = useState(true);

  const candidateSites = useMemo(() => {
    return compareCandidates
      .map((c) => {
        const site = sites.find((s) => s.id === c.siteId);
        if (!site) return null;
        const tag = weatherTags.find((t) => t.id === site.weatherTagId);
        return { site, tag, addedAt: c.addedAt };
      })
      .filter(Boolean) as Array<{ site: typeof sites[0]; tag: typeof weatherTags[0]; addedAt: number }>;
  }, [compareCandidates, sites, weatherTags]);

  if (candidateSites.length === 0) return null;

  const bestPick = useMemo(() => {
    if (candidateSites.length === 0) return null;
    return [...candidateSites].sort((a, b) => a.tag.riskLevel - b.tag.riskLevel)[0];
  }, [candidateSites]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 animate-slide-up">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#1a1a1a]">
              候选对比 ({candidateSites.length}/4)
            </span>
            {bestPick && (
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                推荐：{bestPick.site.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearCompareCandidates}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 size={12} />
              清空
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {candidateSites.map(({ site, tag }) => {
                const TypeIcon = typeIcons[site.type];
                const isRecommended = bestPick?.site.id === site.id;
                return (
                  <div
                    key={site.id}
                    className={`
                      relative rounded-xl p-4 border-2 transition-all cursor-pointer
                      ${isRecommended ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'}
                      hover:shadow-md
                    `}
                    onClick={() => selectSite(site.id)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCompareCandidate(site.id);
                      }}
                      className="absolute -top-2 -right-2 bg-gray-200 hover:bg-red-500 text-gray-600 hover:text-white rounded-full p-1 transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>

                    {isRecommended && (
                      <div className="absolute -top-2 -left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        推荐
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <TypeIcon size={14} className="text-[#2D5016]/60" />
                      <span className="text-sm font-semibold text-[#1a1a1a]">{site.name}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <WeatherIcon name={tag.icon} size={18} />
                      <span className="text-xs" style={{ color: tag.color }}>
                        {tag.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{
                          backgroundColor: `${RISK_COLORS[tag.riskLevel]}20`,
                          color: RISK_COLORS[tag.riskLevel],
                        }}
                      >
                        {RISK_LABELS[tag.riskLevel]}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {typeLabels[site.type]}
                      </span>
                    </div>

                    {tag.isStrongWind && (
                      <div className="text-[10px] text-red-600 font-medium bg-red-100 rounded px-2 py-1 text-center">
                        不可预约
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
