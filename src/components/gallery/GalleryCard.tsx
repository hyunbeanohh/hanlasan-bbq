import type { GalleryPost } from '@/types';

interface GalleryCardProps {
  post: GalleryPost;
  featured?: boolean;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function GalleryCard({ post, featured = false }: GalleryCardProps) {
  return (
    <article
      className={`relative group overflow-hidden bg-[#1e2020] border border-white/5 hover:border-[#f95e14] transition-colors duration-500 ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Image placeholder */}
      <div className={`relative ${featured ? 'h-full min-h-[400px]' : 'aspect-[4/3]'} bg-gradient-to-br from-zinc-800 via-zinc-900 to-black overflow-hidden`}>
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(ellipse at 50% 80%, rgba(249,94,20,0.4) 0%, transparent 70%)',
          }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
          <span className="text-[#ffb59a] text-xs font-bold uppercase tracking-widest mb-2">
            네이버 블로그
          </span>
          <h3
            className="text-white font-bold text-lg md:text-xl mb-1 line-clamp-2"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            {post.title}
          </h3>
          <p className="text-zinc-400 text-sm">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </p>
        </div>
        <div className="absolute bottom-3 right-3 text-zinc-600 text-xs z-10">[사진 준비중]</div>
      </div>

      {/* Card footer (always visible on non-featured) */}
      {!featured && (
        <div className="p-5">
          <time
            dateTime={post.publishedAt}
            className="text-xs text-zinc-500 mb-2 block uppercase tracking-wider"
          >
            {formatDate(post.publishedAt)}
          </time>
          <h3 className="text-white font-bold text-base mb-3 line-clamp-2">{post.title}</h3>
          <a
            href={post.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#f95e14] text-sm font-bold uppercase tracking-wider hover:text-[#ffb59a] transition-colors"
            aria-label={`${post.title} — 네이버 블로그에서 보기`}
          >
            블로그에서 보기 →
          </a>
        </div>
      )}
    </article>
  );
}
