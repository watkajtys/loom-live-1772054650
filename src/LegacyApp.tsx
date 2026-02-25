import { DndContext, type DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import LoomBoard from './components/legacy/LoomBoard';
import ThreadSpool from './components/legacy/ThreadSpool';
import { useStore } from './store';
import './App.css';

function LegacyApp() {
  const setThreadTime = useStore((state) => state.setThreadTime);
  const threads = useStore((state) => state.threads);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // If dropped over the LoomBoard (id: loom-board)
    if (over.id === 'loom-board') {
      const threadId = active.id as string;
      const thread = threads.find((t) => t.id === threadId);
      if (!thread) return;

      // Get the timeline container rect
      const timelineContainer = document.getElementById('timeline-container');
      if (!timelineContainer) return;
      
      const timelineRect = timelineContainer.getBoundingClientRect();
      
      // Calculate drop Y relative to the timeline container
      // active.rect.current.translated is the final position of the dragged item
      const activeRect = active.rect.current?.translated;
      if (!activeRect) return;

      const relativeY = activeRect.top - timelineRect.top;
      
      // Convert to minutes (1px = 1min)
      // Add scroll offset if container is scrolled
      // Actually timelineContainer.getBoundingClientRect().top accounts for scroll of its parent if it's visible
      // Wait, if the container is scrolled, rect.top moves up.
      // relativeY = activeRect.top - timelineRect.top.
      // If I scrolled down 100px, timelineRect.top is smaller (higher up).
      // So relativeY becomes larger. This seems correct.
      // However, if the dragged item is in a fixed position overlay, activeRect.top is viewport relative.
      // timelineRect.top is viewport relative.
      // So relativeY is the visual distance from the top of the container.
      // But if the container is scrolled, the content inside is shifted.
      // Wait, LoomBoard structure:
      // <div class="flex-1 overflow-y-auto ... relative">
      //   <div class="flex min-h-[1440px] ...">
      //     <div id="timeline-container" ...>
      // The scroll happens on the wrapper div.
      // The timeline container is inside the scrollable area.
      // If I scroll down, timelineContainer moves up.
      // So timelineRect.top decreases.
      // activeRect.top is where I dropped it on screen.
      // relativeY = activeRect.top - timelineRect.top increases.
      // This maps correctly to the Y coordinate *inside* the timeline container.
      
      let newStartTime = Math.round(relativeY);
      
      // Clamp to valid range (0 to 1440 - duration)
      newStartTime = Math.max(0, Math.min(1440 - thread.duration, newStartTime));
      
      // Snap to 15 minutes
      newStartTime = Math.round(newStartTime / 15) * 15;

      setThreadTime(threadId, newStartTime);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-deep-void">
        <ThreadSpool />
        <LoomBoard />
      </div>
    </DndContext>
  );
}

export default LegacyApp;
