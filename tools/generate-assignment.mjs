/**
 * Generates public/assignment-1.pdf — a sanitized copy of the COA
 * Assignment 1 source document.
 *
 * Contains ONLY the course title and the 12 questions + answers (academic
 * content, verbatim). All source-student identity and submission metadata
 * (name, UID, section, submitted-to, submission date) are intentionally
 * omitted so the file is safe to publish as a public static asset.
 *
 * Run: node tools/generate-assignment.mjs
 */
import PDFDocument from 'pdfkit'
import { createWriteStream, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public')
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, 'assignment-1.pdf')

const AMBER = '#b07d1e'
const DARK = '#1a1d24'
const GRAY = '#4a5060'
const LINE = '#d8d3c4'

const QA = [
  {
    q: 'Q1. What is Raspberry Pi (G)?',
    a: [
      'Raspberry Pi is a small computer which we can use to learn programming and to build electronics projects. We can do all the difficult computer tasks like web browsing, coding, and using applications. Raspberry Pi has become popular among students and developers looking to learn and build projects. It is of low cost.',
    ],
  },
  {
    q: 'Q2. What are the 10 takeaways of Ai summit?',
    a: [
      '1. AI is now being used in real life very much.',
      '2. Every Country has different AI Rules.',
      '3. Better technology is needed for the increased use of AI.',
      '4. AI should be safe and secure.',
      '5. The environment also matters because a lot of energy is required to develop new technology.',
      '6. With AI technology, researchers and developers are creating more ideas.',
      '7. AI also helped in increasing the economy.',
      '8. Countries want to build their own AI so that they ca become independent.',
      '9. Teamwork is important to make AI more useful.',
      '10. AI is shaping the future of next generations.',
    ],
  },
  {
    q: 'Q3. What is YOTTA?',
    a: [
      'YOTTA is an Indian technology company that provides cloud services, and secure data storage. It helps in businesses to manage their data and run applications smoothly. YOTTA supports AI and machine learning projects with powerful computing resources. For organizations, by using YOTTA services it become very easy for them to grow and adopt digital technologies.',
    ],
  },
  {
    q: 'Q4. What is NPTEL?',
    a: [
      'NPTEL (National Program on Technology Enhanced Learning) is a online learning platform created by the IITs and IISc with support from the Government of India. It is free of cost. It offers many courses in engineering, science, management, and many other subjects. Students can learn through video lectures, assignments, and the given content even at their own place. They can also give an optional exam to earn a certificate after successfully completing the course.',
    ],
  },
  {
    q: 'Q5. How to decide a programming language to design an application and what are the parameters?',
    a: [
      "To decide a programming language to design an application, it is important to select that language that fits best for the project's needs. Some key parameters are:",
      '1. Purpose – Decide whether the application is for the web, mobile, desktop, AI, or gaming.',
      "2. Performance – Choose a language that fulfills the need of required speed and efficiency and it's performance is good.",
      '3. Security – Make sure that language supports in building secure and useable applications.',
      '4. Scalability – The application must be capable of handling more users and data, as in future they grows.',
      '5. Easy use – The language should have good tools, libraries, and community support to make development easier.',
    ],
  },
  {
    q: 'Q6. What is the meaning of RAM size, Word size, if the system is of 64bit, what is the speed and operating system of our PC?',
    a: [
      'RAM Size: RAM stands for Random Access Memory. It is the temporary memory of a computer. It helps the system to work faster and handle multiple tasks.',
      'Word Size: Word size refers to the amount of data a single CPU can process. If our system is of 64-bit, it means that it can handle 64 bits of data in one operation, making CPU more efficient to work.',
      'Speed: The speed of a computer is mainly checked by CPU. A processor with higher speed means it has better performance and faster to give response than others.',
      'Operating System (OS): The operating system acts as an interface between the computer user and the hardware devices. It is responsible for all the process management, CPU management, and CPU management etc. Some operating systems commonly used are Windows, macOS, and Linux etc.',
    ],
  },
  {
    q: 'Q7. Why is the GPU faster than the CPU?',
    a: [
      'A GPU (Graphics Processing Unit) is faster than a CPU (Central Processing Unit) because it performs many calculations at a single time using many small cores. A CPU has less cores as compared to GPU that are only designed to handle different tasks one after another. This makes GPU more efficient for performing tasks like graphics, gaming, AI, and machine learning. As a result, GPU process large amounts of data faster as compared to CPU.',
    ],
  },
  {
    q: 'Q8. Define CPU vs TPU vs GPU.',
    a: [
      'CPU (Central Processing Unit) is the main processor of a computer. It is also called brain of Computer. It handles general tasks, runs the operating system, and manages applications.',
      'GPU (Graphics Processing Unit) is designed to perform many calculations at the same time. It is mainly used for doing graphics, gaming, AI, and machine learning.',
      'TPU (Tensor Processing Unit) is a special processor which is developed by Google for AI and machine learning. It is used to train and run AI models much faster and more efficiently than CPUs and GPUs.',
    ],
  },
  {
    q: "Q9. Who won last year's Turing Award?",
    a: [
      'The 2025 Turing Award was won by Charles H. Bennett and Gilles Brassard. They were honored for developing the foundations of quantum cryptography and quantum communication.',
    ],
  },
  {
    q: 'Q10. What is the Stampeding Herd Problem?',
    a: [
      'The Stampeding Herd Problem occurs when many users or processor try to access the same resource at the same time, which overload the server and makes the system very slow. This problem is commonly seen in many web applications, databases, and caching systems. The problem can be managed by using some simple methods like caching, load balancing, and controlling the number of requests generated at the same time.',
    ],
  },
  {
    q: 'Q11. Who is the founder of Intel and AMD?',
    a: [
      'Intel – Intel was founded by Robert Noyce and Gordon Moore in 1968.',
      'AMD – AMD was founded by Jerry Sanders in 1969.',
    ],
  },
  {
    q: 'Q12. Which CPU organization is your Laptop Machine?',
    a: [
      'My laptop has a 64-bit CPU architecture, which means it can process 64 bits of data at a time which helps my system run faster. It also supports larger amount of RAM, and improves multitasking.',
    ],
  },
]

