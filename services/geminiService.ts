
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, HealthMetrics } from "../types";

// Always initialize GoogleGenAI inside or right before use with process.env.API_KEY
// to ensure it uses the latest key if selection occurs.

export const analyzeSymptoms = async (
  type: 'PHYSICAL' | 'MENTAL',
  symptoms: string[]
): Promise<AIAnalysisResult> => {
  // Use named parameter and direct process.env.API_KEY without fallback.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  const prompt = `你是一位专门为《西游记》师徒四人设计的“仙界健康管家”。
  用户当前选择了以下${type === 'PHYSICAL' ? '身体' : '心理'}不适症状：${symptoms.join(', ')}。
  请根据《西游记》的背景，用专业但带有一点神话色彩的口吻分析：
  1. 病情总结（Condition）
  2. 可能病因（Cause，需结合取经背景，如：紧箍咒、妖怪偷袭、师傅念咒、长途跋涉等）
  3. 处理建议（Treatment，如：仙丹、经文、特定休息方式等）
  
  请以JSON格式返回。`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING },
          cause: { type: Type.STRING },
          treatment: { type: Type.STRING }
        },
        required: ["condition", "cause", "treatment"]
      }
    }
  });

  // Accessing text property directly (not a method). 
  // Using trim() on the result as recommended in guidelines.
  const jsonStr = response.text || "{}";
  return JSON.parse(jsonStr.trim());
};

export const generateHealthReport = async (metrics: HealthMetrics): Promise<AIAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  const prompt = `你是一位仙界神医。针对这位西行取经者的健康监测指标进行分析：
  心率：${metrics.heartRate} bpm
  血压：${metrics.bloodPressureHigh}/${metrics.bloodPressureLow} mmHg
  体重：${metrics.weight} kg
  灵力(Qi)水平：${metrics.qiLevel}%
  
  请给出：
  1. 总体健康报告（Condition）
  2. 潜在隐患建议（Cause/Issues）
  3. 仙界调理建议（Treatment）
  4. 中药用药建议（TCM Advice）
  
  请以JSON格式返回。`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING },
          cause: { type: Type.STRING },
          treatment: { type: Type.STRING },
          tcmAdvice: { type: Type.STRING }
        },
        required: ["condition", "cause", "treatment", "tcmAdvice"]
      }
    }
  });

  const jsonStr = response.text || "{}";
  return JSON.parse(jsonStr.trim());
};
