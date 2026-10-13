import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  Atom,
  Bot,
  BrainCircuit,
  Check,
  Code2,
  Cpu,
  FlaskConical,
  Gamepad2,
  Heart,
  Menu,
  MessageCircle,
  Network,
  Palette,
  Send,
  Sparkles,
  Terminal,
  WandSparkles,
  X,
  type LucideIcon,
} from 'lucide-react'

type Topic = { title: string; icon: LucideIcon; tone: string }
type Project = { title: string; description: string; tags: string[]; image: string; number: string; status: string; href?: string }
type ChatMessage = { from: 'club' | 'you'; text: string }

const topics: Topic[] = [
  { title: 'AI tools', icon: WandSparkles, tone: 'mint' },
  { title: 'Coding & building', icon: Code2, tone: 'blue' },
  { title: 'AI agents', icon: Bot, tone: 'orange' },
  { title: 'Machine learning', icon: BrainCircuit, tone: 'pink' },
  { title: 'Prompt engineering', icon: Terminal, tone: 'blue' },
  { title: 'Creative AI', icon: Palette, tone: 'orange' },
  { title: 'AI projects', icon: FlaskConical, tone: 'mint' },
  { title: 'Future tech', icon: Cpu, tone: 'pink' },
]

const activities = [
  { title: 'Build AI projects', text: 'Make AI-powered websites, apps, games, agents, and wonderfully weird experiments.', icon: Code2, color: 'mint' },
  { title: 'Try new AI tools', text: 'Get hands-on with new models and products, and find out what they are actually good at.', icon: Sparkles, color: 'blue' },
  { title: 'Take on AI challenges', text: 'Team up, test ideas, and see who can solve a real problem in the most creative way.', icon: Gamepad2, color: 'orange' },
  { title: 'Understand how it works', text: 'Untangle big AI ideas into clear, human-sized explanations you can use.', icon: Atom, color: 'pink' },
  { title: 'Create with AI', text: 'Bring AI into coding, design, brainstorming, research, and whatever comes next.', icon: Palette, color: 'mint' },
]

const projects: Project[] = [
  { title: 'AI Website', description: 'A little more internet, a little more intelligent. Our first build is taking shape.', tags: ['React', 'AI tools'], image: 'photo-1550745165-9bc0b252726f', number: '01', status: 'In the works' },
  { title: 'AI Agent', description: 'A helpful digital sidekick that can take an idea and turn it into a plan.', tags: ['Agents', 'Automation'], image: 'photo-1518770660439-4636190af475', number: '02', status: 'In the works' },
  { title: 'AI Game', description: 'A playful experiment in making game characters a little less predictable.', tags: ['Creative AI', 'Play'], image: 'photo-1550745165-9bc0b252726f', number: '03', status: 'On the board' },
  { title: 'AI Experiment', description: 'A fresh question, a handful of tools, and absolutely no fear of a first draft.', tags: ['Machine learning', 'Research'], image: 'photo-1518770660439-4636190af475', number: '04', status: 'Coming soon' },
]

const ratings = [
  { title: 'Teaching', score: '10/10', value: 100 },
  { title: 'AI knowledge', score: '10/10', value: 100 },
  { title: 'Helping students', score: '10/10', value: 100 },
  { title: 'Being Mr. Al', score: '100/10', value: 100 },
]

const badges = [
  { icon: '🏆', label: 'Best teacher ever' },
  { icon: '🧠', label: 'AI mastermind' },
  { icon: '💡', label: 'Professional idea generator' },
  { icon: '🚀', label: 'Future builder' },
  { icon: '⭐', label: 'AI Club legend' },
]

const suggestions = ['What is AI?', 'What do we do in AI Club?', 'Why should I join?', 'Who is Mr. Al?']

