import { useAgentBuilder } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/label';
import { Bot, CheckCircle, Circle } from 'lucide-react';
import type { MemoryType } from '@/lib/types';

const workflowSteps = [
  { id: 1, name: 'Identity', completed: true },
  { id: 2, name: 'Memory Types', completed: true },
  { id: 3, name: 'Skills', completed: true },
  { id: 4, name: 'MCP Tools', completed: true },
  { id: 5, name: 'Connections', completed: true },
  { id: 6, name: 'Memory Config', completed: false },
  { id: 7, name: 'Guardrails', completed: false },
];

const memoryTypes: Array<{ key: MemoryType; title: string; description: string }> = [
  {
    key: 'shortTerm',
    title: 'Short-Term Memory',
    description: 'Stores recent conversation context for immediate reference',
  },
  {
    key: 'episodic',
    title: 'Episodic Memory',
    description: 'Stores specific events and experiences with temporal context',
  },
  {
    key: 'procedural',
    title: 'Procedural Memory',
    description: 'Stores learned procedures, workflows, and action sequences',
  },
  {
    key: 'semantic',
    title: 'Semantic Memory',
    description: 'Stores facts, knowledge, and conceptual information',
  },
  {
    key: 'policy',
    title: 'Policy Memory',
    description: 'Stores rules, guidelines, and behavioral constraints',
  },
];

export function Phase3Dashboard() {
  const { phase3, agentSpec, updateMemoryConfig } = useAgentBuilder();

  return (
    <div className="flex h-screen bg-background">
      {/* Workflow Sidebar */}
      <div className="w-60 border-r border-sidebar-border bg-sidebar p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 pb-4 border-b border-sidebar-border">
          <Bot className="w-6 h-6 text-primary" />
          <span className="font-primary font-semibold text-sidebar-foreground">Agent Builder</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Step {phase3.currentStep} of 7</span>
          <span className="text-muted-foreground">85% complete</span>
        </div>

        <div className="flex-1 space-y-1 py-4">
          {workflowSteps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                step.id === phase3.currentStep
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground'
              }`}
            >
              {step.completed ? (
                <CheckCircle className="w-4 h-4 text-success-foreground" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
              <span>{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Configure how your agent remembers and recalls information across different contexts.
            </p>
          </div>

          <div className="space-y-4">
            {memoryTypes.map((memory) => {
              const config = agentSpec.memory[memory.key];

              return (
                <Card key={memory.key} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold">{memory.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{memory.description}</p>
                      </div>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(checked) =>
                          updateMemoryConfig(memory.key, { enabled: checked })
                        }
                      />
                    </div>

                    {config.enabled && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <div>
                          <label className="text-xs text-muted-foreground">Retention Days</label>
                          <input
                            type="number"
                            value={config.retentionDays || 30}
                            onChange={(e) =>
                              updateMemoryConfig(memory.key, {
                                retentionDays: parseInt(e.target.value),
                              })
                            }
                            className="mt-1 w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Max Entries</label>
                          <input
                            type="number"
                            value={config.maxEntries || 1000}
                            onChange={(e) =>
                              updateMemoryConfig(memory.key, {
                                maxEntries: parseInt(e.target.value),
                              })
                            }
                            className="mt-1 w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agent Summary Panel */}
      <div className="w-70 border-l border-border bg-card p-6 flex flex-col gap-4 overflow-y-auto">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">{agentSpec.identity.name || 'My Agent'}</p>
              <p className="text-xs text-muted-foreground">{agentSpec.identity.persona}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">PERSONA</p>
            <Badge variant="success">{agentSpec.identity.persona}</Badge>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">OBJECTIVE</p>
            <p className="text-xs">{agentSpec.identity.objective || 'Not set'}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">MEMORY TYPES</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(agentSpec.memory).map(([key, value]) =>
                value.enabled ? (
                  <Badge key={key} variant="secondary">
                    {key}
                  </Badge>
                ) : null
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">GUARDRAILS</p>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-success-foreground" />
                <span>Content filtering enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-success-foreground" />
                <span>Rate limiting configured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
