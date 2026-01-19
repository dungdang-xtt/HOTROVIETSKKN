
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/gemini';

const Solver: React.FC = () => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async () => {
    if (!input && !image) return;
    setLoading(true);
    setResult(null);
    try {
      const solution = await geminiService.solveProblem(input || "Hãy giải bài toán trong ảnh.", image || undefined);
      setResult(solution);
    } catch (err) {
      setResult("Có lỗi xảy ra khi giải bài. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-teal-800 mb-4 flex items-center gap-2">
        <span className="text-3xl">✨</span> Giải Toán Thông Minh
      </h2>
      <p className="text-slate-600 mb-6 italic">Gửi đề bài bằng văn bản hoặc hình ảnh để nhận lời giải chi tiết.</p>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập đề bài tại đây... (Ví dụ: Tìm x biết 2x + 5 = 11)"
          className="w-full h-32 p-4 border-2 border-teal-100 rounded-2xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all outline-none resize-none"
        />

        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border-2 border-dashed border-teal-300 rounded-xl text-teal-600 font-medium hover:bg-teal-50 transition-colors flex items-center gap-2"
          >
            📸 Chụp/Tải ảnh
          </button>
          
          <button
            onClick={handleSolve}
            disabled={loading || (!input && !image)}
            className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-100"
          >
            {loading ? 'Đang giải...' : 'Giải Ngay'}
          </button>
        </div>

        {image && (
          <div className="relative inline-block mt-2">
            <img src={image} alt="Preview" className="h-32 rounded-lg border border-teal-200" />
            <button 
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {result && (
          <div className="mt-8 p-6 bg-teal-50 rounded-2xl border border-teal-100">
            <h3 className="font-bold text-teal-800 mb-4 flex items-center gap-2">
              ✅ Lời giải chi tiết:
            </h3>
            <div className="prose prose-teal max-w-none whitespace-pre-wrap leading-relaxed text-slate-700">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Solver;
