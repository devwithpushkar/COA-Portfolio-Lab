import { useEffect } from 'react'

const BASE_TITLE = 'Pushkar Gupta | Computer Science & COA Lab'

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE_TITLE}` : BASE_TITLE
  }, [title])
}
