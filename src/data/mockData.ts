import type { WeatherTag, CampSite } from '../types';

export const DEFAULT_WEATHER_TAGS: WeatherTag[] = [
  { id: 'sunny', label: '晴天', icon: 'Sun', riskLevel: 0, color: '#27AE60', isStrongWind: false },
  { id: 'cloudy', label: '多云', icon: 'Cloud', riskLevel: 0, color: '#27AE60', isStrongWind: false },
  { id: 'rain', label: '雨天', icon: 'CloudRain', riskLevel: 1, color: '#F1C40F', isStrongWind: false },
  { id: 'thunder', label: '雷暴', icon: 'CloudLightning', riskLevel: 2, color: '#E67E22', isStrongWind: false },
  { id: 'strong-wind', label: '强风', icon: 'Wind', riskLevel: 3, color: '#C0392B', isStrongWind: true },
  { id: 'fog', label: '大雾', icon: 'CloudFog', riskLevel: 1, color: '#F1C40F', isStrongWind: false },
];

export const DEFAULT_CAMPSITES: CampSite[] = [
  { id: 'a1', name: '松林 A1', row: 0, col: 0, type: 'tent', weatherTagId: 'sunny' },
  { id: 'a2', name: '松林 A2', row: 0, col: 1, type: 'tent', weatherTagId: 'rain' },
  { id: 'a3', name: '松林 A3', row: 0, col: 2, type: 'tent', weatherTagId: 'sunny' },
  { id: 'b1', name: '溪谷 B1', row: 1, col: 0, type: 'rv', weatherTagId: 'thunder' },
  { id: 'b2', name: '溪谷 B2', row: 1, col: 1, type: 'rv', weatherTagId: 'cloudy' },
  { id: 'b3', name: '溪谷 B3', row: 1, col: 2, type: 'rv', weatherTagId: 'strong-wind' },
  { id: 'c1', name: '山顶 C1', row: 2, col: 0, type: 'cabin', weatherTagId: 'strong-wind' },
  { id: 'c2', name: '山顶 C2', row: 2, col: 1, type: 'cabin', weatherTagId: 'fog' },
  { id: 'c3', name: '山顶 C3', row: 2, col: 2, type: 'cabin', weatherTagId: 'sunny' },
  { id: 'd1', name: '湖畔 D1', row: 3, col: 0, type: 'tent', weatherTagId: 'rain' },
  { id: 'd2', name: '湖畔 D2', row: 3, col: 1, type: 'tent', weatherTagId: 'sunny' },
  { id: 'd3', name: '湖畔 D3', row: 3, col: 2, type: 'rv', weatherTagId: 'thunder' },
];