const doc = new PDFDocument({ size: 'A4', margin: 48 })
doc.pipe(createWriteStream(outPath))

const PAGE_W = doc.page.width - 96

/* ---------- Header ---------- */
doc.font('Helvetica-Bold').fontSize(17).fillColor(DARK)
doc.text('COMPUTER ORGANIZATION AND ARCHITECTURE', 48, 44, { width: PAGE_W })
doc.moveDown(0.2)
doc.font('Helvetica-Bold').fontSize(12).fillColor(AMBER)
doc.text('Assignment 1', 48)
doc.moveDown(0.4)
doc
  .moveTo(48, doc.y + 4)
  .lineTo(doc.page.width - 48, doc.y + 4)
  .strokeColor(LINE)
  .lineWidth(0.8)
  .stroke()
doc.moveDown(1)

/* ---------- Questions & answers ---------- */
for (const item of QA) {
  doc.font('Helvetica-Bold').fontSize(11).fillColor(DARK)
  doc.text(item.q, 48, doc.y, { width: PAGE_W })
  doc.moveDown(0.3)

  doc.font('Helvetica-Bold').fontSize(10).fillColor(AMBER)
  doc.text('Answer', 48, doc.y, { width: PAGE_W })
  doc.moveDown(0.15)

  doc.font('Helvetica').fontSize(10).fillColor(GRAY)
  for (const line of item.a) {
    doc.text(line, 48, doc.y, { width: PAGE_W, align: 'justify', lineGap: 1.5 })
    doc.moveDown(0.35)
  }
  doc.moveDown(0.7)
}

doc.end()
console.log(`Assignment document written to ${outPath}`)
