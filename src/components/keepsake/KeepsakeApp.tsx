import CaptureInput from './CaptureInput';
import MemoryFeed from './MemoryFeed';

export default function KeepsakeApp() {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-parchment bg-[image:var(--background-image-paper-texture)] font-serif text-charcoal-ink antialiased selection:bg-faded-sand selection:text-charcoal-ink flex flex-col items-center">
      <main className="w-full max-w-xl mx-auto px-6 py-24 flex flex-col gap-12">
        <CaptureInput />
        <MemoryFeed />
      </main>
    </div>
  );
}
