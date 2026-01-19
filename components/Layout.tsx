
import React from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: AppTab.SOLVER, label: 'Giải Toán AI', icon: '✨' },
    { id: AppTab.TOPICS, label: 'Chủ Đề Học', icon: '📚' },
    { id: AppTab.QUIZ, label: 'Luyện Tập', icon: '✍️' },
    { id: AppTab.TUTOR, label: 'Gia Sư AI', icon: '🤖' },
  ];

  return (
    <div className="min-h-screen pb-24">
      <main>{children}</main>
      
      {/* Sticky Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-teal-100 px-4 py-3 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] flex justify-around items-center z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === tab.id ? 'text-teal-600 scale-110' : 'text-slate-400 hover:text-teal-400'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-xs font-bold">{tab.label}</span>
            {activeTab === tab.id && <div className="w-1 h-1 bg-teal-600 rounded-full mt-0.5"></div>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
