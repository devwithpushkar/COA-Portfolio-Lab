import { Link } from 'react-router-dom'
import {
  GraduationCap,
  MapPin,
  School,
  Sparkles,
  ArrowRight,
  Trophy,
  BriefcaseBusiness,
  Cpu,
} from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { profile } from '../data/profile.js'

const HIGHLIGHT_ICONS = [GraduationCap, Sparkles, Cpu, BriefcaseBusiness, Trophy]

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Identity panel */}
      <Reveal>
        <section className="panel relative overflow-hidden p-8 sm:p-10" aria-labelledby="identity-heading">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-glow/10 blur-3xl"
          />
          <p className="hex-label mb-3">SYS.IDENTITY · 0x01</p>
          <h1 id="identity-heading" className="text-4xl font-bold tracking-tight text-mist-100 sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-lg text-amber-glow">{profile.degree}</p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mist-200">
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap size={15} className="text-mist-400" aria-hidden="true" />
              {profile.university}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={15} className="text-mist-400" aria-hidden="true" />
              Expected Graduation: {profile.expectedGraduation}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} className="text-mist-400" aria-hidden="true" />
              {profile.location}
            </span>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-mist-400">
            {profile.shortProfile}
          </p>
        </section>
      </Reveal>

      {/* Quick highlights */}
      <section className="mt-14" aria-labelledby="highlights-heading">
        <Reveal>
          <SectionHeading
            tag="QUICK HIGHLIGHTS · 0x02"
            title="At a glance"
            subtitle="The short version — student, builder, hackathon participant, incoming AI engineering intern."
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.highlights.map((h, i) => {
            const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length]
            return (
              <Reveal key={h.label} delay={i * 70}>
                <article className="panel panel-hover h-full p-5">
                  <div className="flex items-start justify-between">
                    <Icon size={20} className="text-amber-glow" aria-hidden="true" />
                    <span className="font-mono text-[0.65rem] text-mist-400">
                      0x{String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-mist-100">{h.label}</h3>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-mist-400">{h.detail}</p>
                </article>
              </Reveal>
            )
          })}
          <Reveal delay={350}>
            <Link
              to="/achievements"
              className="panel panel-hover flex h-full flex-col items-center justify-center gap-2 p-5 text-center"
            >
              <span className="text-sm font-medium text-amber-glow">View all achievements</span>
              <ArrowRight size={16} className="text-amber-glow" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Academics */}
      <section className="mt-14" aria-labelledby="academics-heading">
        <Reveal>
          <SectionHeading tag="ACADEMIC RECORD · 0x03" title="Education" />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal>
            <article className="panel panel-hover h-full p-6 md:col-span-1">
              <div className="flex items-center gap-2 text-amber-glow">
                <GraduationCap size={18} aria-hidden="true" />
                <h3 className="text-sm font-semibold">Undergraduate</h3>
              </div>
              <p className="mt-3 text-sm font-medium text-mist-100">{profile.degree}</p>
              <p className="mt-1 text-sm text-mist-400">{profile.university}</p>
              <p className="mt-3 font-mono text-xs text-mist-400">
                EXPECTED GRADUATION · {profile.expectedGraduation}
              </p>
            </article>
          </Reveal>
          <Reveal delay={100}>
            <article className="panel panel-hover h-full p-6">
              <div className="flex items-center gap-2 text-amber-glow">
                <School size={18} aria-hidden="true" />
                <h3 className="text-sm font-semibold">School</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-mist-200">{profile.school.name}</p>
            </article>
          </Reveal>
          <Reveal delay={200}>
            <article className="panel panel-hover h-full p-6">
              <h3 className="text-sm font-semibold text-amber-glow">Board Results</h3>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-mist-200">Class X</span>
                    <span className="font-mono font-semibold text-mist-100">{profile.school.classX}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-700">
                    <div className="h-full rounded-full bg-amber-glow" style={{ width: profile.school.classX }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-mist-200">Class XII</span>
                    <span className="font-mono font-semibold text-mist-100">{profile.school.classXII}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-700">
                    <div className="h-full rounded-full bg-amber-glow" style={{ width: profile.school.classXII }} />
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* COA Lab callout */}
      <Reveal>
        <section className="panel mt-14 flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
          <div>
            <p className="hex-label mb-2">COA LAB · 0x04</p>
            <h2 className="text-xl font-semibold text-mist-100">The interactive part of this project</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist-400">
              Instruction set addressing generator, number system converter, and a persistent
              assignment archive — built for this academic project and fully working.
            </p>
          </div>
          <Link
            to="/lab"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-amber-glow px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-amber-soft"
          >
            Open COA Lab
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </section>
      </Reveal>
    </div>
  )
}
