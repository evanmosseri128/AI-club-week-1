'use client'

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity, ArrowDownRight, ArrowRight, Award, BarChart3, Bot, BrainCircuit, BriefcaseBusiness,
  Check, ChevronRight, CircleHelp, Clock3, Code2, Crown, FlaskConical, Gamepad2, GraduationCap,
  Lightbulb, Menu, MessageSquareText, Network, Plus, Rocket, RotateCcw, Send, Settings2,
  ShieldCheck, Sparkles, Target, Terminal, Trash2, Trophy, WandSparkles, X, Zap,
} from 'lucide-react'
import {
  Badge, Button, Card, Dialog, DialogContent, DialogDescription, DialogTitle, Input, Progress,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger,
  Textarea, cn,
} from '@/components/ui'
import {
  achievementCatalog, emptyCompany, levelForXp, loadProfile, newProfile, recordActivity,
  saveProfile, syncAchievements, type Agent, type Company, type LabProfile,
} from '@/lib/progress'

type PageId = 'home' | 'agents' | 'challenges' | 'prompts' | 'startup' | 'experiments' | 'academy' | 'achievements' | 'leaderboard'
type Challenge = { id: string; title: string; category: string; difficulty: string; xp: number; prompt: string; options: string[]; answer: number; explanation: string }

const navItems: { id: PageId; label: string; icon: typeof Activity; group: string }[] = [
  { id: 'home', label: 'Command center', icon: Activity, group: 'WORKSPACE' },
  { id: 'agents', label: 'Agent builder', icon: Bot, group: 'WORKSPACE' },
  { id: 'challenges', label: 'Challenge arena', icon: Gamepad2, group: 'PLAY' },
  { id: 'prompts', label: 'Prompt arena', icon: Terminal, group: 'PLAY' },
  { id: 'startup', label: 'Startup sim', icon: BriefcaseBusiness, group: 'PLAY' },
  { id: 'experiments', label: 'Experiment lab', icon: FlaskConical, group: 'DISCOVER' },
  { id: 'academy', label: "Mr. Al's academy", icon: GraduationCap, group: 'DISCOVER' },
  { id: 'achievements', label: 'Achievements', icon: Award, group: 'YOUR RECORD' },
  { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3, group: 'YOUR RECORD' },
]

const challenges: Challenge[] = [
  { id: 'prompt-clarity', title: 'Prompt, meet purpose', category: 'Prompt Engineering', difficulty: 'Beginner', xp: 45, prompt: 'Which prompt gives an AI the clearest task?', options: ['Tell me about space.', 'Explain how the Moon causes tides to a 10-year-old in three short steps.', 'Write something interesting.'], answer: 1, explanation: 'A strong prompt names its topic, audience, and output structure.' },
  { id: 'ai-knowledge', title: 'Pattern detective', category: 'AI Knowledge', difficulty: 'Beginner', xp: 40, prompt: 'A model learns from thousands of labeled cat photos, then labels a new photo. What is this?', options: ['Supervised learning', 'Random guessing', 'A hard-coded checklist'], answer: 0, explanation: 'Labeled examples teach a supervised model to map inputs to known categories.' },
  { id: 'logic-puzzle', title: 'The honest robot', category: 'Logic Puzzles', difficulty: 'Intermediate', xp: 60, prompt: 'A robot says: “I always lie.” What is the most useful response?', options: ['Trust every word it says.', 'Notice the self-contradiction: the statement cannot consistently be true.', 'Ask it to count to ten.'], answer: 1, explanation: 'If the sentence is true, the robot is lying; if false, it may not always lie. The claim is self-referential and inconsistent as stated.' },
  { id: 'coding-loops', title: 'Loop logic', category: 'Coding', difficulty: 'Intermediate', xp: 60, prompt: 'A loop should process every item in a list once. Which pattern fits best?', options: ['Repeat a fixed number unrelated to the list.', 'Iterate over each item in the list.', 'Stop after the first item.'], answer: 1, explanation: 'Iterating over the collection directly covers each available item exactly once.' },
  { id: 'ai-ethics', title: 'Fairness checkpoint', category: 'AI Ethics', difficulty: 'Advanced', xp: 80, prompt: 'A hiring model rejects one group far more often. What should the team do first?', options: ['Deploy it anyway; accuracy is all that matters.', 'Audit the data and outcomes with affected groups before deciding whether to use it.', 'Hide the result from applicants.'], answer: 1, explanation: 'An impact audit investigates data, outcomes, and context before deployment.' },
  { id: 'problem-solving', title: 'Measure twice', category: 'Problem Solving', difficulty: 'Advanced', xp: 85, prompt: 'A model has 99% accuracy on a dataset where 99% of cases are “safe.” What should you inspect next?', options: ['Its performance on the rare, high-impact cases.', 'Only the accuracy number.', 'The color of the dashboard.'], answer: 0, explanation: 'Overall accuracy can hide failure on rare classes; inspect class-specific performance and costs.' },
  { id: 'creative-ai', title: 'Creative remix', category: 'Creativity', difficulty: 'Expert', xp: 100, prompt: 'What helps a creative AI brief produce more useful, original results?', options: ['A clear audience, an unusual constraint, and room to explore.', 'No context and no constraints.', 'Ask it to copy a specific creator exactly.'], answer: 0, explanation: 'Context plus a distinctive constraint guides creativity while leaving room for original choices.' },
]

const promptMissions = [
  { id: 'prompt-1', level: 'LEVEL 01', title: 'Quantum, meet kid logic', mission: 'Write a prompt that makes an AI explain quantum physics to a 10-year-old.', target: ['quantum', '10-year-old', 'analogy'] },
  { id: 'prompt-2', level: 'LEVEL 02', title: 'Invent a better lunch', mission: 'Create a prompt that generates a school-friendly business idea with a customer and price.', target: ['business', 'customer', 'price'] },
  { id: 'prompt-3', level: 'LEVEL 03', title: 'Plan the impossible week', mission: 'Write a prompt that builds a realistic study plan with time limits and a structured output.', target: ['study', 'time', 'table'] },
  { id: 'prompt-4', level: 'LEVEL 04', title: 'Stress-test a claim', mission: 'Prompt an AI to assess a claim, cite uncertainty, and argue both sides before concluding.', target: ['claim', 'evidence', 'uncertainty'] },
]

const demoProfiles = [
  { name: 'Nova', xp: 1280, title: 'Prompt architect' },
  { name: 'Circuit', xp: 940, title: 'Agent explorer' },
  { name: 'Pixel', xp: 680, title: 'ML tinkerer' },
  { name: 'Byte', xp: 420, title: 'Challenge solver' },
]

const demoResponses = [
  'I can help map that out. First, let’s define the goal, then break it into a few concrete steps you can test.',
  'Interesting question. Try looking at the examples you have, spotting what changes, and writing down one prediction before testing it.',
  'Here’s a practical starting point: keep the scope small, state your constraints clearly, and check the result against your original goal.',
  'I’m in brainstorm mode. One useful angle is to ask who this helps, what friction it removes, and how you could test the idea cheaply.',
]

const startupEvents = [
  { title: 'A school newsletter features your demo.', effect: 'More curious visitors find the product.', customers: 22 },
  { title: 'A cloud bill arrives early.', effect: 'Infrastructure costs tick up this week.', customers: -5 },
  { title: 'A student team shares your launch video.', effect: 'Word of mouth brings a wave of signups.', customers: 34 },
  { title: 'A competitor launches a similar feature.', effect: 'You will need to keep your value clear.', customers: -12 },
]

const humanSamples = [
  { label: 'Sample 01', text: 'The best part of the science fair was when our volcano leaked under the table. We called it a surprise floor experiment.', answer: 'human' },
  { label: 'Sample 02', text: 'Photosynthesis converts light energy into chemical energy. A useful way to remember it is that plants store sunlight in sugar.', answer: 'ai' },
  { label: 'Sample 03', text: 'I tried to make pancakes before school and somehow used salt instead of sugar. The dog was not impressed either.', answer: 'human' },
] as const

function formatNumber(value: number) { return new Intl.NumberFormat('en-US').format(Math.round(value)) }
function money(value: number) { return `$${formatNumber(value)}` }
function cx(...classes: (string | false | null | undefined)[]) { return classes.filter(Boolean).join(' ') }
function currentAcademyMilestone(missions: string[], id: string) { return missions.includes(id) ? missions : [...missions, id] }

