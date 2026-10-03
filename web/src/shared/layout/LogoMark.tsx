type LogoMarkProps = Readonly<{
  className?: string;
}>;

/**
 * The HubMI mark: an open circle (the problem) joined by a line to a solid circle (the solution).
 * Draws in `currentColor`, so it follows the surrounding colours and stays visible in high-contrast mode.
 * Keep it in step with `src/app/icon.svg`, which is the same drawing with fixed colours.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 28 28">
      <circle cx="7" cy="14" r="4" stroke="currentColor" strokeWidth="2.6" />
      <path d="M11 14h6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.6" />
      <circle cx="21" cy="14" fill="currentColor" r="4.5" />
    </svg>
  );
}
