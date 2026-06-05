import { useCampStore } from '../store/campStore';
import { WeatherIcon } from './WeatherIcon';
import { X } from 'lucide-react';

export function WeatherFilterBar() {
  const weatherTags = useCampStore((s) => s.weatherTags);
  const selectedFilters = useCampStore((s) => s.selectedWeatherFilters);
  const toggleFilter = useCampStore((s) => s.toggleWeatherFilter);
  const clearFilters = useCampStore((s) => s.clearWeatherFilters);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-[#2D5016] uppercase tracking-wider mr-1">
        天气筛选
      </span>
      {weatherTags.map((tag) => {
        const active = selectedFilters.includes(tag.id);
        return (
          <button
            key={tag.id}
            onClick={() => toggleFilter(tag.id)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              transition-all duration-200 border cursor-pointer
              ${active
                ? 'text-white shadow-md scale-105'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }
            `}
            style={active ? { backgroundColor: tag.color, borderColor: tag.color } : undefined}
          >
            <WeatherIcon name={tag.icon} size={14} className={active ? 'text-white' : ''} />
            {tag.label}
          </button>
        );
      })}
      {selectedFilters.length > 0 && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-full text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={12} />
          清除
        </button>
      )}
    </div>
  );
}
