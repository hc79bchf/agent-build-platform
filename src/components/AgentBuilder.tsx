import { useAgentBuilder } from '@/lib/store';
import { Phase1Chatbot } from './phases/Phase1Chatbot';
import { Phase2Diagram } from './phases/Phase2Diagram';
import { Phase3Dashboard } from './phases/Phase3Dashboard';

export function AgentBuilder() {
  const { currentPhase } = useAgentBuilder();

  return (
    <div className="dark bg-background min-h-screen">
      {currentPhase === 1 && <Phase1Chatbot />}
      {currentPhase === 2 && <Phase2Diagram />}
      {currentPhase === 3 && <Phase3Dashboard />}
    </div>
  );
}