function answerFor(question: string) {
  const value = question.toLowerCase()
  if (value.includes('mr') || value.includes('al') || value.includes('teacher')) {
    return 'According to highly scientific AI Club research, Mr. Al has officially achieved legendary teacher status. The data is extremely convincing.'
  }
  if (value.includes('join') || value.includes('why')) {
    return 'Because you get to try the tools, build things with friends, and learn by doing. No experience required. Curiosity is plenty.'
  }
  if (value.includes('club') || value.includes('do')) {
    return 'We explore AI tools, break down how AI works, tackle friendly challenges, and make projects together. Bring an idea; we will help you build it.'
  }
  if (value.includes('agent')) {
    return 'An AI agent is a system that can work through a task in steps, using tools along the way. We experiment with what agents can do, and where a human should stay in charge.'
  }
  if (value.includes('machine') || value.includes('learn')) {
    return 'Machine learning is how computers find patterns in examples and use those patterns to make predictions. In the club, we make the big ideas easier to see.'
  }
  return 'AI is technology that can do tasks we associate with human thinking, like recognizing patterns, working with language, or generating ideas. In AI Club, you get to experiment with how it works.'
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'club', text: 'Hey! Curious about AI Club? Ask me anything, or pick a question below.' },
  ])
  const [joinOpen, setJoinOpen] = useState(false)
  const [joinSent, setJoinSent] = useState(false)

  function ask(questionText: string) {
    const trimmed = questionText.trim()
    if (!trimmed) return
    setMessages((current) => [...current, { from: 'you', text: trimmed }, { from: 'club', text: answerFor(trimmed) }])
    setQuestion('')
  }

  function handleAsk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    ask(question)
  }

  function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setJoinSent(true)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#home" onClick={closeMenu} aria-label="AI Club home">
          <span className="wordmark-icon"><Network size={17} strokeWidth={2.4} /></span>
          <span>AI<span className="wordmark-dot">.</span>CLUB</span>
        </a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#activities" onClick={closeMenu}>What we do</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a href="#mr-al" onClick={closeMenu}>Mr. Al</a>
          <button className="nav-join" type="button" onClick={() => { closeMenu(); setJoinOpen(true); setJoinSent(false) }}>Join the club <ArrowUpRightIcon /></button>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <Reveal>
              <p className="eyebrow"><span className="status-dot" /> YOUR CURIOSITY, MEET AI</p>
              <h1>AI<br /><span>CLUB</span><sup>01</sup></h1>
              <p className="hero-tagline">Learn. Build. Experiment.<br /><span>Create the future.</span></p>
              <p className="hero-description">A place to explore artificial intelligence, try the tools, build things that surprise you, and figure out what this technology can really do.</p>
              <div className="hero-actions">
                <button className="button button-lime" type="button" onClick={() => { setJoinOpen(true); setJoinSent(false) }}>Join the AI Club <ArrowRight size={17} /></button>
                <a className="button button-quiet" href="#about">Explore what we do <ArrowDownRight size={17} /></a>
              </div>
              <div className="hero-footnote"><span>NO EXPERIENCE NEEDED</span><span className="footnote-line" /><span>JUST BRING YOUR QUESTIONS</span></div>
            </Reveal>
          </div>
          <div className="hero-visual" aria-label="Close-up image of a circuit board">
            <div className="hero-photo" />
            <div className="hero-image-shade" />
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <motion.div className="scan-line" aria-hidden="true" animate={{ y: ['0%', '260%', '0%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
            <div className="hero-visual-label"><span className="visual-cross">✳</span><span>IDEAS IN<br />MOTION</span><span className="visual-label-line" /></div>
            <motion.div className="hero-float hero-float-top" animate={{ y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <span className="float-icon"><BrainCircuit size={18} /></span><span><small>LEARNING MODE</small><strong>ON<span className="status-dot" /></strong></span>
            </motion.div>
            <motion.div className="hero-float hero-float-bottom" animate={{ y: [0, 7, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <span className="signal-bars"><i /><i /><i /><i /><i /></span><span><small>IDEA SIGNAL</small><strong>STRONG</strong></span><span className="signal-arrow"><ArrowDownRight size={17} /></span>
            </motion.div>
            <span className="visual-index">FIG. 001 — POSSIBILITIES</span>
          </div>
          <a href="#about" className="scroll-cue"><ArrowDown size={14} /> SCROLL TO EXPLORE</a>
          <span className="hero-coordinate">40° 42' 46.08" N&nbsp;&nbsp; / &nbsp;&nbsp;CURIOUS MINDS</span>
        </section>

        <section className="intro section-pad" id="about">
          <Reveal className="section-heading-row">
            <div><p className="eyebrow"><span className="section-number">01</span> A CLUB FOR THE CURIOUS</p><h2>AI is changing<br />the <span className="text-outline">whole</span> picture.</h2></div>
            <div className="intro-copy"><p>Technology, science, business, creativity, everyday life. AI is finding its way into all of it.</p><p>We think the best way to understand it is to get your hands on it. The club is where students can experiment, ask the big questions, and turn “what if?” into “look what we made.”</p><a href="#activities" className="text-link">Get to know the club <ArrowDownRight size={16} /></a></div>
          </Reveal>
          <div className="topic-grid">
            {topics.map(({ title, icon: Icon, tone }, index) => (
              <Reveal key={title} delay={index * 0.035}>
                <motion.article className={`topic-tile tone-${tone}`} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <span className="topic-index">0{index + 1}</span><Icon className="topic-icon" size={22} strokeWidth={1.7} /><span className="topic-title">{title}</span><ArrowDownRight className="topic-arrow" size={16} />
                </motion.article>
              </Reveal>
            ))}
          </div>
          <div className="marquee" aria-label="Learn by doing, make something real">
            <div className="marquee-track" aria-hidden="true">LEARN BY DOING <span>✳</span> MAKE SOMETHING REAL <span>✳</span> STAY CURIOUS <span>✳</span> LEARN BY DOING <span>✳</span> MAKE SOMETHING REAL <span>✳</span> STAY CURIOUS <span>✳</span></div>
          </div>
        </section>

        <section className="activities section-pad" id="activities">
          <Reveal className="activities-heading">
            <div><p className="eyebrow"><span className="section-number">02</span> LESS TALK, MORE TRY</p><h2>So, what do<br />we <span className="text-lime">actually do?</span></h2></div>
            <p className="heading-aside">A little learning. A lot of making.<br />Never just another lecture.</p>
          </Reveal>
          <div className="activity-list">
            {activities.map(({ title, text, icon: Icon, color }, index) => (
              <Reveal key={title} delay={index * 0.045}>
                <article className={`activity-row activity-${color}`}>
                  <span className="activity-number">0{index + 1}</span><span className="activity-icon"><Icon size={21} strokeWidth={1.7} /></span><div className="activity-copy"><h3>{title}</h3><p>{text}</p></div><ArrowDownRight className="activity-arrow" size={22} />
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="teacher section-pad" id="mr-al">
          <div className="teacher-glow" aria-hidden="true" />
          <Reveal className="teacher-kicker"><p className="eyebrow"><span className="section-number">03</span> VERY IMPORTANT CLUB DATA</p><span className="teacher-stamp"><Heart size={13} fill="currentColor" /> VERIFIED BY STUDENTS</span></Reveal>
          <div className="teacher-layout">
            <Reveal className="teacher-intro">
              <p className="teacher-overline">THE HUMAN BEHIND THE ALGORITHMS</p><h2>Meet<br />Mr. Al<span className="teacher-period">.</span></h2><p className="teacher-subtitle">The best teacher ever.</p>
              <p className="teacher-description">Every great club needs a great teacher behind it. Mr. Al makes learning technology interesting, encourages students to experiment, and somehow makes complicated ideas actually make sense.</p>
              <div className="teacher-signature">— The AI Club <span>♥</span></div>
            </Reveal>
            <Reveal className="teacher-card-wrap" delay={0.12}>
              <div className="teacher-card-top"><span>FIELD NOTES / 001</span><span>THE LEGEND FILES <span className="mini-star">✳</span></span></div>
              <div className="teacher-portrait">
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85" alt="Students collaborating around a table during a club project" loading="lazy" />
                <div className="portrait-overlay" />
                <div className="portrait-caption"><span className="portrait-mark">M<span>A</span></span><span>THE<br />MENTOR</span></div>
                <div className="portrait-index">A VERY GOOD<br />INFLUENCE ↗</div>
              </div>
              <div className="badge-list">{badges.map(({ icon, label }) => <span className="teacher-badge" key={label}><span>{icon}</span>{label}</span>)}</div>
              <div className="teacher-card-foot"><span>RATING: OBJECTIVE-ISH</span><span>★★★★★</span></div>
            </Reveal>
          </div>
          <Reveal className="rating-panel">
            <div className="rating-heading"><span>MR. AL RATING</span><span className="rating-note">The science is settled.</span></div>
            <div className="rating-grid">{ratings.map(({ title, score, value }, index) => (
              <div className="rating-item" key={title}>
                <div className="rating-label"><span>{title}</span><strong>{score}</strong></div>
                <div className="rating-track"><motion.span className="rating-fill" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.7 }} transition={{ duration: 0.85, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: 'left', width: `${value}%` }} /></div>
              </div>
            ))}</div>
            <div className="rating-disclaimer"><span>✳</span> Peer-reviewed by an extremely biased sample of AI Club members.</div>
          </Reveal>
        </section>

        <section className="playground section-pad" id="playground">
          <Reveal className="playground-heading"><div><p className="eyebrow"><span className="section-number">04</span> A TINY TASTE OF AI</p><h2>Ask the<br /><span className="text-lime">AI Club.</span></h2></div><p>Curiosity looks good on you.<br />Go on, ask us something.</p></Reveal>
          <Reveal className="chat-shell" delay={0.1}>
            <div className="chat-topbar"><div className="chat-agent"><span className="agent-avatar"><BrainCircuit size={18} /></span><span><strong>Club sidekick</strong><small><i /> HERE FOR YOUR QUESTIONS</small></span></div><span className="chat-demo-label">DEMO MODE <span>✳</span></span></div>
            <div className="chat-messages" aria-live="polite" aria-label="AI Club demo conversation">
              {messages.map((message, index) => <div className={`chat-message ${message.from === 'you' ? 'from-you' : 'from-club'}`} key={`${index}-${message.from}`}><span className="message-avatar">{message.from === 'club' ? <Sparkles size={14} /> : 'YOU'}</span><p>{message.text}</p></div>)}
            </div>
            <div className="suggestion-label">A GOOD PLACE TO START</div>
            <div className="suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => ask(suggestion)}>{suggestion}<ArrowUpRightIcon /></button>)}</div>
            <form className="chat-form" onSubmit={handleAsk}><label htmlFor="chat-question" className="visually-hidden">Ask the AI Club a question</label><input id="chat-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Type your question..." /><button type="submit" aria-label="Send question" disabled={!question.trim()}><Send size={17} /></button></form>
            <p className="chat-footnote"><span>↳</span> This is a club-built demo. Answers are pre-written; no question leaves this page.</p>
          </Reveal>
        </section>

        <section className="projects section-pad" id="projects">
          <Reveal className="projects-heading"><div><p className="eyebrow"><span className="section-number">05</span> FROM “WHAT IF” TO “WE DID”</p><h2>What we’re<br /><span className="text-lime">building.</span></h2></div><div className="projects-aside"><p>Early ideas. Happy accidents.<br />The beginnings of something good.</p><a className="text-link" href="#join">Add your idea <ArrowDownRight size={16} /></a></div></Reveal>
          <div className="project-grid">{projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.07}>
              <article className="project-card">
                <div className="project-image" style={{ backgroundImage: `url(https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=900&q=80)` }} role="img" aria-label={`${project.title} project visual`}><span className="project-count">PROJECT / {project.number}</span><span className="project-status"><i /> {project.status}</span><ArrowDownRight className="project-open" size={21} /></div>
                <div className="project-info"><div><h3>{project.title}</h3><p>{project.description}</p></div><div className="project-meta"><div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>{project.href ? <a className="project-link-placeholder" href={project.href} aria-label={`Open ${project.title}`} target="_blank" rel="noreferrer"><ArrowRight size={15} /></a> : <span className="project-link-placeholder" aria-label="Project link coming soon"><ArrowRight size={15} /></span>}</div></div>
              </article>
            </Reveal>
          ))}</div>
          <Reveal className="project-coming"><span className="coming-spark">✳</span><span>GOOD IDEAS ARE INCOMING.</span><span className="coming-line" /><span>YOURS COULD BE NEXT.</span></Reveal>
        </section>

        <section className="join-section" id="join">
          <div className="join-orbit join-orbit-a" aria-hidden="true" /><div className="join-orbit join-orbit-b" aria-hidden="true" />
          <Reveal className="join-content"><p className="eyebrow"><span className="status-dot" /> YOUR NEXT THING STARTS HERE</p><h2>Ready to build<br />the <span>future?</span></h2><p>Join the AI Club.</p><button className="button button-lime button-large" type="button" onClick={() => { setJoinOpen(true); setJoinSent(false) }}>I want in <ArrowRight size={18} /></button><span className="join-note">NO EXPERIENCE. NO PRESSURE. JUST POTENTIAL.</span></Reveal>
          <span className="join-coordinate">AI CLUB / OPEN INVITATION <Sparkles size={14} /></span>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#home"><span className="wordmark-icon"><Network size={17} strokeWidth={2.4} /></span><span>AI<span className="wordmark-dot">.</span>CLUB</span></a>
        <p>Built by students.<br /><span>Powered by curiosity.</span></p>
        <nav aria-label="Footer navigation"><a href="#home">Home</a><a href="#about">About</a><a href="#projects">Projects</a><a href="#mr-al">Mr. Al</a><a href="#join">Join</a></nav>
        <span className="footer-copyright">© AI CLUB · MADE OF CURIOSITY</span>
      </footer>

      <AnimatePresence>
        {joinOpen && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setJoinOpen(false) }}>
          <motion.section className="join-modal" role="dialog" aria-modal="true" aria-labelledby="join-modal-title" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.22 }}>
            <button className="modal-close" type="button" aria-label="Close signup dialog" onClick={() => setJoinOpen(false)}><X size={19} /></button>
            {joinSent ? <div className="join-confirmation"><span className="confirmation-icon"><Check size={25} /></span><p className="eyebrow">YOU’RE ON THE RADAR</p><h2>That’s the<br />right energy.</h2><p>This demo does not send or save your details yet. To join, come find Mr. Al at school and tell him you’re in.</p><button type="button" className="button button-lime" onClick={() => setJoinOpen(false)}>Sounds good <ArrowRight size={16} /></button></div> : <><p className="eyebrow"><span className="status-dot" /> YOUR FIRST STEP</p><h2 id="join-modal-title">Curious?<br /><span>Come build.</span></h2><p className="modal-description">Online sign-up is coming soon. Leave a note here to see how the form will work, then come say hi to Mr. Al at school.</p><form className="join-form" onSubmit={handleJoin}><label htmlFor="join-name">Your name</label><input id="join-name" name="name" placeholder="Ada Lovelace" required /><label htmlFor="join-email">School email</label><input id="join-email" name="email" type="email" placeholder="you@school.edu" required /><button className="button button-lime" type="submit">I’m interested <ArrowRight size={16} /></button></form><p className="form-privacy"><MessageCircle size={13} /> Demo only. Nothing gets sent or stored.</p></>}
          </motion.section>
        </motion.div>}
      </AnimatePresence>
    </>
  )
}

function ArrowUpRightIcon() {
  return <ArrowRight className="arrow-up-right" size={15} aria-hidden="true" />
}

export default App