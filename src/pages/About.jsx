import {
  Code2,
  Brain,
  Globe,
  Database,
  Terminal,
  Cloud,
  FileDown,
  ExternalLink,
  Target,
} from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { profile } from '../data/profile.js'
import { skillCategories } from '../data/skills.js'
import { projects } from '../data/projects.js'

const SKILL_ICONS = {
  code: Code2,
  brain: Brain,
  globe: Globe,
  database: Database,
  terminal: Terminal,
  cloud: Cloud,
}

const RESUME_URL = '/resume/pushkar-gupta-resume.pdf'

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Introduction */}
      <Reveal>
        <section aria-labelledby="intro-heading" className="panel p-8 sm:p-10">
          <p className="hex-label mb-3">ABOUT ME · 0x03</p>
          <h1 id="intro-heading" className="text-3xl font-bold tracking-tight text-mist-100 sm:text-4xl">
            Hi, I'm Pushkar.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-mist-200">
            {profile.introduction}
          </p>
        </section>
      </Reveal>

      {/* Academic interests */}
      <section className="mt-14" aria-labelledby="interests-heading">
        <Reveal>
          <SectionHeading
            tag="INTERESTS"
            title="Academic interests"
            subtitle="What I like learning about and where I spend my building time."
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {profile.interests.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <article className="panel panel-hover h-full p-6">
                <h3 className="text-sm font-semibold text-amber-glow">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-200">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Future goals */}
      <section className="mt-14" aria-labelledby="goals-heading">
        <Reveal>
          <SectionHeading tag="DIRECTION" title="Future goals" />
        </Reveal>
        <Reveal>
          <div className="panel p-6 sm:p-8">
            <ul className="space-y-4">
              {profile.goals.map((goal) => (
                <li key={goal} className="flex items-start gap-3 text-sm leading-relaxed text-mist-200">
                  <Target size={16} className="mt-0.5 shrink-0 text-amber-glow" aria-hidden="true" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Technical profile */}
      <section className="mt-14" aria-labelledby="skills-heading">
        <Reveal>
          <SectionHeading tag="TECHNICAL PROFILE" title="Tools & technologies" />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, i) => {
            const Icon = SKILL_ICONS[cat.icon] ?? Code2
            return (
              <Reveal key={cat.category} delay={i * 60}>
                <article className="panel panel-hover h-full p-6">
                  <div className="flex items-center gap-2">
                    <Icon size={17} className="text-amber-glow" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-mist-100">{cat.category}</h3>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {cat.skills.map((s) => (
                      <li
                        key={s}
                        className="rounded-md border border-ink-700 bg-ink-850 px-2.5 py-1 font-mono text-xs text-mist-200"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Selected projects */}
      <section className="mt-14" aria-labelledby="projects-heading">
        <Reveal>
          <SectionHeading
            tag="PORTFOLIO"
            title="Selected projects"
            subtitle="Things I have built or am building — presented honestly, with real status."
          />
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <article className="panel panel-hover flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-mist-100">{p.name}</h3>
                  <span className="shrink-0 rounded-full border border-amber-glow/40 bg-amber-glow/10 px-2.5 py-0.5 font-mono text-[0.6rem] text-amber-glow">
                    {p.status}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-amber-glow/90">{p.tagline}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-mist-400">{p.description}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded border border-ink-700 bg-ink-850 px-2 py-0.5 font-mono text-[0.65rem] text-mist-200"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-5 text-sm text-mist-400">
            More on{' '}
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-amber-glow hover:underline"
            >
              GitHub <ExternalLink size={13} aria-hidden="true" />
            </a>
          </p>
        </Reveal>
      </section>

      {/* CV / Resume */}
      <section id="resume" className="mt-16 scroll-mt-24" aria-labelledby="resume-heading">
        <Reveal>
          <SectionHeading
            tag="CURRICULUM VITAE"
            title="Resume"
            subtitle="Preview below, or download the PDF directly."
          />
        </Reveal>
        <Reveal>
          <div className="panel overflow-hidden">
            <div className="flex flex-col items-start justify-between gap-3 border-b border-ink-700/70 bg-ink-850/60 px-6 py-4 sm:flex-row sm:items-center">
              <div>
                <h3 id="resume-heading" className="text-sm font-semibold text-mist-100">
                  pushkar-gupta-resume.pdf
                </h3>
                <p className="mt-0.5 font-mono text-[0.65rem] text-mist-400">
                  PUBLIC · /resume/pushkar-gupta-resume.pdf
                </p>
              </div>
              <a
                href={RESUME_URL}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-amber-glow px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-amber-soft"
              >
                <FileDown size={16} aria-hidden="true" />
                Download Resume
              </a>
            </div>
            <div className="h-[600px] bg-ink-900">
              <object data={RESUME_URL} type="application/pdf" className="h-full w-full" aria-label="Resume PDF preview">
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="text-sm text-mist-400">
                    PDF preview is not available in this browser.
                  </p>
                  <a
                    href={RESUME_URL}
                    download
                    className="inline-flex items-center gap-2 rounded-lg border border-amber-glow/60 px-4 py-2 text-sm font-medium text-amber-glow hover:bg-amber-glow/10"
                  >
                    <FileDown size={15} aria-hidden="true" />
                    Download the PDF instead
                  </a>
                </div>
              </object>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
