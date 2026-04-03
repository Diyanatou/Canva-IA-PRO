/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Image as ImageIcon, 
  Download, 
  Share2, 
  Loader2, 
  ArrowRight,
  RotateCcw,
  Maximize2,
  Info
} from "lucide-react";

// Initialize Gemini API - REMOVED from client for security
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pimpedPrompt, setPimpedPrompt] = useState("");

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setProgress(10);

    try {
      const enhancedPrompt = `A high-end, professional studio photograph of: ${prompt}. Minimalist aesthetic, clean composition, natural lighting, 8k resolution, sharp focus, masterpiece.`;
      setPimpedPrompt(enhancedPrompt);
      setProgress(30);

      // Call our secure Backend API instead of direct Gemini call
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: enhancedPrompt }),
      });

      setProgress(70);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Generation failed.");
      }

      if (data.image) {
        setGeneratedImage(data.image);
        setProgress(100);
      } else {
        throw new Error("No image returned from server.");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `canva-pro-ia-${Date.now()}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    try {
      const blob = await (await fetch(generatedImage)).blob();
      const file = new File([blob], "canva-pro-ia.png", { type: "image/png" });
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Canva Pro IA Creation',
        });
      } else {
        alert("Sharing not supported. Please download the image.");
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-studio-bg text-white">
      {/* Top Navigation */}
      <nav className="border-b border-studio-border px-6 py-4 flex justify-between items-center bg-studio-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <Plus className="text-black w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Canva Pro IA</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Info className="w-4 h-4" />
            Studio Mode
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar - Controls */}
        <aside className="w-full md:w-96 border-r border-studio-border p-6 flex flex-col gap-8 overflow-y-auto">
          <div>
            <label className="studio-label">Prompt Editor</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your vision..."
              className="studio-input w-full min-h-[200px] resize-none text-sm"
              disabled={isGenerating}
            />
            
            {/* Suggestions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Astronaute néon",
                "Basket futuriste",
                "Salon minimaliste",
                "Cyberpunk Paris",
                "Voiture vintage"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    const fullPrompts: Record<string, string> = {
                      "Astronaute néon": "Un portrait minimaliste d'un astronaute dans un jardin de fleurs néon, style haute couture.",
                      "Basket futuriste": "Une basket futuriste ultra-détaillée inspirée par l'architecture organique, fond blanc studio.",
                      "Salon minimaliste": "Un salon scandinave épuré avec de grandes baies vitrées donnant sur une forêt brumeuse au matin.",
                      "Cyberpunk Paris": "Une rue de Paris en 2099, pluie fine, reflets néons sur les pavés, tour Eiffel holographique.",
                      "Voiture vintage": "Une Porsche 911 classique sur une route côtière italienne au coucher du soleil, grain argentique."
                    };
                    setPrompt(fullPrompts[suggestion]);
                  }}
                  className="px-3 py-1.5 bg-studio-border/50 hover:bg-studio-border border border-studio-border rounded-full text-[10px] font-medium transition-colors"
                  disabled={isGenerating}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={generateImage}
              disabled={isGenerating || !prompt.trim()}
              className="btn-primary w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Image
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            <p className="text-[10px] text-gray-500 text-center">
              Powered by Gemini 2.5 Flash Image • No login required
            </p>
          </div>

          {/* Progress Indicator */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  <span>Processing</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 bg-studio-border rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
              {error}
            </div>
          )}
        </aside>

        {/* Main Canvas - Preview */}
        <section className="flex-1 bg-[#09090b] p-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(#2a2a2e 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <AnimatePresence mode="wait">
            {generatedImage ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative max-w-4xl w-full group"
              >
                <div className="studio-card !p-2">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-auto rounded-lg shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Floating Actions */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <button onClick={handleDownload} className="btn-secondary shadow-xl">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button onClick={handleShare} className="btn-secondary shadow-xl">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10 max-w-md">
                    <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest font-bold">Enhanced Prompt</p>
                    <p className="text-sm text-white/80 line-clamp-2 italic">"{pimpedPrompt}"</p>
                  </div>
                  <button 
                    onClick={() => setGeneratedImage(null)}
                    className="btn-secondary"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 text-gray-600"
              >
                <div className="w-20 h-20 border-2 border-dashed border-gray-800 rounded-2xl flex items-center justify-center">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-medium">Empty Canvas</h3>
                  <p className="text-sm">Enter a prompt on the left to start creating.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
