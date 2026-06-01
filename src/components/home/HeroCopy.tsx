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
        1분 안에 견적이 도착합니다. 인원·날짜·장소만 알려주세요.
      </p>
      <HeroPhoneChip />
    </div>
  );
}
