import { type CSSProperties } from 'react';
import { type Thread } from '../store';

export interface ThreadWithLayout extends Thread {
  style: CSSProperties;
  layoutClass: string;
  colIndex: number;
  svgLeft: number;
  svgWidth: number;
}

// Layout algorithm for overlapping threads
export const calculateThreadLayout = (threads: Thread[]): ThreadWithLayout[] => {
  if (threads.length === 0) return [];

  const sorted = [...threads].sort((a, b) => (a.startTime || 0) - (b.startTime || 0));

  const groups: ThreadWithLayout[][] = [];
  let currentGroup: ThreadWithLayout[] = [];
  let groupEndTime = -1;

  for (const thread of sorted) {
    if (currentGroup.length === 0) {
      currentGroup.push({ ...thread, style: {}, layoutClass: '', colIndex: 0 } as ThreadWithLayout);
      groupEndTime = thread.startTime! + thread.duration;
    } else {
       if (thread.startTime! < groupEndTime) {
         currentGroup.push({ ...thread, style: {}, layoutClass: '', colIndex: 0 } as ThreadWithLayout);
         groupEndTime = Math.max(groupEndTime, thread.startTime! + thread.duration);
       } else {
         groups.push(currentGroup);
         currentGroup = [{ ...thread, style: {}, layoutClass: '', colIndex: 0 } as ThreadWithLayout];
         groupEndTime = thread.startTime! + thread.duration;
       }
    }
  }
  if (currentGroup.length > 0) groups.push(currentGroup);

  const finalResult: ThreadWithLayout[] = [];

  for (const group of groups) {
    // Assign columns within group
    const groupColumns: ThreadWithLayout[][] = [];
    for (const thread of group) {
       let placed = false;
       for (let i = 0; i < groupColumns.length; i++) {
         const col = groupColumns[i];
         const last = col[col.length - 1];
         if ((last.startTime! + last.duration) <= thread.startTime!) {
           col.push(thread);
           thread.colIndex = i;
           placed = true;
           break;
         }
       }
       if (!placed) {
         groupColumns.push([thread]);
         thread.colIndex = groupColumns.length - 1;
       }
    }
    
    const numCols = groupColumns.length;
    for (const thread of group) {
      let style: CSSProperties = {
        top: `${thread.startTime}px`,
        height: `${thread.duration}px`,
        zIndex: thread.title === 'Frontend Impl.' ? 40 : (thread.colIndex > 0 ? 20 : 10),
      };
      let layoutClass = 'cyber-ribbon';
      let svgLeft = 0;
      let svgWidth = 100;

      if (numCols === 1) {
        style = { ...style, left: '1.5rem', right: '2.5rem' }; // Standard margins
        svgLeft = 0;
        svgWidth = 100;
      } else if (numCols === 2) {
        if (thread.colIndex === 0) {
          // Left column
          style = { ...style, left: '2rem', right: '50%', marginRight: '1rem' };
          layoutClass = 'cyber-ribbon-reverse';
          svgLeft = 0;
          svgWidth = 50;
        } else {
          // Right column
          style = { ...style, left: '50%', right: '1rem', marginLeft: '-1.25rem' };
          layoutClass = 'cyber-ribbon';
          svgLeft = 50;
          svgWidth = 50;
        }
      } else {
        // Fallback for > 2 columns (simple split)
        const width = 100 / numCols;
        const left = thread.colIndex * width;
        style = { ...style, left: `${left}%`, width: `${width}%` };
        svgLeft = left;
        svgWidth = width;
      }

      thread.style = style;
      thread.layoutClass = layoutClass;
      thread.svgLeft = svgLeft;
      thread.svgWidth = svgWidth;
      finalResult.push(thread);
    }
  }

  return finalResult;
};
