import Link from 'next/link';

interface Props {
  current: number;
  total: number;
  perPage: number;
  basePath: string;
}

export default function Pagination({ current, total, perPage, basePath }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(current - 4, totalPages - 9));
  const end = Math.min(totalPages, start + 9);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const link = (p: number) => `${basePath}?page=${p}`;

  return (
    <nav className="flex justify-center gap-1 py-8" aria-label="페이지네이션">
      {current > 1 && (
        <Link href={link(current - 1)} className="px-3 py-1 border border-border rounded text-sm">«</Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={link(p)}
          aria-current={p === current ? 'page' : undefined}
          className={`px-3 py-1 border border-border rounded text-sm ${p === current ? 'bg-brand text-white' : ''}`}
        >
          {p}
        </Link>
      ))}
      {current < totalPages && (
        <Link href={link(current + 1)} className="px-3 py-1 border border-border rounded text-sm">»</Link>
      )}
    </nav>
  );
}
