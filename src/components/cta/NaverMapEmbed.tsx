type Props = {
  query?: string;
  height?: number;
  className?: string;
};

export default function NaverMapEmbed({
  query = '제주특별자치도',
  height = 360,
  className,
}: Props) {
  // Public Naver Map embed via search URL — no API key needed.
  // For a real business location, a custom NCP map embed would be richer;
  // this is a sane default until the business address is finalized.
  const src = `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
  return (
    <div className={className} style={{ width: '100%', height }}>
      <iframe
        src={src}
        title="네이버 지도"
        width="100%"
        height={height}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: 0, borderRadius: 12 }}
      />
    </div>
  );
}
