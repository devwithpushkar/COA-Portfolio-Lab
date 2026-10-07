export default function SectionHeading({ tag, title, subtitle }) {
  return (
    <div className="mb-8">
      {tag && (
        <div className="hex-label mb-2 flex items-center gap-2">
          <span className="inline-block h-px w-6 bg-amber-glow/60" aria-hidden="true" />
          {tag}
        </div>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-mist-100 sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist-400">{subtitle}</p>
      )}
    </div>
  )
}
