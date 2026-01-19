
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/gemini';

interface QuizProps {
  grade: number;
  topic: string;
}

const Quiz: React.FC<QuizProps> = ({ grade, topic }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setQuizFinished(false);
    setCurrentIndex(0);
    setScore(0);
    try {
      const data = await geminiService.generateQuiz(topic, grade);
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [topic, grade]);

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      <p className="text-teal-600 font-medium">Đang soạn đề thi cho bạn...</p>
    </div>
  );

  if (quizFinished) return (
    <div className="p-8 text-center space-y-6">
      <div className="text-6xl">🏆</div>
      <h2 className="text-3xl font-bold text-teal-800">Hoàn Thành!</h2>
      <p className="text-xl">Kết quả của bạn: <span className="font-bold text-teal-600">{score}/{questions.length}</span></p>
      <div className="flex gap-4 justify-center">
        <button 
          onClick={fetchQuiz}
          className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all"
        >
          Làm lại
        </button>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="p-12 text-center">
      <p className="text-slate-500">Không có dữ liệu câu hỏi. Vui lòng chọn chủ đề.</p>
    </div>
  );

  const q = questions[currentIndex];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <span className="text-teal-600 font-bold">Câu hỏi {currentIndex + 1}/{questions.length}</span>
        <div className="h-2 w-48 bg-teal-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-500 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-8">{q.question}</h3>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {q.options.map((option: string, idx: number) => {
          let color = "bg-white border-teal-100 text-slate-700 hover:border-teal-400";
          if (selectedOption !== null) {
            if (idx === q.correctAnswer) color = "bg-green-100 border-green-500 text-green-800";
            else if (idx === selectedOption) color = "bg-red-100 border-red-500 text-red-800";
            else color = "bg-slate-50 border-slate-200 opacity-60";
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selectedOption !== null}
              className={`p-4 border-2 rounded-xl text-left font-medium transition-all ${color}`}
            >
              <span className="mr-3 font-bold text-teal-500">{['A', 'B', 'C', 'D'][idx]}.</span> {option}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mt-6 p-6 bg-teal-50 border border-teal-100 rounded-2xl animate-fade-in">
          <p className="font-bold text-teal-800 mb-2">💡 Giải thích:</p>
          <p className="text-slate-700">{q.explanation}</p>
          <button
            onClick={nextQuestion}
            className="mt-6 w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700"
          >
            {currentIndex === questions.length - 1 ? 'Xem Kết Quả' : 'Tiếp Theo'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
