import type { GalleryPost } from '@/types';
import GalleryCard from './GalleryCard';

interface GalleryGridProps {
  posts: GalleryPost[];
}

export default function GalleryGrid({ posts }: GalleryGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-24 text-fg-muted">
        <p className="text-4xl mb-4" aria-hidden="true">📷</p>
        <p className="text-lg">갤러리를 준비 중입니다. 곧 업데이트됩니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <GalleryCard key={post.id} post={post} />
      ))}
    </div>
  );
}
