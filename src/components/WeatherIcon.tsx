import { Sun, Cloud, CloudRain, CloudLightning, Wind, CloudFog, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  CloudFog,
};

export function WeatherIcon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const Icon = iconMap[name] || Cloud;
  return <Icon size={size} className={className} />;
}
