import { useState } from 'react';
import { useCampStore } from '../store/campStore';
import { RISK_COLORS } from '../types';
import { Plus, Trash2, Edit3, Check, X, Wind, Sun, Cloud, CloudRain, CloudLightning, CloudFog } from 'lucide-react';
import type { SiteType, WeatherTag } from '../types';

const weatherIconOptions = ['Sun', 'Cloud', 'CloudRain', 'CloudLightning', 'Wind', 'CloudFog'];
const siteTypeOptions: { value: SiteType; label: string }[] = [
  { value: 'tent', label: '帐篷位' },
  { value: 'rv', label: '房车位' },
  { value: 'cabin', label: '木屋' },
];

export function AdminPanel() {
  const sites = useCampStore((s) => s.sites);
  const weatherTags = useCampStore((s) => s.weatherTags);
  const addSite = useCampStore((s) => s.addSite);
  const removeSite = useCampStore((s) => s.removeSite);
  const updateSite = useCampStore((s) => s.updateSite);
  const addWeatherTag = useCampStore((s) => s.addWeatherTag);
  const removeWeatherTag = useCampStore((s) => s.removeWeatherTag);
  const updateWeatherTag = useCampStore((s) => s.updateWeatherTag);
  const assignWeather = useCampStore((s) => s.assignWeather);

  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteType, setNewSiteType] = useState<SiteType>('tent');
  const [newSiteRow, setNewSiteRow] = useState(0);
  const [newSiteCol, setNewSiteCol] = useState(0);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');

  const handleAddSite = () => {
    if (!newSiteName.trim()) return;
    addSite({
      id: `site-${Date.now()}`,
      name: newSiteName.trim(),
      row: newSiteRow,
      col: newSiteCol,
      type: newSiteType,
      weatherTagId: weatherTags[0]?.id ?? 'sunny',
    });
    setNewSiteName('');
  };

  const handleAddWeatherTag = () => {
    const id = `tag-${Date.now()}`;
    addWeatherTag({
      id,
      label: '新标签',
      icon: 'Cloud',
      riskLevel: 0,
      color: RISK_COLORS[0],
      isStrongWind: false,
    });
  };

  const startEditTag = (tag: WeatherTag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.label);
  };

  const saveEditTag = () => {
    if (editingTagId && editingTagName.trim()) {
      updateWeatherTag(editingTagId, { label: editingTagName.trim() });
    }
    setEditingTagId(null);
    setEditingTagName('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">管理面板</h2>
        <p className="text-sm text-gray-500">维护营位信息和天气标签</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-bold text-[#2D5016]">天气标签管理</h3>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="px-4 py-3 text-left font-semibold">图标</th>
                <th className="px-4 py-3 text-left font-semibold">名称</th>
                <th className="px-4 py-3 text-left font-semibold">风险等级</th>
                <th className="px-4 py-3 text-left font-semibold">强风</th>
                <th className="px-4 py-3 text-left font-semibold">颜色</th>
                <th className="px-4 py-3 text-right font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {weatherTags.map((tag) => (
                <tr key={tag.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {weatherIconOptions.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => updateWeatherTag(tag.id, { icon })}
                          className={`p-1 rounded cursor-pointer ${tag.icon === icon ? 'bg-[#2D5016]/10' : 'hover:bg-gray-100'}`}
                        >
                          {icon === 'Sun' && <Sun size={14} />}
                          {icon === 'Cloud' && <Cloud size={14} />}
                          {icon === 'CloudRain' && <CloudRain size={14} />}
                          {icon === 'CloudLightning' && <CloudLightning size={14} />}
                          {icon === 'Wind' && <Wind size={14} />}
                          {icon === 'CloudFog' && <CloudFog size={14} />}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {editingTagId === tag.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          className="w-24 px-2 py-1 border rounded text-sm"
                          onKeyDown={(e) => e.key === 'Enter' && saveEditTag()}
                        />
                        <button onClick={saveEditTag} className="p-1 text-green-600 cursor-pointer"><Check size={14} /></button>
                        <button onClick={() => setEditingTagId(null)} className="p-1 text-gray-400 cursor-pointer"><X size={14} /></button>
                      </div>
                    ) : (
                      <span className="font-medium">{tag.label}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={tag.riskLevel}
                      onChange={(e) => updateWeatherTag(tag.id, { riskLevel: Number(e.target.value) as 0 | 1 | 2 | 3 })}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      {[0, 1, 2, 3].map((l) => (
                        <option key={l} value={l}>{['安全', '注意', '警告', '危险'][l]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateWeatherTag(tag.id, { isStrongWind: !tag.isStrongWind, riskLevel: !tag.isStrongWind ? 3 : tag.riskLevel })}
                      className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${tag.isStrongWind ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {tag.isStrongWind ? '是' : '否'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="color"
                      value={tag.color}
                      onChange={(e) => updateWeatherTag(tag.id, { color: e.target.value })}
                      className="w-8 h-6 rounded cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEditTag(tag)} className="p-1.5 hover:bg-gray-100 rounded cursor-pointer"><Edit3 size={14} className="text-gray-400" /></button>
                      <button onClick={() => removeWeatherTag(tag.id)} className="p-1.5 hover:bg-red-50 rounded cursor-pointer"><Trash2 size={14} className="text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-gray-100">
            <button onClick={handleAddWeatherTag} className="text-sm text-[#2D5016] font-medium hover:underline cursor-pointer flex items-center gap-1">
              <Plus size={14} /> 添加天气标签
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-bold text-[#2D5016]">营位管理</h3>

        <div className="flex items-end gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">名称</label>
            <input
              type="text"
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              placeholder="营位名称"
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">类型</label>
            <select value={newSiteType} onChange={(e) => setNewSiteType(e.target.value as SiteType)} className="px-3 py-2 border rounded-lg text-sm">
              {siteTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="w-16">
            <label className="block text-xs font-semibold text-gray-500 mb-1">行</label>
            <input type="number" value={newSiteRow} onChange={(e) => setNewSiteRow(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" min={0} />
          </div>
          <div className="w-16">
            <label className="block text-xs font-semibold text-gray-500 mb-1">列</label>
            <input type="number" value={newSiteCol} onChange={(e) => setNewSiteCol(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" min={0} />
          </div>
          <button onClick={handleAddSite} className="px-4 py-2 bg-[#2D5016] text-white rounded-lg text-sm font-medium hover:bg-[#3a6b1e] transition-colors cursor-pointer">
            添加
          </button>
        </div>

        <div className="grid gap-2">
          {sites.map((site) => {
            const tag = weatherTags.find((t) => t.id === site.weatherTagId);
            return (
              <div key={site.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <span className="font-medium text-sm flex-1">{site.name}</span>
                <select
                  value={site.weatherTagId}
                  onChange={(e) => assignWeather(site.id, e.target.value)}
                  className="px-2 py-1 border rounded text-xs"
                >
                  {weatherTags.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                <span className="text-xs text-gray-400">
                  ({site.row},{site.col}) · {siteTypeOptions.find((o) => o.value === site.type)?.label}
                </span>
                {tag && (
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
                )}
                <button onClick={() => removeSite(site.id)} className="p-1.5 hover:bg-red-50 rounded cursor-pointer">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
