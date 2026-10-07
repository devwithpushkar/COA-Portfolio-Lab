/**
 * Data-driven achievement archive. Add new entries here (or via the
 * assignments backend pattern) without touching the UI components.
 *
 * featured: true renders a visually prominent card.
 */
export const achievementCategories = [
  'All',
  'Certification',
  'Hackathon',
  'Competition',
  'Internship',
  'Project',
  'Academic',
]

export const achievements = [
  {
    id: 'bytebuild-1',
    title: 'ByteBuild 1.0',
    category: 'Hackathon',
    organizer: 'ByteXL',
    duration: '24 hours',
    result: 'Final 10',
    status: 'Final 10',
    certificate: 'Participation certificate available',
    description:
      '24-hour hackathon organized by ByteXL. Finished in the Final 10.',
    featured: true,
  },
  {
    id: 'codealpha-internship',
    title: 'AI Engineering Internship',
    category: 'Internship',
    organizer: 'CodeAlpha',
    status: 'Offer Accepted',
    description:
      'Accepted an offer for an AI Engineering internship at CodeAlpha. Upcoming — not yet completed.',
  },
  {
    id: 'ms-ai-900',
    title: 'Microsoft AI-900',
    category: 'Certification',
    organizer: 'Microsoft',
    status: 'Certified',
    description: 'Microsoft Azure AI Fundamentals.',
  },
  {
    id: 'ms-az-900',
    title: 'Microsoft AZ-900',
    category: 'Certification',
    organizer: 'Microsoft',
    status: 'Certified',
    description: 'Microsoft Azure Fundamentals.',
  },
  {
    id: 'idea-2',
    title: 'iDEA 2.0',
    category: 'Competition',
    status: 'Participated',
    description: 'Participated in the iDEA 2.0 competition.',
  },
  {
    id: 'coursera-js-html-css',
    title: 'Programming Foundations with JavaScript, HTML, and CSS',
    category: 'Certification',
    organizer: 'Coursera',
    status: 'Completed',
    description: 'Coursera course on programming foundations for the web.',
  },
  {
    id: 'coursera-pm',
    title: 'Foundations of Project Management',
    category: 'Certification',
    organizer: 'Coursera',
    status: 'Completed',
    description: 'Coursera course on project management foundations.',
  },
  {
    id: 'project-knull',
    title: 'Knull',
    category: 'Project',
    status: 'Under development',
    description:
      'AI-powered autonomous security assessment platform concept — agents, orchestration, and RAG.',
  },
  {
    id: 'project-hermes',
    title: 'Project Hermes',
    category: 'Project',
    status: 'Project work',
    description: 'Configurable business operating platform for digitizing business operations.',
  },
  {
    id: 'project-freekick',
    title: 'FreeKick',
    category: 'Project',
    status: 'Project work',
    description: 'Football analytics application with interactive visualization.',
  },
  {
    id: 'class-xii',
    title: 'Class XII — 95%',
    category: 'Academic',
    organizer: 'Sacred Heart Convent School, Ludhiana',
    status: 'Completed',
    description: 'Senior secondary education with 95%.',
  },
  {
    id: 'class-x',
    title: 'Class X — 94%',
    category: 'Academic',
    organizer: 'Sacred Heart Convent School, Ludhiana',
    status: 'Completed',
    description: 'Secondary education with 94%.',
  },
]
