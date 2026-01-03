
import React, { useState, useEffect } from 'react';
import { HealthServiceType, Symptom, HealthMetrics, AIAnalysisResult } from './types';
import { PHYSICAL_SYMPTOMS, MENTAL_SYMPTOMS, CHARACTERS, GATEKEEPER_LABELS } from './constants';
import { analyzeSymptoms, generateHealthReport } from './services/geminiService';

// --- Sub-components ---

const Header = () => (
  <header className="py-12 px-6 text-center border-b border-yellow-600/30 bg-black/40 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }}></div>
    <div className="inline-block p-2 px-6 rounded-full border border-yellow-600/50 text-yellow-500 text-sm font-bold mb-6 tracking-[0.2em] uppercase bg-black/60 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
      西天取经 · 仙界御医局
    </div>
    <h1 className="text-6xl md:text-7xl font-bold text-yellow-500 mb-4 gufeng-title drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">西游健康管家</h1>
    <p className="text-yellow-100/60 text-xl font-serif italic">“扫尽凡尘垢，修成不坏身”</p>
  </header>
);

const FeatureCard = ({ title, icon, description, onClick }: { title: string, icon: string, description: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="celestial-scroll p-10 rounded-lg text-left transition-all hover:scale-[1.02] group relative overflow-hidden"
  >
    <div className="absolute -right-4 -bottom-4 opacity-5 text-9xl group-hover:rotate-12 transition-transform duration-700">{icon}</div>
    <div className="text-5xl mb-8 w-20 h-20 rounded-full flex items-center justify-center bg-yellow-900/20 border border-yellow-500/30 group-hover:border-yellow-500/80 transition-all">
      {icon}
    </div>
    <h3 className="text-3xl font-bold mb-4 text-yellow-500 font-serif">{title}</h3>
    <p className="text-slate-300 leading-relaxed text-lg font-light">{description}</p>
    <div className="mt-8 flex items-center text-yellow-600 font-bold text-base tracking-widest">
      <span className="border-b border-yellow-600/50 group-hover:border-yellow-600 transition-colors">立即启程</span>
      <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
    </div>
  </button>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // Fix: Marking children as optional to resolve property 'children' is missing error in strict environments
  children?: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="celestial-scroll w-full max-w-2xl rounded-lg overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-6 border-b border-yellow-600/30 flex justify-between items-center bg-yellow-950/20">
          <h2 className="text-3xl font-bold text-yellow-500 font-serif">{title}</h2>
          <button onClick={onClose} className="text-yellow-600 hover:text-yellow-400 text-4xl">&times;</button>
        </div>
        <div className="p-10 max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeView, setActiveView] = useState<'HOME' | 'PHYSICAL_GATE' | 'PHYSICAL_SYMPTOMS' | 'MENTAL' | 'CHECKUP'>('HOME');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  
  const [isPaid, setIsPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [gold, setGold] = useState(100000); // 功德初始值
  
  const [correctGateIndex] = useState(Math.floor(Math.random() * 15));
  
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    heartRate: 72,
    bloodPressureHigh: 115,
    bloodPressureLow: 75,
    weight: 65,
    qiLevel: 95
  });

  const resetState = () => {
    setActiveView('HOME');
    setSelectedSymptoms([]);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  const handleGateClick = (index: number) => {
    if (index === correctGateIndex) {
      setActiveView('PHYSICAL_SYMPTOMS');
    } else {
      alert("此乃镜花水月之幻象，请重新择路。");
    }
  };

  const quickPass = () => {
    if (gold >= 500) {
      setGold(prev => prev - 500);
      setActiveView('PHYSICAL_SYMPTOMS');
    } else {
      alert("功德不足，无法请速通文书。");
    }
  };

  const handleSymptomToggle = (label: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );
  };

  const startAnalysis = async () => {
    if (selectedSymptoms.length === 0) return;
    
    // 每次诊察消耗 5,000 功德
    if (gold < 5000) {
      alert("功德不足 5,000，无法奏请御医诊察！请速去积德。");
      return;
    }

    setIsAnalyzing(true);
    try {
      const type = (activeView === 'PHYSICAL_SYMPTOMS' || activeView === 'PHYSICAL_GATE') ? 'PHYSICAL' : 'MENTAL';
      const result = await analyzeSymptoms(type, selectedSymptoms);
      setGold(prev => prev - 5000); // 扣除 5000 功德
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      alert("三界通讯信号弱，请诚心默念经文后再试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHealthCheckSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gold < 5000) {
      alert("功德不足，无法开启深度推演。");
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await generateHealthReport(healthMetrics);
      setGold(prev => prev - 5000);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* --- Gold Balance Indicator --- */}
      <div className="fixed top-4 right-4 z-40 flex items-center space-x-4">
        <div className="bg-black/80 border border-yellow-600/50 px-5 py-2 rounded-full flex items-center space-x-2 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
          <span className="text-xl">💰</span>
          <span className="font-bold font-serif text-lg">功德: {gold}</span>
        </div>
        {activeView === 'PHYSICAL_GATE' && (
          <button 
            onClick={quickPass}
            className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-bold shadow-lg transition-all active:scale-95"
          >
            500 功德速通
          </button>
        )}
      </div>

      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 py-16">
        {activeView === 'HOME' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
              <FeatureCard 
                title="身体不适" 
                icon="🧘‍♂️" 
                description="火眼金睛干涩？体力透支？进入仙医门诊，开启全方位体察。"
                onClick={() => setActiveView('PHYSICAL_GATE')}
              />
              <FeatureCard 
                title="心理不适" 
                icon="💭" 
                description="思乡情切？见妖焦虑？悟空心猿意马？仙术辅助心理疏导。"
                onClick={() => setActiveView('MENTAL')}
              />
              <FeatureCard 
                title="深度体检" 
                icon="✨" 
                description="解析生命元气，实时监测心率血压，提供定制化仙丹中药调理方案。"
                onClick={() => {
                  if (isPaid) {
                    setActiveView('CHECKUP');
                  } else {
                    setShowPaymentModal(true);
                  }
                }}
              />
            </div>

            <section className="mt-20 relative p-12 rounded-3xl border border-yellow-600/20 bg-yellow-950/5 shadow-2xl overflow-hidden">
               {/* 装饰性水墨效果 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-10 pointer-events-none"></div>
              
              <h2 className="text-4xl font-bold mb-12 text-center text-yellow-500 gufeng-title">取经小分队 · 凡身真影</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {CHARACTERS.map(char => (
                  <div key={char.name} className="celestial-scroll p-6 rounded-xl flex flex-col items-center group transition-all hover:bg-yellow-950/20">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-full blur-md opacity-30 transition-opacity group-hover:opacity-60" style={{ backgroundColor: char.color }}></div>
                      <div className="w-40 h-40 overflow-hidden rounded-2xl border-4 border-yellow-600/30 relative z-10 shadow-xl group-hover:scale-105 transition-transform duration-500">
                        <img 
                          src={char.avatar} 
                          alt={char.name} 
                          className="w-full h-full character-img bg-slate-900" 
                          onError={(e) => {
                            // 备选方案：如果外部链接失效，使用占位图
                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/300/1a1a1a/d4af37?text=${char.name}`;
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-yellow-500 mb-1 font-serif">{char.name}</span>
                    <span className="text-sm text-yellow-100/40 mb-4 tracking-widest">{char.role}</span>
                    <div className="w-full bg-black/40 h-3 rounded-full border border-yellow-600/20 overflow-hidden">
                      <div className="h-full transition-all duration-1000 ease-out" style={{ width: '92%', backgroundColor: char.color }}></div>
                    </div>
                    <span className="mt-3 text-xs text-yellow-600 font-bold uppercase tracking-tighter">元气盈满 (92%)</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* --- Gatekeeper Challenge View --- */}
        {activeView === 'PHYSICAL_GATE' && (
          <div className="animate-in slide-in-from-bottom duration-700 max-w-4xl mx-auto">
            <button onClick={resetState} className="mb-10 text-yellow-600 hover:text-yellow-400 flex items-center font-bold">
              ← 退出门诊
            </button>
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4 gufeng-title text-yellow-500">仙医真经 · 择路而入</h2>
              <p className="text-yellow-100/50 italic text-xl font-serif">“心诚则灵，唯有一道通往医馆。余皆为幻象。”</p>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
              {GATEKEEPER_LABELS.map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGateClick(idx)}
                  className="jade-button py-8 px-4 rounded-lg text-white font-serif text-xl active:scale-95 transition-transform shadow-lg"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- Symptom Selection View --- */}
        {(activeView === 'PHYSICAL_SYMPTOMS' || activeView === 'MENTAL') && !analysisResult && (
          <div className="animate-in fade-in duration-500">
            <button onClick={resetState} className="mb-10 text-yellow-600 hover:text-yellow-400 flex items-center font-bold">
              ← 返回主页
            </button>
            <h2 className="text-4xl font-bold mb-4 gufeng-title text-yellow-500 text-center">请阐述不适之症</h2>
            <p className="text-center text-yellow-600/60 mb-12 font-serif italic text-lg">本次诊察需消耗 5,000 功德</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {(activeView === 'PHYSICAL_SYMPTOMS' ? PHYSICAL_SYMPTOMS : MENTAL_SYMPTOMS).map(sym => (
                <button
                  key={sym.id}
                  onClick={() => handleSymptomToggle(sym.label)}
                  className={`p-8 rounded-xl border-2 transition-all flex flex-col items-center space-y-4 ${
                    selectedSymptoms.includes(sym.label) 
                      ? 'bg-yellow-600/30 border-yellow-500 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                      : 'bg-black/40 border-yellow-600/20 text-yellow-100/40 hover:border-yellow-600/50'
                  }`}
                >
                  <span className="text-5xl mb-2">{sym.icon}</span>
                  <span className="text-xl font-serif font-bold tracking-wider">{sym.label}</span>
                </button>
              ))}
            </div>
            <button
              disabled={selectedSymptoms.length === 0 || isAnalyzing}
              onClick={startAnalysis}
              className="w-full py-6 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-2xl disabled:opacity-30 transition-all active:scale-[0.98] shadow-[0_5px_30px_rgba(202,138,4,0.3)] gufeng-title"
            >
              {isAnalyzing ? '正在奏请天庭...' : `奏请 AI 天眼诊断 (5,000 功德)`}
            </button>
          </div>
        )}

        {/* --- Analysis Result View --- */}
        {analysisResult && (
          <div className="animate-in slide-in-from-bottom duration-700">
             <button onClick={() => { setAnalysisResult(null); setSelectedSymptoms([]); }} className="mb-10 text-yellow-600 hover:text-yellow-400 flex items-center font-bold">
              ← 重新奏报
            </button>
            <div className="celestial-scroll p-12 rounded-lg border-yellow-500/40">
              <h2 className="text-4xl font-bold mb-12 text-yellow-500 border-b border-yellow-600/30 pb-6 gufeng-title text-center">天意诊察报告</h2>
              
              <div className="space-y-12">
                <section className="relative">
                  <div className="absolute -left-6 top-0 text-yellow-700/20 text-6xl font-serif">壹</div>
                  <h4 className="text-2xl font-bold text-yellow-500 mb-4 font-serif">【 灵犀总结 】</h4>
                  <div className="text-yellow-100/80 leading-loose text-xl bg-yellow-950/20 p-8 rounded-xl border border-yellow-600/10 shadow-inner italic">
                    {analysisResult.condition}
                  </div>
                </section>

                <section className="relative">
                  <div className="absolute -left-6 top-0 text-yellow-700/20 text-6xl font-serif">贰</div>
                  <h4 className="text-2xl font-bold text-yellow-500 mb-4 font-serif">【 夙业病因 】</h4>
                  <p className="text-yellow-100/70 leading-loose text-xl px-4">
                    {analysisResult.cause}
                  </p>
                </section>

                <section className="relative">
                  <div className="absolute -left-6 top-0 text-yellow-700/20 text-6xl font-serif">叁</div>
                  <h4 className="text-2xl font-bold text-yellow-500 mb-4 font-serif">【 仙家圣谕 】</h4>
                  <p className="text-yellow-100/70 leading-loose text-xl px-4">
                    {analysisResult.treatment}
                  </p>
                </section>

                {analysisResult.tcmAdvice && (
                  <section className="bg-yellow-600/10 p-10 rounded-xl border-2 border-yellow-600/30 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl">🌿</div>
                    <h4 className="text-2xl font-bold text-yellow-500 mb-6 font-serif">【 百草药方 】</h4>
                    <p className="text-yellow-50/90 leading-loose text-xl">
                      {analysisResult.tcmAdvice}
                    </p>
                  </section>
                )}
              </div>

              <button 
                onClick={resetState}
                className="mt-16 w-full py-5 rounded-xl border-2 border-yellow-600 text-yellow-500 hover:bg-yellow-600/10 font-bold text-xl transition-all active:scale-95"
              >
                谢过御医，归位
              </button>
            </div>
          </div>
        )}

        {/* --- Health Check Metrics View --- */}
        {activeView === 'CHECKUP' && !analysisResult && (
          <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom duration-500">
             <button onClick={resetState} className="mb-10 text-yellow-600 hover:text-yellow-400 flex items-center font-bold">
              ← 返回主页
            </button>
            <h2 className="text-4xl font-bold mb-4 gufeng-title text-yellow-500 text-center">录入仙体玄机</h2>
            <p className="text-center text-yellow-600/60 mb-12 font-serif italic text-lg">深度推演需消耗 5,000 功德</p>

            <form onSubmit={handleHealthCheckSubmit} className="space-y-10 celestial-scroll p-12 rounded-lg shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-lg font-bold text-yellow-600/80 font-serif">心动之率 (bpm)</label>
                  <input 
                    type="number" 
                    value={healthMetrics.heartRate}
                    onChange={(e) => setHealthMetrics({...healthMetrics, heartRate: parseInt(e.target.value)})}
                    className="w-full bg-black/40 border-b-2 border-yellow-600/30 focus:border-yellow-500 py-3 text-2xl text-yellow-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-lg font-bold text-yellow-600/80 font-serif">灵力周天 (%)</label>
                  <input 
                    type="number" 
                    value={healthMetrics.qiLevel}
                    onChange={(e) => setHealthMetrics({...healthMetrics, qiLevel: parseInt(e.target.value)})}
                    className="w-full bg-black/40 border-b-2 border-yellow-600/30 focus:border-yellow-500 py-3 text-2xl text-yellow-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-lg font-bold text-yellow-600/80 font-serif">血涌上限 (mmHg)</label>
                  <input 
                    type="number" 
                    value={healthMetrics.bloodPressureHigh}
                    onChange={(e) => setHealthMetrics({...healthMetrics, bloodPressureHigh: parseInt(e.target.value)})}
                    className="w-full bg-black/40 border-b-2 border-yellow-600/30 focus:border-yellow-500 py-3 text-2xl text-yellow-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-lg font-bold text-yellow-600/80 font-serif">血涌下限 (mmHg)</label>
                  <input 
                    type="number" 
                    value={healthMetrics.bloodPressureLow}
                    onChange={(e) => setHealthMetrics({...healthMetrics, bloodPressureLow: parseInt(e.target.value)})}
                    className="w-full bg-black/40 border-b-2 border-yellow-600/30 focus:border-yellow-500 py-3 text-2xl text-yellow-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-lg font-bold text-yellow-600/80 font-serif">凡胎身重 (kg)</label>
                <input 
                  type="number" 
                  value={healthMetrics.weight}
                  onChange={(e) => setHealthMetrics({...healthMetrics, weight: parseInt(e.target.value)})}
                  className="w-full bg-black/40 border-b-2 border-yellow-600/30 focus:border-yellow-500 py-3 text-2xl text-yellow-500 focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-6 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-2xl transition-all shadow-xl shadow-yellow-900/40 gufeng-title"
              >
                {isAnalyzing ? '正在参透天机...' : '开启全景仙体推演 (5,000 功德)'}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* --- Modals --- */}
      <Modal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        title="开启高级仙体监测"
      >
        <div className="text-center">
          <div className="text-8xl mb-10">📜</div>
          <p className="text-2xl mb-6 font-serif">欲求深度诊疗，需布施功德：</p>
          <div className="text-6xl font-bold text-yellow-500 mb-10 gufeng-title">15,000 功德</div>
          <p className="text-yellow-100/50 mb-12 leading-relaxed text-lg">
            此服务由南极仙翁亲自背书，包含灵力波动溯源、三界实时药方及心猿意马监控。
            <br />
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-yellow-600 underline text-base mt-6 inline-block hover:text-yellow-400"
            >
              了解天庭布施细则 (Billing Docs)
            </a>
          </p>
          <div className="flex space-x-6">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 py-5 rounded-xl bg-slate-800 text-yellow-100/40 font-bold text-xl hover:bg-slate-700 transition-all"
            >
              暂不开启
            </button>
            <button 
              onClick={() => {
                if (gold >= 15000) {
                  setGold(prev => prev - 15000);
                  setIsPaid(true);
                  setShowPaymentModal(false);
                  setActiveView('CHECKUP');
                } else {
                  alert("功德不足！请多行善事。");
                }
              }}
              className="flex-1 py-5 rounded-xl bg-yellow-600 text-black font-bold text-xl hover:bg-yellow-500 active:scale-95 transition-all shadow-lg"
            >
              确认支付 (功德抵扣)
            </button>
          </div>
        </div>
      </Modal>

      <footer className="py-12 text-center text-yellow-800 text-sm border-t border-yellow-900/20 bg-black/60">
        <p className="font-serif tracking-widest mb-2 text-lg">大唐贞观 · 仙界健康技术司</p>
        <p className="italic opacity-50">助力十万八千里取经之路，愿众生离苦得乐</p>
      </footer>
    </div>
  );
}
