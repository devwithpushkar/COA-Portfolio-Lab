/**
 * Generates public/resume/pushkar-gupta-resume.pdf
 * Run: node tools/generate-resume.mjs
 * Content is limited to verified information from the project specification.
 */
import PDFDocument from 'pdfkit'
import { createWriteStream, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'resume')
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, 'pushkar-gupta-resume.pdf')

const AMBER = '#b07d1e'
const DARK = '#1a1d24'
const GRAY = '#4a5060'
const LINE = '#d8d3c4'

const doc = new PDFDocument({ size: 'A4', margin: 48 })
doc.pipe(createWriteStream(outPath))

const PAGE_W = doc.page.width - 96

function sectionTitle(text) {
  doc.moveDown(0.9)
  doc.font('Helvetica-Bold').fontSize(11).fillColor(AMBER)
  doc.text(text.toUpperCase(), { characterSpacing: 1.2 })
  doc.moveTo(0, doc.y + 2).lineTo(doc.page.width - 48, doc.y + 2).strokeColor(LINE).lineWidth(0.8).stroke()
  doc.moveDown(0.45)
}

function entry(title, right, sub) {
  const y = doc.y
  doc.font('Helvetica-Bold').fontSize(10).fillColor(DARK)
  doc.text(title, 48, y, { width: PAGE_W - 140 })
  if (right) {
    doc.font('Helvetica').fontSize(9).fillColor(GRAY)
    doc.text(right, 48 + PAGE_W - 140, y + 1, { width: 140, align: 'right' })
  }
  if (sub) {
    doc.font('Helvetica-Oblique').fontSize(9).fillColor(GRAY)
    doc.text(sub, 48, doc.y + 1, { width: PAGE_W })
  }
  doc.moveDown(0.25)
}

function bullet(text) {
  doc.font('Helvetica').fontSize(9.5).fillColor(DARK)
  doc.text(`•  ${text}`, 54, doc.y, { width: PAGE_W - 6 })
  doc.moveDown(0.12)
}

/* ---------- Header ---------- */
doc.font('Helvetica-Bold').fontSize(24).fillColor(DARK)
doc.text('Pushkar Gupta', 48, 44)
doc.moveDown(0.15)
doc.font('Helvetica').fontSize(10.5).fillColor(AMBER)
doc.text('B.E. Computer Science Engineering · Chandigarh University · Expected 2029', 48)
doc.moveDown(0.25)
doc.font('Helvetica').fontSize(9).fillColor(GRAY)
doc.text('Ludhiana, Punjab, India   |   pushkar4335g@gmail.com   |   github.com/devwithpushkar   |   linkedin.com/in/pushkargupta-', 48, doc.y, { width: PAGE_W })

doc.moveTo(48, doc.y + 8).lineTo(doc.page.width - 48, doc.y + 8).strokeColor(AMBER).lineWidth(1.4).stroke()

/* ---------- Profile ---------- */
sectionTitle('Profile')
doc.font('Helvetica').fontSize(9.5).fillColor(DARK)
doc.text(
  'Computer Science Engineering student interested in AI, software development, intelligent systems, infrastructure, and practical engineering. Builds projects spanning LLM-based systems and AI agents, full-stack web applications, and automation — with a growing focus on how systems work down to the instruction level.',
  48, doc.y, { width: PAGE_W, align: 'justify' },
)

/* ---------- Education ---------- */
sectionTitle('Education')
entry('Chandigarh University', 'Expected 2029', 'B.E. Computer Science Engineering')
entry('Sacred Heart Convent School, Sector-39, Ludhiana', '', 'Class XII — 95%   ·   Class X — 94%')

/* ---------- Technical Skills ---------- */
sectionTitle('Technical Skills')
const skills = [
  ['Programming', 'C++, Python, JavaScript, TypeScript, Java'],
  ['AI / ML', 'LLMs, AI Agents, RAG, Prompt Engineering'],
  ['Web Development', 'React, Vite, FastAPI, REST APIs'],
  ['Databases', 'SQL, PostgreSQL, SQLite, Supabase'],
  ['Infrastructure', 'Docker, Git, GitHub, Linux, WSL'],
  ['Deployment', 'Render'],
]
for (const [label, list] of skills) {
  const y = doc.y
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(DARK).text(label, 48, y, { width: 118 })
  doc.font('Helvetica').fontSize(9.5).fillColor(GRAY).text(list, 170, y, { width: PAGE_W - 122 })
  doc.moveDown(0.18)
}

/* ---------- Projects ---------- */
sectionTitle('Projects')
entry('Knull', 'Under development', 'AI-powered autonomous security assessment platform concept')
bullet('Explores autonomous security-assessment workflows built on AI agents, orchestration, and RAG.')
entry('Project Hermes', 'Project work', 'Configurable business operating platform')
bullet('Digitizes business operations: workflow automation, configurable roles and permissions, multi-location readiness, industry-specific onboarding, and decision support.')
entry('FreeKick', 'Project work', 'Football analytics application')
bullet('Interactive football analytics and visualization. Built with React, JavaScript, Node.js, Python, Supabase; deployed on Render.')
entry('COA Lab — Student Portfolio & Toolkit', 'Academic project', 'This portfolio site + interactive Computer Organization & Architecture tools')
bullet('React + Vite + Tailwind frontend with a FastAPI + SQLite backend; includes an instruction-set addressing generator (3/2/1/0-address) and an arbitrary-base number system converter.')

/* ---------- Experience ---------- */
sectionTitle('Experience')
entry('CodeAlpha', 'Offer Accepted', 'AI Engineering Intern (upcoming)')
bullet('Accepted an offer for an AI Engineering internship; joining is upcoming.')

/* ---------- Certifications ---------- */
sectionTitle('Certifications')
bullet('Microsoft AI-900 — Microsoft Azure AI Fundamentals')
bullet('Microsoft AZ-900 — Microsoft Azure Fundamentals')
bullet('Programming Foundations with JavaScript, HTML, and CSS — Coursera')
bullet('Foundations of Project Management — Coursera')

/* ---------- Competitions ---------- */
sectionTitle('Competitions & Hackathons')
entry('ByteBuild 1.0 — ByteXL', 'Final 10', '24-hour hackathon · Participation certificate')
entry('iDEA 2.0', 'Participated', 'Competition participation')

doc.end()
console.log(`Resume written to ${outPath}`)
