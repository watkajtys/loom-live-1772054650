import { useStore } from '../../store';
import { useDroppable } from '@dnd-kit/core';
import { useMemo } from 'react';
import { calculateThreadLayout, type ThreadWithLayout } from '../../utils/layoutUtils';

// Helper to format time
const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}${m.toString().padStart(2, '0')}`;
};


function BoardThread({ thread, isActive }: { thread: ThreadWithLayout; isActive: boolean }) {
  const colors = {
    'cyber-cyan': { bg: 'bg-cyber-cyan/10', border: 'border-cyber-cyan', text: 'text-cyber-cyan', indicator: 'bg-cyber-cyan' },
    'cyber-magenta': { bg: 'bg-cyber-magenta/10', border: 'border-cyber-magenta', text: 'text-cyber-magenta', indicator: 'bg-cyber-magenta' },
    'cyber-yellow': { bg: 'bg-cyber-yellow/10', border: 'border-cyber-yellow', text: 'text-cyber-yellow', indicator: 'bg-cyber-yellow' },
  }[thread.category];

  const isFrontendImpl = thread.title === 'Frontend Impl.';
  const isProjectAlpha = thread.title.includes('Project Alpha'); // Or rely on ID/duration
  const displayActive = isActive || isFrontendImpl;

  const patternStyle = thread.category === 'cyber-cyan' 
    ? { backgroundImage: "radial-gradient(circle at 2px 2px, rgba(0,240,255,1) 1px, transparent 0)", backgroundSize: "20px 20px", opacity: 0.1 }
    : thread.category === 'cyber-magenta'
      ? { backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDU1IiAvPgo8cGF0aCBkPSJNLTQgOEw4IC00IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=')", opacity: 0.2 }
      : { backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 8px)" };

  return (
    <div
      style={thread.style}
      className={`absolute px-1 group cursor-pointer hover:z-50 transition-all origin-left ${thread.layoutClass} ${isProjectAlpha ? 'hover:bg-cyber-magenta/20' : ''}`}
    >
        <div className={`relative w-full h-full overflow-hidden backdrop-blur-sm transition-all group-hover:bg-opacity-30 ${isFrontendImpl ? 'bg-gradient-to-r from-cyber-cyan/20 to-blue-900/40' : colors.bg}`}>
            {/* Border Left/Right handled by ribbon classes or internal border */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.indicator}`}></div>
            
            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none" style={patternStyle}></div>

            <div className={`relative p-2 h-full flex flex-col ${isProjectAlpha || isFrontendImpl ? 'pl-8' : 'pl-4'}`}>
                <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-white font-bold text-xs uppercase tracking-wider font-display drop-shadow-md truncate leading-tight">{thread.title}</h3>
                        {!isFrontendImpl && <p className={`${colors.text} text-[9px] mt-0.5 font-mono tracking-tight truncate opacity-80`}>{thread.description || 'ACTIVE_THREAD'}</p>}
                        {isFrontendImpl && <p className="text-cyan-200/60 text-[9px] mt-0.5 font-mono tracking-tight truncate opacity-80">{thread.description}</p>}
                    </div>
                    {displayActive && (
                        <span className={`flex-shrink-0 ml-1 px-1.5 py-0.5 ${isFrontendImpl ? 'text-cyber-cyan border border-cyber-cyan bg-transparent' : 'bg-cyber-magenta text-black'} text-[9px] font-bold font-mono animate-pulse rounded-sm`}>
                            RUNNING
                        </span>
                    )}
                </div>

                {isFrontendImpl ? (
                    <>
                        <div className="w-full bg-black/50 h-1 mt-auto mb-2 relative overflow-hidden">
                            <div className="absolute top-0 left-0 h-full w-[65%] bg-cyber-cyan shadow-[0_0_10px_#00f0ff]"></div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="flex -space-x-2">
                                <div className="size-4 border border-cyber-cyan bg-slate-800 bg-center bg-cover grayscale group-hover:grayscale-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYcrXwUFdeiewT9s5Kvnqqd6alj_zNs-eg8kBL98eTl7fJDgbZFU5c3rmS5McE-vsiq_hWWNv1fYgKlYE2oRLzFJI4-5H1WNJAho_LZt26G_11KIYzMKsc82Svc1Vb9LfKJczyqp1A71czgwlZ_1g4L_mXe_nHiuYCULcq9bkuLS3E85_EfsjPDZ2er7rwfAvD3ryLGZjfBnVkpwe5KHmzjN8MZI37kZg2LJBj6pcKvv7EJFFjpl3RbOhfcASeuL3-YyJdhkUGim8')", transform: "skewX(-15deg)" }}></div>
                                <div className="size-4 border border-cyber-cyan bg-slate-800 bg-center bg-cover grayscale group-hover:grayscale-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDrPe6pUPkfZYi2EAsikd2c3ghaxamxnjRnCIi9lLNQ3sffHMz7Po4kK185EPr8E-RmRF4KsNBmhdN97C_XtcB60ivAvtBrRmAJHScEKKu34ml-A9A-93bvbBygKOdAmchMcqkBDx0kXikv10tS69vk18Owl8c-6lKktU8AT2LxufdNtlXs3CWnisr9jATJoam42f5KEO7SXlsT6UuvkyRrDMAYIRJUUcM-zvMovt1RuykJtkSz72aPpTgEwyJV0t_zW7GT2YwNdfs')", transform: "skewX(-15deg)" }}></div>
                            </div>
                            <div className="text-[8px] text-cyber-cyan font-mono">STATUS: COMPILING...</div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-between mt-auto pt-2">
                         {/* Only show time range for Project Alpha or long tasks */}
                         {isProjectAlpha ? (
                            <span className="bg-black/60 text-cyber-magenta text-[9px] px-2 py-0.5 border border-cyber-magenta/30 font-mono">
                                {formatTime(thread.startTime!)} - {formatTime(thread.startTime! + thread.duration)}
                            </span>
                         ) : (
                            <span></span>
                         )}
                        
                        {/* Avatar */}
                        {isProjectAlpha ? (
                             <div className="flex -space-x-3">
                                <div 
                                    className="size-8 border-2 border-black bg-slate-700 bg-center bg-cover grayscale group-hover:grayscale-0 transition-all" 
                                    style={{ 
                                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBHkkUmEf5zaPERwUWT8VHLpf9k0Q5xGOxYLvQrqcWiWEQ7QqdIrugSUrhvAF0GQHujf-P26M91ZuSoNPKMX0uadGHNywX6cWZuqgav1jmO7Wvp9Pm82_vUk-5z8djgN3QITCNJOIT91CCjADPAxwxCqmRMulsoTdfNt-C-kTBXxkwSoF0jrmVzj0V7y4qft9P63ihcuJfwLJYy2sTnUu4xmPU7ihVls-qdnKoEZ0kPV9TC8Eq4SUlK71CuweR3fIZcR_spRY28rD4')",
                                        clipPath: "polygon(20% 0, 100% 0, 80% 100%, 0% 100%)"
                                    }}
                                ></div>
                            </div>
                        ) : (
                            // Use hidden or different avatar for others if needed, but for now only Project Alpha has explicit design
                            <div className="size-6 rounded-full border border-white/20 overflow-hidden bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <img 
                                    src={`https://i.pravatar.cc/150?u=${thread.id}`} 
                                    alt="U" 
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}

export default function LoomBoard() {
  const threads = useStore((state) => state.threads);
  const activeThreads = threads.filter((t) => t.startTime !== null);
  const { setNodeRef } = useDroppable({
    id: 'loom-board',
  });

  // Calculate layout
  const layoutThreads = useMemo(() => calculateThreadLayout(activeThreads), [activeThreads]);

  // Current time simulation (approx 10:15 AM = 615 mins)
  const currentTime = 615;

  const generateMarkers = () => {
    const markers = [];
    for (let i = 0; i < 24; i++) {
      const isCurrentHour = Math.floor(currentTime / 60) === i;
      markers.push(
        <div key={i} className={`absolute w-full text-right pr-4 text-xs font-mono ${isCurrentHour ? 'text-cyber-cyan font-bold' : (i >= 8 && i <= 17 ? 'text-white/40' : 'text-white/10')}`} style={{ top: `${i * 60}px` }}>
          {i.toString().padStart(2, '0')}00
        </div>
      );
    }
    return markers;
  };

    const handleSeverThreads = () => {
        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1440" viewBox="0 0 800 1440" style="background-color: #05050a; font-family: monospace;">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 240, 255, 0.1)" stroke-width="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                ${layoutThreads.map(t => {
                    const color = t.category === 'cyber-cyan' ? '#00f0ff' : t.category === 'cyber-magenta' ? '#ff0055' : '#fcee0a';
                    // Calculate position based on layout (total width 600px starting at x=100)
                    const xPos = 100 + (t.svgLeft / 100) * 600;
                    const width = (t.svgWidth / 100) * 600;
                    
                    return `
                        <g transform="translate(${xPos}, ${t.startTime})">
                            <rect width="${width}" height="${t.duration}" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2" />
                            <text x="10" y="20" fill="white" font-size="14" font-weight="bold" clip-path="inset(0 0 0 0)">${t.title}</text>
                            <text x="10" y="40" fill="${color}" font-size="10">${formatTime(t.startTime!)} - ${formatTime(t.startTime! + t.duration)}</text>
                        </g>
                    `;
                }).join('')}
            </svg>
        `;
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `loominal-export-${new Date().toISOString().split('T')[0]}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    };

  return (
    <main className="flex-1 flex flex-col h-full bg-deep-void relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-deep-void via-transparent to-deep-void pointer-events-none"></div>
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-deep-void/90 backdrop-blur-md z-30 sticky top-0">
          <div className="flex items-center gap-6">
            <div className="flex gap-1">
              <button className="size-8 flex items-center justify-center border border-white/10 text-white/60 hover:text-cyber-cyan hover:border-cyber-cyan transition-all">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="size-8 flex items-center justify-center border border-white/10 text-white/60 hover:text-cyber-cyan hover:border-cyber-cyan transition-all">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest font-display">Cycle: Today</h2>
              <p className="text-[10px] text-cyber-cyan font-mono">TUE 24 OCT // 14:35:22</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-black/50 border border-white/10 skew-x-[-12deg]">
              <span className="material-symbols-outlined text-white/40 text-sm skew-x-[12deg]">search</span>
              <input className="bg-transparent border-none text-sm text-white placeholder:text-white/30 focus:ring-0 w-48 p-0 font-mono skew-x-[12deg]" placeholder="SCAN_THREADS..." type="text" />
            </div>
            <button 
                onClick={handleSeverThreads}
                className="relative px-6 py-2 bg-transparent text-cyber-yellow text-sm font-bold font-mono tracking-widest uppercase border border-cyber-yellow/30 hover:bg-cyber-yellow/10 hover:border-cyber-yellow hover:shadow-[0_0_15px_rgba(252,238,10,0.4)] transition-all group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">content_cut</span>
                Sever Threads
              </span>
              <div className="absolute inset-0 bg-cyber-yellow/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto cyber-scrollbar relative">
          <div className="flex min-h-[1440px] relative pb-20">
            <div className="w-20 flex-shrink-0 border-r border-white/10 bg-panel-bg z-10">
              <div className="relative h-full pt-2">
                {generateMarkers()}
              </div>
            </div>
            <div ref={setNodeRef} id="timeline-container" className="flex-1 relative pr-12">
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "100% 60px" }}></div>
              
              {/* NOW Indicator (Hardcoded for visual at 10:15 AM) */}
              <div className="absolute top-[615px] left-0 w-full flex items-center z-40 pointer-events-none">
                <div className="absolute -left-1.5 size-3 bg-cyber-magenta shadow-[0_0_10px_#ff0055] rotate-45"></div>
                <div className="h-[1px] w-full bg-cyber-magenta shadow-[0_0_8px_#ff0055]"></div>
                <div className="absolute right-0 bg-cyber-magenta text-black text-[10px] font-bold px-1 font-mono">NOW</div>
              </div>

              {layoutThreads.map(thread => {
                  const isActive = currentTime >= thread.startTime! && currentTime < (thread.startTime! + thread.duration);
                  return <BoardThread key={thread.id} thread={thread} isActive={isActive} />;
              })}
              
            </div>
          </div>
        </div>
      </main>
  );
}
