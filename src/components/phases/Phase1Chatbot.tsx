import { useState } from 'react';
import { useAgentBuilder } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Bot, Send } from 'lucide-react';

const discoverySections = [
  { id: 1, name: 'Identity', icon: 'user' },
  { id: 2, name: 'Memory', icon: 'brain' },
  { id: 3, name: 'Skills', icon: 'zap' },
  { id: 4, name: 'MCP Tools', icon: 'plug' },
  { id: 5, name: 'Connections', icon: 'users' },
  { id: 6, name: 'Guardrails', icon: 'shield' },
  { id: 7, name: 'Review', icon: 'check-circle' },
];

export function Phase1Chatbot() {
  const { phase1, agentSpec, addMessage, nextPhase, updateIdentity } = useAgentBuilder();
  const [inputValue, setInputValue] = useState('');

  const currentSection = phase1.currentSection;
  const progressPercent = (currentSection / 7) * 100;

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    });

    // Simple demo logic - update spec based on section
    if (currentSection === 1 && !agentSpec.identity.name) {
      updateIdentity({ name: inputValue });
    }

    // Add bot response
    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: `Got it! Let's move on to the next section.`,
        timestamp: new Date(),
      });
    }, 500);

    setInputValue('');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Progress Sidebar */}
      <div className="w-60 border-r border-sidebar-border bg-sidebar p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-primary" />
            <span className="font-primary font-semibold text-sidebar-foreground">Agent Builder</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step {currentSection} of 7</span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>

        <div className="flex-1 flex flex-col gap-1">
          {discoverySections.map((section) => (
            <div
              key={section.id}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                section.id === currentSection
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              {section.name}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-border flex items-center px-6">
          <h2 className="text-base font-semibold">Let's configure your agent's specifications</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {phase1.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-2xl rounded-lg p-4 ${
                  message.role === 'bot'
                    ? 'bg-card border border-border'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.options && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.options.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        size="default"
                        onClick={() => setInputValue(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-6">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your response..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Press Enter to send or click the options above to make quick selections
          </p>
        </div>
      </div>

      {/* Specification Preview */}
      <div className="w-90 border-l border-border bg-card p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold">Agent Specification</h3>
          <p className="text-xs text-muted-foreground mt-1">Live preview of collected data</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-2">Identity</h4>
            <div className="text-xs space-y-1">
              <p><span className="text-muted-foreground">Name:</span> {agentSpec.identity.name || 'Not set'}</p>
              <p><span className="text-muted-foreground">Persona:</span> {agentSpec.identity.persona}</p>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-2">Memory</h4>
            <div className="text-xs space-y-1">
              {Object.entries(agentSpec.memory).map(([key, value]) => (
                <p key={key}>
                  <span className="text-muted-foreground">{key}:</span> {value.enabled ? 'Enabled' : 'Disabled'}
                </p>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <Button className="w-full" onClick={nextPhase}>
            Continue to Design Diagram
          </Button>
          <Button variant="outline" className="w-full">
            Export as JSON
          </Button>
        </div>
      </div>
    </div>
  );
}
