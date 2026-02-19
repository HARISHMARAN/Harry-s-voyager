
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { searchPlaces, analyzeImage, transcribeAudio, askAssistantComplex, searchWeb } from '../services/geminiService';
import { decodeBase64, encodeBase64, decodeAudioData } from '../services/voiceService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image' | 'voice';
  citations?: any[];
}

export const AssistantInterface: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Voyager Concierge. I can analyze travel documents, check live events, or just chat. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Grounding helper
  const handleGroundingSearch = async (query: string) => {
    setLoading(true);
    try {
      const isPlaceSearch = query.toLowerCase().includes('near') || query.toLowerCase().includes('restaurant');
      let result;
      if (isPlaceSearch) {
        const pos: any = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        result = await searchPlaces(query, pos.coords.latitude, pos.coords.longitude);
      } else {
        result = await searchWeb(query);
      }
      setMessages(prev => [...prev, { role: 'assistant', content: result.text, citations: result.citations }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I couldn't reach the live search engine right now." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      if (userMsg.length > 100) {
        const response = await askAssistantComplex(userMsg);
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      } else {
        await handleGroundingSearch(userMsg);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setMessages(prev => [...prev, { role: 'user', content: "Analyzed an image...", type: 'image' }]);
      const response = await analyzeImage(base64, file.type);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const text = await transcribeAudio(base64);
          setInput(text);
        };
        reader.readAsDataURL(audioBlob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  const toggleLive = async () => {
    if (!isLive) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let nextStartTime = 0;
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const sources = new Set<AudioBufferSourceNode>();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBase64 = encodeBase64(new Uint8Array(int16.buffer));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: pcmBase64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
              const buffer = await decodeAudioData(decodeBase64(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
              sources.add(source);
            }
          },
          onclose: () => setIsLive(false),
          onerror: () => setIsLive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'You are a warm, efficient travel concierge. Help with directions, tickets, and bookings.'
        }
      });
      liveSessionRef.current = sessionPromise;
      setIsLive(true);
    } else {
      setIsLive(false);
      // Logic to close session
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-end p-6 pointer-events-none">
      <div className="w-full max-w-lg h-[600px] glass-card rounded-3xl pointer-events-auto flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-right-8 duration-500 overflow-hidden">
        <header className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-background-dark/50">
          <div className="flex items-center gap-3">
             <div className="size-2 rounded-full bg-primary animate-pulse"></div>
             <span className="font-display font-bold text-lg">Voyager Assistant</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-background-dark font-bold' : 'bg-white/5 border border-white/10 text-slate-200'}`}>
                {m.content}
                {m.citations && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-primary tracking-widest">Sources:</p>
                    {m.citations.map((c: any, idx: number) => (
                      <a key={idx} href={c.web?.uri || c.maps?.uri} target="_blank" className="block text-[10px] text-slate-400 hover:text-primary truncate">
                        • {c.web?.title || c.maps?.title || "View Citation"}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 rounded-2xl p-4 flex gap-1">
                <div className="size-1 bg-primary rounded-full animate-bounce"></div>
                <div className="size-1 bg-primary rounded-full animate-bounce delay-75"></div>
                <div className="size-1 bg-primary rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>

        <footer className="p-4 bg-background-dark/50 border-t border-white/10">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
               <label className="cursor-pointer size-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                  <span className="material-symbols-outlined text-primary text-xl">image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
               </label>
               <button onClick={toggleRecording} className={`size-10 flex items-center justify-center rounded-xl border transition-all ${isRecording ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/5 hover:bg-white/10 border-white/10 text-primary'}`}>
                  <span className="material-symbols-outlined text-xl">{isRecording ? 'stop' : 'mic'}</span>
               </button>
               <button onClick={toggleLive} className={`flex-1 flex items-center justify-center gap-2 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${isLive ? 'bg-emerald-500 text-background-dark border-emerald-500' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'}`}>
                  <span className="material-symbols-outlined text-sm">{isLive ? 'graphic_eq' : 'settings_voice'}</span>
                  <span>{isLive ? 'Live Call Active' : 'Native Voice Chat'}</span>
               </button>
            </div>
            <div className="relative">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Voyager... (Grounding & Thinking active)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-0 focus:border-primary/50 transition-all"
              />
              <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-all">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
