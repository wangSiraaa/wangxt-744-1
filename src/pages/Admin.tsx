import { AdminPanel } from '../components/AdminPanel';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col">
      <header className="bg-[#2D5016] text-white px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <Settings size={20} />
          <h1 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            管理面板
          </h1>
        </div>
      </header>

      <main className="flex-1 py-8">
        <AdminPanel />
      </main>
    </div>
  );
}
