/**
 * Small persistent credit anchored to the bottom-right of every page.
 * Subtle enough not to compete with content, present enough to brand the site.
 */
export default function Byline() {
  return (
    <a
      href="https://github.com/DirectriX01"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View source on GitHub — built by Abhinav"
      className="fixed bottom-3 right-3 z-[45] inline-flex items-center gap-1.5 mono text-[0.6rem] uppercase tracking-[0.2em] text-[var(--mist)] hover:text-[var(--ember)] transition-colors pointer-events-auto"
      style={{
        textShadow: "0 0 12px rgba(7, 6, 13, 0.9)",
      }}
    >
      <span
        aria-hidden
        className="inline-block h-1 w-1 rounded-full bg-[var(--ember)]"
      />
      Built by Abhinav
    </a>
  );
}
