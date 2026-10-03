export type AgentRole =
  | "ceo"
  | "cpo"
  | "architect"
  | "cmo"
  | "qa_critic"
  | "cfo"
  | "security_hacker"
  | "custom";

export type Department =
  | "Executive Office"
  | "Strategy & Product"
  | "Engineering & Architecture"
  | "Marketing & Growth"
  | "Risk & Quality Assurance"
  | "Cyber Security & Red Team"
  | "Cyber Security & Deep QA (Argent Protocol)"
  | "Finance & Operations"
  | "Custom Department";

export interface Agent {
  id: string;
  name: string;
  role: string;
  roleType: AgentRole;
  department: Department;
  avatarColor: string;
  avatarIcon: string;
  personality: string;
  systemPrompt: string;
  temperature?: number;
  assignedModel?: string; // e.g. "default", "gemini-3.8-flash", "groq:llama-3.3-70b"
  isSpeaking?: boolean;
}

export type TaskStatus = "pending" | "in_debate" | "in_progress" | "review" | "completed";
export type TaskPriority = "low" | "medium" | "high" | "critical" | "urgent";

export interface TaskArtifact {
  name: string;
  type: "code" | "markdown" | "config" | "json";
  data?: string;
  content?: string;
}

export interface TaskDeliverable {
  taskId?: string;
  taskTitle?: string;
  agentId?: string;
  agentName: string;
  agentRole: string;
  deliverableTitle: string;
  executiveNotes?: string;
  content: string;
  artifacts: TaskArtifact[];
  completedAt: string;
}

export interface CompanyTask {
  id: string;
  title: string;
  department: string;
  assignedAgentId: string;
  priority: TaskPriority;
  estimatedTime: string;
  description: string;
  dependencies: string[];
  status: TaskStatus;
  deliverable?: TaskDeliverable;
}

export type DebateSentiment = "constructive" | "critical" | "enthusiastic" | "cautious";

export interface DebateMessage {
  id: string;
  agentId: string;
  agentName: string;
  role: string;
  timestamp: string;
  speech: string;
  thinking: string;
  sentiment: DebateSentiment;
  actionProposal?: string;
  round: number;
}

export interface AgentProposal {
  id: string;
  projectId?: string;
  title: string;
  description: string;
  department: string;
  agentId: string;
  agentName: string;
  agentRole: string;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
  actionSummary: string;
  keyPoints: string[];
}

export interface FinalSynthesis {
  masterPlanTitle: string;
  ceoVerdict: string;
  readinessScore: number;
  nextSteps: string[];
  synthesisMarkdown: string;
  generatedAt: string;
}

export type AIProvider = "gemini" | "openai" | "deepseek" | "groq" | "openrouter" | "ollama" | "custom";

export interface AISettings {
  activeProvider: AIProvider;
  singleAIEmulationMode: boolean; // 1 AI acts as entire company
  ttsEnabled: boolean; // Read agent speech aloud via browser speech
  geminiModel: string;
  openAiApiKey?: string;
  openAiModel?: string;
  deepseekApiKey?: string;
  deepseekModel?: string;
  groqApiKey?: string;
  groqModel?: string;
  openRouterApiKey?: string;
  openRouterModel?: string;
  customEndpoint?: string;
  customApiKey?: string;
  customModel?: string;
}

export interface MissionPreset {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  context: string;
}

export type ProjectType =
  | "media-streaming"
  | "saas-ai"
  | "crm-swarm"
  | "ecommerce"
  | "cyber-defense"
  | "custom";

export interface EnterpriseProject {
  id: string;
  name: string;
  category: string;
  projectType?: ProjectType;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | "draft" | "completed" | "archived";
  icon?: string;
  missionPrompt?: string;
  activeMission?: string;
  tasks: CompanyTask[];
  debateMessages: DebateMessage[];
  proposals?: AgentProposal[];
  synthesis?: FinalSynthesis | null;
  activePhase?: string;
  competitors?: string[];
  competitorDomainName?: string;
  customSettings?: Record<string, any>;
}

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: "guest" | "viewer" | "vip" | "admin";
  favoriteSlugs: string[];
  history: Array<{
    slug: string;
    title: string;
    poster: string;
    watchedSeconds: number;
    totalSeconds: number;
    updatedAt: string;
  }>;
  preferences: {
    themeColor: "red" | "emerald" | "amber" | "violet" | "cyan";
    defaultServer: string;
    autoNext: boolean;
    ambientLight: boolean;
  };
}

export interface ArchitectureBlueprint {
  id: string;
  title: string;
  sourceProjectName: string;
  category: string;
  tags: string[];
  description: string;
  achievements: string[];
  recommendedFor: string;
  taskData: {
    title: string;
    department: string;
    assignedAgentId: string;
    description: string;
    deliverableTitle: string;
    artifacts: Array<{
      name: string;
      type: "code" | "markdown" | "config" | "json";
      data: string;
    }>;
  };
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: "image" | "file";
  mimeType: string;
  size?: number;
  dataUrl: string; // base64 data url
}

export interface AgentSkill {
  id: string;
  name: string;
  icon: string;
  badge: string;
  description: string;
  category: "tft" | "system" | "ui" | "analytics";
  quickPrompt: string;
}

export interface AgentChatMessage {
  id: string;
  role: "user" | "agent";
  agentId?: string;
  agentName?: string;
  agentRole?: string;
  content: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  thoughtProcess?: string;
  invokedSkill?: {
    id: string;
    name: string;
    icon: string;
    actionSummary?: string;
  };
  card?: {
    type: "tft_comps" | "tft_roll" | "tft_items" | "patch_applied" | "image_design_analysis" | "custom";
    title?: string;
    data: any;
  };
  autoExecuted?: boolean;
}