export default function AiLab() {
  const [profile, setProfile] = useState<LabProfile>(() => newProfile())
  const [ready, setReady] = useState(false)
  const [page, setPage] = useState<PageId>('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [usernameDraft, setUsernameDraft] = useState('')
  const [toast, setToast] = useState('')
  const [agentDraft, setAgentDraft] = useState({ name: '', personality: 'Curious', specialty: 'Study helper', style: 'Clear & friendly', instructions: '' })
  const [editingAgent, setEditingAgent] = useState<string | null>(null)
  const [activeAgent, setActiveAgent] = useState<string | null>(null)
  const [agentMessages, setAgentMessages] = useState<{ from: 'agent' | 'student'; text: string }[]>([])
  const [agentMessage, setAgentMessage] = useState('')
  const [challengeId, setChallengeId] = useState(challenges[0].id)
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null)
  const [challengeFeedback, setChallengeFeedback] = useState<{ score: number; text: string } | null>(null)
  const [promptId, setPromptId] = useState(promptMissions[0].id)
  const [promptText, setPromptText] = useState('')
  const [promptScore, setPromptScore] = useState<{ score: number; notes: string[]; dimensions: number[] } | null>(null)
  const [startupName, setStartupName] = useState('')
  const [startupIdea, setStartupIdea] = useState('')
  const [startupIndustry, setStartupIndustry] = useState('Education')
  const [explainText, setExplainText] = useState('')
  const [experimentInput, setExperimentInput] = useState(58)
  const [experimentSecondary, setExperimentSecondary] = useState(42)
  const [decisionRisk, setDecisionRisk] = useState(25)
  const [decisionBudget, setDecisionBudget] = useState(65)
  const [sampleIndex, setSampleIndex] = useState(0)
  const [sampleFeedback, setSampleFeedback] = useState('')

  useEffect(() => {
    const saved = syncAchievements(loadProfile())
    setProfile(saved)
    setExperimentInput(saved.experiments.neuralInput)
    setExperimentSecondary(saved.experiments.neuralSecondary)
    setDecisionRisk(saved.experiments.decisionRisk)
    setDecisionBudget(saved.experiments.decisionBudget)
    setSampleIndex(saved.experiments.sampleIndex)
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) saveProfile(profile)
  }, [profile, ready])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const level = levelForXp(profile.xp)
  const currentNav = navItems.find((item) => item.id === page) ?? navItems[0]
  const challenge = challenges.find((item) => item.id === challengeId) ?? challenges[0]
  const promptMission = promptMissions.find((item) => item.id === promptId) ?? promptMissions[0]
  const activeAgentData = profile.agents.find((agent) => agent.id === activeAgent)

  function gainXp(amount: number, label: string, detail: string) {
    setProfile((current) => syncAchievements(recordActivity({ ...current, xp: current.xp + amount }, label, detail)))
    setToast(`+${amount} XP · ${label}`)
  }

  function openPage(nextPage: PageId) {
    setPage(nextPage)
    setMobileOpen(false)
  }

  function saveUsername(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = usernameDraft.trim().slice(0, 32)
    if (!name) return
    setProfile((current) => recordActivity({ ...current, username: name }, 'Profile updated', `Welcome to the lab, ${name}.`))
    setSettingsOpen(false)
    setToast(`Welcome to the lab, ${name}.`)
  }

  function resetProgress() {
    setProfile(newProfile())
    setReady(true)
    setActiveAgent(null)
    setAgentMessages([])
    setChallengeFeedback(null)
    setPromptScore(null)
    setExperimentInput(58)
    setExperimentSecondary(42)
    setDecisionRisk(25)
    setDecisionBudget(65)
    setSampleIndex(0)
    setToast('Progress reset. A fresh experiment begins.')
  }

  function submitChallenge() {
    if (challengeAnswer === null) return
    const correct = challengeAnswer === challenge.answer
    const alreadyDone = profile.completed.includes(challenge.id)
    const score = correct ? 100 : 0
    setChallengeFeedback({ score, text: correct ? `Correct. ${challenge.explanation}` : `Not quite. ${challenge.explanation}` })
    if (correct && !alreadyDone) {
      setProfile((current) => syncAchievements(recordActivity({ ...current, xp: current.xp + challenge.xp, completed: [...current.completed, challenge.id], scores: { ...current.scores, [challenge.id]: score }, academyMissions: currentAcademyMilestone(current.academyMissions, 'challenge') }, challenge.title, `${challenge.category} · ${score}% · +${challenge.xp} XP`)))
      setToast(`Challenge cleared · +${challenge.xp} XP`)
    } else if (correct) setToast('Already cleared. Nice recall.')
    else setProfile((current) => ({ ...current, scores: { ...current.scores, [challenge.id]: Math.max(current.scores[challenge.id] ?? 0, score) } }))
  }

  function scorePrompt(text = promptText, mission = promptMission) {
    const value = text.toLowerCase()
    const dimensions = [
      Math.min(20, value.length >= 45 ? 20 : value.length >= 20 ? 12 : value.length > 0 ? 5 : 0),
      Math.min(20, (value.match(/\b(explain|create|write|compare|plan|analyze|generate|design)\b/g) ?? []).length * 7),
      Math.min(20, (value.match(/\b(to a|for|audience|student|customer|10-year-old|school)\b/g) ?? []).length * 7),
      Math.min(20, (value.match(/\b(under|within|include|avoid|must|between|limit|step|short)\b/g) ?? []).length * 7),
      Math.min(20, (value.match(/\b(table|bullets|steps|format|JSON|paragraph|list|sections)\b/g) ?? []).length * 7),
    ]
    const score = dimensions.reduce((sum, part) => sum + part, 0)
    const notes = [
      dimensions[0] >= 20 ? 'Clear task length: enough detail to act on.' : 'Add enough detail to make the task unmistakable.',
      dimensions[1] >= 14 ? 'A direct action verb makes the job clear.' : 'Use a specific action verb such as explain, compare, or design.',
      dimensions[2] >= 14 ? 'Audience or context gives the AI a useful point of view.' : 'Add context: who is this for, and what do they already know?',
      dimensions[3] >= 14 ? 'Constraints make the result more focused.' : 'Add a useful boundary, requirement, or thing to avoid.',
      dimensions[4] >= 14 ? 'You named a format, so the result will be easier to use.' : 'Specify an output format such as steps, a table, or bullets.',
    ]
    setPromptScore({ score, notes, dimensions })
    if (score >= 45 && !profile.completed.includes(mission.id)) {
      setProfile((current) => syncAchievements(recordActivity({ ...current, xp: current.xp + 45, promptsDone: current.promptsDone + 1, completed: [...current.completed, mission.id], scores: { ...current.scores, [mission.id]: score }, academyMissions: currentAcademyMilestone(current.academyMissions, 'prompt') }, mission.title, `Rubric score ${score}/100 · +45 XP`)))
      setToast(`Prompt mission cleared · +45 XP`)
    } else if (score < 45) setToast('Add more context and constraints to clear this mission.')
    else setToast('Mission already recorded. Improve your rubric score.')
  }

  function saveAgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = agentDraft.name.trim().slice(0, 36)
    if (!name) return
    if (editingAgent) {
      setProfile((current) => recordActivity({ ...current, agents: current.agents.map((agent) => agent.id === editingAgent ? { ...agent, ...agentDraft, name } : agent) }, 'Agent updated', `${name} is ready for another run.`))
      setToast(`${name} updated.`)
    } else {
      const agent: Agent = { id: crypto.randomUUID(), ...agentDraft, name }
      setProfile((current) => syncAchievements(recordActivity({ ...current, agents: [...current.agents, agent], agentsBuilt: current.agentsBuilt + 1, xp: current.xp + 80, academyMissions: currentAcademyMilestone(current.academyMissions, 'agent') }, 'Agent built', `${name} joined your toolkit · +80 XP`)))
      setToast(`Agent built · +80 XP`)
    }
    setEditingAgent(null)
    setAgentDraft({ name: '', personality: 'Curious', specialty: 'Study helper', style: 'Clear & friendly', instructions: '' })
  }

  function editAgent(agent: Agent) {
    setEditingAgent(agent.id)
    setAgentDraft({ name: agent.name, personality: agent.personality, specialty: agent.specialty, style: agent.style, instructions: agent.instructions })
    document.getElementById('agent-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function removeAgent(id: string) {
    const agent = profile.agents.find((item) => item.id === id)
    setProfile((current) => recordActivity({ ...current, agents: current.agents.filter((item) => item.id !== id) }, 'Agent archived', `${agent?.name ?? 'Agent'} removed from your toolkit.`))
    if (activeAgent === id) { setActiveAgent(null); setAgentMessages([]) }
    setToast(`${agent?.name ?? 'Agent'} deleted.`)
  }

  function sendAgentMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = agentMessage.trim()
    if (!text || !activeAgentData) return
    const base = demoResponses[Math.floor(Math.random() * demoResponses.length)]
    const response = `${activeAgentData.personality} ${activeAgentData.specialty.toLowerCase()} mode: ${base}${activeAgentData.instructions ? ` Your agent's note: ${activeAgentData.instructions}` : ''}`
    setAgentMessages((messages) => [...messages, { from: 'student', text }, { from: 'agent', text: response }])
    setAgentMessage('')
  }

  function createCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!startupName.trim() || !startupIdea.trim()) return
    const company = { ...emptyCompany(), started: true, name: startupName.trim().slice(0, 40), idea: startupIdea.trim().slice(0, 120), industry: startupIndustry }
    setProfile((current) => recordActivity({ ...current, company }, 'Company founded', `${company.name} opened with a $50,000 seed budget.`))
    setToast(`${company.name} is open for business.`)
  }

  function runBusinessAction(kind: 'product' | 'hire' | 'marketing' | 'pivot') {
    const current = profile.company
    const costs = { product: 8000, hire: 5000, marketing: 3500, pivot: 6000 }
    const labels = { product: 'Built a product prototype', hire: 'Hired a teammate', marketing: 'Launched a marketing campaign', pivot: 'Invested in a customer research pivot' }
    const cost = costs[kind]
    if (current.cash < cost) { setToast('Not enough runway. Try another move or reset the simulator.'); return }
    const nextWeek = current.week
    const event = startupEvents[(nextWeek - 1) % startupEvents.length]
    const products = current.products + (kind === 'product' ? 1 : 0)
    const employees = current.employees + (kind === 'hire' ? 1 : 0)
    const marketing = current.marketing + (kind === 'marketing' ? 18 : 0)
    const insight = kind === 'pivot' ? 15 : 0
    const customers = Math.max(0, current.customers + Math.round(8 + products * 8 + employees * 2 + marketing * 0.3 + insight + event.customers))
    const revenue = products * 180 + Math.round(customers * 7)
    const expenses = employees * 1200 + marketing * 85 + 350
    const cash = current.cash - cost + revenue - expenses
    const updated: Company = { ...current, cash, products, employees, marketing, customers, revenue, expenses, week: nextWeek + 1, log: [`Week ${nextWeek}: ${labels[kind]}. ${event.title}`, ...current.log].slice(0, 8) }
    setProfile((state) => recordActivity({ ...state, company: updated }, labels[kind], `${event.title} Net weekly result: ${money(revenue - expenses)}.`))
    setToast(`Week ${nextWeek} · ${event.title}`)
  }

  function runExperiment() {
    if (profile.experimentsDone > 0) { setToast('Experiment run. Your progress is saved.'); return }
    setProfile((current) => syncAchievements(recordActivity({ ...current, experimentsDone: current.experimentsDone + 1, xp: current.xp + 50, academyMissions: currentAcademyMilestone(current.academyMissions, 'experiment') }, 'Experiment completed', 'You ran an interactive model experiment · +50 XP.')))
    setToast('Experiment recorded · +50 XP')
  }

  function finishExplainMission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (explainText.trim().split(/\s+/).length < 8) { setToast('Add a little more detail: aim for at least eight words.'); return }
    completeAcademyMission('explain')
  }

  function completeAcademyMission(id: string) {
    if (profile.academyMissions.includes(id)) { setToast('Mission already completed.'); return }
    const missions = [...profile.academyMissions, id]
    const done = missions.length >= 5
    setProfile((current) => syncAchievements(recordActivity({ ...current, academyMissions: missions, xp: current.xp + (done ? 100 : 35) }, done ? 'MR. AL APPROVED' : 'Academy mission cleared', done ? 'All academy missions completed · legendary status unlocked.' : 'A new academy mission is in the books.')))
    setToast(done ? 'MR. AL APPROVED · +100 XP' : 'Academy mission cleared · +35 XP')
  }

  function doSampleGuess(guess: 'human' | 'ai') {
    if (sampleFeedback) return
    const sample = humanSamples[sampleIndex]
    const right = sample.answer === guess
    setSampleFeedback(right ? 'Good call. The sample label was ' + sample.answer.toUpperCase() + '.' : 'Not this time. The sample label was ' + sample.answer.toUpperCase() + '.')
    if (right) {
      setProfile((current) => ({ ...current, humanScore: current.humanScore + 1 }))
      setToast('+1 point · Good eye.')
    }
  }

  function nextSample() {
    const next = (sampleIndex + 1) % humanSamples.length
    setSampleIndex(next)
    setProfile((current) => ({ ...current, experiments: { ...current.experiments, sampleIndex: next } }))
    setSampleFeedback('')
  }

  function navButton(item: typeof navItems[number], compact = false) {
    const Icon = item.icon
    return <button key={item.id} onClick={() => openPage(item.id)} className={cx('nav-item', page === item.id && 'nav-item-active', compact && 'nav-item-compact')} aria-current={page === item.id ? 'page' : undefined}>
      <Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{item.id === 'agents' && profile.agents.length > 0 && <span className="nav-count">{profile.agents.length}</span>}
    </button>
  }

  if (!ready) return <div className="app-loading"><div className="brand-mark"><Network size={18} /></div><span>Waking up the lab...</span></div>

  return <div className="lab-shell">
    <aside className={cx('sidebar', mobileOpen && 'sidebar-open')}>
      <a className="brand-lockup" href="#home" onClick={(event) => { event.preventDefault(); openPage('home') }}><span className="brand-mark"><Network size={18} strokeWidth={2.2} /></span><span><strong>AI<span>LAB</span></strong><small>STUDENT PLAYGROUND</small></span></a>
      <div className="workspace-switch"><span className="workspace-icon"><Sparkles size={15} /></span><span><strong>Club workspace</strong><small>LOCAL SESSION</small></span><ChevronRight size={15} /></div>
      <nav className="side-navigation" aria-label="Main navigation">
        {['WORKSPACE', 'PLAY', 'DISCOVER', 'YOUR RECORD'].map((group) => <div className="nav-group" key={group}><p>{group}</p>{navItems.filter((item) => item.group === group).map((item) => navButton(item))}</div>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-xp"><div className="xp-topline"><span><Zap size={13} /> LEVEL {level.level}</span><strong>{formatNumber(profile.xp)} XP</strong></div><Progress value={Math.round((level.current / level.needed) * 100)} /><p>{formatNumber(level.needed - level.current)} XP to level {level.level + 1}</p></div>
        <button className="student-card" onClick={() => { setUsernameDraft(profile.username); setSettingsOpen(true) }}><span className="student-avatar">{profile.username.slice(0, 1).toUpperCase()}</span><span className="student-identity"><strong>{profile.username}</strong><small>Level {level.level} explorer</small></span><Settings2 size={15} /></button>
      </div>
    </aside>

    <div className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-hidden={!mobileOpen} />
    <main className="main-shell">
      <header className="topbar">
        <div className="topbar-left"><Button variant="ghost" size="icon" className="mobile-menu-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={19} /></Button><div className="breadcrumbs"><span>AI LAB</span><ChevronRight size={13} /><strong>{currentNav.label}</strong></div></div>
        <div className="topbar-right"><Badge className="session-pill"><span className="live-dot" /> LOCAL SESSION</Badge><Button variant="ghost" size="icon" aria-label="Profile settings" onClick={() => { setUsernameDraft(profile.username); setSettingsOpen(true) }}><Settings2 size={18} /></Button><button className="top-avatar" onClick={() => { setUsernameDraft(profile.username); setSettingsOpen(true) }} aria-label={`Profile settings for ${profile.username}`}>{profile.username.slice(0, 1).toUpperCase()}</button></div>
      </header>
      <div className="page-content"><AnimatePresence mode="wait"><motion.div key={page} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .2 }}>
        {page === 'home' && <Dashboard profile={profile} level={level} setPage={openPage} onEditName={() => { setUsernameDraft(profile.username); setSettingsOpen(true) }} />}
        {page === 'agents' && <AgentWorkspace profile={profile} draft={agentDraft} setDraft={setAgentDraft} editing={editingAgent} setEditing={setEditingAgent} saveAgent={saveAgent} editAgent={editAgent} removeAgent={removeAgent} activeAgent={activeAgent} setActiveAgent={(id) => { setActiveAgent(id); setAgentMessages([]) }} activeAgentData={activeAgentData} messages={agentMessages} message={agentMessage} setMessage={setAgentMessage} sendMessage={sendAgentMessage} />}
        {page === 'challenges' && <ChallengesWorkspace challenge={challenge} challengeId={challengeId} setChallengeId={(id) => { setChallengeId(id); setChallengeFeedback(null); setChallengeAnswer(null) }} answer={challengeAnswer} setAnswer={setChallengeAnswer} feedback={challengeFeedback} submit={submitChallenge} completed={profile.completed} scores={profile.scores} />}
        {page === 'prompts' && <PromptWorkspace mission={promptMission} missionId={promptId} setMissionId={(id) => { setPromptId(id); setPromptScore(null); setPromptText('') }} text={promptText} setText={setPromptText} result={promptScore} score={() => scorePrompt()} completed={profile.completed} />}
        {page === 'startup' && <StartupWorkspace company={profile.company} name={startupName} setName={setStartupName} idea={startupIdea} setIdea={setStartupIdea} industry={startupIndustry} setIndustry={setStartupIndustry} create={createCompany} action={runBusinessAction} reset={() => { setProfile((current) => ({ ...current, company: emptyCompany() })); setToast('Startup simulation reset.') }} />}
        {page === 'experiments' && <ExperimentsWorkspace input={experimentInput} setInput={(value) => { setExperimentInput(value); setProfile((current) => ({ ...current, experiments: { ...current.experiments, neuralInput: value } })) }} secondary={experimentSecondary} setSecondary={(value) => { setExperimentSecondary(value); setProfile((current) => ({ ...current, experiments: { ...current.experiments, neuralSecondary: value } })) }} risk={decisionRisk} setRisk={(value) => { setDecisionRisk(value); setProfile((current) => ({ ...current, experiments: { ...current.experiments, decisionRisk: value } })) }} budget={decisionBudget} setBudget={(value) => { setDecisionBudget(value); setProfile((current) => ({ ...current, experiments: { ...current.experiments, decisionBudget: value } })) }} sampleIndex={sampleIndex} feedback={sampleFeedback} guess={doSampleGuess} nextSample={nextSample} humanScore={profile.humanScore} runExperiment={runExperiment} points={profile.experiments.points} setPoints={(points) => setProfile((current) => ({ ...current, experiments: { ...current.experiments, points } }))} classifierX={profile.experiments.classifierX} classifierY={profile.experiments.classifierY} setClassifier={(x, y) => setProfile((current) => ({ ...current, experiments: { ...current.experiments, classifierX: x, classifierY: y } }))} />}
        {page === 'academy' && <AcademyWorkspace profile={profile} explainText={explainText} setExplainText={setExplainText} finishExplain={finishExplainMission} goTo={openPage} complete={completeAcademyMission} />}
        {page === 'achievements' && <AchievementsWorkspace profile={profile} />}
        {page === 'leaderboard' && <LeaderboardWorkspace profile={profile} level={level} />}
      </motion.div></AnimatePresence></div>
      <footer className="app-footer"><span>AI LAB / THE STUDENT PLAYGROUND</span><span>LOCAL SAVE ACTIVE <i /></span></footer>
    </main>

    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}><DialogContent><DialogTitle className="dialog-heading">Your lab profile</DialogTitle><DialogDescription className="dialog-copy">Choose a name for this browser profile. Progress is saved on this device only.</DialogDescription><form className="settings-form" onSubmit={saveUsername}><label htmlFor="student-name">Display name</label><Input id="student-name" maxLength={32} value={usernameDraft} onChange={(event) => setUsernameDraft(event.target.value)} placeholder="Ada" required /><Button type="submit" variant="primary">Save profile <Check size={15} /></Button></form><div className="reset-divider" /><div className="reset-row"><span><strong>Start fresh</strong><small>Remove all saved progress and agents from this browser.</small></span><Button variant="danger" size="sm" onClick={() => { if (window.confirm('Reset all AI LAB progress on this browser? This cannot be undone.')) resetProgress() }}><RotateCcw size={14} /> Reset</Button></div></DialogContent></Dialog>
    <AnimatePresence>{toast && <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} role="status"><span className="toast-icon"><Check size={15} /></span>{toast}</motion.div>}</AnimatePresence>
  </div>
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description: string; action?: ReactNode }) {
  return <div className="page-heading"><div><p className="eyebrow"><span />{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>{action && <div className="heading-action">{action}</div>}</div>
}

function Dashboard({ profile, level, setPage, onEditName }: { profile: LabProfile; level: ReturnType<typeof levelForXp>; setPage: (id: PageId) => void; onEditName: () => void }) {
  const daily = challenges[(new Date().getDate() + new Date().getMonth()) % challenges.length]
  const activity = profile.activity.slice(0, 4)
  const hours = new Date().getHours()
  const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening'
  return <>
    <PageHeading eyebrow="TUESDAY · YOUR WORKSPACE IS READY" title={<>{greeting}, <span className="title-accent">{profile.username}.</span></>} description="Your next idea is one experiment away. Pick up where you left off." action={<Button variant="secondary" onClick={onEditName}><Settings2 size={15} /> Edit profile</Button>} />
    <section className="hero-panel"><div className="hero-panel-grid" /><div className="hero-glow" /><div className="hero-panel-copy"><Badge className="tiny-status"><span className="live-dot" /> DAILY TRANSMISSION</Badge><h2>Small experiments.<br /><span>Unexpected results.</span></h2><p>Today&apos;s challenge: {daily.title}. Can you crack it?</p><Button variant="primary" onClick={() => setPage('challenges')}>Enter the arena <ArrowRight size={16} /></Button></div><div className="hero-panel-art" aria-hidden="true"><div className="neural-ring ring-a" /><div className="neural-ring ring-b" /><div className="neural-core"><BrainCircuit size={40} /></div><span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" /><span className="orbit-dot dot-three" /><span className="orbit-label">NODE_01 / ACTIVE</span></div><span className="panel-corner">LAB / 001</span></section>
    <div className="stat-grid"><StatCard icon={Zap} label="TOTAL EXPERIENCE" value={formatNumber(profile.xp)} unit="XP" tone="lime" foot={`Level ${level.level} explorer`} /><StatCard icon={Target} label="CHALLENGES CLEARED" value={String(profile.completed.filter((id) => challenges.some((item) => item.id === id)).length).padStart(2, '0')} unit={`/ ${challenges.length}`} tone="cyan" foot="Knowledge, logic & creativity" /><StatCard icon={Award} label="BADGES EARNED" value={String(profile.achievements.length).padStart(2, '0')} unit={`/ ${achievementCatalog.length}`} tone="pink" foot="Your collection is growing" /></div>
    <div className="dashboard-columns"><div className="dashboard-main-column"><Card className="section-card progression-card"><div className="card-heading"><div><p className="eyebrow">YOUR PROGRESS</p><h3>Level {level.level} <span>· Curious explorer</span></h3></div><Badge className="xp-badge"><Zap size={12} /> {formatNumber(profile.xp)} XP</Badge></div><Progress className="level-progress" value={Math.round(level.current / level.needed * 100)} /><div className="progress-labels"><span>LEVEL {level.level}</span><span>{formatNumber(level.needed - level.current)} XP TO LEVEL {level.level + 1}</span></div><div className="level-marker"><span>✳</span><div><strong>Keep your curiosity in motion.</strong><small>Challenges, agents, and experiments all move your progress forward.</small></div><ArrowDownRight size={18} /></div></Card>
    <Card className="section-card quick-tools"><div className="card-heading"><div><p className="eyebrow">JUMP BACK IN</p><h3>Your lab tools</h3></div><span className="tool-count">06 MODULES</span></div><div className="tool-grid">{[{ icon: Bot, name: 'Agent builder', text: 'Make a sidekick', page: 'agents' as const, tone: 'tone-mint' }, { icon: Gamepad2, name: 'Challenge arena', text: 'Test your instincts', page: 'challenges' as const, tone: 'tone-cyan' }, { icon: Terminal, name: 'Prompt arena', text: 'Tune your prompts', page: 'prompts' as const, tone: 'tone-pink' }, { icon: BriefcaseBusiness, name: 'Startup sim', text: 'Build a business', page: 'startup' as const, tone: 'tone-amber' }, { icon: FlaskConical, name: 'Experiment lab', text: 'See models in action', page: 'experiments' as const, tone: 'tone-cyan' }, { icon: GraduationCap, name: "Mr. Al's academy", text: 'Earn the legend badge', page: 'academy' as const, tone: 'tone-lime' }].map(({ icon: Icon, name, text, page, tone }) => <button key={name} className="tool-link" onClick={() => setPage(page)}><span className={cx('tool-icon', tone)}><Icon size={17} /></span><span><strong>{name}</strong><small>{text}</small></span><ArrowRight size={15} /></button>)}</div></Card></div>
    <div className="dashboard-side-column"><Card className="section-card daily-card"><div className="daily-topline"><Badge className="daily-difficulty">{daily.difficulty}</Badge><span>+{daily.xp} XP</span></div><span className="daily-icon"><Target size={21} /></span><p className="eyebrow">TODAY&apos;S CHALLENGE</p><h3>{daily.title}</h3><p className="daily-category">{daily.category} <span>·</span> 3 min</p><Button className="daily-button" variant="secondary" onClick={() => setPage('challenges')}>Take the challenge <ArrowRight size={14} /></Button></Card>
    <Card className="section-card activity-card"><div className="card-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h3>Your lab log</h3></div><Clock3 size={16} className="subtle-icon" /></div>{activity.length ? <div className="activity-list">{activity.map((item, index) => <div className="activity-item" key={`${item.at}-${index}`}><span className="activity-dot" /><div><strong>{item.label}</strong><small>{item.detail}</small><time>{new Date(item.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</time></div></div>)}</div> : <div className="empty-activity"><span><Lightbulb size={18} /></span><p>Your next great idea goes here.</p><small>Try your first challenge and start a lab log.</small><button onClick={() => setPage('challenges')}>Browse challenges <ArrowRight size={13} /></button></div>}</Card></div></div>
    <div className="academy-strip"><div className="academy-seal"><Crown size={17} /></div><div><p className="eyebrow">SPECIAL PROGRAM / MR. AL&apos;S ACADEMY</p><strong>Five missions. One legendary teacher badge.</strong><span>Complete your first academy mission and begin the journey to MR. AL APPROVED.</span></div><Button variant="secondary" onClick={() => setPage('academy')}>Enter academy <ArrowRight size={15} /></Button></div>
  </>
}

function StatCard({ icon: Icon, label, value, unit, tone, foot }: { icon: typeof Activity; label: string; value: string; unit: string; tone: string; foot: string }) {
  return <Card className="stat-card"><div className={cx('stat-icon', `tone-${tone}`)}><Icon size={17} /></div><p>{label}</p><div className="stat-value">{value}<span>{unit}</span></div><small>{foot}</small></Card>
}

function AgentWorkspace({ profile, draft, setDraft, editing, setEditing, saveAgent, editAgent, removeAgent, activeAgent, setActiveAgent, activeAgentData, messages, message, setMessage, sendMessage }: {
  profile: LabProfile; draft: Omit<Agent, 'id'>; setDraft: (draft: Omit<Agent, 'id'>) => void; editing: string | null; setEditing: (id: string | null) => void; saveAgent: (event: FormEvent<HTMLFormElement>) => void; editAgent: (agent: Agent) => void; removeAgent: (id: string) => void; activeAgent: string | null; setActiveAgent: (id: string | null) => void; activeAgentData?: Agent; messages: { from: 'agent' | 'student'; text: string }[]; message: string; setMessage: (value: string) => void; sendMessage: (event: FormEvent<HTMLFormElement>) => void
}) {
  return <><PageHeading eyebrow="BUILD A DIGITAL SIDEKICK" title={<>Agent <span className="title-accent">workshop.</span></>} description="Design a character, give it a job, and see how it handles your ideas." action={<Badge className="simulation-badge"><Sparkles size={12} /> SIMULATED CHAT</Badge>} />
    <div className="agent-layout"><Card className="section-card agent-editor" id="agent-builder"><div className="card-heading"><div><p className="eyebrow">{editing ? 'EDIT YOUR AGENT' : 'AGENT CONFIGURATION'}</p><h3>{editing ? 'Tune your sidekick' : 'Give your idea a voice'}</h3></div><span className="editor-icon"><Bot size={18} /></span></div><form className="agent-form" onSubmit={saveAgent}><label>Agent name<Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="e.g. Orbit" maxLength={36} required /></label><div className="form-two"><label>Personality<Select value={draft.personality} onValueChange={(value) => setDraft({ ...draft, personality: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['Curious', 'Patient', 'Bold', 'Playful', 'Analytical'].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></label><label>Specialty<Select value={draft.specialty} onValueChange={(value) => setDraft({ ...draft, specialty: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['Study helper', 'Coding assistant', 'Creative coach', 'Business advisor', 'AI researcher'].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></label></div><label>Communication style<Select value={draft.style} onValueChange={(value) => setDraft({ ...draft, style: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['Clear & friendly', 'Short & direct', 'Detailed & thoughtful', 'Playful & energetic'].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></label><label>Custom instructions <span className="optional-label">OPTIONAL</span><Textarea value={draft.instructions} onChange={(event) => setDraft({ ...draft, instructions: event.target.value })} placeholder="What should your agent keep in mind?" maxLength={400} /></label><div className="agent-form-actions"><Button type="submit" variant="primary"><Sparkles size={15} /> {editing ? 'Save changes' : 'Build agent'}</Button>{editing && <Button type="button" variant="ghost" onClick={() => { setEditing(null); setDraft({ name: '', personality: 'Curious', specialty: 'Study helper', style: 'Clear & friendly', instructions: '' }) }}>Cancel</Button>}</div><p className="form-xp-note"><Zap size={12} /> Building your first agent earns 80 XP.</p></form></Card>
    <div className="agent-right"><Card className="agent-chat-card"><div className="chat-window-head"><span className="chat-agent-icon"><Bot size={17} /></span><div><strong>{activeAgentData?.name ?? 'Agent chat'}</strong><small>{activeAgentData ? `${activeAgentData.specialty} · ${activeAgentData.style}` : 'Choose an agent to begin'}</small></div><Badge className="simulation-badge">DEMO</Badge></div>{activeAgentData ? <><div className="agent-chat-log">{messages.length ? messages.map((item, index) => <div key={index} className={cx('agent-bubble-row', item.from === 'student' && 'student-bubble-row')}><span className="bubble-avatar">{item.from === 'agent' ? <Bot size={13} /> : 'YOU'}</span><p>{item.text}</p></div>) : <div className="chat-empty"><span><MessageSquareText size={21} /></span><strong>Say hello to {activeAgentData.name}.</strong><p>Your agent follows its saved specialty and instructions. Try asking for a first step.</p><div className="sample-chips"><button onClick={() => setMessage('Help me get unstuck on a new project.')}>Help me get unstuck</button><button onClick={() => setMessage('Explain this idea in a simple way.')}>Explain an idea</button></div></div>}</div><form className="agent-message-form" onSubmit={sendMessage}><Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Message your agent..." aria-label="Message your agent" /><Button type="submit" variant="primary" size="icon" aria-label="Send message" disabled={!message.trim()}><Send size={16} /></Button></form></> : <div className="chat-empty chat-empty-large"><span><Bot size={23} /></span><strong>Your agent&apos;s desk is ready.</strong><p>Build an agent and select it below to start a local demo conversation.</p></div>}<div className="demo-disclaimer"><ShieldCheck size={13} /> Responses are simulated locally. No AI model is connected and nothing is sent.</div></Card>
    <Card className="agent-list-card"><div className="card-heading"><div><p className="eyebrow">YOUR TOOLKIT</p><h3>Saved agents <span className="agent-count">{profile.agents.length}</span></h3></div><button className="icon-action" onClick={() => document.getElementById('agent-builder')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Create another agent"><Plus size={16} /></button></div>{profile.agents.length ? <div className="saved-agent-list">{profile.agents.map((agent) => <div className={cx('saved-agent', activeAgent === agent.id && 'saved-agent-active')} key={agent.id}><button className="saved-agent-main" onClick={() => setActiveAgent(agent.id)}><span className="saved-agent-avatar"><Bot size={15} /></span><span><strong>{agent.name}</strong><small>{agent.specialty} · {agent.personality}</small></span><ChevronRight size={15} /></button><div className="saved-agent-actions"><button onClick={() => editAgent(agent)} aria-label={`Edit ${agent.name}`}><Settings2 size={13} /></button><button onClick={() => removeAgent(agent.id)} aria-label={`Delete ${agent.name}`}><Trash2 size={13} /></button></div></div>)}</div> : <div className="mini-empty"><span><Bot size={16} /></span><p>No agents in your toolkit yet.</p><small>Your first build earns 80 XP.</small></div>}</Card></div></div>
    <div className="demo-note"><CircleHelp size={14} /><span><strong>About demo mode:</strong> Chat replies are locally generated starter suggestions, not outputs from a real language model. No API key or personal data is used.</span></div>
  </>
}

function ChallengesWorkspace({ challenge, challengeId, setChallengeId, answer, setAnswer, feedback, submit, completed, scores }: { challenge: Challenge; challengeId: string; setChallengeId: (id: string) => void; answer: number | null; setAnswer: (answer: number) => void; feedback: { score: number; text: string } | null; submit: () => void; completed: string[]; scores: Record<string, number> }) {
  return <><PageHeading eyebrow="PLAY · LEARN · LEVEL UP" title={<>Challenge <span className="title-accent">arena.</span></>} description="Real questions. Clear rules. XP when you get it right." action={<Badge><Trophy size={12} /> {completed.filter((id) => challenges.some((item) => item.id === id)).length} / {challenges.length} cleared</Badge>} /><div className="challenge-layout"><Card className="challenge-list-card"><div className="card-heading"><div><p className="eyebrow">MISSION SELECT</p><h3>Pick your next test</h3></div><Gamepad2 size={18} className="subtle-icon" /></div><div className="challenge-list">{challenges.map((item, index) => <button className={cx('challenge-item', item.id === challengeId && 'challenge-item-active')} key={item.id} onClick={() => setChallengeId(item.id)}><span className={cx('challenge-number', completed.includes(item.id) && 'challenge-number-done')}>{completed.includes(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span className="challenge-label"><strong>{item.title}</strong><small>{item.category}</small></span><span className="challenge-item-meta"><Badge className={cx('difficulty-badge', `difficulty-${item.difficulty.toLowerCase()}`)}>{item.difficulty}</Badge><small>+{item.xp} XP</small></span></button>)}</div></Card>
    <Card className="challenge-play-card"><div className="challenge-topline"><Badge>{challenge.category}</Badge><span><Clock3 size={13} /> 3 MIN</span></div><p className="eyebrow challenge-index">MISSION / {String(challenges.findIndex((item) => item.id === challenge.id) + 1).padStart(2, '0')}</p><h2>{challenge.title}</h2><p className="challenge-instruction">{challenge.prompt}</p><div className="answer-options" role="radiogroup" aria-label="Challenge answers">{challenge.options.map((option, index) => <button key={option} className={cx('answer-option', answer === index && 'answer-selected', feedback && index === challenge.answer && 'answer-correct')} onClick={() => setAnswer(index)} role="radio" aria-checked={answer === index}><span>{String.fromCharCode(65 + index)}</span><strong>{option}</strong>{answer === index && <Check size={15} />}</button>)}</div>{feedback && <div className={cx('challenge-feedback', feedback.score ? 'feedback-correct' : 'feedback-incorrect')}><span>{feedback.score ? <Check size={16} /> : <Lightbulb size={16} />}</span><p><strong>{feedback.score ? 'Correct answer' : 'Good try'}</strong><small>{feedback.text}</small></p><Badge>{feedback.score}%</Badge></div>}<div className="challenge-footer"><div><Badge className={cx('difficulty-badge', `difficulty-${challenge.difficulty.toLowerCase()}`)}>{challenge.difficulty}</Badge><span>{completed.includes(challenge.id) ? `Best score: ${scores[challenge.id] ?? 100}%` : `Reward: ${challenge.xp} XP`}</span></div><Button variant="primary" onClick={submit} disabled={answer === null || (!!feedback && feedback.score === 100)}>{completed.includes(challenge.id) ? 'Completed' : 'Lock in answer'} <ArrowRight size={15} /></Button></div></Card></div><div className="challenge-rule"><ShieldCheck size={14} /><span>Objective questions are checked against a fixed answer key; you can retry any mission before it is cleared.</span></div></>
}

function PromptWorkspace({ mission, missionId, setMissionId, text, setText, result, score, completed }: { mission: typeof promptMissions[number]; missionId: string; setMissionId: (id: string) => void; text: string; setText: (text: string) => void; result: { score: number; notes: string[]; dimensions: number[] } | null; score: () => void; completed: string[] }) {
  const dimensions = ['Clarity', 'Specificity', 'Context', 'Constraints', 'Output format']
  return <><PageHeading eyebrow="A GOOD PROMPT IS A SMALL SUPERPOWER" title={<>Prompt <span className="title-accent">arena.</span></>} description="Write the instructions. See the rubric. Make your next draft stronger." action={<Badge className="simulation-badge"><Target size={12} /> TRANSPARENT RUBRIC</Badge>} /><div className="prompt-layout"><Card className="prompt-mission-card"><p className="eyebrow">MISSION DECK</p><h3>Choose a brief.</h3>{promptMissions.map((item, index) => <button key={item.id} className={cx('prompt-mission', item.id === missionId && 'prompt-mission-active')} onClick={() => setMissionId(item.id)}><span className="prompt-mission-index">0{index + 1}</span><span><small>{item.level}</small><strong>{item.title}</strong></span>{completed.includes(item.id) ? <Check size={15} className="complete-check" /> : <ChevronRight size={15} />}</button>)}<div className="rubric-mini"><span><ShieldCheck size={15} /></span><p><strong>Scoring is visible.</strong><small>Five dimensions · 20 points each. No AI model is involved.</small></p></div></Card><Card className="prompt-workbench"><div className="workbench-header"><Badge className="mission-level">{mission.level}</Badge><span>{completed.includes(mission.id) ? 'MISSION CLEARED' : '+45 XP AT 45 POINTS'}</span></div><h2>{mission.title}</h2><p className="mission-brief">{mission.mission}</p><label className="prompt-label" htmlFor="prompt-draft">YOUR PROMPT <span>{text.length} / 600</span></label><Textarea id="prompt-draft" className="prompt-textarea" value={text} onChange={(event) => setText(event.target.value.slice(0, 600))} placeholder="Write the exact instructions you would give the AI..." /><div className="prompt-toolbar"><span><Lightbulb size={13} /> Specific details help your score.</span><Button variant="primary" onClick={score} disabled={!text.trim()}><Zap size={14} /> Evaluate prompt</Button></div>{result && <div className="rubric-results"><div className="rubric-score"><div className="score-circle" style={{ '--score': `${result.score * 3.6}deg` } as React.CSSProperties}><span>{result.score}<small>/100</small></span></div><div><strong>{result.score >= 75 ? 'Strong prompt.' : result.score >= 45 ? 'Mission cleared.' : 'Room to sharpen.'}</strong><small>{result.score >= 45 ? 'This is a useful set of instructions.' : 'Reach 45 points to clear the mission and earn XP.'}</small></div></div><div className="rubric-bars">{dimensions.map((dimension, index) => <div className="rubric-row" key={dimension}><span>{dimension}</span><Progress value={result.dimensions[index] * 5} /><small>{result.dimensions[index]}</small></div>)}</div><ul className="rubric-notes">{result.notes.map((note) => <li key={note}><Check size={12} />{note}</li>)}</ul></div>}</Card></div></>
}

function StartupWorkspace({ company, name, setName, idea, setIdea, industry, setIndustry, create, action, reset }: { company: Company; name: string; setName: (value: string) => void; idea: string; setIdea: (value: string) => void; industry: string; setIndustry: (value: string) => void; create: (event: FormEvent<HTMLFormElement>) => void; action: (kind: 'product' | 'hire' | 'marketing' | 'pivot') => void; reset: () => void }) {
  if (!company.started) return <><PageHeading eyebrow="PLAY · BUILD A BUSINESS" title={<>Startup <span className="title-accent">simulator.</span></>} description="One fictional seed fund. A market to explore. Your decisions shape the outcome." action={<Badge className="simulation-badge"><BriefcaseBusiness size={12} /> GAME SIMULATION</Badge>} /><Card className="startup-setup"><div className="setup-art"><div className="setup-orbit"><Rocket size={30} /></div><span>SEED ROUND / $50,000</span></div><form className="startup-form" onSubmit={create}><p className="eyebrow">YOUR COMPANY STARTS HERE</p><h2>Pick a problem<br /><span>worth solving.</span></h2><p className="form-description">You start with $50,000 in fictional funding. Build a product, grow your customers, and see if you can stay in business.</p><label>Company name<Input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Brightside Labs" maxLength={40} required /></label><label>Your startup idea<Input value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="What problem are you solving?" maxLength={120} required /></label><label>Industry<Select value={industry} onValueChange={setIndustry}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['Education', 'Climate', 'Health', 'Creative tools', 'Community', 'Productivity'].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></label><Button type="submit" variant="primary">Open your company <ArrowRight size={15} /></Button></form></Card><SimulationDisclaimer text="Business figures and market events are fictional, deterministic game mechanics. No real money or companies are involved." /></>
  const profit = company.revenue - company.expenses
  const valuation = Math.max(0, company.revenue * 8 + company.customers * 80 + company.products * 15000)
  return <><PageHeading eyebrow={`WEEK ${String(company.week).padStart(2, '0')} · ${company.industry.toUpperCase()}`} title={<>{company.name} <span className="title-accent">HQ.</span></>} description={company.idea} action={<Button variant="ghost" size="sm" onClick={() => { if (window.confirm('Close this startup and restart the simulator?')) reset() }}><RotateCcw size={14} /> Restart</Button>} /><div className="business-metrics">{[{ icon: Zap, label: 'RUNWAY', value: money(company.cash), tone: 'tone-lime' }, { icon: BarChart3, label: 'WEEKLY REVENUE', value: money(company.revenue), tone: 'tone-cyan' }, { icon: Activity, label: 'WEEKLY PROFIT', value: money(profit), tone: profit >= 0 ? 'tone-lime' : 'tone-pink' }, { icon: Target, label: 'CUSTOMERS', value: formatNumber(company.customers), tone: 'tone-amber' }, { icon: Rocket, label: 'VALUATION', value: money(valuation), tone: 'tone-pink' }].map(({ icon: Icon, label, value, tone }) => <Card className="business-metric" key={label}><span className={cx('metric-icon', tone)}><Icon size={15} /></span><small>{label}</small><strong>{value}</strong></Card>)}</div><div className="business-layout"><Card className="section-card business-decisions"><div className="card-heading"><div><p className="eyebrow">YOUR NEXT MOVE</p><h3>Invest one week.</h3></div><Badge>WEEK {company.week}</Badge></div><div className="decision-list">{[{ id: 'product' as const, icon: Rocket, title: 'Build a product', text: 'Prototype a useful first release.', cost: 8000 }, { id: 'hire' as const, icon: Bot, title: 'Hire a teammate', text: 'Add an employee. Weekly payroll applies.', cost: 5000 }, { id: 'marketing' as const, icon: Zap, title: 'Run a campaign', text: 'Spend to reach a bigger audience.', cost: 3500 }, { id: 'pivot' as const, icon: BrainCircuit, title: 'Research a pivot', text: 'Talk to customers and rethink the offer.', cost: 6000 }].map(({ id, icon: Icon, title, text, cost }) => <div className="decision-row" key={id}><span><Icon size={17} /></span><div><strong>{title}</strong><small>{text}</small></div><Button size="sm" variant="secondary" disabled={company.cash < cost} onClick={() => action(id)}>{money(cost)} <ArrowRight size={12} /></Button></div>)}</div><div className="business-asset-row"><span><Code2 size={15} /> PRODUCTS <strong>{company.products}</strong></span><span><Bot size={15} /> TEAM <strong>{company.employees}</strong></span><span><Zap size={15} /> MARKETING <strong>{company.marketing}</strong></span></div></Card><Card className="section-card business-log"><div className="card-heading"><div><p className="eyebrow">MARKET SIGNAL</p><h3>Founder&apos;s log</h3></div><Activity size={16} className="subtle-icon" /></div>{company.log.length ? <div className="event-log">{company.log.map((line, index) => <div key={`${line}-${index}`}><span className="event-log-dot" /><p>{line}</p></div>)}</div> : <div className="market-empty"><span><BriefcaseBusiness size={19} /></span><strong>Your first week is unwritten.</strong><small>Make a move to meet your first market event.</small></div>}<div className="business-health"><div><span>Cash runway</span><strong>{Math.max(0, Math.floor(company.cash / Math.max(1, company.expenses)))} weeks</strong></div><Progress value={Math.min(100, Math.max(0, company.cash / 500))} /><small>Weekly costs include $350 baseline, payroll, and marketing.</small></div></Card></div><SimulationDisclaimer text="This is a fictional strategy game. Revenue, expenses, customers, and competitors are simulated with consistent rules; they are not real business forecasts." /></>
}

function ExperimentsWorkspace({ input, setInput, secondary, setSecondary, risk, setRisk, budget, setBudget, sampleIndex, feedback, guess, nextSample, humanScore, runExperiment, points, setPoints, classifierX, classifierY, setClassifier }: { input: number; setInput: (value: number) => void; secondary: number; setSecondary: (value: number) => void; risk: number; setRisk: (value: number) => void; budget: number; setBudget: (value: number) => void; sampleIndex: number; feedback: string; guess: (guess: 'human' | 'ai') => void; nextSample: () => void; humanScore: number; runExperiment: () => void; points: LabProfile['experiments']['points']; setPoints: (points: LabProfile['experiments']['points']) => void; classifierX: number; classifierY: number; setClassifier: (x: number, y: number) => void }) {
  const output = Math.round(100 / (1 + Math.exp(-((input * .055 + secondary * .042) - 4.8))))
  const decisionScore = Math.max(0, Math.min(100, Math.round(100 - risk * .65 + budget * .2)))
  const decision = risk > 65 ? 'PAUSE & REVIEW' : budget < 25 ? 'NEEDS RESOURCES' : decisionScore >= 65 ? 'PROCEED TO TEST' : 'GATHER MORE DATA'
  const sample = humanSamples[sampleIndex]
  return <><PageHeading eyebrow="TOUCH THE VARIABLES. SEE WHAT CHANGES." title={<>Experiment <span className="title-accent">lab.</span></>} description="Small models. Visible inputs. You are in control of the experiment." action={<Badge className="simulation-badge"><FlaskConical size={12} /> INTERACTIVE MODELS</Badge>} /><div className="experiment-grid"><Card className="experiment-card network-card"><div className="experiment-heading"><span className="experiment-icon tone-cyan"><Network size={17} /></span><Badge>01 / NEURAL NET</Badge><span className="live-tag"><i /> LIVE</span></div><h3>A tiny neural network.</h3><p>Two inputs flow through a weighted hidden layer. Change a signal and watch the output respond.</p><div className="network-diagram"><div className="network-column"><small>INPUTS</small><span className="network-node input-node">{input}%</span><span className="network-node input-node input-node-alt">{secondary}%</span></div><div className="network-links"><i /><i /><i /><i /></div><div className="network-column hidden-column"><small>HIDDEN</small><span className="network-node hidden-node">Σ</span><span className="network-node hidden-node hidden-node-alt">Σ</span></div><div className="network-links output-links"><i /><i /></div><div className="network-column output-column"><small>OUTPUT</small><span className="network-node output-node">{output}%</span></div></div><div className="slider-control"><label htmlFor="input-a">Signal A <strong>{input}%</strong></label><input id="input-a" type="range" min="0" max="100" value={input} onChange={(event) => setInput(Number(event.target.value))} /></div><div className="slider-control"><label htmlFor="input-b">Signal B <strong>{secondary}%</strong></label><input id="input-b" type="range" min="0" max="100" value={secondary} onChange={(event) => setSecondary(Number(event.target.value))} /></div><div className="output-readout"><span>MODEL OUTPUT</span><strong>{output}<small>%</small></strong></div></Card>
    <Card className="experiment-card decision-card"><div className="experiment-heading"><span className="experiment-icon tone-amber"><Target size={17} /></span><Badge>02 / DECISION SIM</Badge><span className="live-tag"><i /> LIVE</span></div><h3>Should this idea launch?</h3><p>A transparent decision rule weighs risk and available budget. Adjust the inputs and see what changes.</p><div className="decision-verdict"><span className="verdict-icon"><BrainCircuit size={20} /></span><div><small>RULE-BASED RECOMMENDATION</small><strong>{decision}</strong></div><span className="verdict-score">{decisionScore}<small>/100</small></span></div><div className="slider-control"><label htmlFor="risk-input">Risk level <strong>{risk}%</strong></label><input id="risk-input" type="range" min="0" max="100" value={risk} onChange={(event) => setRisk(Number(event.target.value))} /></div><div className="slider-control"><label htmlFor="budget-input">Budget readiness <strong>{budget}%</strong></label><input id="budget-input" type="range" min="0" max="100" value={budget} onChange={(event) => setBudget(Number(event.target.value))} /></div><div className="rule-note"><ShieldCheck size={14} /><span>Rule: pause above 65% risk. Otherwise, require 25% budget readiness and a 65-point score.</span></div></Card>
    <Card className="experiment-card classifier-card"><div className="experiment-heading"><span className="experiment-icon tone-lime"><BrainCircuit size={17} /></span><Badge>03 / MACHINE LEARNING</Badge><span className="live-tag"><i /> LIVE</span></div><h3>Train a tiny classifier.</h3><p>Move a data point and add labeled examples. The nearest-neighbor model updates from your training set.</p><Classifier points={points} setPoints={setPoints} x={classifierX} y={classifierY} setPosition={setClassifier} />
    </Card><Card className="experiment-card human-card"><div className="experiment-heading"><span className="experiment-icon tone-pink"><MessageSquareText size={17} /></span><Badge>04 / AI VS HUMAN</Badge><span className="human-score">{humanScore} PTS</span></div><h3>Who wrote this?</h3><p>Read one sample and make your best call. These are fictional writing samples created for this quiz.</p><div className="sample-card"><span>{sample.label} · BLIND TEST</span><p>“{sample.text}”</p></div><div className="guess-actions"><Button variant="secondary" onClick={() => guess('human')}>Written by a human</Button><Button variant="secondary" onClick={() => guess('ai')}>AI-generated</Button></div>{feedback && <div className="sample-feedback"><span>{feedback}</span><Button size="sm" variant="ghost" onClick={nextSample}>Next sample <ArrowRight size={13} /></Button></div>}</Card></div><div className="experiment-complete"><span><Sparkles size={15} /></span><div><strong>Exploration counts.</strong><small>Run any experiment once to log your first lab session and earn 50 XP.</small></div><Button variant="primary" onClick={runExperiment}><FlaskConical size={15} /> Log experiment</Button></div></>
}

function Classifier({ points, setPoints, x, y, setPosition }: { points: LabProfile['experiments']['points']; setPoints: (points: LabProfile['experiments']['points']) => void; x: number; y: number; setPosition: (x: number, y: number) => void }) {
  const samples = points
  const nearest = samples.map((sample) => ({ ...sample, distance: Math.hypot(sample.x - x, sample.y - y) })).sort((a, b) => a.distance - b.distance)[0]
  const predicted = nearest.label
  return <><div className="classifier-plane" aria-label="Two-dimensional classification plot"><span className="plane-axis axis-x">FEATURE A</span><span className="plane-axis axis-y">FEATURE B</span>{samples.map((point, index) => <span key={index} className={cx('training-point', `point-${point.label}`)} style={{ left: `${point.x}%`, top: `${100 - point.y}%` }} title={`Training example: ${point.label}`} />)}<span className={cx('query-point', predicted === 'mint' ? 'query-mint' : 'query-pink')} style={{ left: `${x}%`, top: `${100 - y}%` }} title="Your query point" /></div><div className="classifier-result"><span className={cx('class-dot', predicted === 'mint' ? 'point-mint' : 'point-pink')} /><span>Prediction: <strong>{predicted === 'mint' ? 'MINT CLASS' : 'PINK CLASS'}</strong></span><small>nearest example · {Math.round(nearest.distance)} units away · {samples.length} samples</small></div><div className="slider-control"><label htmlFor="point-x">Feature A <strong>{x}</strong></label><input id="point-x" type="range" min="5" max="95" value={x} onChange={(event) => setPosition(Number(event.target.value), y)} /></div><div className="slider-control"><label htmlFor="point-y">Feature B <strong>{y}</strong></label><input id="point-y" type="range" min="5" max="95" value={y} onChange={(event) => setPosition(x, Number(event.target.value))} /></div><div className="training-actions"><span>TRAIN THIS POINT AS</span><Button size="sm" variant="secondary" onClick={() => setPoints([...points, { x, y, label: 'mint' }].slice(-100))}><i className="point-mint" /> Mint</Button><Button size="sm" variant="secondary" onClick={() => setPoints([...points, { x, y, label: 'pink' }].slice(-100))}><i className="point-pink" /> Pink</Button></div><p className="classifier-legend"><i className="point-mint" /> MINT TRAINING DATA <i className="point-pink" /> PINK TRAINING DATA <i className="query-legend" /> YOUR POINT</p></>
}

function AcademyWorkspace({ profile, explainText, setExplainText, finishExplain, goTo, complete }: { profile: LabProfile; explainText: string; setExplainText: (value: string) => void; finishExplain: (event: FormEvent<HTMLFormElement>) => void; goTo: (page: PageId) => void; complete: (id: string) => void }) {
  const missions = [
    { id: 'explain', number: '01', title: 'Explain an AI concept', text: 'Teach an imaginary middle-schooler one AI idea. In your own words.', page: null },
    { id: 'challenge', number: '02', title: 'Solve a technology puzzle', text: 'Clear any challenge in the arena. Show your reasoning.', page: 'challenges' as const },
    { id: 'agent', number: '03', title: 'Build an AI agent', text: 'Create a sidekick with a specialty and a point of view.', page: 'agents' as const },
    { id: 'prompt', number: '04', title: 'Complete a prompt mission', text: 'Write a prompt with enough detail to score at least 45.', page: 'prompts' as const },
    { id: 'experiment', number: '05', title: 'Finish an AI experiment', text: 'Adjust a live model and log your experiment session.', page: 'experiments' as const },
  ]
  const prerequisites = [profile.completed.some((id) => challenges.some((challenge) => challenge.id === id)), profile.agentsBuilt > 0, profile.promptsDone > 0, profile.experimentsDone > 0]
  const isDone = (id: string) => profile.academyMissions.includes(id) || (id === 'challenge' && prerequisites[0]) || (id === 'agent' && prerequisites[1]) || (id === 'prompt' && prerequisites[2]) || (id === 'experiment' && prerequisites[3])
  return <><PageHeading eyebrow="THE SPECIAL PROGRAM" title={<>Mr. Al&apos;s <span className="title-accent">academy.</span></>} description="Five small missions. One very large teacher rating. All in good fun." action={<Badge className="mr-badge"><Crown size={12} /> MR. AL APPROVED {profile.academyMissions.length >= 5 && <Check size={12} />}</Badge>} /><section className="mr-hero"><div className="mr-hero-glow" /><div className="mr-badge-mark"><Crown size={26} /></div><div><Badge className="mr-hero-label">ACADEMY DOSSIER / 001</Badge><h2>Mr. Al.<br /><span>The best teacher ever.</span></h2><p>Independent research by a deeply biased student panel has reached a clear conclusion.</p></div><div className="ratings-stamp"><strong>100<span>/10</span></strong><small>LEGEND STATUS</small></div></section><div className="mr-ratings">{[{ title: 'Teaching', rating: '10/10', fill: '100%' }, { title: 'AI knowledge', rating: '10/10', fill: '100%' }, { title: 'Legendary status', rating: '100/10', fill: '100%' }].map((item) => <div key={item.title}><span>{item.title}</span><Progress value={100} /><strong>{item.rating}</strong></div>)}</div><p className="rating-disclaimer"><Sparkles size={13} /> These ratings are playful, unofficial, and extremely biased. Please do not cite in a scientific journal.</p><Card className="academy-missions-card"><div className="card-heading"><div><p className="eyebrow">THE APPROVAL RUN</p><h3>Academy missions <span>{profile.academyMissions.length}/5</span></h3></div><div className="academy-progress-count"><strong>{Math.min(100, Math.round(profile.academyMissions.length / 5 * 100))}%</strong><small>COMPLETE</small></div></div><Progress value={profile.academyMissions.length / 5 * 100} className="academy-progress" /><div className="academy-mission-list">{missions.map((mission) => { const done = isDone(mission.id); return <div className={cx('academy-mission', done && 'academy-mission-done')} key={mission.id}><span className="academy-mission-number">{done ? <Check size={15} /> : mission.number}</span><div className="academy-mission-copy"><strong>{mission.title}</strong><small>{mission.text}</small></div>{mission.id === 'explain' && !done ? <form className="academy-explain-form" onSubmit={finishExplain}><Input value={explainText} onChange={(event) => setExplainText(event.target.value)} placeholder="Explain it in your own words..." aria-label="Explain an AI concept" /><Button type="submit" size="sm" variant="primary">Submit</Button></form> : done ? <Badge className="mission-done-pill"><Check size={11} /> CLEARED</Badge> : <Button size="sm" variant="secondary" onClick={() => mission.page && goTo(mission.page)}>Open mission <ArrowRight size={13} /></Button>}</div>})}</div>{profile.academyMissions.length >= 5 && <div className="approved-banner"><span className="approved-burst">✳</span><div><strong>MR. AL APPROVED</strong><small>Legendary teacher status confirmed by very silly science.</small></div><Crown size={22} /></div>}</Card></>
}

function AchievementsWorkspace({ profile }: { profile: LabProfile }) {
  const unlocked = profile.achievements.length
  return <><PageHeading eyebrow="PROOF YOU SHOWED UP" title={<>Your <span className="title-accent">trophy case.</span></>} description="Every badge has a real unlock condition. Keep exploring to fill the collection." action={<Badge><Award size={12} /> {unlocked} / {achievementCatalog.length} UNLOCKED</Badge>} /><div className="achievement-summary"><div><span><Trophy size={18} /></span><strong>{unlocked}<small> / {achievementCatalog.length}</small></strong><p>BADGES COLLECTED</p></div><Progress value={unlocked / achievementCatalog.length * 100} /><span>{Math.round(unlocked / achievementCatalog.length * 100)}% complete</span></div><div className="achievement-grid">{achievementCatalog.map((item, index) => { const earned = profile.achievements.includes(item.id); const Icon = item.icon === 'Crown' ? Crown : item.icon === 'Bot' ? Bot : item.icon === 'Network' ? Network : item.icon === 'Trophy' ? Trophy : item.icon === 'WandSparkles' ? WandSparkles : Sparkles; return <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }}><Card className={cx('achievement-card', earned && 'achievement-earned')}><span className={cx('achievement-icon', `tone-${item.color}`)}><Icon size={22} /></span><Badge className={cx('achievement-status', earned ? 'status-earned' : '')}>{earned ? <><Check size={10} /> EARNED</> : 'LOCKED'}</Badge><h3>{item.title}</h3><p>{item.description}</p>{earned ? <span className="earned-caption"><Sparkles size={12} /> Added to your record</span> : <div className="achievement-hint"><span>UNLOCK CONDITION</span><small>{item.description}</small></div>}</Card></motion.div>})}</div><div className="achievement-footnote"><ShieldCheck size={14} /><span>Badges are awarded by the app when your saved progress meets each condition.</span></div></>
}

function LeaderboardWorkspace({ profile, level }: { profile: LabProfile; level: ReturnType<typeof levelForXp> }) {
  const rows = useMemo(() => [...demoProfiles, { name: profile.username, xp: profile.xp, title: `Level ${level.level} explorer`, student: true }].sort((a, b) => b.xp - a.xp), [profile.username, profile.xp, level.level])
  return <><PageHeading eyebrow="A LITTLE FRIENDLY CONTEXT" title={<>Local <span className="title-accent">leaderboard.</span></>} description="A demo board for your browser session. The other profiles are fictional examples." action={<Badge className="simulation-badge"><ShieldCheck size={12} /> LOCAL / DEMO DATA</Badge>} /><Card className="leaderboard-card"><div className="leaderboard-head"><div><p className="eyebrow">THE LAB BOARD</p><h2>Curiosity, in motion.</h2><p>Ranked by XP earned in this browser and sample demo profiles.</p></div><span className="leaderboard-trophy"><Trophy size={22} /></span></div><div className="leaderboard-columns"><span>RANK / STUDENT</span><span>STATUS</span><span>TOTAL XP</span></div><div className="leaderboard-rows">{rows.map((row, index) => <div className={cx('leaderboard-row', 'student' in row && row.student && 'leaderboard-you')} key={row.name}><span className={cx('leaderboard-rank', index < 3 && `rank-${index + 1}`)}>{String(index + 1).padStart(2, '0')}</span><span className="leaderboard-person"><span className="leaderboard-avatar">{row.name.slice(0, 1)}</span><span><strong>{row.name}{'student' in row && row.student && <Badge>YOU</Badge>}</strong><small>{row.title}</small></span></span><Badge className="rank-status">{index === 0 ? 'TOP EXPLORER' : `${Math.max(1, 100 - index * 13)}% ACTIVE`}</Badge><strong className="leaderboard-xp">{formatNumber(row.xp)} <small>XP</small></strong></div>)}</div><div className="leaderboard-foot"><span><span className="live-dot" /> THIS DEVICE ONLY</span><span>DEMO PROFILES ARE FICTIONAL</span></div></Card><div className="backend-note"><CircleHelp size={15} /><span><strong>Not a shared school leaderboard.</strong> Scores are stored only in this browser. A real shared board would need an authenticated backend and a shared database.</span></div></>
}

function SimulationDisclaimer({ text }: { text: string }) {
  return <div className="simulation-disclaimer"><ShieldCheck size={14} /><span>{text}</span></div>
}