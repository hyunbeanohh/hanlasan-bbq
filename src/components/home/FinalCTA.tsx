import CallButton from '@/components/cta/CallButton';
import SmsButton from '@/components/cta/SmsButton';
import EmailButton from '@/components/cta/EmailButton';
import { CONTACT } from '@/lib/constants';

export default function FinalCTA() {
  return (
    <section className="py-[120px] bg-[#0c0f0f] relative overflow-hidden">
      {/* Ember glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(249,94,20,0.4) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
        <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-6 block">
          지금 바로 문의
        </span>
        <h2
          className="text-4xl md:text-6xl font-black text-white uppercase leading-tight mb-6"
          style={{ fontFamily: 'var(--font-headline)', letterSpacing: '-0.02em' }}
        >
          특별한 자리,
          <br />
          <span className="text-[#ffb59a]">한라산이 함께합니다</span>
        </h2>
        <div className="w-24 h-1 bg-[#f95e14] mx-auto mb-8" />
        <p className="text-white/70 text-lg mb-4 max-w-lg mx-auto">
          날짜·장소·인원만 알려주세요. 나머지는 저희가 다 합니다.
        </p>
        <p className="text-[#ffb59a] font-black text-2xl mb-10" style={{ fontFamily: 'var(--font-headline)' }}>
          {CONTACT.phone}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <CallButton variant="primary">전화 문의하기</CallButton>
          <SmsButton variant="ghost">문자 문의하기</SmsButton>
          <EmailButton variant="ghost">이메일 문의하기</EmailButton>
        </div>
      </div>
    </section>
  );
}
