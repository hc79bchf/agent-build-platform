import { useAgentBuilder } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/label';
import { Bot, Brain, Zap, Plug, Users, Shield, CheckCircle } from 'lucide-react';

const nodeConfig = [
  { id: 'memory', label: 'Memory Systems', icon: Brain, color: 'text-purple-500', count: 5, x: 120, y: 180 },
  { id: 'skills', label: 'Skills', icon: Zap, color: 'text-green-500', count: 2, x: 540, y: 180 },
  { id: 'mcp', label: 'MCP Tools', icon: Plug, color: 'text-blue-500', count: 3, x: 120, y: 580 },
  { id: 'a2a', label: 'A2A Connections', icon: Users, color: 'text-orange-500', count: 1, x: 540, y: 580 },
  { id: 'guardrails', label: 'Guardrails', icon: Shield, color: 'text-red-500', count: 4, x: 680, y: 380 },
];

export function Phase2Diagram() {
  const { phase2, agentSpec, selectNode, nextPhase } = useAgentBuilder();

  return (
    <div className="flex h-screen bg-background">
      {/* Components Panel */}
      <div className="w-70 border-r border-sidebar-border bg-sidebar p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-4 border-b border-sidebar-border">
          <Bot className="w-6 h-6 text-primary" />
          <span className="font-primary font-semibold text-sidebar-foreground">Agent Builder</span>
        </div>

        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">{agentSpec.identity.name || 'My Agent'}</p>
              <p className="text-xs text-muted-foreground">{agentSpec.identity.persona}</p>
            </div>
          </div>
        </Card>

        <div className="flex-1 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">COMPONENTS</p>
          {nodeConfig.map((node) => (
            <div key={node.id} className="text-sm">
              <div className="flex items-center justify-between">
                <span className="text-sidebar-foreground">{node.label}</span>
                <Badge variant="secondary">{node.count}</Badge>
              </div>
            </div>
          ))}
        </div>

        <Card className="p-3 bg-success/10 border-success">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success-foreground" />
            <div>
              <p className="text-xs font-semibold text-success-foreground">Validated</p>
              <p className="text-xs text-muted-foreground">Architecture is complete</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Diagram Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-border flex items-center justify-between px-6">
          <h2 className="text-base font-semibold">Agent Architecture Diagram</h2>
        </div>

        <div className="flex-1 relative bg-black/95 overflow-hidden">
          {/* Central Agent Node */}
          <div
            className="absolute bg-primary rounded-xl flex flex-col items-center justify-center gap-2 p-4 cursor-pointer hover:bg-primary/90 transition-colors"
            style={{ width: 180, height: 100, left: 330, top: 380 }}
          >
            <Bot className="w-8 h-8 text-primary-foreground" />
            <span className="text-xs font-semibold text-primary-foreground text-center">
              {agentSpec.identity.name || 'Sales Enablement Agent'}
            </span>
          </div>

          {/* Component Nodes */}
          {nodeConfig.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className={`absolute bg-card border-2 rounded-lg flex flex-col items-center justify-center gap-2 p-3 cursor-pointer hover:bg-card/80 transition-colors ${
                  phase2.selectedNode === node.id ? 'ring-2 ring-primary' : ''
                }`}
                style={{ width: 140, height: 80, left: node.x, top: node.y }}
                onClick={() => selectNode(node.id)}
              >
                <Icon className={`w-6 h-6 ${node.color}`} />
                <span className="text-xs font-medium text-center">{node.label}</span>
                <span className="text-xs text-muted-foreground">{node.count} {node.id}</span>
              </div>
            );
          })}

          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none">
            <line x1="260" y1="260" x2="330" y2="420" stroke="#9333ea" strokeWidth="2" />
            <line x1="480" y1="260" x2="420" y2="420" stroke="#22c55e" strokeWidth="2" />
            <line x1="260" y1="580" x2="330" y2="460" stroke="#3b82f6" strokeWidth="2" />
            <line x1="480" y1="580" x2="420" y2="460" stroke="#f97316" strokeWidth="2" />
            <line x1="590" y1="430" x2="680" y2="430" stroke="#ef4444" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Details Panel */}
      <div className="w-75 border-l border-border bg-card p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold">Component Details</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {phase2.selectedNode ? 'View configuration' : 'Click a node to view details'}
          </p>
        </div>

        {phase2.selectedNode && (
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs font-semibold text-primary mb-2">SELECTED</p>
              <Card className="p-3 border-primary">
                <p className="text-sm font-semibold">
                  {nodeConfig.find((n) => n.id === phase2.selectedNode)?.label}
                </p>
              </Card>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">CONFIGURATION</p>
              <div className="text-xs space-y-2">
                <p>• Component is configured</p>
                <p>• All connections validated</p>
                <p>• Ready for deployment</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button variant="outline" className="w-full" disabled>
            Edit Configuration
          </Button>
          <Button className="w-full" onClick={nextPhase}>
            Continue to Config
          </Button>
        </div>
      </div>
    </div>
  );
}
