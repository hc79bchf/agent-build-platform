import { useAgentBuilder } from '@/lib/store';

const phases = [
  { id: 1 as const, label: 'Discovery' },
  { id: 2 as const, label: 'Diagram' },
  { id: 3 as const, label: 'Config' },
];

export function PhaseNav() {
  const { currentPhase, setPhase } = useAgentBuilder();

  return (
    <div className="flex gap-0.5 p-0.5 rounded-md bg-sidebar-accent/30">
      {phases.map((phase) => {
        const isActive = currentPhase === phase.id;
        return (
          <button
            key={phase.id}
            onClick={() => setPhase(phase.id)}
            className={`flex-1 min-w-0 py-1.5 rounded text-[11px] font-medium text-center transition-colors cursor-pointer truncate ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            {phase.label}
          </button>
        );
      })}
    </div>
  );
}
