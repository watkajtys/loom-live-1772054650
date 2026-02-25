import { useState } from 'react';
import { useStore, type Thread } from '../../store';
import { useDraggable } from '@dnd-kit/core';

function DraggableThread({ thread }: { thread: Thread }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: thread.id,
    data: { thread },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000,
    opacity: isDragging ? 0.8 : 1,
  } : undefined;

  const borderColor = {
    'cyber-cyan': 'border-cyber-cyan',
    'cyber-magenta': 'border-cyber-magenta',
    'cyber-yellow': 'border-cyber-yellow',
  }[thread.category];

  const groupHoverColor = {
    'cyber-cyan': 'group-hover:text-cyber-cyan',
    'cyber-magenta': 'group-hover:text-cyber-magenta',
    'cyber-yellow': 'group-hover:text-cyber-yellow',
  }[thread.category];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative p-3 bg-white/5 border-l-2 ${borderColor} hover:bg-white/10 cursor-grab active:cursor-grabbing transition-all flex gap-3 items-center`}
    >
      <div className="flex-1">
        <h4 className="text-sm font-bold text-white font-display uppercase tracking-wide">{thread.title}</h4>
        <p className="text-xs text-white/40 font-mono mt-1">{thread.duration} MIN // {thread.description || 'TASK'}</p>
      </div>
      <span className={`material-symbols-outlined text-white/20 ${groupHoverColor}`}>drag_indicator</span>
    </div>
  );
}

export default function ThreadSpool() {
  const threads = useStore((state) => state.threads);
  const addThread = useStore((state) => state.addThread);
  const bufferedThreads = threads.filter((t) => t.startTime === null);

  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('60');
  const [newCategory, setNewCategory] = useState<Thread['category']>('cyber-cyan');

  const handleAddThread = () => {
    if (!newTitle.trim()) return;
    addThread({
      title: newTitle,
      duration: parseInt(newDuration, 10) || 60,
      category: newCategory,
      startTime: null,
      description: 'NEW_THREAD',
    });
    setNewTitle('');
    setNewDuration('60');
  };

  const indicatorColor = {
    'cyber-cyan': 'bg-cyber-cyan',
    'cyber-magenta': 'bg-cyber-magenta',
    'cyber-yellow': 'bg-cyber-yellow',
  }[newCategory];

  return (
    <aside className="thread-spool h-full bg-panel-bg border-r border-panel-border flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.5)] absolute md:relative">
       {/* Left Icon Bar */}
      <div className="w-16 flex flex-col items-center py-6 gap-8 bg-panel-bg/50 backdrop-blur-sm z-20 absolute top-0 bottom-0 left-0 border-r border-white/5">
        <div className="size-10 flex items-center justify-center text-cyber-cyan">
          <span className="material-symbols-outlined text-3xl drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">all_inclusive</span>
        </div>
        
        <div className="flex flex-col gap-6 mt-4 w-full items-center">
            {/* Add / Reset Form */}
            <button 
                onClick={() => { setNewTitle(''); setNewDuration('60'); setNewCategory('cyber-cyan'); }} 
                className="size-10 flex items-center justify-center transition-all duration-300 rounded-none border border-transparent text-cyber-cyan/50 hover:text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan/30"
                title="New Thread"
            >
                <span className="material-symbols-outlined">add</span>
            </button>
            
            <div className="w-8 h-px bg-white/10"></div>
            
            {/* Magenta / Work */}
            <button 
                onClick={() => setNewCategory('cyber-magenta')} 
                className={`size-10 flex items-center justify-center transition-all duration-300 rounded-none border ${newCategory === 'cyber-magenta' ? 'bg-cyber-magenta text-black border-cyber-magenta shadow-[0_0_15px_rgba(255,0,85,0.6)]' : 'border-transparent text-cyber-magenta/50 hover:text-cyber-magenta hover:bg-cyber-magenta/10'}`}
            >
                <span className="material-symbols-outlined">work</span>
            </button>
            
            {/* Cyan / Groups */}
            <button 
                onClick={() => setNewCategory('cyber-cyan')} 
                className={`size-10 flex items-center justify-center transition-all duration-300 rounded-none border ${newCategory === 'cyber-cyan' ? 'bg-cyber-cyan text-black border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.6)]' : 'border-transparent text-cyber-cyan/50 hover:text-cyber-cyan hover:bg-cyber-cyan/10'}`}
            >
                <span className="material-symbols-outlined">groups</span>
            </button>
            
            {/* Yellow / Fitness */}
            <button 
                onClick={() => setNewCategory('cyber-yellow')} 
                className={`size-10 flex items-center justify-center transition-all duration-300 rounded-none border ${newCategory === 'cyber-yellow' ? 'bg-cyber-yellow text-black border-cyber-yellow shadow-[0_0_15px_rgba(252,238,10,0.6)]' : 'border-transparent text-cyber-yellow/50 hover:text-cyber-yellow hover:bg-cyber-yellow/10'}`}
            >
                <span className="material-symbols-outlined">fitness_center</span>
            </button>
        </div>
        
        <div className="mt-auto mb-4">
          <button className="size-10 flex items-center justify-center text-white/30 hover:text-cyber-cyan hover:rotate-90 transition-all duration-500">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-16 w-[320px] h-full flex flex-col bg-panel-bg border-r border-cyber-cyan/20">
        <div className="spool-content h-full flex flex-col p-6">
          <div className="mb-8 border-b border-white/10 pb-4">
            <h1 className="text-white text-2xl font-bold uppercase tracking-widest font-display glitch-text cursor-default">Loominal</h1>
            <p className="text-cyber-cyan text-xs font-mono tracking-tighter">SYS.THREAD_SPOOL.V2</p>
          </div>
          
          {/* Add Thread Form */}
          <div className="flex flex-col gap-4 mb-8">
            <label className="text-cyber-cyan text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
              <span className={`w-2 h-2 ${indicatorColor} shadow-[0_0_8px_currentColor]`}></span> Initialize Thread
            </label>
            <div className="relative">
              <input 
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/20 p-3 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all rounded-none corner-cut mb-2" 
                placeholder="TASK_TITLE..." 
              />
              <div className="flex gap-2">
                  <input 
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-1/3 bg-black/40 border border-white/20 p-2 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all rounded-none" 
                    placeholder="MIN" 
                  />
                  <div className="flex-1 flex items-center px-2 text-xs text-white/40 font-mono uppercase border border-white/10 bg-white/5">
                    Mode: {newCategory.split('-')[1].toUpperCase()}
                  </div>
              </div>
              <div className="absolute -right-1 -bottom-1 w-3 h-3 border-r border-b border-cyber-cyan"></div>
            </div>
            <button 
                onClick={handleAddThread}
                className="w-full py-2 bg-cyber-cyan/10 border border-cyber-cyan/50 text-cyber-cyan font-mono text-xs hover:bg-cyber-cyan hover:text-black transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-2 group"
            >
              Execute <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
            </button>
          </div>

          {/* Buffered Threads List */}
          <div className="flex flex-col gap-4 flex-1 overflow-y-auto cyber-scrollbar pr-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-white/50 text-xs font-mono uppercase">Buffer Zone</span>
              <span className="text-cyber-cyan text-xs font-mono">[{bufferedThreads.length}]</span>
            </div>
            {bufferedThreads.map(thread => (
                <DraggableThread key={thread.id} thread={thread} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
