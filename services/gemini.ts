
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async solveProblem(problem: string, imageBase64?: string): Promise<string> {
    const model = 'gemini-3-pro-preview';
    const systemInstruction = `Bạn là một giáo viên dạy Toán THCS (Cấp 2) tại Việt Nam.
    Hãy giải bài toán sau một cách chi tiết, từng bước một.
    Sử dụng ký hiệu LaTeX (ví dụ: $x^2 + 2x + 1$) cho các công thức toán học.
    Đảm bảo giải thích rõ ràng các định lý hoặc tính chất được sử dụng.
    Nếu là hình học, hãy mô tả cách vẽ hình và các bước chứng minh.`;

    const contents: any[] = [{ text: problem }];
    if (imageBase64) {
      contents.push({
        inlineData: {
          mimeType: 'image/png',
          data: imageBase64.split(',')[1] || imageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts: contents },
      config: { systemInstruction }
    });

    return response.text || "Không thể giải bài toán này. Vui lòng thử lại.";
  },

  async generateQuiz(topic: string, grade: number): Promise<any[]> {
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model,
      contents: `Tạo 5 câu hỏi trắc nghiệm Toán lớp ${grade} về chủ đề "${topic}".
      Mỗi câu hỏi phải có 4 lựa chọn, đáp án đúng và giải thích chi tiết.
      Định dạng kết quả trả về là JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswer: { type: Type.INTEGER, description: 'Index từ 0-3' },
              explanation: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctAnswer', 'explanation']
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  },

  async chatWithTutor(history: ChatMessage[], message: string): Promise<string> {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Bạn là "Gia sư Toán MathMaster". Bạn thân thiện, kiên nhẫn và giỏi giải thích các khái niệm Toán THCS. 
        Hãy giúp học sinh hiểu bản chất vấn đề thay vì chỉ đưa ra đáp án. 
        Sử dụng LaTeX cho công thức. Trả lời bằng tiếng Việt.`
      }
    });

    // In a real implementation, we would send history. 
    // Here we'll simplify to a single send for the demo structure.
    const response = await chat.sendMessage({ message });
    return response.text || "Xin lỗi, tôi gặp sự cố khi kết nối.";
  }
};
