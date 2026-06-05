import { useCampStore } from '../store/campStore';
import { AlertTriangle, Siren } from 'lucide-react';

export function EvacuationBanner() {
  const hasHighRisk = useCampStore((s) => s.hasHighRisk());
  const hasCriticalRisk = useCampStore((s) => s.hasCriticalRisk());

  if (!hasHighRisk) return null;

  const isCritical = hasCriticalRisk;

  return (
    <div
      className={`
        flex items-center justify-center gap-3 px-6 py-3 text-white font-semibold text-sm
        ${isCritical
          ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse-banner'
          : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500'
        }
      `}
    >
      {isCritical ? (
        <>
          <Siren size={20} className="animate-bounce" />
          <span className="animate-pulse-text">
            紧急撤离提示：当前存在强风危险营位，请立即撤离至安全区域！
          </span>
          <Siren size={20} className="animate-bounce" />
        </>
      ) : (
        <>
          <AlertTriangle size={18} />
          <span>天气警告：部分营位风险等级升高，请关注天气变化并做好撤离准备</span>
        </>
      )}
    </div>
  );
}
