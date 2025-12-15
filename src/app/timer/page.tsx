'use client';

// Corrected import path:
// Go up two directories (from app/timer/ to project root)
// then down into src/components/training/
import TrainingTimer from '@/components/training/TrainingTimer';

export default function MyComponent() {
  // Use Tailwind for basic centering, since this is a client component wrapper
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <TrainingTimer />
    </div>
  );
}