
import React from 'react';

interface TopicSelectorProps {
  grade: number;
  onSelect: (topic: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ grade, onSelect }) => {
  const topicsMap: Record<number, string[]> = {
    6: ['Số tự nhiên', 'Số nguyên', 'Phân số', 'Số thập phân', 'Hình học trực quan', 'Tính đối xứng'],
    7: ['Số hữu tỉ', 'Số thực', 'Hàm số và đồ thị', 'Biểu thức đại số', 'Tam giác', 'Quan hệ giữa các yếu tố'],
    8: ['Đa thức', 'Phân thức đại số', 'Phương trình bậc nhất', 'Định lý Thalès', 'Hình đồng dạng', 'Hình khối'],
    9: ['Căn bậc hai, căn bậc ba', 'Hàm số bậc nhất', 'Hệ phương trình', 'Hàm số y=ax^2', 'Đường tròn', 'Hình trụ, cầu'],
  };

  const currentTopics = topicsMap[grade] || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-teal-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">📚</span> Lộ Trình Học Toán Lớp {grade}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentTopics.map((topic, i) => (
          <button
            key={i}
            onClick={() => onSelect(topic)}
            className="p-6 bg-white border border-teal-100 rounded-2xl text-left hover:bg-teal-50 hover:border-teal-400 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-teal-500 uppercase tracking-wider">Chương {i + 1}</span>
                <h3 className="text-lg font-bold text-slate-800 mt-1">{topic}</h3>
              </div>
              <div className="bg-teal-100 text-teal-600 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-2">Hệ thống 15+ câu hỏi luyện tập và bài giảng AI cho chủ đề này.</p>
          </button>
        ))}
      </div>

      <div className="mt-12 p-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl text-white shadow-xl">
        <h3 className="text-xl font-bold mb-2">Thử thách hàng tuần!</h3>
        <p className="opacity-90 mb-6">Tham gia giải bộ 10 câu hỏi tổng hợp lớp {grade} để nhận huy hiệu MathMaster.</p>
        <button 
          onClick={() => onSelect('Kiểm tra tổng hợp')}
          className="bg-white text-teal-700 px-6 py-2 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
        >
          Bắt đầu ngay
        </button>
      </div>
    </div>
  );
};

export default TopicSelector;
