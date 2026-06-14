export function Logo({ className }: { className?: string }) {
  return (
    <span className={className}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M16 2.5 4.5 7v8.4c0 7.1 4.8 11.6 11.5 14.1 6.7-2.5 11.5-7 11.5-14.1V7L16 2.5Z"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M18.5 10.5 11 18.2h4.4l-1.9 6.3 7.5-9.4h-4.6l2-4.6Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
