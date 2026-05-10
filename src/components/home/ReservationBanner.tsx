import CallButton from '@/components/cta/CallButton';
import SmsButton from '@/components/cta/SmsButton';
import EmailButton from '@/components/cta/EmailButton';

export default function ReservationBanner() {
  return (
    <section id="contact" className="py-20 md:py-24 bg-brand">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: headline */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              지금 바로 예약하세요
            </h2>
            <p className="text-white/80 text-base md:text-lg">
              010-7332-4199 한 번이면 끝,
              <br />
              전화·문자·이메일로 편하게 문의하세요.
            </p>
          </div>

          {/* Right: CTA buttons */}
          <div className="flex flex-col gap-3">
            <CallButton variant="dark-on-brand">
              전화 010-7332-4199
            </CallButton>
            <SmsButton variant="dark-on-brand">
              문자 보내기
            </SmsButton>
            <EmailButton variant="dark-on-brand">
              이메일 문의
            </EmailButton>
          </div>
        </div>
      </div>
    </section>
  );
}
