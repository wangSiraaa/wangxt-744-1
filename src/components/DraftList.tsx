import { useCampStore } from '../store/campStore';
import { Trash2, RotateCcw, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

export function DraftList() {
  const drafts = useCampStore((s) => s.drafts);
  const removeDraft = useCampStore((s) => s.removeDraft);
  const selectSite = useCampStore((s) => s.selectSite);
  const sites = useCampStore((s) => s.sites);
  const weatherTags = useCampStore((s) => s.weatherTags);
  const navigate = useNavigate();

  const draftsWithInfo = useMemo(() => {
    return drafts.map((draft) => {
      const site = sites.find((s) => s.id === draft.siteId) ?? null;
      const tag = site ? weatherTags.find((t) => t.id === site.weatherTagId) ?? null : null;
      return { draft, site, tag, isStrongWind: tag?.isStrongWind ?? false };
    });
  }, [drafts, sites, weatherTags]);

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <FileText size={48} className="mb-3 opacity-30" />
        <p className="text-sm font-medium">暂无预约草稿</p>
        <p className="text-xs mt-1">选择营位并填写预约信息后，草稿将保存在此处</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {draftsWithInfo.map(({ draft, site, tag, isStrongWind }) => {
        return (
          <div
            key={draft.id}
            className={`
              rounded-xl p-4 border transition-all duration-200
              ${isStrongWind
                ? 'bg-red-50 border-red-200'
                : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-[#1a1a1a]">
                    {site?.name ?? '未知营位'}
                  </span>
                  {isStrongWind && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded font-medium">
                      强风
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <p>预约人：{draft.guestName}</p>
                  <p>日期：{draft.date} · 人数：{draft.guests}</p>
                  <p className="text-gray-400">
                    保存于 {new Date(draft.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 ml-3">
                <button
                  onClick={() => {
                    selectSite(draft.siteId);
                    navigate('/');
                  }}
                  disabled={isStrongWind}
                  className="p-2 rounded-lg hover:bg-[#2D5016]/10 text-[#2D5016] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title={isStrongWind ? '强风不可恢复' : '恢复草稿'}
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => removeDraft(draft.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="删除草稿"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
