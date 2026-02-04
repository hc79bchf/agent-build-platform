import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AgentBuilderState,
  AgentSpec,
} from './types';

const STORAGE_KEY = 'agent-builder-state';

// Initial state
const initialAgentSpec: AgentSpec = {
  identity: {
    name: '',
    persona: 'Friendly',
    objective: '',
  },
  memory: {
    shortTerm: {
      enabled: false,
      description: 'Stores recent conversation context',
    },
    episodic: {
      enabled: false,
      description: 'Stores specific events and experiences',
    },
    procedural: {
      enabled: false,
      description: 'Stores learned procedures and workflows',
    },
    semantic: {
      enabled: false,
      description: 'Stores facts and knowledge',
    },
    policy: {
      enabled: false,
      description: 'Stores rules and guidelines',
    },
  },
  skills: [],
  mcpTools: [],
  a2aConnections: [],
  guardrails: [],
};

export const useAgentBuilder = create<AgentBuilderState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentPhase: 1,
      agentSpec: initialAgentSpec,
      phase1: {
        currentSection: 1,
        messages: [
          {
            id: '1',
            role: 'bot',
            content: "Hi! I'm here to help you build your AI agent. Let's start by defining your agent's identity. What would you like to name your agent?",
            timestamp: new Date(),
          },
        ],
        isComplete: false,
      },
      phase2: {
        selectedNode: null,
      },
      phase3: {
        currentStep: 6, // Memory configuration step
        expandedCard: null,
      },

      // Spec update actions
      updateSpec: (updates) => {
        set((state) => ({
          agentSpec: {
            ...state.agentSpec,
            ...updates,
          },
        }));
      },

      updateIdentity: (identity) => {
        set((state) => ({
          agentSpec: {
            ...state.agentSpec,
            identity: {
              ...state.agentSpec.identity,
              ...identity,
            },
          },
        }));
      },

      updateMemoryConfig: (memoryType, settings) => {
        set((state) => ({
          agentSpec: {
            ...state.agentSpec,
            memory: {
              ...state.agentSpec.memory,
              [memoryType]: {
                ...state.agentSpec.memory[memoryType],
                ...settings,
              },
            },
          },
        }));
      },

      addSkill: (skill) => {
        set((state) => ({
          agentSpec: {
            ...state.agentSpec,
            skills: [...state.agentSpec.skills, skill],
          },
        }));
      },

      updateSkill: (skillId, updates) => {
        set((state) => ({
          agentSpec: {
            ...state.agentSpec,
            skills: state.agentSpec.skills.map((skill) =>
              skill.id === skillId ? { ...skill, ...updates } : skill
            ),
          },
        }));
      },

      addMCPTool: (tool) => {
        set((state) => ({
          agentSpec: {
            ...state.agentSpec,
            mcpTools: [...state.agentSpec.mcpTools, tool],
          },
        }));
      },

      updateMCPTool: (toolId, updates) => {
        set((state) => ({
          agentSpec: {
            ...state.agentSpec,
            mcpTools: state.agentSpec.mcpTools.map((tool) =>
              tool.id === toolId ? { ...tool, ...updates } : tool
            ),
          },
        }));
      },

      addA2AConnection: (connection) => {
        set((state) => ({
          agentSpec: {
            ...state.agentSpec,
            a2aConnections: [...state.agentSpec.a2aConnections, connection],
          },
        }));
      },

      addGuardrail: (guardrail) => {
        set((state) => ({
          agentSpec: {
            ...state.agentSpec,
            guardrails: [...state.agentSpec.guardrails, guardrail],
          },
        }));
      },

      updateGuardrail: (guardrailId, updates) => {
        set((state) => ({
          agentSpec: {
            ...state.agentSpec,
            guardrails: state.agentSpec.guardrails.map((guardrail) =>
              guardrail.id === guardrailId ? { ...guardrail, ...updates } : guardrail
            ),
          },
        }));
      },

      // Phase navigation
      nextPhase: () => {
        set((state) => {
          const nextPhase = Math.min(3, state.currentPhase + 1) as 1 | 2 | 3;
          return { currentPhase: nextPhase };
        });
      },

      prevPhase: () => {
        set((state) => {
          const prevPhase = Math.max(1, state.currentPhase - 1) as 1 | 2 | 3;
          return { currentPhase: prevPhase };
        });
      },

      setPhase: (phase) => {
        set({ currentPhase: phase });
      },

      // Phase 1 actions
      addMessage: (message) => {
        set((state) => ({
          phase1: {
            ...state.phase1,
            messages: [...state.phase1.messages, message],
          },
        }));
      },

      setCurrentSection: (section) => {
        set((state) => ({
          phase1: {
            ...state.phase1,
            currentSection: section,
          },
        }));
      },

      // Phase 2 actions
      selectNode: (nodeId) => {
        set((state) => ({
          phase2: {
            ...state.phase2,
            selectedNode: nodeId,
          },
        }));
      },

      // Phase 3 actions
      setCurrentStep: (step) => {
        set((state) => ({
          phase3: {
            ...state.phase3,
            currentStep: step,
          },
        }));
      },

      setExpandedCard: (cardId) => {
        set((state) => ({
          phase3: {
            ...state.phase3,
            expandedCard: cardId,
          },
        }));
      },

      // Export
      exportJSON: () => {
        const state = get();
        return JSON.stringify(state.agentSpec, null, 2);
      },

      // Persistence methods
      loadFromLocalStorage: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            set(parsed);
          } catch (error) {
            console.error('Failed to load state from localStorage:', error);
          }
        }
      },

      saveToLocalStorage: () => {
        const state = get();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        currentPhase: state.currentPhase,
        agentSpec: state.agentSpec,
        phase1: state.phase1,
        phase2: state.phase2,
        phase3: state.phase3,
      }),
    }
  )
);
