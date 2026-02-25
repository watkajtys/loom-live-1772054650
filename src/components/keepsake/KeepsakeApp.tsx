import { useState, useEffect, useRef } from 'react';
import { useKeepsakeStore } from '../../store/keepsakeStore';

const getRelativeTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  // Just now: < 1 minute
  if (diff < 60000) return 'Just now';
  
  // Minutes: < 1 hour
  const minutes = Math.floor(diff / 60000);
  if (diff < 3600000) return `${minutes}m ago`;
  
  // Hours: < 24 hours AND same day (rough approximation for "Today")
  const date = new Date(timestamp);
  const today = new Date();
  const isToday = date.getDate() === today.getDate() && 
                  date.getMonth() === today.getMonth() && 
                  date.getFullYear() === today.getFullYear();
                  
  if (isToday) return 'Today';
  
  // Yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.getDate() === yesterday.getDate() &&
                      date.getMonth() === yesterday.getMonth() &&
                      date.getFullYear() === yesterday.getFullYear();
                      
  if (isYesterday) return 'Yesterday';
  
  // Days ago: < 7 days
  const days = Math.floor(diff / 86400000);
  if (days < 7) return `${days} days ago`;
  
  // Date format
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

export default function KeepsakeApp() {
  const [text, setText] = useState('');
  const { quotes, addQuote } = useKeepsakeStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePreserve = () => {
    if (!text.trim()) return;
    addQuote(text.trim());
    setText('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = '3em'; // Reset to min height
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePreserve();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 48)}px`; // 3em approx 48px
    }
  }, [text]);

  return (
    <div className="bg-paper-texture font-serif text-charcoal min-h-screen antialiased selection:bg-[#D3CFC0] selection:text-charcoal flex flex-col items-center pt-24 pb-32">
      <main className="w-full max-w-3xl px-8 flex flex-col gap-16">
        <div className="w-full relative">
          <textarea
            ref={textareaRef}
            autoFocus
            className="w-full bg-transparent border-none text-4xl md:text-5xl lg:text-6xl font-normal text-charcoal placeholder:text-stone placeholder:opacity-60 placeholder:italic focus:placeholder:opacity-30 focus:ring-0 resize-none p-0 leading-tight outline-none"
            placeholder="What did they say today?"
            rows={1}
            style={{ minHeight: '3em' }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-stone tracking-widest uppercase opacity-80">
              <span className="material-symbols-outlined text-[14px]">keyboard_return</span>
              <span>Press Enter to capture</span>
            </div>
            
            <button 
              onClick={handlePreserve}
              className="text-xs text-stone tracking-widest uppercase opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Preserve"
            >
              Preserve
            </button>
          </div>
          
          <div className="absolute -bottom-8 left-0 w-full h-px bg-stone/20"></div>
        </div>

        <div className="flex flex-col gap-14 mt-8" data-testid="quote-feed">
          {quotes.map((quote) => (
            <article key={quote.id} className="group relative pl-6 border-l-2 border-transparent hover:border-stone/30 transition-all duration-500">
              <div className="flex flex-col gap-2">
                <time className="text-sm text-stone font-semibold tracking-wide italic mb-1">
                  {getRelativeTime(quote.timestamp)}
                </time>
                <p className="text-2xl md:text-3xl font-normal leading-snug text-charcoal group-hover:text-black transition-colors duration-500">
                  {quote.text}
                </p>
              </div>
            </article>
          ))}
        </div>
        
        <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-linen to-transparent pointer-events-none"></div>
      </main>
    </div>
  );
}
