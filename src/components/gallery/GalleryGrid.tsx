import type { GalleryPost } from '@/types';
import GalleryCard from './GalleryCard';

interface GalleryGridProps {
  posts: GalleryPost[];
}

export default function GalleryGrid({ posts }: GalleryGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-24 text-zinc-500">
        <span className="material-symbols-outlined text-6xl block mb-4 text-zinc-700">
          photo_camera
        </span>
        <p className="text-lg">갤러리를 준비 중입니다. 곧 업데이트됩니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
      {posts.map((post, index) => (
        <GalleryCard
          key={post.id}
          post={post}
          featured={index === 0}
        />
      ))}
    </div>
  );
}
