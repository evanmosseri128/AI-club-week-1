export type Agent = {
  id: string
  name: string
  personality: string
  specialty: string
  style: string
  instructions: string
}

export type Company = {
  started: boolean
  name: string
  idea: string
  industry: string
  cash: number
  revenue: number
  expenses: number
  customers: number
  employees: number
  products: number
  marketing: number
  week: number
  log: string[]
}

export type ExperimentState = {
  neuralInput: number
  neuralSecondary: number
  decisionRisk: number
  decisionBudget: number
  classifierX: number
  classifierY: number
  sampleIndex: number
  points: { x: number; y: number; label: 'mint' | 'pink' }[]
}

export type LabProfile = {
  version: number
  username: string
  xp: number
  completed: string[]
  scores: Record<string, number>
  achievements: string[]
  agents: Agent[]
  agentsBuilt: number
  experimentsDone: number
  promptsDone: number
  academyMissions: string[]
  humanScore: number
  experiments: ExperimentState
  company: Company
  activity: { label: string; detail: string; at: number }[]
}

const STORAGE_KEY = 'ai-lab.profile.v1'

export const emptyCompany = (): Company => ({
  started: false,
  name: '',
  idea: '',
  industry: 'Education',
  cash: 50_000,
  revenue: 0,
  expenses: 0,
  customers: 0,
  employees: 0,
  products: 0,
  marketing: 0,
  week: 1,
  log: [],
})

export const defaultExperiments = (): ExperimentState => ({
  neuralInput: 58,
  neuralSecondary: 42,
  decisionRisk: 25,
  decisionBudget: 65,
  classifierX: 58,
  classifierY: 38,
  sampleIndex: 0,
  points: [
    { x: 22, y: 30, label: 'mint' },
    { x: 29, y: 72, label: 'mint' },
    { x: 74, y: 22, label: 'pink' },
    { x: 78, y: 71, label: 'pink' },
  ],
})

export const newProfile = (): LabProfile => ({
  version: 1,
  username: 'New student',
  xp: 0,
  completed: [],
  scores: {},
  achievements: [],
  agents: [],
  agentsBuilt: 0,
  experimentsDone: 0,
  promptsDone: 0,
  academyMissions: [],
  humanScore: 0,
  experiments: defaultExperiments(),
  company: emptyCompany(),
  activity: [],
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(0, 300) : []
}

export function loadProfile(): LabProfile {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return newProfile()
    const value: unknown = JSON.parse(raw)
    if (!isRecord(value)) return newProfile()
    const base = newProfile()
    const company = isRecord(value.company) ? value.company : {}
    const scores = isRecord(value.scores) ? value.scores : {}
    const experiments = isRecord(value.experiments) ? value.experiments : {}
    const defaultExperimentState = defaultExperiments()
    const points = Array.isArray(experiments.points) ? experiments.points.filter(isRecord).filter((point) =>
      typeof point.x === 'number' && typeof point.y === 'number' && (point.label === 'mint' || point.label === 'pink'),
    ).slice(0, 100) as unknown as ExperimentState['points'] : defaultExperimentState.points
    const activity = Array.isArray(value.activity) ? value.activity.filter(isRecord).slice(0, 30) : []
    const agents = Array.isArray(value.agents) ? value.agents.filter(isRecord).filter((agent) =>
      typeof agent.id === 'string' && typeof agent.name === 'string',
    ).slice(0, 50) as unknown as Agent[] : []
    return {
      ...base,
      version: 1,
      username: typeof value.username === 'string' && value.username.trim() ? value.username.slice(0, 32) : base.username,
      xp: typeof value.xp === 'number' && Number.isFinite(value.xp) ? Math.max(0, Math.floor(value.xp)) : 0,
      completed: stringList(value.completed),
      scores: Object.fromEntries(Object.entries(scores).filter((entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1]))),
      achievements: stringList(value.achievements),
      agents,
      agentsBuilt: typeof value.agentsBuilt === 'number' ? Math.max(0, value.agentsBuilt) : agents.length,
      experimentsDone: typeof value.experimentsDone === 'number' ? Math.max(0, value.experimentsDone) : 0,
      promptsDone: typeof value.promptsDone === 'number' ? Math.max(0, value.promptsDone) : 0,
      academyMissions: stringList(value.academyMissions),
      humanScore: typeof value.humanScore === 'number' ? Math.max(0, value.humanScore) : 0,
      experiments: {
        neuralInput: boundedNumber(experiments.neuralInput, defaultExperimentState.neuralInput),
        neuralSecondary: boundedNumber(experiments.neuralSecondary, defaultExperimentState.neuralSecondary),
        decisionRisk: boundedNumber(experiments.decisionRisk, defaultExperimentState.decisionRisk),
        decisionBudget: boundedNumber(experiments.decisionBudget, defaultExperimentState.decisionBudget),
        classifierX: boundedNumber(experiments.classifierX, defaultExperimentState.classifierX),
        classifierY: boundedNumber(experiments.classifierY, defaultExperimentState.classifierY),
        sampleIndex: boundedNumber(experiments.sampleIndex, 0) % 3,
        points,
      },
      company: {
        ...base.company,
        ...company,
        started: company.started === true,
        name: typeof company.name === 'string' ? company.name.slice(0, 40) : '',
        idea: typeof company.idea === 'string' ? company.idea.slice(0, 120) : '',
        industry: typeof company.industry === 'string' ? company.industry : 'Education',
        cash: typeof company.cash === 'number' ? company.cash : 50_000,
        revenue: typeof company.revenue === 'number' ? company.revenue : 0,
        expenses: typeof company.expenses === 'number' ? company.expenses : 0,
        customers: typeof company.customers === 'number' ? company.customers : 0,
        employees: typeof company.employees === 'number' ? company.employees : 0,
        products: typeof company.products === 'number' ? company.products : 0,
        marketing: typeof company.marketing === 'number' ? company.marketing : 0,
        week: typeof company.week === 'number' ? company.week : 1,
        log: stringList(company.log),
      },
      activity: activity.map((item) => ({
        label: typeof item.label === 'string' ? item.label.slice(0, 64) : 'Lab activity',
        detail: typeof item.detail === 'string' ? item.detail.slice(0, 120) : '',
        at: typeof item.at === 'number' ? item.at : Date.now(),
      })),
    }
  } catch {
    return newProfile()
  }
}

function boundedNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : fallback
}

export function saveProfile(profile: LabProfile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...profile, version: 1 }))
  } catch {
    // The app remains usable when storage is disabled or full.
  }
}

export function levelForXp(xp: number) {
  const thresholds = [0, 100, 250, 500, 900, 1400, 2100, 3000]
  const levelIndex = thresholds.findIndex((threshold, index) => xp < (thresholds[index + 1] ?? Infinity))
  const index = Math.max(0, levelIndex)
  const start = thresholds[index]
  const end = thresholds[index + 1] ?? start + 1000
  return { level: index + 1, current: xp - start, needed: end - start, nextXp: end }
}

export const achievementCatalog = [
  { id: 'first-spark', title: 'AI Beginner', description: 'Finish your first challenge.', icon: 'Sparkles', color: 'lime' },
  { id: 'prompt-wizard', title: 'Prompt Wizard', description: 'Complete three prompt missions.', icon: 'WandSparkles', color: 'pink' },
  { id: 'agent-architect', title: 'Agent Architect', description: 'Build your first AI agent.', icon: 'Bot', color: 'cyan' },
  { id: 'ml-explorer', title: 'Machine Learning Explorer', description: 'Run your first experiment.', icon: 'Network', color: 'amber' },
  { id: 'challenge-streak', title: 'Challenge Collector', description: 'Finish five AI challenges.', icon: 'Trophy', color: 'pink' },
  { id: 'mr-al-approved', title: 'MR. AL APPROVED', description: 'Complete all five academy missions.', icon: 'Crown', color: 'lime' },
]

export function syncAchievements(profile: LabProfile): LabProfile {
  const unlocked = new Set(profile.achievements)
  if (profile.completed.length > 0) unlocked.add('first-spark')
  if (profile.promptsDone >= 3) unlocked.add('prompt-wizard')
  if (profile.agentsBuilt >= 1) unlocked.add('agent-architect')
  if (profile.experimentsDone >= 1) unlocked.add('ml-explorer')
  if (profile.completed.length >= 5) unlocked.add('challenge-streak')
  if (profile.academyMissions.length >= 5) unlocked.add('mr-al-approved')
  return { ...profile, achievements: [...unlocked] }
}

export function recordActivity(profile: LabProfile, label: string, detail: string): LabProfile {
  return { ...profile, activity: [{ label, detail, at: Date.now() }, ...profile.activity].slice(0, 30) }
}