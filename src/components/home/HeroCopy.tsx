import TrustChips from './reservation/TrustChips';
import HeroPhoneChip from './HeroPhoneChip';

export default function HeroCopy() {
  return (
    <div className="text-white text-left">
      <TrustChips />
      <h1
        id="hero-title"
        className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 drop-shadow-lg"
      >
        참나무 훈연, 깔끔한 맛
        <br />
        전국 출장바베큐
      </h1>
      <p className="text-white/85 text-base md:text-lg leading-relaxed mb-5 drop-shadow">
        원하는 메뉴와 행사 정보를 알려주세요. 맞춤 견적을 안내해 드립니다.
      </p>
      <HeroPhoneChip />
    </div>
  );
}
