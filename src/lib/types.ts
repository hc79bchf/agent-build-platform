// Agent specification types
export interface AgentSpec {
  identity: AgentIdentity;
  memory: MemoryConfiguration;
  skills: Skill[];
  mcpTools: MCPTool[];
  a2aConnections: AgentConnection[];
  guardrails: Guardrail[];
}

export interface AgentIdentity {
  name: string;
  persona: 'Friendly' | 'Professional' | 'Technical' | 'Creative';
  objective: string;
  icon?: string;
}

export interface MemoryConfiguration {
  shortTerm: MemorySettings;
  episodic: MemorySettings;
  procedural: MemorySettings;
  semantic: MemorySettings;
  policy: MemorySettings;
}

export interface MemorySettings {
  enabled: boolean;
  description: string;
  retentionDays?: number;
  maxEntries?: number;
  vectorStore?: string;
  embeddingModel?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface MCPTool {
  id: string;
  name: string;
  description: string;
  provider: string;
  enabled: boolean;
}

export interface AgentConnection {
  id: string;
  agentName: string;
  connectionType: 'bidirectional' | 'unidirectional';
  description: string;
}

export interface Guardrail {
  id: string;
  name: string;
  description: string;
  ruleType: 'content' | 'behavior' | 'security' | 'compliance';
  enabled: boolean;
}

// Phase 1 specific types
export interface Phase1State {
  currentSection: number; // 1-7
  messages: ChatMessage[];
  isComplete: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  content: string;
  options?: QuickOption[];
  timestamp: Date;
}

export interface QuickOption {
  id: string;
  label: string;
  value: string;
}

export interface DiscoverySection {
  id: number;
  name: string;
  icon: string;
  completed: boolean;
}

// Phase 2 specific types
export interface Phase2State {
  selectedNode: string | null;
}

export interface DiagramNode {
  id: string;
  type: 'agent' | 'memory' | 'skills' | 'mcp' | 'a2a' | 'guardrails';
  label: string;
  count?: number;
  color: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface DiagramConnection {
  id: string;
  from: string;
  to: string;
  color: string;
}

// Phase 3 specific types
export interface Phase3State {
  currentStep: number; // 1-7
  expandedCard: string | null;
}

export interface WorkflowStep {
  id: number;
  name: string;
  completed: boolean;
}

// Global store state
export interface AgentBuilderState {
  currentPhase: 1 | 2 | 3;
  agentSpec: AgentSpec;
  phase1: Phase1State;
  phase2: Phase2State;
  phase3: Phase3State;

  // Actions
  updateSpec: (updates: Partial<AgentSpec>) => void;
  updateIdentity: (identity: Partial<AgentIdentity>) => void;
  updateMemoryConfig: (memoryType: keyof MemoryConfiguration, settings: Partial<MemorySettings>) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (skillId: string, updates: Partial<Skill>) => void;
  addMCPTool: (tool: MCPTool) => void;
  updateMCPTool: (toolId: string, updates: Partial<MCPTool>) => void;
  addA2AConnection: (connection: AgentConnection) => void;
  addGuardrail: (guardrail: Guardrail) => void;
  updateGuardrail: (guardrailId: string, updates: Partial<Guardrail>) => void;

  // Phase navigation
  nextPhase: () => void;
  prevPhase: () => void;
  setPhase: (phase: 1 | 2 | 3) => void;

  // Phase 1 actions
  addMessage: (message: ChatMessage) => void;
  setCurrentSection: (section: number) => void;

  // Phase 2 actions
  selectNode: (nodeId: string | null) => void;

  // Phase 3 actions
  setCurrentStep: (step: number) => void;
  setExpandedCard: (cardId: string | null) => void;

  // Export
  exportJSON: () => string;

  // Persistence
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
}

// Utility types
export type MemoryType = keyof MemoryConfiguration;

export interface ValidationError {
  field: string;
  message: string;
}
