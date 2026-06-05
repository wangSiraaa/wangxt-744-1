import { DraftList } from '../components/DraftList';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function DraftsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col">
      <header className="bg-[#2D5016] text-white px-6 py-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <MapPin size={20} />
          <h1 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            我的预约草稿
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        <DraftList />
      </main>
    </div>
  );
}
