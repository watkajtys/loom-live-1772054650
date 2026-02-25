import { useState, useRef, useEffect } from 'react';
import { useKeepsakeStore } from '../../store/keepsakeStore';

export default function CaptureInput() {
  const [text, setText] = useState('');
  const { addQuote } = useKeepsakeStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const handlePreserve = () => {
    if (!text.trim()) return;
    addQuote(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePreserve();
    }
  };

  // Auto-resize using shadow div
  useEffect(() => {
    if (textareaRef.current && shadowRef.current) {
      shadowRef.current.innerText = text + '\u200b'; // Add zero-width space to ensure height with trailing newline
      textareaRef.current.style.height = `${Math.max(shadowRef.current.scrollHeight, 48)}px`;
    }
  }, [text]);

  return (
    <div className="w-full relative flex flex-col gap-8 items-start">
      {/* Hidden shadow div for height calculation */}
      <div
        ref={shadowRef}
        className="absolute top-0 left-0 w-full invisible pointer-events-none text-4xl md:text-5xl font-normal leading-tight font-serif p-0 whitespace-pre-wrap break-words"
        aria-hidden="true"
      ></div>

      <textarea
        ref={textareaRef}
        autoFocus
        className="w-full bg-transparent border-none text-4xl md:text-5xl font-normal leading-tight text-charcoal-ink placeholder:text-charcoal-ink/30 placeholder:italic placeholder:font-serif focus:ring-0 resize-none p-0 outline-none overflow-hidden"
        placeholder="What did they say today?"
        rows={1}
        style={{ minHeight: '3em' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      
      <div className="flex flex-col items-start gap-6 w-full">
        <div className="text-xs tracking-widest uppercase font-serif italic text-charcoal-ink/50 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm font-light">west</span>
          <span>Press Enter to capture</span>
        </div>
        
        <div className="w-full h-px bg-charcoal-ink/10"></div>
      </div>
    </div>
  );
}
