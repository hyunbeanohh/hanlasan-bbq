interface PhotoPlaceholderProps {
  className?: string;
  label?: string;
}

export default function PhotoPlaceholder({ className = '', label = '사진 준비중' }: PhotoPlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-surface-3 flex items-center justify-center ${className}`}
    >
      <div className="flex flex-col items-center gap-2 text-fg-muted">
        <span className="text-3xl" aria-hidden="true">📷</span>
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}
