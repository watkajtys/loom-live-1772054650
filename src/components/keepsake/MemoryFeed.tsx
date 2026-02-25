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

export default function MemoryFeed() {
  const { quotes } = useKeepsakeStore();

  return (
    <div className="flex flex-col gap-12" data-testid="quote-feed">
      {quotes.map((quote) => (
        <article key={quote.id} className="group flex flex-col gap-2 items-start text-left">
          <time className="text-sm text-charcoal-ink/60 font-serif italic">
            {getRelativeTime(quote.timestamp)}
          </time>
          <p className="text-xl md:text-2xl font-normal leading-snug text-charcoal-ink">
            {quote.text}
          </p>
        </article>
      ))}
    </div>
  );
}
