import { useCampStore } from '../store/campStore';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const isOffline = useCampStore((s) => s.isOffline);
  const snapshotTimestamp = useCampStore((s) => s.snapshotTimestamp);

  if (!isOffline) return null;

  const formatted = snapshotTimestamp
    ? new Date(snapshotTimestamp).toLocaleString('zh-CN')
    : '无';

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-full text-amber-700 text-xs font-medium animate-shake">
      <WifiOff size={14} />
      <span>离线模式 · 天气快照: {formatted}</span>
    </div>
  );
}
