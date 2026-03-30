import React, { useState } from "react";
import { generateBrandImages, GenerationResult } from "./services/gemini";
import { 
  Layout, 
  Image as ImageIcon, 
  Newspaper, 
  Monitor, 
  Share2, 
  Loader2, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [productDescription, setProductDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productDescription.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateBrandImages(productDescription);
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate images. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] p-6 flex justify-between items-center">
        <div>
          <h1 className="font-serif italic text-2xl tracking-tight">Brand Builder</h1>
          <p className="text-[11px] uppercase tracking-widest opacity-50 font-mono">Visual Identity Generator v1.0</p>
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-10 border border-[#141414] flex items-center justify-center">
            <Layout size={18} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-4 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 opacity-50">
              <span className="font-mono text-[10px]">01</span>
              <h2 className="font-serif italic text-sm uppercase tracking-wider">Product Definition</h2>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="relative group">
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Describe your product (e.g., 'A sleek minimalist electric kettle made of brushed copper with a wooden handle')"
                  className="w-full h-48 bg-transparent border border-[#141414] p-4 focus:outline-none focus:ring-0 resize-none placeholder:opacity-30 font-mono text-sm"
                  disabled={isGenerating}
                />
                <div className="absolute bottom-4 right-4 opacity-30 group-focus-within:opacity-100 transition-opacity">
                  <Sparkles size={16} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !productDescription.trim()}
                className="w-full h-14 bg-[#141414] text-[#E4E3E0] flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span className="font-mono text-xs uppercase tracking-widest">Generating Assets...</span>
                  </>
                ) : (
                  <>
                    <span className="font-mono text-xs uppercase tracking-widest">Build Brand</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </section>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-red-500 text-red-600 flex gap-3 items-start bg-red-50"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-mono leading-relaxed">{error}</p>
            </motion.div>
          )}

          <AnimatePresence>
            {results && (
              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 pt-8 border-t border-[#141414] border-dashed"
              >
                <div className="flex items-center gap-2 opacity-50">
                  <span className="font-mono text-[10px]">02</span>
                  <h2 className="font-serif italic text-sm uppercase tracking-wider">Visual Core</h2>
                </div>
                <div className="p-4 border border-[#141414] bg-white/50">
                  <p className="text-[12px] font-mono leading-relaxed opacity-70 italic">
                    "{results.description}"
                  </p>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Billboard - Full Width */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-end border-b border-[#141414] pb-2">
                <div className="flex items-center gap-2">
                  <Monitor size={14} className="opacity-50" />
                  <h3 className="font-serif italic text-lg">City Billboard</h3>
                </div>
                <span className="font-mono text-[10px] opacity-30 uppercase tracking-widest">16:9 Aspect</span>
              </div>
              <ImagePlaceholder 
                src={results?.billboard} 
                isLoading={isGenerating} 
                aspect="aspect-video"
              />
            </div>

            {/* Newspaper */}
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-[#141414] pb-2">
                <div className="flex items-center gap-2">
                  <Newspaper size={14} className="opacity-50" />
                  <h3 className="font-serif italic text-lg">Print Media</h3>
                </div>
                <span className="font-mono text-[10px] opacity-30 uppercase tracking-widest">3:4 Aspect</span>
              </div>
              <ImagePlaceholder 
                src={results?.newspaper} 
                isLoading={isGenerating} 
                aspect="aspect-[3/4]"
              />
            </div>

            {/* Social */}
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-[#141414] pb-2">
                <div className="flex items-center gap-2">
                  <Share2 size={14} className="opacity-50" />
                  <h3 className="font-serif italic text-lg">Social Post</h3>
                </div>
                <span className="font-mono text-[10px] opacity-30 uppercase tracking-widest">1:1 Aspect</span>
              </div>
              <ImagePlaceholder 
                src={results?.social} 
                isLoading={isGenerating} 
                aspect="aspect-square"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-[#141414] p-8 text-center">
        <p className="font-mono text-[10px] opacity-30 uppercase tracking-[0.3em]">
          Powered by Nano-Banana & Gemini 3.0
        </p>
      </footer>
    </div>
  );
}

function ImagePlaceholder({ src, isLoading, aspect }: { src?: string; isLoading: boolean; aspect: string }) {
  return (
    <div className={`relative w-full ${aspect} border border-[#141414] overflow-hidden bg-white/20 group`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          >
            <div className="w-12 h-12 border-2 border-[#141414] border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-50">Rendering...</span>
          </motion.div>
        ) : src ? (
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0"
          >
            <img 
              src={src} 
              alt="Generated Brand Asset" 
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 border-[10px] border-[#E4E3E0] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <ImageIcon size={48} strokeWidth={1} />
          </div>
        )}
      </AnimatePresence>
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#141414]" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#141414]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#141414]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#141414]" />
    </div>
  );
}

