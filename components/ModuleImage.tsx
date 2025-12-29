import React, { useState } from 'react';
import { ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { generateImage } from '../services/geminiService';

interface ModuleImageProps {
  prompt: string;
  alt: string;
}

export const ModuleImage: React.FC<ModuleImageProps> = ({ prompt, alt }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(false);
    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (imageUrl) {
    return (
      <div className="my-6 relative group">
        <img 
          src={imageUrl} 
          alt={alt} 
          className="w-full h-64 object-cover rounded-xl shadow-md" 
        />
        <button 
          onClick={handleGenerate}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 hover:text-indigo-600 no-print"
          title="Regenerate Image"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="my-6 w-full h-48 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 gap-3 no-print">
      {loading ? (
        <div className="flex flex-col items-center animate-pulse">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
          <span className="text-sm font-medium">Creating illustration...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center text-red-500">
           <span className="text-sm font-medium mb-2">Generation failed</span>
           <button 
            onClick={handleGenerate}
            className="px-4 py-2 bg-white border border-red-200 rounded-lg shadow-sm hover:bg-red-50 text-sm"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <ImageIcon className="w-10 h-10 text-slate-300" />
          <div className="text-center">
             <p className="text-xs text-slate-400 max-w-xs mx-auto mb-3 line-clamp-2">Prompt: {prompt}</p>
             <button 
              onClick={handleGenerate}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-sm font-medium hover:text-indigo-600 transition-colors"
            >
              Generate Graphic
            </button>
          </div>
        </>
      )}
    </div>
  );
};
