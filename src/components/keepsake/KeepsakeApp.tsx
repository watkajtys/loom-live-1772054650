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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-parchment bg-[image:var(--background-image-paper-texture)] font-serif text-charcoal-ink antialiased selection:bg-faded-sand selection:text-charcoal-ink flex flex-col items-center">
      <main className="w-full max-w-xl mx-auto px-6 py-24 flex flex-col gap-12">
        <div className="w-full relative flex flex-col gap-8 items-center">
          <textarea
            ref={textareaRef}
            autoFocus
            className="w-full bg-transparent border-none text-4xl md:text-5xl font-normal leading-tight text-charcoal-ink placeholder:text-charcoal-ink/30 placeholder:italic placeholder:font-serif focus:ring-0 resize-none p-0 outline-none text-center placeholder:text-center"
            placeholder="What did they say today?"
            rows={1}
            style={{ minHeight: '3em' }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="text-xs tracking-widest uppercase font-serif italic text-charcoal-ink/50 flex items-center gap-2">
              <span>Press Enter to capture</span>
              <span className="material-symbols-outlined text-sm font-light">keyboard_return</span>
            </div>
            
            <div className="w-full h-px bg-charcoal-ink/10"></div>
          </div>
        </div>

        <div className="flex flex-col gap-12" data-testid="quote-feed">
          {quotes.map((quote) => (
            <article key={quote.id} className="group flex flex-col gap-2 items-center text-center">
              <time className="text-sm text-charcoal-ink/60 font-serif italic">
                {getRelativeTime(quote.timestamp)}
              </time>
              <p className="text-xl md:text-2xl font-normal leading-snug text-charcoal-ink">
                {quote.text}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
