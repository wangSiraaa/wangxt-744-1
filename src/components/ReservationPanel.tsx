import { useState, useEffect, useMemo } from 'react';
import { useCampStore } from '../store/campStore';
import { WeatherIcon } from './WeatherIcon';
import { RISK_LABELS } from '../types';
import { X, Save, AlertTriangle, Tent, Truck, Home } from 'lucide-react';

const typeLabels = { tent: '帐篷位', rv: '房车位', cabin: '木屋' };
const typeIcons = { tent: Tent, rv: Truck, cabin: Home };

export function ReservationPanel() {
  const selectedSiteId = useCampStore((s) => s.selectedSiteId);
  const selectSite = useCampStore((s) => s.selectSite);
  const sites = useCampStore((s) => s.sites);
  const weatherTags = useCampStore((s) => s.weatherTags);
  const saveDraft = useCampStore((s) => s.saveDraft);
  const drafts = useCampStore((s) => s.drafts);

  const [guestName, setGuestName] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [saved, setSaved] = useState(false);

  const site = useMemo(() => {
    return selectedSiteId ? sites.find((s) => s.id === selectedSiteId) ?? null : null;
  }, [selectedSiteId, sites]);

  const tag = useMemo(() => {
    return site ? weatherTags.find((t) => t.id === site.weatherTagId) ?? null : null;
  }, [site, weatherTags]);

  const existingDrafts = useMemo(() => {
    return site ? drafts.filter((d) => d.siteId === site.id) : [];
  }, [site, drafts]);

  useEffect(() => {
    setGuestName('');
    setDate('');
    setGuests(1);
    setSaved(false);
  }, [selectedSiteId]);

  if (!site || !tag) return null;

  const isStrongWind = tag.isStrongWind;
  const TypeIcon = typeIcons[site.type];

  const handleSave = () => {
    if (isStrongWind) return;
    if (!guestName.trim() || !date) return;
    saveDraft({ siteId: site.id, guestName: guestName.trim(), date, guests });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 max-w-full bg-white shadow-2xl border-l border-gray-100 z-50 flex flex-col animate-slide-in">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1a1a1a]">预约营位</h2>
          <button
            onClick={() => selectSite(null)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div
          className="rounded-xl p-4 border-2"
          style={{ borderColor: `${tag.color}40`, backgroundColor: `${tag.color}08` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <TypeIcon size={18} className="text-[#2D5016]/70" />
            <span className="font-semibold text-[#1a1a1a]">{site.name}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <WeatherIcon name={tag.icon} size={16} />
              <span style={{ color: tag.color }}>{tag.label}</span>
            </div>
            <div
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              {RISK_LABELS[tag.riskLevel]}
            </div>
            <span className="text-gray-400 text-xs">{typeLabels[site.type]}</span>
          </div>
        </div>

        {isStrongWind && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-semibold text-sm">该营位当前处于强风状态</p>
              <p className="text-red-600 text-xs mt-1">强风天气下无法预约，请选择其他营位或等待天气好转</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              姓名
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={isStrongWind}
              placeholder="请输入您的姓名"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]/30 focus:border-[#2D5016] disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              预约日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isStrongWind}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]/30 focus:border-[#2D5016] disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              人数
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={isStrongWind || guests <= 1}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-semibold w-8 text-center">{guests}</span>
              <button
                onClick={() => setGuests(Math.min(10, guests + 1))}
                disabled={isStrongWind || guests >= 10}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {existingDrafts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">已有 {existingDrafts.length} 份草稿</p>
            <p className="text-[10px] text-blue-600">可在"我的草稿"页面查看和管理</p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={isStrongWind || !guestName.trim() || !date}
          className={`
            w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200
            ${isStrongWind
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#2D5016] text-white hover:bg-[#3a6b1e] hover:shadow-lg active:scale-[0.98]'
            }
          `}
          title={isStrongWind ? '强风天气不可预约' : '保存草稿'}
        >
          {isStrongWind ? (
            <>
              <AlertTriangle size={16} />
              强风不可预约
            </>
          ) : saved ? (
            '已保存 ✓'
          ) : (
            <>
              <Save size={16} />
              保存预约草稿
            </>
          )}
        </button>
      </div>
    </div>
  );
}
